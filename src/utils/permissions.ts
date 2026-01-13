// utils/permissions.ts

/**
 * Tipo flexible para representar lo que puede venir desde Supabase
 * en la parte de permisos (con o sin relaciones).
 */
export type PermisoRaw =
  | string
  | {
      clave?: string;
      permiso?: { clave?: string } | { clave?: string }[];
      permisos?: { clave?: string }[];
    }
  | {
      permiso?: { clave?: string } | { clave?: string }[];
    }
  | {
      permisos?: { clave?: string }[];
    }
  | any;

/**
 * Normaliza cualquier estructura de permisos en un array de strings:
 * ["ver_dashboard", "capturar_activos", ...]
 *
 * Soporta formatos como:
 * - "ver_dashboard"
 * - { clave: "ver_dashboard" }
 * - { permiso: { clave: "ver_dashboard" } }
 * - { permiso: [ { clave: "ver_dashboard" }, ... ] }
 * - { permisos: [ { clave: "ver_dashboard" }, ... ] }
 */
export function normalizePermissions(raw: any): string[] {
  if (!raw) return [];

  const out: string[] = [];

  // Caso simple: string único ("gestionar_clientes")
  if (typeof raw === "string") {
    return [raw.trim()];
  }

  // Caso array: procesar cada elemento
  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (!item) continue;

      if (typeof item === "string") {
        out.push(item.trim());
        continue;
      }

      if (item.clave) {
        out.push(String(item.clave).trim());
      }

      if (item.permiso?.clave) {
        out.push(String(item.permiso.clave).trim());
      }

      if (Array.isArray(item.permiso)) {
        item.permiso.forEach((p: any) => {
  if (p?.clave) out.push(String(p.clave).trim());
});

      }

      if (Array.isArray(item.permisos)) {
        item.permiso.forEach((p: any) => {
  if (p?.clave) out.push(String(p.clave).trim());
});

      }
    }

    return Array.from(new Set(out));
  }

  // Caso objeto: { clave }, { permiso: { clave } }, { permiso: [ ... ] }
  if (typeof raw === "object") {
    if (raw.clave) return [String(raw.clave).trim()];

    if (raw.permiso?.clave) {
      return [String(raw.permiso.clave).trim()];
    }

    if (Array.isArray(raw.permiso)) {
      return raw.permiso
        .filter((p: any) => p?.clave)
        .map((p: any) => p.clave.trim());
    }

    if (Array.isArray(raw.permisos)) {
      return raw.permisos
        .filter((p: any) => p?.clave)
        .map((p: any) => p.clave.trim());
    }
  }

  return [];
}


/**
 * Verifica si en una lista (en bruto o ya normalizada) existe un permiso.
 */
export function hasPermission(permisosInput: PermisoRaw[] | null | undefined, required: string): boolean {
  const permisos = normalizePermissions(permisosInput);
  return permisos.includes(required);
}
