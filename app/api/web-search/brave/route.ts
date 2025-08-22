import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { query, count = 5 } = await req.json()
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const apiKey = process.env.BRAVE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "BRAVE_API_KEY not configured" }, { status: 500 })
    }

    const url = new URL("https://api.search.brave.com/res/v1/web/search")
    url.searchParams.set("q", query)
    url.searchParams.set("count", String(count || 5))

    const res = await fetch(url.toString(), {
      headers: {
        "X-Subscription-Token": apiKey,
        "Accept": "application/json",
      },
      cache: "no-store",
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: "Brave API error", details: text }, { status: res.status })
    }

    const json = await res.json()
    const webResults = (json?.web?.results || json?.results || []) as any[]

    const results = webResults.slice(0, count).map((r: any) => ({
      title: r.title || r.name || "",
      url: r.url || r.link || "",
      description: r.description || r.snippet || r.page_description || "",
      published: r.published || r.page_age || undefined,
      favicon: r.profile?.icon || r.favicon || undefined,
    }))

    return NextResponse.json({ query, results, total: json?.web?.total || results.length })
  } catch (error) {
    console.error("Brave search route error:", error)
    return NextResponse.json({ error: "Failed to perform web search" }, { status: 500 })
  }
}
