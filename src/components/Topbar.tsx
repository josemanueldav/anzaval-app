//import type { ReactNode } from "react";
import { useTheme } from "@/hooks/useTheme";
//import { DemoUserSwitcher } from "@/components/demo/DemoUserSwitcher";
import { LogOut } from "lucide-react";
import { logout } from "@/login/Logout"; // si lo pusiste como util
import InstallPWAButton from "@/components/InstallPWAButton";
import { Sun, Moon } from "lucide-react";
//import UserIndicator from "@components/UserIndicator";
//import UserMenu from "@components/UserMenu";
import { useAuth } from "@/context/AuthContext";
//import { ROLE_LABELS } from "@/lib/roleLabels";
//import { useAuthPermissions } from "@/hooks/useAuthPermissions";
//import { hasPermission } from "@/utils/permissions";



interface TopbarProps {
  onToggleSidebar: () => void;
  onToggleMobileMenu: () => void;
}

export default function Topbar({
  onToggleSidebar,
  onToggleMobileMenu,
}: TopbarProps) {
  const { theme, toggleTheme } = useTheme();
  
 const { user, loading } = useAuth();

if (loading || !user) return null;

const displayName =
  user.nombre && user.nombre.trim().length > 0
    ? user.nombre
    : user.email.split("@")[0];

const initials = displayName
  .replace(/[^a-zA-Z0-9]/g, " ")
  .split(" ")
  .filter(Boolean)
  .slice(0, 2)
  .map(w => w[0])
  .join("")
  .toUpperCase();

//const { permisos, loading: loadingPermisos } = useAuthPermissions();

//if (loadingPermisos) return null;

  return (
    
    <header
      className="
        w-full
        bg-white dark:bg-slate-800
        text-gray-900 dark:text-white
        border-b border-gray-200 dark:border-white/10
      "
    >
      <div className="flex items-center justify-between px-4 py-3">

        {/* ===== IZQUIERDA ===== */}
        <div className="flex items-center gap-3">

          {/* Hamburger móvil */}
          <button
            onClick={onToggleMobileMenu}
            className="text-2xl lg:hidden hover:text-blue-500 transition"
            aria-label="Abrir menú"
          >
            ☰
          </button>

          {/* Hamburger desktop */}
          <button
            onClick={onToggleSidebar}
            className="hidden lg:block text-2xl hover:text-blue-500 transition"
            aria-label="Contraer sidebar"
          >
            ☰
          </button>

          {/* Logo / Nombre */}
          <span className="text-lg font-semibold tracking-wide">
            Anzaval
          </span>
        </div>

        {/* ===== DERECHA ===== */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Theme toggle */}
          <button
      onClick={toggleTheme}
      className="
        rounded-md p-2
        hover:bg-white/10
        transition
      "
      title="Cambiar tema"
    >
      {theme === "dark" ? (
        <Sun size={20} className="text-yellow-400" />
      ) : (
        <Moon size={20} className="text-blue-800" />
      )}
    </button>

          {/* Usuario demo */}
          <div className="flex items-center gap-2">
  {/* Avatar */}
  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
    {initials}
  </div>

  {/* Nombre + rol */}
  <div className="hidden sm:flex flex-col leading-tight">
    <span className="text-sm font-medium text-white">
      {displayName}
    </span>
    <span className="text-xs text-white/60 capitalize">
      {user.rol}
    </span>
  </div>
</div>



 {/* Logout (desktop visible, mobile discreto) */}
          <button
            onClick={logout}
            className="
              hidden sm:flex items-center gap-2
              text-sm text-red-600 dark:text-red-400
              hover:bg-red-100/60 dark:hover:bg-red-900/40
              px-3 py-1.5 rounded-md transition
            "
          >
            <LogOut size={16} />
            <span>Cerrar sesión</span>
          </button>
         

          {/* PWA */}
          <InstallPWAButton />
        </div>
      </div>
    </header>
  );
}

