import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
	try {
		const { query, count = 5 } = await req.json()
		if (!query || typeof query !== "string") {
			return NextResponse.json({ error: "Query is required" }, { status: 400 })
		}

		const apiKey = process.env.EXA_API_KEY
		if (!apiKey) {
			return NextResponse.json({ error: "EXA_API_KEY not configured" }, { status: 500 })
		}

		const res = await fetch("https://api.exa.ai/search", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": apiKey,
			},
			body: JSON.stringify({ query, numResults: count || 5 })
		})

		if (!res.ok) {
			const text = await res.text()
			return NextResponse.json({ error: "Exa API error", details: text }, { status: res.status })
		}

		const json = await res.json()
		const items = Array.isArray(json?.results) ? json.results : []
		const results = items.slice(0, count).map((r: any) => ({
			title: r.title || r.text || r.url || "",
			url: r.url || r.link || "",
			description: r.text || r.snippet || "",
			published: r.publishedDate || undefined,
			favicon: undefined,
		}))

		return NextResponse.json({ query, results, total: results.length })
	} catch (error) {
		console.error("Exa search route error:", error)
		return NextResponse.json({ error: "Failed to perform web search" }, { status: 500 })
	}
}