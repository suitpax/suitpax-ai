export interface NewsResult {
  title: string
  url: string
  description: string
  published?: string
  outlet?: string
  image?: string
}

export interface NewsResponse {
  query: string
  results: NewsResult[]
  total: number
}

export type BraveFreshness = "d1" | "d7" | "m1"

export async function fetchNews(query: string, count = 6, freshness: BraveFreshness = "d7"): Promise<NewsResponse> {
  try {
    const response = await fetch("/api/brave/news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, count, freshness }),
    })

    if (!response.ok) {
      throw new Error("News search failed")
    }

    return await response.json()
  } catch (error) {
    console.error("News search error:", error)
    return {
      query,
      results: [],
      total: 0,
    }
  }
}

export function formatNewsForAI(results: NewsResult[]): string {
  if (results.length === 0) {
    return "No relevant news found."
  }

  return results
    .map(
      (r, i) => `${i + 1}. ${r.title}\n   ${r.description}\n   Source: ${r.outlet || "Unknown"} - ${r.url}`,
    )
    .join("\n\n")
}
