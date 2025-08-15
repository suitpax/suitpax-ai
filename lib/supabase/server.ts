import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/database.types"

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn("Supabase environment variables not configured properly")
    return {
      auth: {
        async getUser() {
          return { data: { user: null }, error: null }
        },
        async getSession() {
          return { data: { session: null }, error: null }
        },
      },
      from() {
        return {
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: null, error: null }),
              maybeSingle: () => Promise.resolve({ data: null, error: null }),
            }),
            limit: () => ({
              single: () => Promise.resolve({ data: null, error: null }),
            }),
          }),
          insert: () => Promise.resolve({ data: null, error: null }),
          update: () => ({
            eq: () => Promise.resolve({ data: null, error: null }),
            match: () => Promise.resolve({ data: null, error: null }),
          }),
          delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
          upsert: () => Promise.resolve({ data: null, error: null }),
        }
      },
    } as unknown as ReturnType<typeof createServerClient<Database>>
  }

  try {
    const cookieStore = cookies()

    return createServerClient<Database>(url, key, {
      cookies: {
        getAll() {
          try {
            return cookieStore.getAll()
          } catch (error) {
            console.warn("Failed to get cookies:", error)
            return []
          }
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            console.warn("Cookie operation failed:", error)
          }
        },
      },
    })
  } catch (error) {
    console.error("Failed to create Supabase client:", error)
    return {
      auth: {
        async getUser() {
          return { data: { user: null }, error: null }
        },
        async getSession() {
          return { data: { session: null }, error: null }
        },
      },
      from() {
        return {
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: null, error: null }),
              maybeSingle: () => Promise.resolve({ data: null, error: null }),
            }),
          }),
          insert: () => Promise.resolve({ data: null, error: null }),
          update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
          delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
        }
      },
    } as unknown as ReturnType<typeof createServerClient<Database>>
  }
}
