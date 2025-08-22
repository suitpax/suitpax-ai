import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query, count = 10, offset = 0 } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const braveApiKey = process.env.BRAVE_API_KEY
    if (!braveApiKey) {
      return NextResponse.json({ error: "Brave API key not configured" }, { status: 500 })
    }

    const url = new URL("https://api.search.brave.com/res/v1/web/search")
    url.search = new URLSearchParams({
      q: query,
      count: count.toString(),
      offset: offset.toString(),
      search_lang: "en",
      country: "US",
      safesearch: "moderate",
      freshness: "pw",
    }).toString()

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": braveApiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Brave API error: ${response.status}`)
    }

    const data = await response.json()

    const formattedResults = {
      query,
      results:
        data.web?.results?.map((result: any) => ({
          title: result.title,
          url: result.url,
          description: result.description,
          published: result.age,
          favicon: result.profile?.img,
        })) || [],
      total: data.web?.results?.length || 0,
    }

    return NextResponse.json(formattedResults)
  } catch (error) {
    console.error("Brave search error:", error)
    return NextResponse.json({ error: "Failed to perform web search" }, { status: 500 })
  }
}
