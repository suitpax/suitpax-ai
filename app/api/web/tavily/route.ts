import { NextRequest, NextResponse } from "next/server"
import { getTavilyClient } from "@/lib/tavily/client"

export async function POST(req: NextRequest) {
	try {
		const { query, count = 5, depth = "basic" } = await req.json()
		if (!query || typeof query !== "string") {
			return NextResponse.json({ error: "Query is required" }, { status: 400 })
		}
		const tvly = getTavilyClient()
		const data = await tvly.search(query, { max_results: count || 5, search_depth: depth === "advanced" ? "advanced" : "basic" })
		const items = Array.isArray((data as any)?.results) ? (data as any).results : []
		const results = items.slice(0, count).map((r: any) => ({
			title: r.title || r.url || "",
			url: r.url || "",
			description: r.content || r.snippet || r.text || "",
			published: r.published_date || undefined,
			favicon: undefined,
		}))
		return NextResponse.json({ query, results, total: results.length })
	} catch (error) {
		console.error("Tavily search route error:", error)
		return NextResponse.json({ error: "Failed to perform web search" }, { status: 500 })
	}
}