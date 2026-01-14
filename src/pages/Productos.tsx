import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import ProductListTable from "@/components/product/ProductListTable";  // integración
import { useAuthPermissions } from "@/hooks/useAuthPermissions";
import { useCliente } from "@/context/ClienteContext";
//import { ClienteProvider } from "@/context/ClienteContext";

export default function Productos() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { clienteId, setClienteId } = useCliente();
  const [clientes, setClientes] = useState<any[]>([]);
  const { perfil } = useAuthPermissions();
  

  useEffect(() => {
    loadClientes();
  }, []);
useEffect(() => {
    loadProductos();
  }, [clienteId]);

  const loadClientes = async () => {
  const { data, error } = await supabase
    .from("clientes")
    .select("id, nombre")
    .order("nombre", { ascending: true });

  if (error || !data) {
    setClientes([]);
    return;
  }

  // Si es admin → ver todos
  if (perfil?.rol === "admin") {
    setClientes(data);
    return;
  }

  // Usuarios normales → filtrar clientes asignados
  const asignados = perfil?.clientes?.map(c => c.cliente_id) ?? [];

  const filtrados = data.filter(c => asignados.includes(c.id));

  setClientes(filtrados);
};

  const loadProductos = async () => {
    setLoading(true);

    let query = supabase
      .from("productos")
      .select("*")
      .order("created_at", { ascending: false });

  // Si eligió cliente manualmente → respetar filtro
  if (clienteId) {
    query = query.eq("cliente_id", clienteId);
  } else {
    // Si NO eligió cliente:
    if (perfil?.rol !== "admin") {
      const asignados = perfil?.clientes?.map(c => c.cliente_id) ?? [];

      if (asignados.length === 0) {
        setProductos([]);
        setLoading(false);
        return;
      }

      query = query.in("cliente_id", asignados);
    }
  }


    const { data: rows, error } = await query;

    if (!rows || error) {
      setProductos([]);
      setLoading(false);
      return;
    }

    const { data: imgs } = await supabase
      .from("productos_imagenes")
      .select("id, producto_id");

    const countMap: Record<string, number> = {};
    imgs?.forEach((i) => {
      countMap[i.producto_id] = (countMap[i.producto_id] ?? 0) + 1;
    });

    const enriched = rows.map((p) => ({
      ...p,
      imagenes: countMap[p.id] ?? 0,
    }));

    setProductos(enriched);
    setLoading(false);
  };

  const filtered = productos.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (p.descripcion_corta || "").toLowerCase().includes(q) ||
      (p.tipo || "").toLowerCase().includes(q) ||
      (p.marca || "").toLowerCase().includes(q) ||
      (p.modelo || "").toLowerCase().includes(q) ||
      (p.tag || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-6 text-white space-y-6 min-h-screen">

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Proyectos</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
  value={clienteId ?? ""}
   onChange={(e) => setClienteId(e.target.value || null)}
  className="
    px-4 py-2 rounded-lg
    border border-gray-300 dark:border-white/20
    bg-white dark:bg-white/10
    text-gray-800 dark:text-white
    focus:outline-none focus:ring-2 focus:ring-blue-500/50
  "
>


  <option value="">Todos los clientes</option>

  {clientes.map(cli => (
    <option key={cli.id} value={cli.id}>
      {cli.nombre}
    </option>
  ))}
</select>


          <input
  placeholder="Buscar producto..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="
    px-4 py-2 rounded-lg w-full sm:max-w-xs
    border border-gray-300 dark:border-white/20
    bg-white dark:bg-white/10
    text-gray-800 dark:text-white
    placeholder-gray-500 dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-500/50
  "
/>


          <button
  onClick={() => navigate("/productos/nuevo")}
  className="
    px-4 py-2 rounded-lg font-semibold shadow 
    w-full sm:w-auto
    bg-blue-600 hover:bg-blue-700 
    text-white
    focus:outline-none focus:ring-2 focus:ring-blue-500/40
  "
>
  + Nuevo
</button>

        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando productos...</p>
      ) : (
        <ProductListTable products={filtered} />
      )}
    </div>
  );
}
