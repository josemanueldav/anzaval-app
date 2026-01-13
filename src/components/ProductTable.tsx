import { useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { supabase } from "../lib/supabaseClient";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Zoom } from "swiper/modules";
import { QRCodeCanvas } from "qrcode.react";
import { useToast } from "../hooks/useToast";
import "swiper/swiper-bundle.css";
import "../styles/swiper-fix.css";

interface Producto {
  id?: string;
  cliente_id?: string;
  descripcion_corta: string;
  tipo: string;
  marca: string;
  modelo: string;
  serie?: string;
  categoria?: string;
  ubicacion?: string;
  unidad?: string;
  estado?: string;
  proveedor?: string;
  codigo_barras?: string;
  codigo_qr?: string;
  created_at?: string;
}

interface Imagen {
  id: number;
  imagen_url: string;
  signedUrl: string;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // === Estados principales ===
  const [producto, setProducto] = useState<Producto | null>(null);
  const [imagenes, setImagenes] = useState<Imagen[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("datos");
  const [userRole, setUserRole] = useState("");
  const [clienteActivo, setClienteActivo] = useState<string | null>(null);
  const [clienteActivoNombre, setClienteActivoNombre] = useState<string>("");

  // === Escáner QR ===
  const [scanning, setScanning] = useState(false);
  const qrRegionId = "reader";

  // === Movimientos ===
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [nuevoMovimiento, setNuevoMovimiento] = useState({
    tipo_movimiento: "entrada",
    cantidad: 1,
    usuario: "",
    referencia: "",
    comentarios: "",
  });

  // === Inicialización ===
  useEffect(() => {
    fetchUser();
    fetchClientes();
  }, []);

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (user?.user_metadata?.role) setUserRole(user.user_metadata.role);
    if (user?.user_metadata?.cliente_activo) {
      setClienteActivo(user.user_metadata.cliente_activo);
      const { data: c } = await supabase
        .from("clientes")
        .select("nombre")
        .eq("id", user.user_metadata.cliente_activo)
        .single();
      if (c) setClienteActivoNombre(c.nombre);
    }
  };

  const fetchClientes = async () => {
    const { data } = await supabase.from("clientes").select("id, nombre").order("nombre");
    setClientes(data || []);
  };

  // === Cargar producto o preparar nuevo ===
  useEffect(() => {
    if (!id) return;
    if (id === "nuevo") {
      setProducto({
        descripcion_corta: "",
        tipo: "",
        marca: "",
        modelo: "",
        cliente_id: clienteActivo || undefined,
      });
      setShowModal(true);
      setLoading(false);
    } else {
      fetchProducto();
      fetchImagenes();
      fetchMovimientos();
    }
  }, [id, clienteActivo]);

  const fetchProducto = async () => {
    const { data: prod, error } = await supabase.from("productos").select("*").eq("id", id).single();
    if (error) console.error("Error cargando producto:", error);
    if (prod) setProducto(prod);
    setLoading(false);
  };

  const fetchImagenes = async () => {
    if (!id || id === "nuevo") return;
    const { data: imgs } = await supabase.from("productos_imagenes").select("id, imagen_url").eq("producto_id", id);
    if (imgs && imgs.length > 0) {
      const signed = await Promise.all(
        imgs.map(async (img) => {
          const { data } = await supabase.storage.from("productos").createSignedUrl(img.imagen_url, 60 * 60);
          return { ...img, signedUrl: data?.signedUrl || "" };
        })
      );
      setImagenes(signed);
    } else setImagenes([]);
  };

  const fetchMovimientos = async () => {
    if (!id || id === "nuevo") return;
    const { data, error } = await supabase
      .from("inventario_movimientos")
      .select("*")
      .eq("producto_id", id)
      .order("created_at", { ascending: false });

    if (error) console.error("Error cargando movimientos:", error);
    else setMovimientos(data || []);
  };

