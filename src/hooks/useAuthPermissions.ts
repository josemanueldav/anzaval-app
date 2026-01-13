// src/hooks/useAuthPermissions.ts
import { useAuthStore } from "@/store/authStore";
import { normalizePermissions } from "@/utils/permissions";
import type { Perfil } from "@/store/authStore"; // si ahí definiste el tipo

export function useAuthPermissions() {
 const { permisos, user, perfil, loading } = useAuthStore() as {
    user: any; 
    permisos: any[];
    perfil: Perfil | null;
    loading: boolean;
  };

  const permisosNorm = normalizePermissions(permisos || []);

  return {
    user,
    permisos: permisosNorm,
    perfil,
    loading
  };
}
