import { type NextRequest, NextResponse } from "next/server"
import { createDuffelClient } from "@/lib/duffel"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const query = (url.searchParams.get("query") || url.searchParams.get("q") || "").trim()
    const limit = url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : 15
    const typesParam = (url.searchParams.get("types") || "").trim()
    const types = typesParam ? typesParam.split(",").map((t) => t.trim().toLowerCase()) : undefined

    if (!query || query.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: "Query must be at least 2 characters",
          places: [],
        },
        { status: 400 },
      )
    }

    if (!process.env.DUFFEL_API_KEY && !process.env.DUFFEL_ACCESS_TOKEN) {
      console.error("Duffel API key not configured")
      return NextResponse.json(
        {
          success: false,
          error: "Flight search service not configured. Please contact support.",
          places: [],
        },
        { status: 503 },
      )
    }

    const duffel = createDuffelClient()

    console.log(`Searching places for query: "${query}", limit: ${limit}, types: ${types?.join(",") || "all"}`)

    let suggestions: any[] | null = null

    // Try official place suggestions if available in SDK
    try {
      const anyClient: any = duffel as any
      const hasSuggestions = !!(anyClient?.places?.suggestions?.list || anyClient?.placeSuggestions?.list)

      if (hasSuggestions) {
        console.log("Using Duffel SDK place suggestions")
        const listFn = anyClient?.places?.suggestions?.list || anyClient?.placeSuggestions?.list
        const params: any = { query, limit: Math.max(limit, 20) }
        if (types && Array.isArray(types) && types.length > 0) params.types = types

        const res = await listFn(params)
        const data = res?.data || res || []

        if (Array.isArray(data) && data.length > 0) {
          suggestions = data.map((p: any) => ({
            id: p.id,
            type: p.type,
            iata_code: p.iata_code,
            name: p.name,
            city_name: p.city?.name || p.city_name || "",
            country_name: p.city?.country_name || p.country_name || "",
            latitude: p.latitude,
            longitude: p.longitude,
          }))
          console.log(`Found ${suggestions.length} suggestions via SDK`)
        }
      }
    } catch (e) {
      console.log("SDK place suggestions not available, trying REST API")
      suggestions = null
    }

    // REST fallback if SDK does not expose place suggestions
    if (!suggestions) {
      try {
        console.log("Using Duffel REST API for place suggestions")
        const apiKey = process.env.DUFFEL_API_KEY || process.env.DUFFEL_ACCESS_TOKEN

        const resp = await fetch(
          `https://api.duffel.com/air/places/suggestions?query=${encodeURIComponent(query)}&limit=${Math.max(limit, 20)}`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Duffel-Version": "v2",
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            cache: "no-store",
          },
        )

        if (!resp.ok) {
          const errorText = await resp.text()
          console.error(`Duffel API error: ${resp.status} ${resp.statusText}`, errorText)
          throw new Error(`Duffel API returned ${resp.status}: ${errorText}`)
        }

        const json: any = await resp.json()
        const data = json?.data || []

        if (Array.isArray(data) && data.length > 0) {
          suggestions = data.map((p: any) => ({
            id: p.id,
            type: p.type,
            iata_code: p.iata_code,
            name: p.name,
            city_name: p.city?.name || p.city_name || "",
            country_name: p.city?.country_name || p.country_name || "",
            latitude: p.latitude,
            longitude: p.longitude,
          }))
          console.log(`Found ${suggestions.length} suggestions via REST API`)
        } else {
          console.log("No suggestions found via REST API")
        }
      } catch (restError) {
        console.error("REST API fallback failed:", restError)
        return NextResponse.json(
          {
            success: false,
            error: `Unable to search airports: ${restError instanceof Error ? restError.message : "Unknown error"}`,
            places: [],
          },
          { status: 500 },
        )
      }
    }

    if (suggestions && suggestions.length > 0) {
      // Basic scoring + prefer airports for 3-letter queries
      const q = query.toLowerCase()
      const isLikelyIata = q.length === 3 && /^[a-z]{3}$/i.test(q)

      const scored = suggestions
        .map((item) => {
          let score = 0
          if (item.iata_code && item.iata_code.toLowerCase() === q) score += 120
          if (item.name && item.name.toLowerCase() === q) score += 90
          if (item.name && item.name.toLowerCase().includes(q)) score += 45
          if (item.city_name && item.city_name.toLowerCase().includes(q)) score += 25
          if (isLikelyIata && item.type === "airport") score += 20
          if (types && types.length > 0 && !types.includes(item.type)) score -= 1000
          return { ...item, score }
        })
        .sort((a, b) => b.score - a.score)

      const results = scored.slice(0, limit)
      console.log(`Returning ${results.length} filtered and scored results`)

      return NextResponse.json({
        success: true,
        places: results,
        query: query,
        total: results.length,
      })
    }

    console.log(`No places found for query: "${query}"`)
    return NextResponse.json({
      success: true,
      places: [],
      query: query,
      total: 0,
      message: `No airports or cities found matching "${query}"`,
    })
  } catch (error: any) {
    console.error("Places suggestions error:", error)
    return NextResponse.json(
      {
        success: false,
        error: `Failed to fetch place suggestions: ${error.message || "Unknown error"}`,
        places: [],
      },
      { status: 500 },
    )
  }
}
