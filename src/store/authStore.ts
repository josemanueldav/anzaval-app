import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

export interface PerfilCliente {
  cliente_id: string;
}
export interface Perfil {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  clientes: PerfilCliente[];
  //proyectos: string[];
  //proyectos: UsuarioProyecto[];
  //proyectos: { cliente_id: string }[];
  
}

export interface UsuarioProyecto {
  cliente_id: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  proyectos: UsuarioProyecto[];
}

interface AuthState {
  user: any | null;
  perfil: Perfil | null;
  permisos: string[];
  loading: boolean;

  setUser: (user: any) => void;
  setPermisos: (permisos: any[]) => void;
  setPerfil: (perfil: Perfil | null) => void;
  setLoading: (loading: boolean) => void;

  loadUserFromSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  
}
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  permisos: [],
  perfil: null,
  loading: true,

  setUser: (user) => set({ user }),
  setPermisos: (permisos) => set({ permisos }),
  setPerfil: (perfil) => set({ perfil }),
  setLoading: (loading) => set({ loading }),
  
  // Cargar usuario desde supabase.auth
  loadUserFromSession: async () => {

    
    console.log("🔄 Cargando sesión...");

    const { data: { session } } = await supabase.auth.getSession();

    console.log("SESSION:", session);

    // Si no hay sesión → no hay usuario
    if (!session) {
      set({ user: null, perfil: null, permisos: [], loading: false });
      return;
    }

    const userId = session.user.id;

    // 1. Obtener perfil desde perfiles
    /*const { data: perfil } = await supabase
      .from("perfiles")
      .select("id, nombre, rol")
      .eq("id", userId)
      .maybeSingle();

    console.log("PERFIL:", perfil);*/

     //const { data: perfilBase } = await supabase
  //.from("perfiles")
  //.select("id, nombre, rol")
  //.eq("id", userId)
  //.maybeSingle();

    // 1️⃣ Usuario (perfil real)
  //const { data: usuario } = await supabase
  const { data: usuarioBase, error: usuarioError } = await supabase
    .from("usuarios")
    .select("id, nombre, email, rol")
    .eq("id", userId)
    .maybeSingle();

     //if (!usuario) {
    //set({ user: session.user, perfil: null, permisos: [], loading: false });
    //return;
  //}
  if (usuarioError || !usuarioBase) {
  set({
    user: session.user,
    perfil: null,
    permisos: [],
    loading: false,
  });
  return;
}
  

      // 2. Obtener clientes asignados desde usuarios_proyectos
const { data: proyectos } = await supabase
  .from("usuarios_proyectos")
  .select("cliente_id")
  .eq("usuario_id", userId)
  .eq("activo", true);

  const perfil: Perfil = {
  id: usuarioBase.id,
  nombre: usuarioBase.nombre,
  email: usuarioBase.email,
  rol: usuarioBase.rol,
  clientes: proyectos ?? [], // ← [{ cliente_id }]
};

  //const perfil = perfilBase
  //? {
      //...perfilBase,
      //clientes: proyectos ?? [],  // clientes = [{ cliente_id }]
      //proyectos: (proyectos ?? []).map(p => p.cliente_id),
    //}
  //: null;
  
    if (!perfil) {
      // Usuario sin perfil → usuario limitado
      set({
        user: session.user,
        perfil: null,
        permisos: [],
        loading: false,
      });
      return;
    }

    // 2. Obtener permisos desde roles → permisos
    const { data: rolData } = await supabase
      .from("roles")
      .select("permisos ( clave )")
      //.select("id, nombre, descripcion, permisos ( clave )")
      .eq("nombre", usuarioBase.rol)
      .maybeSingle();

    console.log("ROL DATA:", rolData);

    const permisos =
      rolData?.permisos?.map((p: any) => p.clave) ?? [];

    console.log("PERMISOS:", permisos);

    // 3. Guardar en store
    set({
      user: session.user,
      perfil,
      permisos,
      loading: false,
    });
  },

  // Login normal
  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    await (useAuthStore.getState().loadUserFromSession());
  },

  // Logout
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, perfil: null, permisos: [], loading: false });
  },
}));


