// types/permissions.ts
export interface UserPermissionContext {
  userId: string | null;
  email: string | null;
  roles: string[];          // ['admin', 'capturista', etc.]
  permisos: string[];       // ['ver_dashboard', 'generar_reportes', ...]
  clientesPermitidos: string[]; // lista de cliente_id (uuid)
  loading: boolean;
}
