import { createBrowserClient } from "@supabase/ssr"
import { createServerClient } from "@supabase/ssr"
import type { Database } from "./types"

export function createBrowserSupabase() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL
	const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	if (!url || !anon) return null as any
	return createBrowserClient<Database>(url, anon)
}

export function createServerSupabase(cookies: Parameters<typeof createServerClient>[2]["cookies"]) {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
	const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	return createServerClient<Database>(url, anon, { cookies })
}

export function assertServerOnly() {
	if (typeof window !== "undefined") {
		throw new Error("This function must only be called on the server")
	}
}