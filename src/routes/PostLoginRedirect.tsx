import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function PostLoginRedirect() {
  const { user, perfil, permisos, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Cargando…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ADMIN
  if (perfil?.rol === "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // CAPTURISTA / OPERATIVO
  if (permisos.includes("capturar_activos")) {
    return <Navigate to="/productos" replace />;
  }

  // Fallback
  return <Navigate to="/no-autorizado" replace />;
}
