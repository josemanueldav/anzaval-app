import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface UserProfile {
  id: string;
  email: string;
  nombre?:   string;
  rol?: string;
  proyectos: string[];
}

interface AuthContextType {
  user: any;
  perfil: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [perfil, setPerfil] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Obtiene el perfil desde perfiles
  async function loadPerfil(id: string) {
    const { data, error } = await supabase
      .from("perfiles")
      .select("id, email, nombre, rol, proyectos")
      .eq("id", id)
      .single();

    if (!error && data) setPerfil(data);
  }

  // Refresca manualmente (para cambios de rol o perfil)
  async function refreshSession() {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
    if (data.user) await loadPerfil(data.user.id);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setPerfil(null);
  }

  // Al cargar la app
  useEffect(() => {
  let mounted = true;

  async function init() {
    console.log("🔄 Cargando sesión inicial...");

    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;

    if (session?.user) {

      // Cargar perfil
      const { data: perfilData } = await supabase
        .from("perfiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      // Cargar roles/permisos si los usas desde tabla separada
      // (ya lo tienes implementado arriba, solo dejo el espacio)
      // ...

      // Cargar proyectos asignados
      const { data: proyectosAsignados } = await supabase
        .from("usuarios_proyectos")
        .select("cliente_id")
        .eq("usuario_id", session.user.id)
        .eq("activo", true);

      if (mounted) {
        setUser(session.user);

        // Aquí corregimos TS: prev puede ser null
        setPerfil(prev => prev ? {
          ...prev,
          ...perfilData,
          proyectos: proyectosAsignados?.map(p => p.cliente_id) ?? []
        } : {
          ...perfilData,
          proyectos: proyectosAsignados?.map(p => p.cliente_id) ?? []
        });
      }
    }

    if (mounted) setLoading(false);
  }

  init();

  // Mantener sesión en tiempo real
  const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
    (async () => {
      if (session?.user) {
        const { data: perfilData } = await supabase
          .from("perfiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        const { data: proyectosAsignados } = await supabase
          .from("usuarios_proyectos")
          .select("cliente_id")
          .eq("usuario_id", session.user.id)
          .eq("activo", true);

        setUser(session.user);
        setPerfil({
          ...perfilData,
          proyectos: proyectosAsignados?.map(p => p.cliente_id) ?? []
        });
      } else {
        setUser(null);
        setPerfil(null);
      }
      setLoading(false);
    })();
  });

  return () => {
    mounted = false;
    listener?.subscription.unsubscribe();
  };
}, []);



  return (
    <AuthContext.Provider value={{ user, perfil, loading, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
