export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"
import { getDuffelClient } from "@/lib/duffel/client"

function parseQuery(q: string) {
  const text = (q || "").toUpperCase()
  const iatas = Array.from(text.matchAll(/\b([A-Z]{3})\b/g)).map((m) => m[1])
  const dates = Array.from(text.matchAll(/\b(\d{4}-\d{2}-\d{2})\b/g)).map((m) => m[1])
  const [origin, destination] = iatas.length >= 2 ? [iatas[0], iatas[1]] : [undefined, undefined]
  const [departure_date, return_date] = dates.length >= 2 ? [dates[0], dates[1]] : [dates[0], undefined]
  return { origin, destination, departure_date, return_date }
}

function buildAirlineLogoUrl(iata?: string | null): string | null {
  if (!iata) return null
  return `https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${iata}.svg`
}

function normalizeOffers(raw: any[]) {
  return (raw || []).slice(0, 5).map((o: any) => {
    const firstSlice = o?.slices?.[0]
    const lastSlice = o?.slices?.[o?.slices?.length - 1]
    const firstSeg = firstSlice?.segments?.[0]
    const lastSeg = lastSlice?.segments?.[lastSlice?.segments?.length - 1]

    const carrier = firstSeg?.marketing_carrier || firstSeg?.operating_carrier || {}
    const airlineName = carrier?.name || undefined
    const airlineIata = carrier?.iata_code || carrier?.iata || undefined

    const originIata = firstSeg?.origin?.iata_code || firstSlice?.origin?.iata_code || firstSeg?.origin?.iata || undefined
    const destinationIata = lastSeg?.destination?.iata_code || lastSlice?.destination?.iata_code || lastSeg?.destination?.iata || undefined
    const segmentsCount = (firstSlice?.segments?.length || 1)

    return {
      id: o?.id,
      price: `${o?.total_amount || o?.total_amount?.toString() || ""} ${o?.total_currency || ""}`.trim(),
      airline: airlineName,
      airline_iata: airlineIata,
      logo: buildAirlineLogoUrl(airlineIata || null),
      depart: firstSeg?.departing_at || firstSlice?.departing_at,
      arrive: lastSeg?.arriving_at || lastSlice?.arriving_at,
      origin: originIata,
      destination: destinationIata,
      stops: Math.max(0, segmentsCount - 1),
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { query, origin, destination, departure_date, return_date, passengers, cabin_class } = body || {}

    let params = { origin, destination, departure_date, return_date }
    if (query && (!origin || !destination || !departure_date)) {
      const parsed = parseQuery(String(query))
      params = { ...params, ...parsed }
    }

    if (!params.origin || !params.destination || !params.departure_date) {
      return NextResponse.json(
        { error: "Missing required fields: origin, destination, departure_date (or provide a parsable query)" },
        { status: 400 },
      )
    }

    const duffel = getDuffelClient()
    const searchResult = await duffel.searchFlights({
      origin: params.origin,
      destination: params.destination,
      departure_date: params.departure_date,
      return_date: params.return_date,
      passengers: passengers && Array.isArray(passengers) && passengers.length > 0 ? passengers : [{ type: "adult" }],
      cabin_class: cabin_class || "economy",
    })

    const raw = searchResult.data || []
    const offers = normalizeOffers(raw)

    return NextResponse.json({ success: true, offers, raw })
  } catch (error: any) {
    const message = error?.message || "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}