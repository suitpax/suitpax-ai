export interface NewsResult {
  title: string
  url: string
  description: string
  published?: string
  outlet?: string
  image?: string
}

export interface WebSearchResult {
  title: string
  url: string
  description: string
  published?: string
  language?: string
  is_source_local?: boolean
  is_source_both?: boolean
}

export interface NewsResponse {
  query: string
  results: NewsResult[]
  total: number
}

export interface WebSearchResponse {
  query: string
  results: WebSearchResult[]
  total: number
}

export type BraveFreshness = "d1" | "d7" | "m1"
export type BraveSearchLang = "en" | "es" | "fr" | "de" | "it" | "pt" | "ru" | "ja" | "ko" | "zh"
export type BraveCountry = "US" | "GB" | "CA" | "AU" | "DE" | "FR" | "IT" | "ES" | "BR" | "JP" | "KR" | "CN"
export type BraveSafeSearch = "strict" | "moderate" | "off"

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

export async function fetchWebSearch(
  query: string, 
  count = 10, 
  search_lang: BraveSearchLang = "en",
  country: BraveCountry = "US",
  safesearch: BraveSafeSearch = "moderate"
): Promise<WebSearchResponse> {
  try {
    const response = await fetch("/api/brave/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, count, search_lang, country, safesearch }),
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

export function formatWebSearchForAI(results: WebSearchResult[]): string {
  if (results.length === 0) {
    return "No relevant search results found."
  }

  return results
    .map(
      (r, i) => `${i + 1}. ${r.title}\n   ${r.description}\n   URL: ${r.url}\n   Language: ${r.language || "Unknown"}`,
    )
    .join("\n\n")
}
