import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    if (!query || typeof query !== "string") {
      return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 })
    }

    // Very light intent parsing for origin/destination (IATA or city words)
    const iataMatch = query.match(/\b([A-Z]{3})\b.*\b(to|→|-|from)\b.*\b([A-Z]{3})\b/i)
    const [origin, destination] = iataMatch ? [iataMatch[1]?.toUpperCase(), iataMatch[3]?.toUpperCase()] : ["MAD", "SFO"]

    const now = new Date()
    const dep = new Date(now.getTime() + 1000 * 60 * 60 * 24)
    const arr = new Date(dep.getTime() + 1000 * 60 * 60 * 12)

    const offers = [
      {
        airline: { name: "Iberia", code: "IB", logo: "https://content.airhex.com/content/logos/airlines_64/IB.png" },
        price: 520,
        currency: "EUR",
        route: {
          origin,
          destination,
          departure_time: dep.toISOString(),
          arrival_time: arr.toISOString(),
          duration: 720,
          stops: 0,
        },
        booking_url: "https://suitpax.com/book/flight/IB-MAD-SFO",
      },
      {
        airline: { name: "Lufthansa", code: "LH", logo: "https://content.airhex.com/content/logos/airlines_64/LH.png" },
        price: 610,
        currency: "EUR",
        route: {
          origin,
          destination,
          departure_time: dep.toISOString(),
          arrival_time: new Date(arr.getTime() + 1000 * 60 * 60 * 2).toISOString(),
          duration: 840,
          stops: 1,
        },
        booking_url: "https://suitpax.com/book/flight/LH-MAD-SFO",
      },
      {
        airline: { name: "Air France", code: "AF", logo: "https://content.airhex.com/content/logos/airlines_64/AF.png" },
        price: 590,
        currency: "EUR",
        route: {
          origin,
          destination,
          departure_time: dep.toISOString(),
          arrival_time: new Date(arr.getTime() + 1000 * 60 * 30).toISOString(),
          duration: 780,
          stops: 1,
        },
        booking_url: "https://suitpax.com/book/flight/AF-MAD-SFO",
      },
    ]

    return NextResponse.json({ success: true, offers, search_params: { origin, destination } })
  } catch (e) {
    console.error("flight-search tool error:", e)
    return NextResponse.json({ success: false, error: "Failed to search flights" }, { status: 500 })
  }
}

// NOTE: For production, integrate real Duffel search in a separate tool version.