import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

let cachedAdmin: ReturnType<typeof createClient<Database>> | null = null

export function getAdminClient() {
	if (cachedAdmin) return cachedAdmin
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL
	const serviceRole = process.env.SUPABASE_SERVICE_ROLE
	if (!url || !serviceRole) {
		throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE')
	}
	cachedAdmin = createClient<Database>(url, serviceRole)
	return cachedAdmin
}