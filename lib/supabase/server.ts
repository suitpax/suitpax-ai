import { createServerClient } from "@supabase/ssr"
import type { Database } from "./types"
import { cookieStore } from "./cookies"

export const createClient = () => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieStore
    }
  )
}
