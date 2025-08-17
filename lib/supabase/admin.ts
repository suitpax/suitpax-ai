import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./types"

let cachedAdminClient: ReturnType<typeof createSupabaseClient<Database>> | null = null

export function getAdminClient() {
  if (cachedAdminClient) return cachedAdminClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error("Missing Supabase service role configuration (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)")
  }

  cachedAdminClient = createSupabaseClient<Database>(url, serviceKey)
  return cachedAdminClient
}