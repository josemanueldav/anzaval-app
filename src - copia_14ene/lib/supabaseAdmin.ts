// lib/supabaseAdmin.ts
import { createClient } from "@supabase/supabase-js";

// Solo crear el cliente admin en entorno de servidor
let supabaseAdmin: any = null;

if (typeof window === "undefined") {
  supabaseAdmin = createClient(
    import.meta.env.VITE_SUPABASE_URL as string,
    import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string
  );
} else {
  console.warn("⚠️ Evitando crear supabaseAdmin en el navegador");
}

export { supabaseAdmin };
