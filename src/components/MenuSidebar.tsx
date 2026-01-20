import { NavLink } from "react-router-dom";
import { useAuthPermissions } from "@/hooks/useAuthPermissions";
import { hasPermission } from "@/utils/permissions";
import { menuItems } from "@/config/menu";
import { logout } from "@/login/Logout";

export default function MenuSidebar({
  collapsed,
  mobileOpen,
  closeMobile,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  closeMobile: () => void;
}) {
  const { permisos } = useAuthPermissions();

  return (
    <>
      {/* Fondo oscuro para móvil */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-40
          h-full bg-slate-900 text-white shadow-xl
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-16" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0
        `}
      >
        <nav className="pt-6 space-y-3">
          {menuItems.map((item) => {
            if (item.permiso && !hasPermission(permisos, item.permiso)) {
  return null;
}


            if (item.children) {
              return (
                <div key={item.label} className="px-3">
                  <p className="font-semibold flex items-center gap-2 mb-1">
                    <span>{item.icon}</span>
                    {!collapsed && item.label}
                  </p>

                  <div className="ml-6 space-y-1">
                    {item.children.map((sub) => (
                      <NavLink
                        key={sub.path}
                        to={sub.path}
                        onClick={closeMobile}
                        className={({ isActive }) =>
                          `block px-2 py-1 rounded ${
                            isActive ? "bg-slate-700" : "hover:bg-slate-800"
                          }`
                        }
                      >
                        {!collapsed && sub.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded ${
                    isActive ? "bg-slate-700" : "hover:bg-slate-800"
                  }`
                }
              >
                <span>{item.icon}</span>
                {!collapsed && item.label}
              </NavLink>
            );
          })}

          <button
  onClick={logout}
  className="
    w-full text-left px-4 py-3
    text-red-500
    hover:bg-white/10
  "
>
  Cerrar sesión
</button>

        </nav>
      </aside>
    </>
  );
}
