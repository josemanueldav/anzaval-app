import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { normalizePermissions, hasPermission } from "@/utils/permissions";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export default function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { user, perfil,permisos, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        Verificando acceso…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission) {
    const permisosNorm = normalizePermissions(permisos || []);

    if (!hasPermission(permisosNorm, requiredPermission)) {
      return <Navigate to="/no-autorizado" replace />;
    }
  }

  if (perfil?.passwordTemporal && location.pathname !== "/reset-password") {
  return <Navigate to="/reset-password" replace />;
}


  return <>{children}</>;
}
