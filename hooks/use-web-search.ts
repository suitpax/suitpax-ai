"use client"

import { useCallback, useState } from "react"

type Provider = "brave" | "exa" | "tavily"

export interface WebSearchItem {
	title: string
	url: string
	description: string
	published?: string
	favicon?: string
}

export function useWebSearch(defaultProvider: Provider = "brave") {
	const [loading, setLoading] = useState(false)
	const [results, setResults] = useState<WebSearchItem[]>([])
	const [error, setError] = useState<string | null>(null)

	const search = useCallback(async (query: string, opts?: { count?: number; provider?: Provider }) => {
		setLoading(true)
		setError(null)
		try {
			const provider = opts?.provider || defaultProvider
			const res = await fetch(`/api/web/${provider}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ query, count: opts?.count ?? 5 })
			})
			if (!res.ok) throw new Error(`Web search failed: ${provider}`)
			const json = await res.json()
			setResults(Array.isArray(json?.results) ? json.results : [])
		} catch (e: any) {
			setError(e?.message || "Web search error")
			setResults([])
		} finally {
			setLoading(false)
		}
	}, [defaultProvider])

	return { loading, results, error, search }
}