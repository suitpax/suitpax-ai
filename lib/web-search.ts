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

function getPreferredProvider(): "exa" | "brave" | "tavily" {
  const pref = (process.env.NEXT_PUBLIC_WEB_SEARCH_PROVIDER || "").toLowerCase()
  if (pref === "exa") return "exa"
  if (pref === "tavily") return "tavily"
  return "brave"
}

async function callProvider(path: "/api/web/brave" | "/api/web/exa" | "/api/web/tavily", query: string, count = 5): Promise<WebSearchResponse> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, count }),
  })
  if (!response.ok) throw new Error(`Search failed: ${path}`)
  return await response.json()
}

export async function searchWeb(query: string, count = 5): Promise<WebSearchResponse> {
  const provider = getPreferredProvider()
  try {
    if (provider === "exa") {
      return await callProvider("/api/web/exa", query, count)
    }
    if (provider === "tavily") {
      return await callProvider("/api/web/tavily", query, count)
    }
    return await callProvider("/api/web/brave", query, count)
  } catch (primaryError) {
    try {
      // Fallback order: brave -> exa -> tavily
      return await callProvider("/api/web/brave", query, count)
    } catch (err1) {
      try {
        return await callProvider("/api/web/exa", query, count)
      } catch (err2) {
        return await callProvider("/api/web/tavily", query, count)
      }
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
