import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { hasPermission } from "@/utils/permissions";

export default function PostLoginRedirect() {
  const { user, permisos, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-500">
        Cargando sesión...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (hasPermission(permisos, "ver_dashboard")) {
    return <Navigate to="/dashboard" replace />;
  }

  if (hasPermission(permisos, "capturar_activos")) {
    return <Navigate to="/productos" replace />;
  }

  return <Navigate to="/no-autorizado" replace />;
}
