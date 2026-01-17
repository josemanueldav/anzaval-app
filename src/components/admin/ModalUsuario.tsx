import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";

interface ModalUsuarioProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete?: () => void;
  usuario?: any; // si existe, es edición
  rolesDisponibles: string[];
  proyectos: any[];
}

export default function ModalUsuario({
  open,
  onClose,
  onSave,
  onDelete,
  usuario,
  rolesDisponibles,
  proyectos,
}: ModalUsuarioProps) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [proyectosAsignados, setProyectosAsignados] = useState<string[]>([]);


  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre || "");
      setEmail(usuario.email || "");
      setRoles(usuario.roles || []);
      setProyectosAsignados((usuario.proyectos || []).map((p: any) => p.id));

    } else {
      setNombre("");
      setEmail("");
      setRoles([]);
      setProyectosAsignados([]);
    }
  }, [usuario]);

  const toggleRole = (role: string) => {
    setRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  const save = () => {
    if (!email) return alert("El email es obligatorio");
    onSave({ nombre, email, roles, proyectosAsignados });
  };

  
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={usuario ? "Editar Usuario" : "Crear Usuario"}
    >
      <div className="space-y-4">

        {/* NOMBRE */}
        <div>
          <label className="text-sm">Nombre</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-lg border 
            bg-white dark:bg-slate-700 
            border-gray-300 dark:border-slate-600"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-lg border 
            bg-white dark:bg-slate-700 
            border-gray-300 dark:border-slate-600"
          />
        </div>

        {/* ROLES */}
        <div>
          <label className="text-sm">Roles</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {rolesDisponibles.map((rol) => (
              <button
                key={rol}
                onClick={() => toggleRole(rol)}
                className={`
                  px-3 py-1 rounded-full text-sm 
                  border 
                  ${roles.includes(rol)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-slate-700 border-gray-400 dark:border-slate-600"
                  }
                `}
              >
                {rol}
              </button>
            ))}
          </div>
        </div>

        {/* PROYECTOS */}
<div>
  <label className="text-sm font-medium">Proyectos asignados</label>
  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto pr-1">

    {proyectos.map((p) => {
      const checked = proyectosAsignados.includes(p.id);

      return (
        <label
          key={p.id}
          className="flex items-center gap-2 p-2 rounded-lg cursor-pointer 
          hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={() => {
              if (checked) {
                setProyectosAsignados((prev) =>
                  prev.filter((id) => id !== p.id)
                );
              } else {
                setProyectosAsignados((prev) => [...prev, p.id]);
              }
            }}
          />
          <span>{p.nombre}</span>
        </label>
      );
    })}
  </div>
</div>


        {/* BOTONES */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-slate-600 text-gray-800 dark:text-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={save}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Guardar
          </button>
          {usuario && (
  <button
    type="button"
    onClick={onDelete}
    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
  >
    🗑 Eliminar usuario
  </button>
)}
        </div>

      </div>
    </Modal>
  );
}
