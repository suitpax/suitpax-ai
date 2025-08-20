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

import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function extractIataCodes(query: string): string[] {
  const codes = new Set<string>()
  const re = /\b([A-Z]{3})\b/g
  let m
  while ((m = re.exec(query.toUpperCase())) !== null) {
    codes.add(m[1])
  }
  return Array.from(codes)
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json()
    if (!query) return NextResponse.json({ success: false, error: 'query is required' }, { status: 400 })

    const iatas = extractIataCodes(query)
    if (iatas.length < 2) {
      return NextResponse.json({ success: false, error: 'Please include origin and destination IATA codes (e.g., MAD LHR)' }, { status: 400 })
    }

    const origin = iatas[0]
    const destination = iatas[1]
    const departure_date = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]

    const body = {
      origin,
      destination,
      departure_date,
      passengers: { adults: 1 },
      cabin_class: 'economy',
      max_connections: 1,
    }

    const endpoint = new URL('/api/flights/duffel/search', (request as any).url || 'http://localhost:3000')
    const resp = await fetch(endpoint.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!resp.ok) {
      const text = await resp.text()
      return NextResponse.json({ success: false, error: text || 'Duffel error' }, { status: 500 })
    }

    const json = await resp.json()
    const offers = (json?.data?.offers || json?.data || []) as any[]

    return NextResponse.json({ success: true, offers, search_params: body })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}