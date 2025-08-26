import { tavily } from "@tavily/core"
import { assertServerOnly } from "@/lib/supabase/utils"

let tavilyClient: ReturnType<typeof tavily> | null = null

export function getTavilyClient() {
	assertServerOnly()
	if (tavilyClient) return tavilyClient
	const apiKey = process.env.TAVILY_API_KEY
	if (!apiKey) {
		throw new Error("Missing TAVILY_API_KEY")
	}
	tavilyClient = tavily({ apiKey })
	return tavilyClient
}

export async function tavilySearch(query: string, options?: { maxResults?: number; searchDepth?: "basic" | "advanced" }) {
	const client = getTavilyClient()
	const res = await client.search(query, {
		max_results: options?.maxResults ?? 5,
		search_depth: options?.searchDepth ?? "basic",
	})
	return res
}