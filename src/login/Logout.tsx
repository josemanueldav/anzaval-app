import { supabase } from "@/lib/supabaseClient";

export async function logout() {
  await supabase.auth.signOut();
  window.location.href = "/login"; // o la ruta que uses
}
