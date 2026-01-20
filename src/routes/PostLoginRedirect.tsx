import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { hasPermission } from "@/utils/permissions";

const PostLoginRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { user, perfil, permisos, loading } = useAuthStore();

  // Side-effect: redirección inmediata si no hay perfil
  useEffect(() => {
    if (!loading && !perfil) {
      navigate("/login", { replace: true });
    }
  }, [loading, perfil, navigate]);

  // ⏳ Cargando sesión
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-500">
        Cargando sesión...
      </div>
    );
  }

  // 🔐 Forzar cambio de contraseña
  if (perfil?.passwordTemporal) {
    return <Navigate to="/reset-password" replace />;
  }

  // 🚫 Sin usuario
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Permisos
  if (hasPermission(permisos, "ver_dashboard")) {
    return <Navigate to="/dashboard" replace />;
  }

  if (hasPermission(permisos, "capturar_activos")) {
    return <Navigate to="/productos" replace />;
  }

  // ❌ No autorizado
  return <Navigate to="/no-autorizado" replace />;
};

export default PostLoginRedirect;