  // === Guardar producto ===
  const handleSave = async () => {
    if (!producto) return;
    setLoading(true);

    const allowedFields = [
      "cliente_id",
      "descripcion_corta",
      "tipo",
      "marca",
      "modelo",
      "serie",
      "categoria",
      "ubicacion",
      "unidad",
      "estado",
      "proveedor",
      "codigo_barras",
      "codigo_qr",
    ];

    const filtered = Object.fromEntries(Object.entries(producto).filter(([key]) => allowedFields.includes(key)));

    if (userRole === "capturista" && clienteActivo) filtered.cliente_id = clienteActivo;

    const { error } =
      id === "nuevo"
        ? await supabase.from("productos").insert([filtered])
        : await supabase.from("productos").update(filtered).eq("id", id);

    if (error) {
      console.error("Error al guardar producto:", error);
      showToast("error", "Error al guardar el producto");
    } else {
      showToast("success", "Producto guardado correctamente");
      setShowModal(false);
      navigate("/productos");
    }

    setLoading(false);
  };

  // === Subir imagen ===
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !id) return;
    setLoading(true);
    const files = Array.from(e.target.files);
    for (const file of files) {
      const filePath = `${id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("productos").upload(filePath, file, { upsert: true });
      if (uploadError) {
        console.error("Error subiendo archivo", uploadError);
        showToast("error", "Error al subir imagen");
        continue;
      }
      await supabase.from("productos_imagenes").insert([{ producto_id: id, imagen_url: filePath }]);
      showToast("success", "Imagen subida correctamente");
    }
    await fetchImagenes();
    setLoading(false);
  };

  // === Registrar movimiento ===
  const handleRegistrarMovimiento = async () => {
    if (!producto || !id) return;

    const { tipo_movimiento, cantidad, usuario, referencia, comentarios } = nuevoMovimiento;
    const { error } = await supabase
      .from("inventario_movimientos")
      .insert([{ producto_id: id, tipo_movimiento, cantidad, usuario, referencia, comentarios }]);

    if (error) {
      console.error("Error registrando movimiento:", error);
      showToast("error", "Error al registrar movimiento");
      return;
    }

    showToast("success", "Movimiento registrado correctamente");
    await fetchMovimientos();
    setNuevoMovimiento({
      tipo_movimiento: "entrada",
      cantidad: 1,
      usuario: "",
      referencia: "",
      comentarios: "",
    });
  };

  // === General UI ===
  const handleChange = (field: keyof Producto, value: any) =>
    setProducto((prev) => ({ ...prev!, [field]: value }));

  if (loading) return <p className="p-4 text-gray-300">Cargando producto...</p>;

  return (
    <div className="p-4 sm:p-6 space-y-6 text-white">
      <button onClick={() => navigate(-1)} className="text-blue-400 hover:underline text-sm">
        ← Volver
      </button>

      {userRole === "capturista" && clienteActivoNombre && (
        <div className="bg-blue-900/30 border border-blue-700 text-blue-200 px-4 py-2 rounded-lg mb-4 text-sm">
          Cliente activo: <span className="font-semibold">{clienteActivoNombre}</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {id === "nuevo" ? "Nuevo producto" : producto?.descripcion_corta || "Producto"}
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold shadow"
        >
          {id === "nuevo" ? "Agregar" : "Editar"}
        </button>
      </div>

      {/* === GALERÍA === */}
      {id !== "nuevo" && imagenes.length > 0 && (
        <div className="relative w-full flex justify-center items-center">
          <Swiper
            modules={[Navigation, Pagination, Zoom]}
            navigation
            pagination={{ clickable: true }}
            zoom
            className="rounded-2xl shadow-lg border border-white/20 bg-white/10 backdrop-blur-lg w-full max-w-4xl"
          >
            {imagenes.map((img, i) => (
              <SwiperSlide key={i} className="flex justify-center items-center">
                <img
                  src={img.signedUrl}
                  alt={`producto-${i}`}
                  className="w-auto max-w-full max-h-[70vh] object-contain rounded-xl"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* === MODAL === */}
      {showModal &&
        createPortal(
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-3xl text-white relative shadow-2xl overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-300 hover:text-white text-xl"
              >
                ✕
              </button>

              {/* === Tabs === */}
              <div className="flex overflow-x-auto scrollbar-hide space-x-2 pb-2 mb-4 border-b border-white/10">
                {[
                  { id: "datos", label: "🧾 Datos" },
                  { id: "tecnicos", label: "⚙️ Técnicos" },
                  { id: "inventario", label: "📦 Inventario" },
                  { id: "imagenes", label: "🖼️ Imágenes" },
                  { id: "qr", label: "🔍 Identificación" },
                  { id: "movimientos", label: "↔️ Movimientos" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
                            {/* === Contenido de Tabs === */}
              <div className="space-y-4">
                {/* === DATOS === */}
                {activeTab === "datos" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(userRole === "admin" || userRole === "supervisor") && (
                      <div>
                        <label className="block text-sm mb-1">Cliente</label>
                        <select
                          value={producto?.cliente_id || ""}
                          onChange={(e) => handleChange("cliente_id", e.target.value)}
                          className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none"
                        >
                          <option value="">Seleccione cliente</option>
                          {clientes.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <Input label="Descripción corta" field="descripcion_corta" value={producto} onChange={handleChange} />
                    <Input label="Tipo" field="tipo" value={producto} onChange={handleChange} />
                    <Input label="Marca" field="marca" value={producto} onChange={handleChange} />
                    <Input label="Modelo" field="modelo" value={producto} onChange={handleChange} />
                    <Input label="Serie" field="serie" value={producto} onChange={handleChange} />
                    <Input label="Categoría" field="categoria" value={producto} onChange={handleChange} />
                    <Input label="Proveedor" field="proveedor" value={producto} onChange={handleChange} />
                  </div>
                )}

                {/* === TÉCNICOS === */}
                {activeTab === "tecnicos" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Ubicación" field="ubicacion" value={producto} onChange={handleChange} />
                    <Input label="Unidad" field="unidad" value={producto} onChange={handleChange} />
                    <Input label="Estado" field="estado" value={producto} onChange={handleChange} />
                    <Input label="Categoría técnica" field="categoria" value={producto} onChange={handleChange} />
                  </div>
                )}

                {/* === INVENTARIO === */}
                {activeTab === "inventario" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Código de barras" field="codigo_barras" value={producto} onChange={handleChange} />
                    <Input label="Código QR" field="codigo_qr" value={producto} onChange={handleChange} />
                    <Input label="Unidad de medida" field="unidad" value={producto} onChange={handleChange} />
                    <Input label="Estado físico" field="estado" value={producto} onChange={handleChange} />
                  </div>
                )}

                {/* === IMÁGENES === */}
                {activeTab === "imagenes" && (
                  <div className="space-y-4">
                    <label className="block text-sm mb-1">Agregar imágenes</label>
                    <input
                      type="file"
                      multiple
                      onChange={handleUpload}
                      className="block w-full text-sm text-gray-300
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-600 file:text-white
                         hover:file:bg-blue-700"
                    />
                    {imagenes.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {imagenes.map((img) => (
                          <div key={img.id} className="relative group">
                            <img
                              src={img.signedUrl}
                              alt="producto"
                              className="rounded-lg object-cover w-full h-32"
                            />
                           <button
  onClick={async () => {
    if (!confirm("¿Eliminar esta imagen?")) return;
    try {
      await supabase.from("productos_imagenes").delete().eq("id", img.id);
      await supabase.storage.from("productos").remove([img.imagen_url]);
      setImagenes((prev) => prev.filter((i) => i.id !== img.id));
      showToast("success", "Imagen eliminada correctamente");
    } catch (err) {
      console.error("Error eliminando imagen:", err);
      showToast("error", "No se pudo eliminar la imagen");
    }
  }}
  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
>
  ✕
</button>

                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">📦 No hay imágenes aún</p>
                    )}
                  </div>
                )}

                {/* === QR / CÓDIGOS === */}
                {activeTab === "qr" && (
                  <div className="space-y-4 text-center">
                    <Input label="Código de barras / SKU" field="codigo_barras" value={producto} onChange={handleChange} />
                    <Input label="Texto QR" field="codigo_qr" value={producto} onChange={handleChange} />

                    {producto?.codigo_qr && (
                      <div className="flex flex-col items-center space-y-2 mt-4">
                        <QRCodeCanvas value={producto.codigo_qr} size={160} bgColor="#111827" fgColor="#ffffff" />
                        <p className="text-xs text-gray-400">Este QR representa el texto anterior</p>
                      </div>
                    )}

                    {/* Escáner */}
                    <div className="mt-6">
                      <button
                        onClick={() => setScanning((prev) => !prev)}
                        className={`px-5 py-2 rounded-lg font-semibold transition ${
                          scanning ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {scanning ? "Detener escaneo" : "Iniciar escaneo"}
                      </button>

                      <div id={qrRegionId} className="mt-4 flex justify-center"></div>
                    </div>
                  </div>
                )}

                {/* === MOVIMIENTOS === */}
                {activeTab === "movimientos" && (
                  <div className="space-y-6">
                    {/* Formulario de registro */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-4 rounded-lg">
                      <div>
                        <label className="block text-sm mb-1">Tipo de movimiento</label>
                        <select
                          value={nuevoMovimiento.tipo_movimiento}
                          onChange={(e) =>
                            setNuevoMovimiento({ ...nuevoMovimiento, tipo_movimiento: e.target.value })
                          }
                          className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none"
                        >
                          <option value="entrada">Entrada</option>
                          <option value="salida">Salida</option>
                          <option value="ajuste">Ajuste</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Cantidad</label>
                        <input
                          type="number"
                          value={nuevoMovimiento.cantidad}
                          onChange={(e) =>
                            setNuevoMovimiento({
                              ...nuevoMovimiento,
                              cantidad: parseInt(e.target.value),
                            })
                          }
                          className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm mb-1">Usuario</label>
                        <input
                          type="text"
                          value={nuevoMovimiento.usuario}
                          onChange={(e) =>
                            setNuevoMovimiento({ ...nuevoMovimiento, usuario: e.target.value })
                          }
                          className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm mb-1">Referencia</label>
                        <input
                          type="text"
                          value={nuevoMovimiento.referencia}
                          onChange={(e) =>
                            setNuevoMovimiento({ ...nuevoMovimiento, referencia: e.target.value })
                          }
                          className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm mb-1">Comentarios</label>
                        <textarea
                          value={nuevoMovimiento.comentarios}
                          onChange={(e) =>
                            setNuevoMovimiento({ ...nuevoMovimiento, comentarios: e.target.value })
                          }
                          rows={2}
                          className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2 flex justify-end">
                        <button
                          onClick={handleRegistrarMovimiento}
                          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-semibold"
                        >
                          Registrar
                        </button>
                      </div>
                    </div>

                    {/* Listado histórico */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Historial de movimientos</h3>
                      {movimientos.length > 0 ? (
                        <div className="max-h-60 overflow-y-auto">
                          {movimientos.map((m) => (
                            <div
                              key={m.id}
                              className="flex justify-between items-center p-2 bg-white/5 rounded-lg mb-2"
                            >
                              <div>
                                <p className="text-sm">
                                  <span className="font-semibold">{m.tipo_movimiento}</span> —{" "}
                                  {m.cantidad} unidades
                                </p>
                                <p className="text-xs text-gray-400">
                                  {new Date(m.created_at).toLocaleString("es-MX")}
                                </p>
                              </div>
                              <p className="text-xs text-gray-400">{m.usuario || "—"}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm">No hay movimientos registrados</p>
                      )}
                    </div>
                  </div>
                )}

                {/* === BOTONES DE NAVEGACIÓN === */}
                <div className="flex justify-between pt-4">
                  {activeTab !== "datos" && (
                    <button
                      onClick={() =>
                        setActiveTab((prev) =>
                          prev === "tecnicos"
                            ? "datos"
                            : prev === "inventario"
                            ? "tecnicos"
                            : prev === "imagenes"
                            ? "inventario"
                            : prev === "qr"
                            ? "imagenes"
                            : "qr"
                        )
                      }
                      className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg text-gray-200 font-semibold"
                    >
                      ← Anterior
                    </button>
                  )}

                  {activeTab !== "movimientos" ? (
                    <button
                      onClick={() =>
                        setActiveTab((prev) =>
                          prev === "datos"
                            ? "tecnicos"
                            : prev === "tecnicos"
                            ? "inventario"
                            : prev === "inventario"
                            ? "imagenes"
                            : prev === "imagenes"
                            ? "qr"
                            : "movimientos"
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-semibold"
                    >
                      Siguiente →
                    </button>
                  ) : (
                    <button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg text-white font-semibold"
                    >
                      Guardar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

/* === Componente Input reutilizable === */
function Input({ label, field, value, onChange, type = "text" }: any) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input
        type={type}
        value={value?.[field] || ""}
        onChange={(e) => onChange(field, type === "number" ? Number(e.target.value) : e.target.value)}
        className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

