import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./types"

export const createClient = () => {
	// Avoid crashing during SSR/prerender. Only initialize in the browser.
	if (typeof window === "undefined") {
		return {
			auth: {
				signUp: async () => {
					throw new Error("Supabase client is not available during SSR")
				},
				signInWithPassword: async () => {
					throw new Error("Supabase client is not available during SSR")
				},
				resetPasswordForEmail: async () => {
					throw new Error("Supabase client is not available during SSR")
				},
				updateUser: async () => {
					throw new Error("Supabase client is not available during SSR")
				},
				getUser: async () => ({ data: { user: null }, error: null }),
			},
			from: () => ({
				select: async () => ({ data: null, error: new Error("Supabase is not available during SSR") }),
				insert: async () => ({ data: null, error: new Error("Supabase is not available during SSR") }),
				update: async () => ({ data: null, error: new Error("Supabase is not available during SSR") }),
			}),
			rpc: async () => ({ data: null, error: new Error("Supabase is not available during SSR") }),
		} as any
	}

	const url = process.env.NEXT_PUBLIC_SUPABASE_URL
	const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

	if (!url || !anon) {
		if (process.env.NODE_ENV !== "production") {
			console.error("Supabase env missing: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY")
		}
		return {
			auth: {
				signUp: async () => {
					throw new Error("Supabase is not configured")
				},
				signInWithPassword: async () => {
					throw new Error("Supabase is not configured")
				},
				resetPasswordForEmail: async () => {
					throw new Error("Supabase is not configured")
				},
				updateUser: async () => {
					throw new Error("Supabase is not configured")
				},
				getUser: async () => ({ data: { user: null }, error: null }),
			},
			from: () => ({
				select: async () => ({ data: null, error: new Error("Supabase is not configured") }),
				insert: async () => ({ data: null, error: new Error("Supabase is not configured") }),
				update: async () => ({ data: null, error: new Error("Supabase is not configured") }),
			}),
			rpc: async () => ({ data: null, error: new Error("Supabase is not configured") }),
		} as any
	}

	return createBrowserClient<Database>(url, anon)
}
