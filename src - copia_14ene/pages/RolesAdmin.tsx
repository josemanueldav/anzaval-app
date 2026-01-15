// src/pages/RolesAdmin.tsx

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RolesAdmin() {
  const [roles, setRoles] = useState<any[]>([]);
  const [permisos, setPermisos] = useState<any[]>([]);
  const [mostrarEditor, setMostrarEditor] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState<any>(null);
  const [nombreRol, setNombreRol] = useState("");
  const [descripcionRol, setDescripcionRol] = useState("");
  const [permisosAsignados, setPermisosAsignados] = useState<string[]>([]);

  useEffect(() => {
    cargarRoles();
    cargarPermisos();
  }, []);

  async function cargarRoles() {
    const { data } = await supabase.from("roles").select("*").order("nombre");
    setRoles(data || []);
  }

  async function cargarPermisos() {
    const { data } = await supabase.from("permisos").select("*").order("clave");
    setPermisos(data || []);
  }

  function abrirEditor(rol: any) {
    if (rol) {
      setRolSeleccionado(rol);
      setNombreRol(rol.nombre);
      setDescripcionRol(rol.descripcion);

      cargarPermisosDeRol(rol.id);
    } else {
      setRolSeleccionado(null);
      setNombreRol("");
      setDescripcionRol("");
      setPermisosAsignados([]);
    }
    setMostrarEditor(true);
  }

  async function cargarPermisosDeRol(rol_id: string) {
    const { data } = await supabase
      .from("roles_permisos")
      .select("permiso_id")
      .eq("rol_id", rol_id);

    setPermisosAsignados((data || []).map((p) => p.permiso_id));
  }

  function togglePermiso(id: string) {
    setPermisosAsignados((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  async function guardarRol() {
    if (rolSeleccionado) {
      // Update rol
      await supabase
        .from("roles")
        .update({ nombre: nombreRol, descripcion: descripcionRol })
        .eq("id", rolSeleccionado.id);

      // Reset permisos
      await supabase.from("roles_permisos").delete().eq("rol_id", rolSeleccionado.id);

      // Insert permisos nuevos
      if (permisosAsignados.length > 0) {
        const rows = permisosAsignados.map((pid) => ({
          rol_id: rolSeleccionado.id,
          permiso_id: pid,
        }));
        await supabase.from("roles_permisos").insert(rows);
      }
    } else {
      // Crear rol nuevo
      const { data, error } = await supabase
        .from("roles")
        .insert([{ nombre: nombreRol, descripcion: descripcionRol }])
        .select("id")
        .single();

      if (!error) {
        const rol_id = data.id;

        if (permisosAsignados.length > 0) {
          const rows = permisosAsignados.map((pid) => ({
            rol_id,
            permiso_id: pid,
          }));
          await supabase.from("roles_permisos").insert(rows);
        }
      }
    }

    setMostrarEditor(false);
    cargarRoles();
  }

  return (
    <div className="text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Administración de Roles</h1>

      <button
        onClick={() => abrirEditor(null)}
        className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
      >
        + Crear nuevo rol
      </button>

      <div className="space-y-2">
        {roles.map((rol) => (
          <div
            key={rol.id}
            className="p-3 bg-slate-800 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{rol.nombre}</p>
              <p className="text-sm text-slate-400">
                {rol.descripcion || "Sin descripción"}
              </p>
            </div>

            <button
              onClick={() => abrirEditor(rol)}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded"
            >
              Editar
            </button>
          </div>
        ))}
      </div>

      {/* Modal / Editor */}
      {mostrarEditor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-slate-900 p-6 rounded-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {rolSeleccionado ? "Editar rol" : "Crear rol"}
            </h2>

            <label className="block mb-2 text-sm">Nombre del rol</label>
            <input
              className="w-full p-2 rounded bg-slate-800 border border-slate-600 mb-3"
              value={nombreRol}
              onChange={(e) => setNombreRol(e.target.value)}
            />

            <label className="block mb-2 text-sm">Descripción</label>
            <textarea
              className="w-full p-2 rounded bg-slate-800 border border-slate-600 mb-3"
              value={descripcionRol}
              onChange={(e) => setDescripcionRol(e.target.value)}
            />

            <p className="text-sm mb-2">Permisos del rol</p>
            <div className="max-h-48 overflow-y-auto border border-slate-700 rounded p-2 mb-4">
              {permisos.map((p) => (
                <label
                  key={p.id}
                  className="flex items-center gap-2 mb-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={permisosAsignados.includes(p.id)}
                    onChange={() => togglePermiso(p.id)}
                  />
                  {p.clave}
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setMostrarEditor(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded"
              >
                Cancelar
              </button>

              <button
                onClick={guardarRol}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
