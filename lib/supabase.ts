import { createClient, SupabaseClient } from "@supabase/supabase-js"

/* Reads credentials from env (set them in .env.local — see .env.local.example).
   The values are public by design (anon key); row-level security in the
   database is what keeps each coach's data private. */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anon)

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local")
  }
  if (!_client) {
    _client = createClient(url as string, anon as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  }
  return _client
}
