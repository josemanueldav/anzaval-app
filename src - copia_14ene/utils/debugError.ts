import { PostgrestError } from "@supabase/supabase-js";

export function debugSupabaseError(error: PostgrestError | null) {
  if (!error) return "✅ Sin errores";

  // Mostrar todo el objeto en consola
  console.error("🔴 Supabase error:", error);

  // Construir un mensaje detallado para la UI
  let msg = `❌ ${error.message}`;
  if (error.details) msg += `\nDetalles: ${error.details}`;
  if (error.hint) msg += `\nHint: ${error.hint}`;

  return msg;
}
