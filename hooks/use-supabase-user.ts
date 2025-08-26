"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function useSupabaseUser() {
	const supabase = createClient()
	const [userId, setUserId] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)
	useEffect(() => {
		let mounted = true
		async function load() {
			try {
				const { data: { user } } = await supabase.auth.getUser()
				if (!mounted) return
				setUserId(user?.id || null)
			} finally {
				if (mounted) setLoading(false)
			}
		}
		load()
		return () => { mounted = false }
	}, [supabase])
	return { userId, loading }
}