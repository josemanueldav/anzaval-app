// src/hooks/useAuthPermissions.ts
import { useAuthStore } from "@/store/authStore";
import { normalizePermissions } from "@/utils/permissions";
import type { Perfil } from "@/store/authStore"; // si ahí definiste el tipo

export function useAuthPermissions() {
 const { permisos, user, perfil, loading } = useAuthStore(); 

 return {
    user,
    perfil: perfil as Perfil | null,
    permisos: normalizePermissions(permisos || []),
    loading
  };
}
