export interface WebSearchResult {
  title: string
  url: string
  description: string
  published?: string
  favicon?: string
}

export interface WebSearchResponse {
  query: string
  results: WebSearchResult[]
  total: number
}

export async function searchWeb(query: string, count = 5): Promise<WebSearchResponse> {
  try {
    const response = await fetch("/api/web-search/brave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, count }),
    })

    if (!response.ok) {
      throw new Error("Web search failed")
    }

    return await response.json()
  } catch (error) {
    console.error("Web search error:", error)
    return {
      query,
      results: [],
      total: 0,
    }
  }
}

export function formatSearchResultsForAI(results: WebSearchResult[]): string {
  if (results.length === 0) {
    return "No web search results found."
  }

  return results
    .map((result, index) => `${index + 1}. **${result.title}**\n   ${result.description}\n   Source: ${result.url}\n`)
    .join("\n")
}
