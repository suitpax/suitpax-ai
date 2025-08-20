import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    if (!query || typeof query !== "string") {
      return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 })
    }

    // Parse IATA like: MAD to SFO
    const iataMatch = query.match(/\b([A-Z]{3})\b.*\b(to|→|-|from)\b.*\b([A-Z]{3})\b/i)
    const [origin, destination] = iataMatch ? [iataMatch[1]?.toUpperCase(), iataMatch[3]?.toUpperCase()] : [null, null]
    if (!origin || !destination) {
      return NextResponse.json({ success: false, error: "Please include origin and destination IATA codes (e.g., MAD to SFO)" }, { status: 400 })
    }

    // Departure date: +14 days default
    const departure_date = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const duffelRes = await fetch(`${baseUrl}/api/flights/duffel/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origin, destination, departure_date, passengers: { adults: 1 }, cabin_class: "economy", max_connections: 1, max_results: 10 }),
    })

    if (!duffelRes.ok) {
      const errorText = await duffelRes.text()
      return NextResponse.json({ success: false, error: errorText || "Duffel search failed" }, { status: 500 })
    }

    const { data } = await duffelRes.json()

    // Map Duffel offers into AI tool schema (normalized subset)
    const offers = (Array.isArray(data) ? data : []).slice(0, 5).map((offer: any) => {
      const slice = offer?.slices?.[0]
      const segment = slice?.segments?.[0]
      const marketingCarrier = segment?.marketing_carrier || offer?.owner
      const depart = segment?.departing_at
      const arrive = segment?.arriving_at
      const durationMinutes = segment?.duration ? Math.max(0, Math.round((Number(segment.duration) || 0) / 60)) : 0
      const stops = (slice?.segments?.length || 1) - 1

      return {
        airline: {
          name: marketingCarrier?.name || offer?.owner?.name || "",
          code: marketingCarrier?.iata_code || offer?.owner?.iata_code || "",
          logo: marketingCarrier?.logo_symbol_url || null,
        },
        price: Number(offer?.total_amount) || 0,
        currency: offer?.total_currency || "EUR",
        route: {
          origin: origin,
          destination: destination,
          departure_time: depart || new Date().toISOString(),
          arrival_time: arrive || new Date(Date.now() + 6 * 3600000).toISOString(),
          duration: durationMinutes,
          stops,
        },
        booking_url: `/dashboard/flights/book/${encodeURIComponent(offer?.id || "")}`,
      }
    })

    return NextResponse.json({ success: true, offers, search_params: { origin, destination, departure_date } })
  } catch (e) {
    console.error("flight-search tool error:", e)
    return NextResponse.json({ success: false, error: "Failed to search flights" }, { status: 500 })
  }
}

// NOTE: For production, integrate real Duffel search in a separate tool version.