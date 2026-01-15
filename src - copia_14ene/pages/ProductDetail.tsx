// src/pages/ProductDetail.tsx
// ProductDetail totalmente modular — Feb 2025

import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabaseClient";

/* Swiper */
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Zoom } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "@/styles/swiper-fix.css";

/* QR + Barcode utils */
import { QRCodeCanvas } from "qrcode.react";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";
import jsPDF from "jspdf";

/* Scanner ZXing */
import { useZXingScanner } from "@/components/product/hooks/useZXingScanner";

/* Componentes especiales */
import FieldRow from "@/components/product/detail/FieldRow";
import BarcodeImage from "@/components/product/widgets/BarcodeImage";

/* Pantallas del Wizard */
import Pantalla1Proyecto from "@/components/product/wizard/Pantalla1Proyecto";
import Pantalla2DatosActivo from "@/components/product/wizard/Pantalla2DatosActivo";
import Pantalla3Dimensiones from "@/components/product/wizard/Pantalla3Dimensiones";
import Pantalla4Componentes from "@/components/product/wizard/Pantalla4Componentes";
import Pantalla5Vehiculos from "@/components/product/wizard/Pantalla5Vehiculos";
import Pantalla6Asignacion from "@/components/product/wizard/Pantalla6Asignacion";
import Pantalla7Imagenes from "@/components/product/wizard/Pantalla7Imagenes";
import Pantalla8IdentAvanzada from "@/components/product/wizard/Pantalla8IdentAvanzada";
import Pantalla9Resumen from "@/components/product/wizard/Pantalla9Resumen";
import Pantalla9Auditoria from "@/components/product/wizard/Pantalla9Auditoria";
import ClienteContextHeader from "@components/ClienteContextHeader";
import ClienteSelectorModal from "@components/ClienteSelectorModal";
import { useCliente } from "@/context/ClienteContext";
/* ===================== Tipos ===================== */
interface Producto {
  id?: string;
  cliente_id: string | null;
  ubicacion: string | null;
  piso: string | null;
  area_sector: string | null;
  tipo: string | null;
  descripcion_corta: string | null;
  tag: string | null;
  unidad: string | null;
  estado: string | null;
  proveedor: string | null;
  descripcion_larga?: string | null;
  notas_adicionales?: string | null;
  observaciones?: string | null;
  marca?: string | null;
  submarca?: string | null;
  modelo?: string | null;
  version?: string | null;
  no_serie?: string | null;
  pais_origen?: string | null;
  material?: string | null;
  color?: string | null;
  movilidad?: string | null;
  vida_util_remanente?: string | null;
  estado_fisico?: string | null;
  estado_operatividad?: string | null;
  largo?: number | null;
  ancho?: number | null;
  alto?: number | null;
  unidad_medida_dimensiones?: string | null;
  diametro?: number | null;
  um_diametro?: string | null;
  capacidad?: number | null;
  um_capacidad?: string | null;
  asiento?: string | null;
  respaldo?: string | null;
  base?: string | null;
  cubierta?: string | null;
  rodajas?: string | null;
  descansabrazos?: string | null;
  no_cajones?: number | null;
  no_gavetas?: number | null;
  no_entrepanos?: number | null;
  no_puertas_abatibles?: number | null;
  no_puertas_corredizas?: number | null;
  no_motor?: string | null;
  matricula?: string | null;
  kilometraje?: number | null;
  no_economico?: string | null;
  usuario?: string | null;
  consultor?: string | null;
  area_especifica?: string | null;
  tag_anterior?: string | null;
  tag_colocado_nuevo?: string | null;
  codigo_barras?: string | null;
  codigo_qr?: string | null;
}

/* ===================== Constantes ===================== */
const BUCKET = "productos";
const STICKY_KEY = "captura_sticky_v1";

const PROYECTOS = [
  "Aptiv de México",
  "Yorozu Automotive México",
  "Calsonic Kansei México",
  "Nidec Global Appliance",
  "Tachi-S México",
  "Gestamp México",
  "Plastic Omnium México",
];

const formatoNombreHumano: Record<string, string> = {
  QR_CODE: "QR Code",
  EAN_13: "EAN-13",
  EAN_8: "EAN-8",
  UPC_A: "UPC-A",
  UPC_E: "UPC-E",
  CODE_128: "Code 128",
  CODE_39: "Code 39",
  ITF: "ITF",
  CODABAR: "Codabar",
  DATA_MATRIX: "DataMatrix",
  PDF_417: "PDF417",
};

 

/* ===================== Utilidad: convertir SVG → PNG ===================== */
async function barcodeToPNG(svg: SVGSVGElement): Promise<string> {
  const svgString = new XMLSerializer().serializeToString(svg);

  const img = new Image();
  img.src =
    "data:image/svg+xml;base64," +
    window.btoa(unescape(encodeURIComponent(svgString)));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  return new Promise((resolve) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
  });
}

/* ===================== Componente principal ===================== */
export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clienteId, setClienteId } = useCliente(); // 👈 contexto global
   //   /* Datos */
  const [producto, setProducto] = useState<Producto | null>(null);
  const [imagenes, setImagenes] = useState<any[]>([]);
const [imagenesTemporales, setImagenesTemporales] = useState<
  { path: string; file: File | Blob }[]
>([]);

 // ✅ CLIENTES AQUÍ
  const [clientes, setClientes] = useState<Cliente[]>([]);
const [showConfirmChangeCliente, setShowConfirmChangeCliente] = useState(false);
const [clientePendiente, setClientePendiente] = useState<string | null>(null);

  /* ===================== CARGAR CLIENTES ===================== */
  useEffect(() => {
    const loadClientes = async () => {
      const { data } = await supabase
        .from("clientes")
        .select("id, nombre")
        .order("nombre", { ascending: true });

      setClientes((data as Cliente[]) || []);
    };

    loadClientes();
  }, []);

  const [loading, setLoading] = useState(true);
  const [clienteNombre, setClienteNombre] = useState("");

  const [proyecto, setProyecto] = useState<string>(PROYECTOS[0]);
  const [tipoDetectado, setTipoDetectado] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

