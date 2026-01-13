// components/Layout/MainMenu.tsx
import { Link } from "react-router-dom";
import { useAuthPermissions } from "@/hooks/useAuthPermissions";
import { hasPermission } from "@/utils/permissions";

export function MainMenu() {
  const { permisos } = useAuthPermissions();

  const items = [
    { label: "Productos", to: "/productos" }, // todos
    hasPermission(permisos, "ver_dashboard") && {
      label: "Dashboard",
      to: "/dashboard",
    },
    hasPermission(permisos, "gestionar_clientes") && {
      label: "Clientes",
      to: "/clientes",
    },
    hasPermission(permisos, "gestionar_usuarios") && {
      label: "Usuarios",
      to: "/usuarios",
    },
    hasPermission(permisos, "generar_reportes") && {
      label: "Reportes",
      to: "/reportes",
    },
    hasPermission(permisos, "gestionar_usuarios") && {
      label: "Asignar proyectos",
      to: "/admin/asignaciones",
    },
  ].filter(Boolean) as { label: string; to: string }[];

  return (
    <nav className="flex gap-4">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="text-sm text-slate-200 hover:text-white"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
