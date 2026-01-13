import { Navigate } from "react-router-dom";
import { normalizePermissions, hasPermission } from "@/utils/permissions";
import { useAuthStore } from "@/store/authStore";

export default function HomeRedirect() {
  const { user, permisos } = useAuthStore();

  // Si no hay usuario → login
  if (!user) return <Navigate to="/login" replace />;

  const permisosNorm = normalizePermissions(permisos || []);

  // Admin o dashboard
  if (hasPermission(permisosNorm, "ver_dashboard")) {
    return <Navigate to="/dashboard" replace />;
  }

  // Capturista
  if (
    hasPermission(permisosNorm, "capturar_activos") ||
    hasPermission(permisosNorm, "editar_activos")
  ) {
    return <Navigate to="/productos" replace />;
  }

  // Usuario sin permisos especiales
  return <Navigate to="/productos" replace />;
}
