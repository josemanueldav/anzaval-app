import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface UserProfile {
  id: string;
  email: string;
  nombre?: string;
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

  async function loadUserData(userId: string) {
  try {
    console.log("👤 Cargando usuario:", userId);

    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("id, email, nombre, rol")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("❌ Error usuarios:", error);
      setPerfil(null);
      return;
    }

    const { data: proyectosAsignados, error: errProyectos } = await supabase
      .from("usuarios_proyectos")
      .select("cliente_id")
      .eq("usuario_id", userId)
      .eq("activo", true);

    if (errProyectos) {
      console.error("❌ Error proyectos:", errProyectos);
    }

    setPerfil({
      ...usuario,
      proyectos: proyectosAsignados?.map(p => p.cliente_id) ?? []
    });

    console.log("✅ Perfil cargado");
  } catch (e) {
    console.error("🔥 Error crítico loadUserData:", e);
    setPerfil(null);
  }
}


  async function refreshSession() {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
    if (data.user) await loadUserData(data.user.id);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setPerfil(null);
  }

  useEffect(() => {
    let mounted = true;

    async function init() {
  try {
    console.log("🔄 Cargando sesión inicial...");

    const { data } = await supabase.auth.getSession();
    const session = data.session;

    if (session?.user) {
      setUser(session.user);
      await loadUserData(session.user.id);
    } else {
      setUser(null);
      setPerfil(null);
    }
  } catch (e) {
    console.error("🔥 Error init auth:", e);
    setUser(null);
    setPerfil(null);
  } finally {
    console.log("✅ Auth listo");
    setLoading(false);
  }
}


    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          await loadUserData(session.user.id);
        } else {
          setUser(null);
          setPerfil(null);
        }

        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, perfil, loading, signOut, refreshSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
