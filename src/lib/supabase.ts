import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      // Se le credenziali mancano, restituisci un client fittizio
      // che darà errore solo quando si tenta di usarlo (a runtime, non a build time)
      _supabase = createClient(
        "https://placeholder-for-build.supabase.co",
        "placeholder-key-for-build"
      );
      console.warn(
        "[Supabase] Credenziali non configurate. " +
        "Imposta NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY su Vercel."
      );
    } else {
      _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
  }
  return _supabase;
}
