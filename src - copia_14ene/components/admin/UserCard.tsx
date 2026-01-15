// UserCard.tsx
import { Pencil } from "lucide-react";

export default function UserCard({
  user,
  onEdit,
  filtroTipoProyecto,
}: {
  user: any;
  onEdit: () => void;
  filtroTipoProyecto?: string;
}) {
  const proyectosMax = 3; // cuantos mostrar antes del "+n más"

  const proyectos = user.proyectos || [];

  return (
    <div
      className="
        bg-gray-800/60 dark:bg-gray-800
        rounded-2xl border border-gray-700/40 
        p-5 shadow-sm hover:shadow-md
        transition-all duration-200
      "
    >
      {/* HEADER */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className="
            w-12 h-12 rounded-full 
            bg-blue-500 flex items-center justify-center 
            text-white font-bold text-lg shadow
          "
        >
          {user.nombre?.substring(0, 2).toUpperCase()}
        </div>

        <div className="flex flex-col">
          <span className="font-semibold text-lg text-gray-100">
            {user.nombre}
          </span>

          {/* email truncado */}
          <span className="text-gray-400 text-sm max-w-[170px] truncate">
            {user.email}
          </span>
        </div>
      </div>

      {/* ROLES */}
      <div className="flex flex-wrap gap-2 mt-4">
        {user.roles?.map((rol: string) => (
          <span
            key={rol}
            className="
              px-3 py-1 rounded-full text-xs font-medium 
              bg-blue-700/50 text-blue-200
            "
          >
            {rol}
          </span>
        ))}
      </div>

      {/* PROYECTOS */}
      {proyectos.length > 0 && (
        <div className="flex flex-col gap-2 mt-4">
          {proyectos.slice(0, proyectosMax).map((p: any) => {
            const highlight = filtroTipoProyecto === p.tipo;

            return (
              <span
                key={p.id}
                className={`
                  px-3 py-1 text-xs rounded-full font-medium truncate
                  w-fit max-w-[200px]
                  border transition-all
                  ${
                    p.tipo === "activo"
                      ? "bg-green-900/40 text-green-300 border-green-700/40"
                      : p.tipo === "revision"
                      ? "bg-yellow-900/40 text-yellow-300 border-yellow-700/40"
                      : p.tipo === "terminado"
                      ? "bg-blue-900/40 text-blue-300 border-blue-700/40"
                      : "bg-gray-700/40 text-gray-300 border-gray-600/40"
                  }
                  ${
                    highlight
                      ? "ring-2 ring-yellow-400 shadow-lg"
                      : ""
                  }
                `}
              >
                {p.nombre}
              </span>
            );
          })}

          {/* +n más */}
          {proyectos.length > proyectosMax && (
            <span className="text-xs text-gray-400 ml-1">
              + {proyectos.length - proyectosMax} más
            </span>
          )}
        </div>
      )}

      {/* BOTÓN EDITAR */}
      <button
        onClick={onEdit}
        className="
          mt-5 w-full px-4 py-2 rounded-lg 
          bg-gray-700/50 hover:bg-gray-700
          text-gray-200 flex items-center justify-center gap-2
          transition-all
        "
      >
        <Pencil size={16} /> Editar
      </button>
    </div>
  );
}
