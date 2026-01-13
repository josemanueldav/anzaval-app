// ------------------------------
// BASE TYPES FROM YOUR DATABASE
// ------------------------------

export interface Rol {
  id: string;
  nombre: string;
  descripcion?: string | null;
}

export interface Permiso {
  id: string;
  clave: string;
  descripcion?: string | null;
}

export interface ClienteProyecto {
  id: string;
  nombre: string;
}

// Tabla usuarios_roles_nuevo
export interface UsuarioRol {
  usuario_id: string;
  rol_id: string;
  roles?: {
    nombre: string;
  };
}

// Tabla usuarios_proyectos
export interface UsuarioProyecto {
  usuario_id: string;
  cliente_id: string;
  activo: boolean;
}

// Usuario de auth
export interface AuthUser {
  id: string;
  email: string | null;
  role?: string; // no lo usaremos pero viene de Supabase
}

// Usuario enriquecido con información completa
export interface UsuarioCompleto {
  id: string;
  email: string | null;
  roles: {
    id: string;
    nombre: string;
  }[];
  clientes: string[];
}

// Para el hook de permisos
export interface UserPermissionContext {
  userId: string | null;
  email: string | null;
  roles: string[];
  permisos: string[];
  clientesPermitidos: string[];
  loading: boolean;
}
