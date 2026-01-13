import { useNavigate } from "react-router-dom";
import { useAuthPermissions } from "@/hooks/useAuthPermissions";
import { hasPermission } from "@/utils/permissions";

export default function AdminPanel() {
  const nav = useNavigate();
  const { permisos } = useAuthPermissions();

  const cards = [
    {
      label: "Usuarios",
      description: "Administrar cuentas, roles y proyectos asignados",
      permission: "gestionar_usuarios",
      icon: "👤",
      onClick: () => nav("/admin/usuarios"),
    },
    {
      label: "Roles",
      description: "Crear y editar roles y permisos",
      permission: "gestionar_usuarios",
      icon: "🛡️",
      onClick: () => nav("/admin/roles"),
    },
    {
      label: "Asignación de proyectos",
      description: "Asignar clientes a usuarios",
      permission: "gestionar_usuarios",
      icon: "📁",
      onClick: () => nav("/admin/asignaciones"),
    },
    {
      label: "Clientes",
      description: "Crear y editar proyectos",
      permission: "gestionar_clientes",
      icon: "🏢",
      onClick: () => nav("/clientes"),
    },
    {
      label: "Reportes",
      description: "Ver reportes globales y exportar",
      permission: "generar_reportes",
      icon: "📊",
      onClick: () => nav("/reportes"),
    },
    {
      label: "Dashboard del sistema",
      description: "Resumen administrativo",
      permission: "ver_dashboard",
      icon: "📈",
      onClick: () => nav("/dashboard"),
    },
  ];

  return (
    <div className="p-6 overflow-auto flex-1 bg-white dark:bg-slate-900">

      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards
          .filter((c) => hasPermission(permisos, c.permission))
          .map((card) => (
            <button
              key={card.label}
              onClick={card.onClick}
              className="bg-slate-800 hover:bg-slate-700 text-left p-5 rounded-xl shadow transition"
            >
              <div className="text-4xl mb-3">{card.icon}</div>
              <div className="text-xl font-bold">{card.label}</div>
              <div className="text-sm text-slate-400 mt-1">
                {card.description}
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
