export function UserCard({
  user,
  onEdit,
}: {
  user: any;
  onEdit: () => void;
}) {
  return (
    <div
      className="rounded-xl shadow p-4 flex flex-col gap-2
      bg-white text-gray-800
      dark:bg-slate-800 dark:text-gray-100
      hover:shadow-lg transition-all"
    >
      {/* Nombre */}
      <h2 className="text-lg font-semibold">{user.nombre ?? "Sin nombre"}</h2>

      {/* Email */}
      <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>

      {/* Roles */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Roles:{" "}
        <span className="font-medium">{user.roles?.join(", ") || "N/A"}</span>
      </p>

      {/* Proyectos */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Proyectos asignados:{" "}
        <span className="font-medium">{user.totalProyectos}</span>
      </p>

      <div className="mt-3">
        <button
          onClick={onEdit}
          className="px-3 py-1.5 text-sm rounded-lg bg-slate-700 hover:bg-slate-600 
          text-white dark:bg-slate-600 dark:hover:bg-slate-500"
        >
          Editar
        </button>
      </div>
    </div>
  );
}
