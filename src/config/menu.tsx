import { LayoutDashboard, UserCog, Package, ClipboardList } from "lucide-react";

export const menuItems = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    path: "/dashboard",
    permiso: "ver_dashboard",
  },

  {
    label: "Productos",
    icon: <Package size={18} />,
    path: "/productos",
    permiso: null, // cualquier usuario logueado
  },

  {
    label: "Clientes",
    icon: <ClipboardList size={18} />,
    path: "/clientes",
    permiso: "gestionar_clientes",
  },

  {
    label: "Administración",
    icon: <UserCog size={18} />,
    permiso: "gestionar_usuarios",
    children: [
      {
        label: "Panel Admin",
        path: "/admin",
      },
      {
        label: "Usuarios",
        path: "/admin/usuarios",
      },
      {
        label: "Roles",
        path: "/admin/roles",
      },
      {
        label: "Asignaciones",
        path: "/admin/asignaciones",
      },
    ],
  },
];
