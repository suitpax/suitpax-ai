export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query, count = 10, offset = 0, search_lang = "en", country = "US", safesearch = "moderate" } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const braveApiKey = process.env.BRAVE_API_KEY
    if (!braveApiKey) {
      return NextResponse.json({ error: "Brave API key not configured" }, { status: 500 })
    }

    const url = new URL("https://api.search.brave.com/res/v1/web/search")
    url.searchParams.set("q", query)
    url.searchParams.set("count", String(count))
    url.searchParams.set("offset", String(offset))
    url.searchParams.set("search_lang", search_lang)
    url.searchParams.set("country", country)
    url.searchParams.set("safesearch", safesearch)
    url.searchParams.set("spellcheck", "1")

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": braveApiKey,
      },
    })

    if (!response.ok) {
      const text = await response.text().catch(() => "")
      throw new Error(`Brave Search API error: ${response.status} ${text}`)
    }

    const data = await response.json()

    const formattedResults = {
      query,
      results:
        data.web?.results?.map((item: any) => ({
          title: item.title,
          url: item.url,
          description: item.description,
          published: item.age,
          language: item.language,
          is_source_local: item.is_source_local,
          is_source_both: item.is_source_both,
        })) || [],
      total: data.web?.results?.length || 0,
    }

    return NextResponse.json(formattedResults)
  } catch (error) {
    console.error("Brave Search error:", error)
    return NextResponse.json({ error: "Failed to perform web search" }, { status: 500 })
  }
}