const [showClienteModal, setShowClienteModal] = useState(false);

   type Cliente = {
  id: string;
  nombre: string;
  logo_url?: string;
};

const clienteActivo = producto
  ? clientes.find((c: Cliente) => c.id === producto.cliente_id)
  : null;

  useEffect(() => {
  if (
    clienteId &&
    producto &&
    producto.cliente_id !== clienteId
  ) {
    setProducto((p) => ({
      ...p!,
      cliente_id: clienteId,
    }));
  }
}, [clienteId, producto]);

  /* Modal Wizard */
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("pantalla1");
  const [transitionDirection, setTransitionDirection] =
    useState<"left" | "right">("left");
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);

  const [labelSize, setLabelSize] = useState<"small" | "medium" | "large">(
    "small"
  );

  /* ===================== Scanner ZXing ===================== */
  const {
    init,
    videoRef,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    scanning,
    detected,
    start,
    stop,
  } = useZXingScanner({
    onResult: (text, format) => {
      const nombre = formatoNombreHumano[format] || format;
      setTipoDetectado(nombre);

      if (format === "QR_CODE") {
        setProducto((p) => ({ ...p!, codigo_qr: text }));
      } else {
        setProducto((p) => ({ ...p!, codigo_barras: text }));
      }
    },
    onError: (err) => console.warn("Scanner error:", err),
  });

  useEffect(() => {
    init();
  }, []);

  /* Orden de tabs reales */
  const tabsOrden = [
    "pantalla1",
    "pantalla2",
    "pantalla3",
    "componentes",
    "vehiculos",
    "asignacion",
    "imagenes",
    "id_avanzada",
    "auditoria",
    "resumen",
  ];

  /* ===================== Carga inicial ===================== */
  useEffect(() => {
    const sticky = JSON.parse(localStorage.getItem(STICKY_KEY) || "{}");

    //if (sticky?.proyecto) setProyecto(sticky.proyecto);

    if (id === "nuevo") {
      const base: Producto = {
        cliente_id: sticky?.cliente_id ?? null,
        ubicacion: sticky?.ubicacion ?? null,
        piso: sticky?.piso ?? null,
        area_sector: sticky?.area_sector ?? null,
        tipo: sticky?.tipo ?? null,
        descripcion_corta: null,
        tag: null,
        unidad: null,
        estado: null,
        proveedor: null,
        descripcion_larga: null,
        notas_adicionales: null,
        observaciones: null,
        marca: null,
        submarca: null,
        modelo: null,
        version: null,
        no_serie: null,
        pais_origen: null,
        material: null,
        color: null,
        movilidad: null,
        vida_util_remanente: null,
        estado_fisico: null,
        estado_operatividad: null,
        largo: null,
        ancho: null,
        alto: null,
        unidad_medida_dimensiones: null,
        diametro: null,
        um_diametro: null,
        capacidad: null,
        um_capacidad: null,
        asiento: null,
        respaldo: null,
        base: null,
        cubierta: null,
        rodajas: null,
        descansabrazos: null,
        no_cajones: null,
        no_gavetas: null,
        no_entrepanos: null,
        no_puertas_abatibles: null,
        no_puertas_corredizas: null,
        no_motor: null,
        matricula: null,
        kilometraje: null,
        no_economico: null,
        usuario: null,
        consultor: null,
        area_especifica: null,
        tag_anterior: null,
        tag_colocado_nuevo: null,
        codigo_barras: null,
        codigo_qr: null,
      };
      setProducto(base);
      setShowModal(true);
      setLoading(false);
    } else {
      fetchProducto();
      fetchImagenes();
    }
  }, [id]);

  /* ===================== Fetch producto ===================== */
  const fetchProducto = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) setProducto(data);
    setLoading(false);
    if (data?.cliente_id) {
  const { data: cli } = await supabase
    .from("clientes")
    .select("nombre")
    .eq("id", data.cliente_id)
    .single();

  if (cli) setClienteNombre(cli.nombre);
}
  };

  /* ===================== Fetch imágenes===================== */
  const fetchImagenes = async () => {
    if (!id || id === "nuevo") return;

    const { data: imgs } = await supabase
      .from("productos_imagenes")
      .select("id, imagen_url")
      .eq("producto_id", id)
      .order("created_at", { ascending: true });

    if (!imgs) return;

    const signed = await Promise.all(
      imgs.map(async (img) => {
        const { data } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(img.imagen_url, 3600);
        return { ...img, signedUrl: data?.signedUrl };
      })
    );

    setImagenes(signed);
  };

  /* ===================== Handlers ===================== */
  const allowedFields = Object.keys({
    cliente_id: null,
    ubicacion: null,
    piso: null,
    area_sector: null,
    tipo: null,
    descripcion_corta: null,
    tag: null,
    unidad: null,
    estado: null,
    proveedor: null,
    descripcion_larga: null,
    notas_adicionales: null,
    observaciones: null,
    marca: null,
    submarca: null,
    modelo: null,
    version: null,
    no_serie: null,
    pais_origen: null,
    material: null,
    color: null,
    movilidad: null,
    vida_util_remanente: null,
    estado_fisico: null,
    estado_operatividad: null,
    largo: null,
    ancho: null,
    alto: null,
    unidad_medida_dimensiones: null,
    diametro: null,
    um_diametro: null,
    capacidad: null,
    um_capacidad: null,
    asiento: null,
    respaldo: null,
    base: null,
    cubierta: null,
    rodajas: null,
    descansabrazos: null,
    no_cajones: null,
    no_gavetas: null,
    no_entrepanos: null,
    no_puertas_abatibles: null,
    no_puertas_corredizas: null,
    no_motor: null,
    matricula: null,
    kilometraje: null,
    no_economico: null,
    usuario: null,
    consultor: null,
    area_especifica: null,
    tag_anterior: null,
    tag_colocado_nuevo: null,
    codigo_barras: null,
    codigo_qr: null,
  });

  const cleanForDB = (obj: any) =>
    Object.fromEntries(
      Object.entries(obj).filter(([k]) => allowedFields.includes(k))
    );
    

  const handleChange = async (field: string, value: any) => {
  setProducto((p) => ({ ...p!, [field]: value === "" ? null : value }));

  // 🆕 Si cambia cliente, obtener nombre
  if (field === "cliente_id") {
    // 🛑 Si se limpia el cliente, no consultes Supabase
    if (!value) {
      setClienteNombre("");
      return;
    }
    const { data, error } = await supabase
      .from("clientes")
      .select("nombre")
      .eq("id", value)
      .single();
 
     if (!error) {
      setClienteNombre(data?.nombre ?? "");
    }
  }
};

  
 const persistSticky = (draft?: Partial<Producto>) => {
  const next = {
    cliente_id: draft?.cliente_id ?? producto?.cliente_id ?? null,
    ubicacion: draft?.ubicacion ?? producto?.ubicacion ?? null,
    piso: draft?.piso ?? producto?.piso ?? null,
    area_sector: draft?.area_sector ?? producto?.area_sector ?? null,
    tipo: draft?.tipo ?? producto?.tipo ?? null,
  };

  localStorage.setItem(STICKY_KEY, JSON.stringify(next));
};


  /* ===================== Subida de imágenes (módulo Pantalla7) ===================== */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return;

  const files = Array.from(e.target.files);

  for (const file of files) {
    const tempPath = `temp/${Date.now()}-${file.name}`;

    // Subir la imagen original a temp
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(tempPath, file, { upsert: true });

    if (!error) {
      // 👉 Guardar preview local + path en Supabase
      setImagenesTemporales((prev) => [
        ...prev,
        { path: tempPath, file }   // ✔ FILE INCLUIDO
      ]);
    }
  }

  // Limpia el input para permitir volver a tomar la misma foto
  e.target.value = "";
};


  const handleCancelarImagenesTemporales = async () => {
   for (const img of imagenesTemporales) {
  await supabase.storage.from(BUCKET).remove([img.path]);
}

    setImagenesTemporales([]);
  };

  const handleDeleteImagen = async (id: string, path: string) => {
    await supabase.from("productos_imagenes").delete().eq("id", id);
    await supabase.storage.from(BUCKET).remove([path]);
    fetchImagenes();
  };

  /* ===================== Guardar ===================== */
  const handleSave = async () => {
    setSubmitAttempted(true);
    if (!producto) return;

    if (!producto.ubicacion || !producto.piso || !producto.area_sector) {
      alert("Debes llenar Ubicación, Piso y Área/Sector");
      return;
    }

    /* ================= VALIDACIÓN DE CAMPOS OBLIGATORIOS ================= */
    const camposObligatorios: Record<string, string> = {
      ubicacion: "Ubicación",
      piso: "Piso",
      area_sector: "Área / Sector",
      tipo: "Tipo",
      descripcion_corta: "Descripción corta",
      tag: "Tag",
    };

    for (const campo in camposObligatorios) {
      if (!(producto as any)[campo] || (producto as any)[campo] === "") {
        alert(`El campo "${camposObligatorios[campo]}" es obligatorio.`);
        return;
      }
    }

    const dataToSave = cleanForDB(producto);
    let newId = id;

    if (id === "nuevo") {
      const { data, error } = await supabase
        .from("productos")
        .insert([dataToSave])
        .select("id")
        .single();

      if (error || !data) {
        alert("Error al guardar producto");
        if (error) {
  //console.error("SUPABASE ERROR:", error.message, error.details, error.hint);
}
        return;
      }

      newId = data.id;
    } else {
      console.log("ANTES DE GUARDAR producto =", producto);

      await supabase.from("productos").update(dataToSave).eq("id", id);
    }

    /* Procesar imágenes temporales */
    for (const img of imagenesTemporales) {
  const tempPath = img.path;
  const filename = tempPath.split("/").pop();
  const finalPath = `${newId}/${filename}`;

  const { data: blob } = await supabase.storage
    .from(BUCKET)
    .download(tempPath);

  if (blob) {
    await supabase.storage.from(BUCKET).upload(finalPath, blob, {
      upsert: true,
    });

    await supabase
      .from("productos_imagenes")
      .insert([{ producto_id: newId, imagen_url: finalPath }]);
    }

  await supabase.storage.from(BUCKET).remove([tempPath]);
}


    setImagenesTemporales([]);

    alert("Producto guardado");
    setShowModal(false);

    if (id === "nuevo") navigate(`/productos/${newId}`);
  };

  /* ===================== Eliminar producto ===================== */
  const handleDeleteProducto = async () => {
    if (!id || id === "nuevo") return;

    if (!confirm("¿Eliminar producto e imágenes asociadas?")) return;

    const { data: imgs } = await supabase
      .from("productos_imagenes")
      .select("imagen_url")
      .eq("producto_id", id);

    if (imgs?.length) {
      await supabase.storage
        .from(BUCKET)
        .remove(imgs.map((i) => i.imagen_url));

      await supabase
        .from("productos_imagenes")
        .delete()
        .eq("producto_id", id);
    }

    await supabase.from("productos").delete().eq("id", id);
    alert("Producto eliminado");
    navigate("/productos");
  };

  /* ===================== Impresión / PDF de etiqueta ===================== */
  /* ============================================================
   IMPRESIÓN DE ETIQUETA — versión mejorada
   Igual al diseño original (logo izquierda, QR derecha, barcode abajo)
============================================================ */
  const handlePrintEtiqueta = async () => {
    if (!producto) return;

    const fecha = new Date().toLocaleString("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const sizes = {
      small: { w: 600, h: 330 },
      medium: { w: 750, h: 400 },
      large: { w: 900, h: 480 },
    };

    const { w, h } = sizes[labelSize];

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#000000";
    ctx.textBaseline = "top";

    /* ------------------------- LOGO TRANSPARENTE (PDF) --------------------------- */
    const logo = new Image();
    logo.src = "/logo-anzaval-transparent.png"; // <--- Nuevo logo

    await new Promise((resolve) => (logo.onload = resolve));

    // Tamaño ajustado para PDF
    ctx.drawImage(logo, 20, 20, 180, 110);

    /* ------------------------- QR --------------------------- */

    if (producto.codigo_qr) {
      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, producto.codigo_qr, {
        width: 150,
        margin: 0,
      });

      // bajado 20px para que no choque con texto
      ctx.drawImage(qrCanvas, w - 180, 30, 150, 150);
    }

    /* ------------------------- TEXTO --------------------------- */

    ctx.font =
      labelSize === "large"
        ? "26px Arial"
        : labelSize === "medium"
        ? "22px Arial"
        : "20px Arial";

    const xText = 220;
    let y = 30;

    const lineSpacing =
      labelSize === "large"
        ? 34
        : labelSize === "medium"
        ? 30
        : 26;

    const write = (text: string) => {
      ctx.fillText(text, xText, y);
      y += lineSpacing;
    };

    write(`Proyecto: ${proyecto}`);
    write(`Descripción: ${producto.descripcion_corta ?? "-"}`);
    write(`No. serie: ${producto.no_serie ?? "-"}`);
    write(`Fecha impresión: ${fecha}`);

    /* ------------------------- BARRAS --------------------------- */

    if (producto.codigo_barras) {
      const barcodeCanvas = document.createElement("canvas");

      JsBarcode(barcodeCanvas, producto.codigo_barras, {
        format: "CODE128",
        width: 2.2,
        height:
          labelSize === "large"
            ? 140
            : labelSize === "medium"
            ? 130
            : 120,
        displayValue: true,
        fontSize: 16,
        margin: 8,
        lineColor: "#000000",
      });

      // subir un poco el código de barras (30px más arriba)
      const barcodeX = (w - barcodeCanvas.width) / 2;
      const barcodeY = h - barcodeCanvas.height - 40;

      ctx.drawImage(barcodeCanvas, barcodeX, barcodeY);
    }

    /* ------------------------- IMPRIMIR --------------------------- */

    const win = window.open("", "_blank");
    win!.document.write(`
    <html>
      <head><title>Etiqueta</title></head>
      <body style="margin:0;padding:0;">
        <img src="${canvas.toDataURL()}" style="width:100%;"/>
      </body>
    </html>
  `);

    win!.document.close();

    setTimeout(() => {
      win!.focus();
      win!.print();
    }, 300);
  };

  /* ============================================================
     GENERAR PDF — jsPDF usando la misma etiqueta
============================================================ */
  const handlePrintEtiquetaPDF = async () => {
    if (!producto) return;

    const w = 609;
    const h = 406;

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#000000";
    ctx.textBaseline = "top";

    /* LOGO */
    const logo = new Image();
    logo.src = "/logo-anzaval-transparent.png";
    await new Promise((resolve) => (logo.onload = resolve));
    ctx.drawImage(logo, 25, 25, 200, 120);

    /* QR */
    if (producto.codigo_qr) {
      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, producto.codigo_qr, { width: 150 });
      ctx.drawImage(qrCanvas, w - 180, 25, 150, 150);
    }

    /* TEXTO */
    ctx.font = "22px Arial";
    const xText = 250;
    let y = 40;
    const lineSpacing = 30;

    const fecha = new Date().toLocaleString("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const write = (txt: string) => {
      ctx.fillText(txt, xText, y);
      y += lineSpacing;
    };

    write(`Proyecto: ${proyecto}`);
    write(`Descripción: ${producto.descripcion_corta ?? "-"}`);
    write(`No. serie: ${producto.no_serie ?? "-"}`);
    write(`Fecha impresión: ${fecha}`);

    /* BARRAS */
    if (producto.codigo_barras) {
      const barcodeCanvas = document.createElement("canvas");

      JsBarcode(barcodeCanvas, producto.codigo_barras, {
        format: "CODE128",
        width: 2.4,
        height: 140,
        displayValue: true,
        fontSize: 18,
        margin: 4,
      });

      ctx.drawImage(
        barcodeCanvas,
        (w - barcodeCanvas.width) / 2,
        h - barcodeCanvas.height - 25
      );
    }

    /* PDF */
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [w, h],
    });

    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, w, h);

    pdf.save(`etiqueta-${producto.id ?? "nuevo"}.pdf`);
  };

  /* ===================== Render ===================== */
  if (loading) {
    return <p className="p-4 text-gray-300">Cargando producto...</p>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 text-gray-800 dark:text-white">

      {/* Header */}
      <div className="flex items-center justify-between">

 


        <div className="flex items-center gap-3">
          <img src="/logo.png" className="h-8 w-8" />
          <button
            onClick={() => navigate(-1)}
            className="text-blue-400 hover:underline text-sm"
          >
            ← Volver
          </button>
        </div>

        <div className="flex gap-2">
          {id !== "nuevo" && (
            <button
              onClick={handleDeleteProducto}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-500/40
"
            >
              🗑️ Eliminar
            </button>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-500/40
"
          >
            {id === "nuevo" ? "Agregar" : "✏️ Editar"}
          </button>
        </div>
      </div>

      {/* Título */}
      <h1 className="text-2xl font-bold">
        {id === "nuevo"
          ? "Nuevo producto"
          : producto?.descripcion_corta || "Producto"}
      </h1>

      {/* Galería superior */}
      {id !== "nuevo" && imagenes.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <span className="text-blue-400">🖼️</span> Imágenes del producto
          </h3>

          <Swiper
            modules={[Navigation, Pagination, Zoom]}
            navigation
            pagination={{ clickable: true }}
            zoom
            className="rounded-xl shadow-lg border border-gray-200 dark:border-white/20  bg-white dark:bg-white/10 backdrop-blur-lg"

            style={{ maxHeight: "320px" }}
          >
            {imagenes.map((img, i) => (
              <SwiperSlide
                key={img.id ?? i}
                className="!w-full flex justify-center items-center"
              >
                <img
                  src={img.signedUrl}
                  alt={`imagen-${i}`}
                  className="w-full h-auto max-h-[60vh] object-contain mx-auto rounded-xl"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Ficha técnica */}
      {id !== "nuevo" && (
        <FichaTecnica
          producto={producto}
          imagenes={imagenes}
          barcodeToPNG={barcodeToPNG}
          labelSize={labelSize}
          setLabelSize={setLabelSize}
          handlePrintEtiqueta={handlePrintEtiqueta}
          handlePrintEtiquetaPDF={handlePrintEtiquetaPDF}
        />
      )}

      {/* ===================== MODAL DEL WIZARD ===================== */}
      {showModal &&
        createPortal(
          <ModalWizard
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabsOrden={tabsOrden}
            setShowModal={setShowModal}
            transitionDirection={transitionDirection}
            setTransitionDirection={setTransitionDirection}
            tabsContainerRef={tabsContainerRef}
            producto={producto}
            proyecto={proyecto}
            PROYECTOS={PROYECTOS}
            handleChange={handleChange}
            persistSticky={persistSticky}
            handleUpload={handleUpload}
            handleCancelarImagenesTemporales={handleCancelarImagenesTemporales}
            handleDeleteImagen={handleDeleteImagen}
            imagenes={imagenes}
            imagenesTemporales={imagenesTemporales}
            tipoDetectado={tipoDetectado}
            barcodeToPNG={barcodeToPNG}
            videoRef={videoRef}
            devices={devices}
            selectedDeviceId={selectedDeviceId}
            setSelectedDeviceId={setSelectedDeviceId}
            scanning={scanning}
            start={start}
            stop={stop}
            detected={detected}
            handleSave={handleSave}
            labelSize={labelSize}
            setLabelSize={setLabelSize}
            setProyecto={setProyecto}
            submitAttempted={submitAttempted}
            setSubmitAttempted={setSubmitAttempted}
            clienteNombre={clienteNombre}
            clienteActivo={clienteActivo}
            onCambiarCliente={() => setShowClienteModal(true)}
            showClienteModal={showClienteModal}
            setShowClienteModal={setShowClienteModal}
            onCloseClienteModal={() => setShowClienteModal(false)}
            //onSelectCliente={onSelectCliente}
            clientes={clientes}
            setClienteId={setClienteId}
            setClientePendiente={setClientePendiente}
            clientePendiente={clientePendiente}
            setShowConfirmChangeCliente={setShowConfirmChangeCliente}
            showConfirmChangeCliente={showConfirmChangeCliente}
          />,
          document.body
        )}
    </div>
  );
}

/* ==========================================================
   COMPONENTES ADICIONALES
   (Ficha técnica y modal wizard)
   ========================================================== */

/* Ficha Técnica compacta del detalle */
function FichaTecnica({
  producto,
  //imagenes,
  barcodeToPNG,
  //labelSize,
  //setLabelSize,
  handlePrintEtiqueta,
  handlePrintEtiquetaPDF,
}: any) {
  if (!producto) return null;

  return (
    <div className="space-y-6">
      {/* ======================= IDENTIFICACIÓN ======================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tarjeta Identificación */}
        <div className="rounded-xl p-4 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 shadow-sm dark:shadow-none">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-800 dark:text-white">

            <span className="text-blue-400">📍</span> Identificación
          </h3>

          <FieldRow label="Ubicación" value={producto.ubicacion} />
          <FieldRow label="Piso" value={producto.piso} />
          <FieldRow label="Área / Sector" value={producto.area_sector} />
          <FieldRow label="Categoría" value={producto.tipo} />
          <FieldRow label="Estado" value={producto.estado} />
          <FieldRow label="Proveedor" value={producto.proveedor} />
          <FieldRow label="Unidad" value={producto.unidad} />
          <FieldRow label="Tag" value={producto.tag} />
          <FieldRow label="Etiqueta anterior" value={producto.tag_anterior} />
          <FieldRow label="Etiqueta nueva" value={producto.tag_colocado_nuevo} />
          <FieldRow label="Código de barras" value={producto.codigo_barras} />
          <FieldRow label="Texto QR" value={producto.codigo_qr} />
        </div>
      </div>

      {/* ======================= ESPECIFICACIONES ======================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl p-4 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 shadow-sm dark:shadow-none">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-800 dark:text-white">

            <span className="text-blue-400">⚙️</span> Especificaciones
          </h3>

          <FieldRow label="Marca" value={producto.marca} />
          <FieldRow label="Submarca" value={producto.submarca} />
          <FieldRow label="Modelo" value={producto.modelo} />
          <FieldRow label="Versión" value={producto.version} />
          <FieldRow label="No. de serie" value={producto.no_serie} />
          <FieldRow label="País de origen" value={producto.pais_origen} />
          <FieldRow label="Material" value={producto.material} />
          <FieldRow label="Color" value={producto.color} />
          <FieldRow label="Movilidad" value={producto.movilidad} />
          <FieldRow
            label="Vida útil remanente"
            value={producto.vida_util_remanente}
          />
          <FieldRow label="Estado físico" value={producto.estado_fisico} />
          <FieldRow
            label="Operatividad"
            value={producto.estado_operatividad}
          />
          <FieldRow label="Capacidad" value={producto.capacidad} />
          <FieldRow label="UM capacidad" value={producto.um_capacidad} />
        </div>

        {/* Dimensiones */}
        <div className="rounded-xl p-4 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 shadow-sm dark:shadow-none">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-800 dark:text-white">

            <span className="text-blue-400">📐</span> Dimensiones y capacidades
          </h3>

          <FieldRow label="Largo" value={producto.largo} />
          <FieldRow label="Ancho" value={producto.ancho} />
          <FieldRow label="Alto" value={producto.alto} />
          <FieldRow
            label="UM dimensiones"
            value={producto.unidad_medida_dimensiones}
          />
          <FieldRow label="Diámetro" value={producto.diametro} />
          <FieldRow label="UM diámetro" value={producto.um_diametro} />
        </div>
      </div>

      {/* ======================= COMPONENTES ======================= */}
      <div className="rounded-xl p-4 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 shadow-sm dark:shadow-none">
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-800 dark:text-white">

          <span className="text-blue-400">🪑</span> Mobiliario
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FieldRow label="Asiento" value={producto.asiento} />
          <FieldRow label="Respaldo" value={producto.respaldo} />
          <FieldRow label="Base" value={producto.base} />
          <FieldRow label="Cubierta" value={producto.cubierta} />
          <FieldRow label="Rodajas" value={producto.rodajas} />
          <FieldRow
            label="Descansabrazos"
            value={producto.descansabrazos}
          />
          <FieldRow label="No. cajones" value={producto.no_cajones} />
          <FieldRow label="No. gavetas" value={producto.no_gavetas} />
          <FieldRow label="No. entrepaños" value={producto.no_entrepanos} />
          <FieldRow
            label="Puertas abatibles"
            value={producto.no_puertas_abatibles}
          />
          <FieldRow
            label="Puertas corredizas"
            value={producto.no_puertas_corredizas}
          />
        </div>
      </div>

      {/* ======================= VEHÍCULOS ======================= */}
      <div className="rounded-xl p-4 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 shadow-sm dark:shadow-none">
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-800 dark:text-white">

          <span className="text-blue-400">🚗</span> Vehículos
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FieldRow label="No. motor" value={producto.no_motor} />
          <FieldRow label="Matrícula" value={producto.matricula} />
          <FieldRow label="Kilometraje" value={producto.kilometraje} />
          <FieldRow label="No. económico" value={producto.no_economico} />
        </div>
      </div>

      {/* ======================= ASIGNACIÓN ======================= */}
      <div className="rounded-xl p-4 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 shadow-sm dark:shadow-none">
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <span className="text-blue-400">🧑‍💼</span> Asignación y auditoría
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FieldRow
            label="Usuario asignado"
            value={producto.usuario}
          />
          <FieldRow label="Consultor" value={producto.consultor} />
          <FieldRow
            label="Área específica"
            value={producto.area_especifica}
          />
        </div>
      </div>

      {/* ======================= DESCRIPCIONES ======================= */}
      <div className="rounded-xl p-4 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 shadow-sm dark:shadow-none">
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-800 dark:text-white">
📝 Descripciones y notas</h3>

        <FieldRow
          label="Descripción corta"
          value={producto.descripcion_corta}
        />
        <FieldRow
          label="Observaciones"
          value={producto.observaciones}
        />
        <FieldRow
          label="Notas adicionales"
          value={producto.notas_adicionales}
        />

        <div className="mt-3">
          <p className="text-gray-400 text-sm mb-1">Descripción larga</p>
          <p className="whitespace-pre-line">
            {producto.descripcion_larga}
          </p>
        </div>
      </div>

      {/* ======================= CÓDIGO DE BARRAS ======================= */}
      {producto.codigo_barras && (
        <div className="rounded-xl p-6 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 shadow-sm dark:shadow-none">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span className="text-gray-700 dark:text-gray-200">🏷️</span> Código de barras
            generado
          </h3>

          <BarcodeImage value={producto.codigo_barras} />

          <button
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
            onClick={async () => {
              const svg = document.querySelector(
                "svg"
              ) as SVGSVGElement;
              const png = await barcodeToPNG(svg);
              const a = document.createElement("a");
              a.href = png;
              a.download = `barcode-${producto.codigo_barras}.png`;
              a.click();
            }}
          >
            Descargar PNG
          </button>
        </div>
      )}

      {/* ======================= QR DEL PRODUCTO ======================= */}
      {producto.codigo_qr && (
        <div className="rounded-xl p-4 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 shadow-sm dark:shadow-none">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span className="text-gray-700 dark:text-gray-200">🔳</span> QR del producto
          </h3>

          <QRCodeCanvas
            value={producto.codigo_qr}
            size={160}
            bgColor="#0b1220"
            fgColor="#ffffff"
          />

          <p className="text-xs text-gray-400 mt-2">
            Este QR representa el texto configurado en “Texto QR”.
          </p>
        </div>
      )}

      <button
        onClick={handlePrintEtiqueta}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-500/40
"
      >
        🖨️ Imprimir etiqueta
      </button>

      <button
        onClick={handlePrintEtiquetaPDF}
        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-500/40
"
      >
        📄 Descargar PDF
      </button>
    </div>
  );
}

/* Modal de Wizard */
/* ======================= MODAL WIZARD (MODO CLARO + OSCURO) ======================= */
function ModalWizard(props: any) {
  const {
    activeTab,
    setActiveTab,
    tabsOrden,
    setShowModal,
    transitionDirection,
    setTransitionDirection,
    tabsContainerRef,
    producto,
    proyecto,
    handleChange,
    persistSticky,
    handleUpload,
    handleCancelarImagenesTemporales,
    handleDeleteImagen,
    imagenes,
    imagenesTemporales,
    tipoDetectado,
    barcodeToPNG,
    videoRef,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    scanning,
    start,
    stop,
    detected,
    handleSave,
    submitAttempted,
    setSubmitAttempted,
    clienteNombre,
    clienteActivo,
    onCambiarCliente,
    showClienteModal,
    setShowClienteModal,
    //onCloseClienteModal,
    //onSelectCliente,
    setClienteId,
    clientes,
    setClientePendiente,
    clientePendiente,
    setShowConfirmChangeCliente,
    showConfirmChangeCliente,
  } = props;

  useEffect(() => {
    setSubmitAttempted(false);
  }, [activeTab, setSubmitAttempted]);

  const TITULOS: Record<string, string> = {
    pantalla1: "Proyecto / Ubicación",
    pantalla2: "Datos del activo",
    pantalla3: "Dimensiones y capacidades",
    componentes: "Mobiliario",
    vehiculos: "Vehículos",
    asignacion: "Asignación",
    imagenes: "Imágenes",
    id_avanzada: "Identificación avanzada",
    auditoria: "Auditoría",
    resumen: "Resumen final",
  };

  //const tituloPantallaActual = TITULOS[activeTab] ?? "Detalle del producto";
const pasoActual = tabsOrden.indexOf(activeTab) + 1;
const totalPasos = tabsOrden.length;
const progreso =
  ((tabsOrden.indexOf(activeTab) + 1) / tabsOrden.length) * 100;


  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-stretch">


      {/* CONTENEDOR PRINCIPAL — MODO CLARO + OSCURO */}
      <div
        className="
          w-full max-w-4xl mx-auto my-2 sm:my-6 
          rounded-3xl shadow-2xl flex flex-col max-h-[100vh]
          bg-white dark:bg-[#0b1220]/95
          border border-gray-300 dark:border-white/15
          text-gray-800 dark:text-white
        "
      >{/* ===== HEADER STICKY (MÓVIL) ===== */}
<div
  className="
    z-40
    bg-slate-900
    border-b border-white/10
    md:static
    md:bg-transparent
    md:border-0
    sticky top-0
    backdrop-blur md:backdrop-blur-0
  "
>

  <div className="px-3 pt-3 pb-2 space-y-2 md:px-0 md:pt-0 md:pb-4 md:space-y-3">


    {/* Fila: título + cerrar */}
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
       <h2 className="truncate text-sm font-semibold text-white md:text-lg">

          {TITULOS[activeTab]}
        </h2>
        <p className="text-[11px] text-white/60 md:text-sm">

          Paso {pasoActual} de {totalPasos}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setShowModal(false)}
        className="shrink-0 rounded-lg p-2 text-white/70 hover:bg-white/10"
        aria-label="Cerrar"
      >
        ✕
      </button>
    </div>

    {/* Barra de progreso */}
    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden md:h-1">


      <div
        className="h-full bg-blue-500 transition-all"
        style={{ width: `${progreso}%` }}
      />
    </div>

    {/* Cliente activo */}
    {producto?.cliente_id && clienteActivo && (
      <ClienteContextHeader
        cliente={clienteActivo}
        compact
        onChangeCliente={onCambiarCliente}
      />
    )}
  </div>
</div>


        {/* HEADER */}
        <div
          className="
            flex items-center justify-between px-4 py-3 
            border-b border-gray-200 dark:border-white/10
            bg-gray-50 dark:bg-transparent
            text-gray-800 dark:text-white
          "
        >
       


<div className="relative">
{showClienteModal && (
  <ClienteSelectorModal
    clientes={clientes}
    clienteActivoId={producto?.cliente_id ?? null}
    onSelectCliente={(cliente) => {
      const tabIndex = tabsOrden.indexOf(activeTab);
      if (tabIndex > 0) {
  // ⚠️ Hay datos capturados → pedir confirmación
  setClientePendiente(cliente.id);
  setShowConfirmChangeCliente(true);
  return;
}

  // 🔑 1) Cambiar cliente global
  setClienteId(cliente.id);

  // 🔑 2) Persistir sticky
  persistSticky({ cliente_id: cliente.id });

  // 🔑 3) Cerrar modal
  setShowClienteModal(false);
}}
    onClose={() => setShowClienteModal(false)}
  />
)}
</div>


        </div>
        {showConfirmChangeCliente && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-900 p-6 space-y-4">
      <h3 className="text-lg font-semibold">
        Cambiar cliente activo
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        Si cambias de cliente, los datos capturados hasta ahora
        se asociarán al nuevo cliente.
        <br />
        ¿Deseas continuar?
      </p>

      <div className="flex justify-end gap-3 pt-2">
        <button
          className="btn-secondary"
          onClick={() => {
            setShowConfirmChangeCliente(false);
            setClientePendiente(null);
          }}
        >
          Cancelar
        </button>

        <button
          className="btn-primary"
          onClick={() => {
            if (clientePendiente) {
              setClienteId(clientePendiente);
              persistSticky({ cliente_id: clientePendiente });
            }
            setShowConfirmChangeCliente(false);
            setClientePendiente(null);
            setShowClienteModal(false);
          }}
        >
          Cambiar cliente
        </button>
      </div>
    </div>
  </div>
)}

        {/* CONTENIDO SCROLLABLE */}
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24 text-gray-800 dark:text-white">

          {/* TABS SUPERIORES ACTUALIZADOS */}
          <WizardTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabsContainerRef={tabsContainerRef}
          />

          {/* CONTENIDO - SIN CAMBIOS */}
          <div
            key={activeTab}
            className={`mt-3 space-y-4 transform transition-all duration-300 ${
              transitionDirection === "left"
                ? "animate-slide-left"
                : "animate-slide-right"
            }`}
          >
            {activeTab === "pantalla1" && (
              <Pantalla1Proyecto
                producto={producto}
                handleChange={handleChange}
                persistSticky={persistSticky}
                submitAttempted={submitAttempted}
              />
            )}
            {activeTab === "pantalla2" && (
              <Pantalla2DatosActivo
                producto={producto}
                submitAttempted={submitAttempted}
                handleChange={handleChange}
                persistSticky={persistSticky}
              />
            )}
            {activeTab === "pantalla3" && (
              <Pantalla3Dimensiones producto={producto} handleChange={handleChange} />
            )}
            {activeTab === "componentes" && (
              <Pantalla4Componentes producto={producto} handleChange={handleChange} />
            )}
            {activeTab === "vehiculos" && (
              <Pantalla5Vehiculos producto={producto} handleChange={handleChange} />
            )}
            {activeTab === "asignacion" && (
              <Pantalla6Asignacion producto={producto} handleChange={handleChange} />
            )}
            {activeTab === "imagenes" && (
              <Pantalla7Imagenes
                imagenes={imagenes}
                imagenesTemporales={imagenesTemporales}
                handleUpload={handleUpload}
                handleCancelarImagenesTemporales={handleCancelarImagenesTemporales}
                handleDeleteImagen={handleDeleteImagen}
              />
            )}
            {activeTab === "id_avanzada" && (
              <Pantalla8IdentAvanzada
                producto={producto}
                handleChange={handleChange}
                tipoDetectado={tipoDetectado}
                videoRef={videoRef}
                devices={devices}
                selectedDeviceId={selectedDeviceId}
                setSelectedDeviceId={setSelectedDeviceId}
                scanning={scanning}
                start={start}
                stop={stop}
                detected={detected}
                barcodeToPNG={barcodeToPNG}
              />
            )}

             {activeTab === "auditoria" && (
              <Pantalla9Auditoria producto={producto} handleChange={handleChange} />
            )}

            {activeTab === "resumen" && (
              <Pantalla9Resumen
                producto={producto}
                proyecto={proyecto}
                clienteNombre={clienteNombre}
              />
            )}
          </div>
        </div>

        {/* NAVEGACIÓN INFERIOR — MODO CLARO + OSCURO */}
        <div
          className="
            px-4 pb-4 
            border-t border-gray-200 dark:border-white/10
            bg-gray-50 dark:bg-transparent
          "
        >
          <WizardNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabsOrden={tabsOrden}
            setTransitionDirection={setTransitionDirection}
            handleSave={handleSave}
            producto={producto}
            submitAttempted={submitAttempted}
            setSubmitAttempted={setSubmitAttempted}
          />
        </div>
      </div>
      
    </div>
  );
}



/* Progreso */
/*function ProgressBar({ activeTab, tabsOrden }: any) {
  const current = tabsOrden.indexOf(activeTab) + 1;
  const total = tabsOrden.length;
  const percent = Math.round((current / total) * 100);


  return (
    <div className="mb-3">
      <div className="flex justify-between items-center text-xs text-gray-300 mb-1">
        <span>
          Paso {current} de {total}
        </span>
        <span className="text-blue-400 font-semibold">{percent}%</span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-sky-500 to-green-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
  */

/* Selector cliente */



/* Tabs superiores */
function WizardTabs({ activeTab, setActiveTab, tabsContainerRef }: any) {
  const tabs = [
    { id: "pantalla1", label: "🏷️ Proyecto / Ubicación" },
    { id: "pantalla2", label: "🧾 Datos del activo" },
    { id: "pantalla3", label: "📐 País / Dimensiones" },
    { id: "componentes", label: "🪑 Mobiliario" },
    { id: "vehiculos", label: "🚗 Vehículos" },
    { id: "asignacion", label: "👤 Asignación" },
    { id: "imagenes", label: "🖼️ Imágenes" },
    { id: "id_avanzada", label: "🔍 Ident. avanzada" },
    { id: "auditoria", label: "🔍 Auditoría" },
    { id: "resumen", label: "✅ Resumen" },
  ];

    return (
    <div className="relative mb-3">
      <div
        ref={tabsContainerRef}
        className="flex overflow-x-auto scrollbar-hide space-x-2 pb-1 -mx-4 px-4"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 rounded-full whitespace-nowrap text-xs sm:text-sm font-semibold transition-colors
              ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}


function WizardNavigation({
  activeTab,
  setActiveTab,
  tabsOrden,
  setTransitionDirection,
  handleSave,
  producto,
  submitAttempted,
  setSubmitAttempted,
}: any) {
  const current = tabsOrden.indexOf(activeTab);

  if (!producto) return null;

  const REQUIRED_BY_TAB: Record<string, string[]> = {
    pantalla1: ["ubicacion", "piso", "area_sector", "tipo", "tag"],
    pantalla2: ["descripcion_corta"],
  };

  const requiredFields = REQUIRED_BY_TAB[activeTab] || [];
  const faltan = requiredFields.filter((campo) => !producto[campo]);
  const disableNext = faltan.length > 0;
  const tooltip = disableNext && submitAttempted ? "Faltan: " + faltan.join(", ") : "";

  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-3">

      {/* ANTERIOR */}
      {current > 0 ? (
        <button
          onClick={() => {
            setTransitionDirection("right");
            setActiveTab(tabsOrden[current - 1]);
          }}
          className="
            w-full sm:w-auto px-4 py-3 rounded-xl font-semibold
            bg-gray-200 text-gray-800 hover:bg-gray-300
            dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/20
          "
        >
          ← Anterior
        </button>
      ) : (
        <div />
      )}

      {/* SIGUIENTE o GUARDAR */}
      {activeTab !== "resumen" ? (
        <div className="w-full sm:w-auto" title={tooltip}>
          <button
            disabled={disableNext}
            onClick={() => {
              setSubmitAttempted(true);
              if (!disableNext) {
                setTransitionDirection("left");
                setActiveTab(tabsOrden[current + 1]);
              }
            }}
            className={`
              w-full px-4 py-3 rounded-xl font-semibold transition-all
              ${
                disableNext
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow"
              }
            `}
          >
            Siguiente →
          </button>
        </div>
      ) : (
        <button 
          onClick={() => {
            setSubmitAttempted(true);
            handleSave();
          }}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 px-4 py-3 rounded-xl text-white font-semibold shadow"
        >
          Guardar
        </button>
      )}
    </div>
  );
}


