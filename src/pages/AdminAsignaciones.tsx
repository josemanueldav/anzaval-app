// pages/AdminAsignaciones.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Usuario {
  id: string;
  email: string;
}

interface Cliente {
  id: string;
  nombre: string;
}

export default function AdminAsignaciones() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string>("");
  const [clientesUsuario, setClientesUsuario] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar usuarios (de auth.users o de tu tabla perfiles/usuarios_roles)
  useEffect(() => {
    const fetchData = async () => {
      const { data: users } = await supabase
        .from("usuarios")
        .select("id, nombre"); // o auth.users: id, email

      const usuariosMap = (users || []).map((u: any) => ({
        id: u.id,
        email: u.nombre ?? u.id,
      }));

      setUsuarios(usuariosMap);

      const { data: cli } = await supabase
        .from("clientes")
        .select("id, nombre")
        .order("nombre", { ascending: true });

      setClientes(cli || []);
    };

    fetchData();
  }, []);

  // Cargar clientes asignados cuando cambia el usuario
  useEffect(() => {
    const fetchAsignaciones = async () => {
      if (!usuarioSeleccionado) {
        setClientesUsuario([]);
        return;
      }
      const { data } = await supabase
        .from("usuarios_proyectos")
        .select("cliente_id")
        .eq("usuario_id", usuarioSeleccionado)
        .eq("activo", true);

      setClientesUsuario((data || []).map((r: any) => r.cliente_id));
    };
    fetchAsignaciones();
  }, [usuarioSeleccionado]);

  const toggleCliente = (clienteId: string) => {
    setClientesUsuario((prev) =>
      prev.includes(clienteId)
        ? prev.filter((id) => id !== clienteId)
        : [...prev, clienteId]
    );
  };

  const handleGuardar = async () => {
  if (!usuarioSeleccionado) return;
  setLoading(true);

  // 1) Desactivar todos
  const { error: errDisable } = await supabase
    .from("usuarios_proyectos")
    .update({ activo: false })
    .eq("usuario_id", usuarioSeleccionado);

  if (errDisable) {
    console.error(errDisable);
    alert("Error al desactivar asignaciones");
    setLoading(false);
    return;
  }

  // 2) Upsert de los seleccionados
  const rows = clientesUsuario.map((clienteId) => ({
    usuario_id: usuarioSeleccionado,
    cliente_id: clienteId,
    activo: true,
  }));

  if (rows.length > 0) {
    const { error: errUpsert } = await supabase
      .from("usuarios_proyectos")
      .upsert(rows, {
        onConflict: "usuario_id,cliente_id",
      });

    if (errUpsert) {
      console.error(errUpsert);
      alert("Error al guardar asignaciones");
      setLoading(false);
      return;
    }
  }

  setLoading(false);
  alert("Asignaciones guardadas correctamente");
};


  


  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Asignar proyectos a usuarios</h1>

      <div className="mb-4">
        <label className="block text-sm mb-1">Usuario</label>
        <select
          value={usuarioSeleccionado}
          onChange={(e) => setUsuarioSeleccionado(e.target.value)}
          className="bg-slate-800 border border-slate-600 rounded px-2 py-1 w-full max-w-md"
        >
          <option value="">-- Selecciona un usuario --</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>
              {u.email}
            </option>
          ))}
        </select>
      </div>

      {usuarioSeleccionado && (
        <>
          <h2 className="text-lg font-semibold mb-2">
            Proyectos asignados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            {clientes.map((c) => (
              <label
                key={c.id}
                className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={clientesUsuario.includes(c.id)}
                  onChange={() => toggleCliente(c.id)}
                />
                <span>{c.nombre}</span>
              </label>
            ))}
          </div>

          <button
            onClick={handleGuardar}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar asignaciones"}
          </button>
        </>
      )}
    </div>
  );
}
