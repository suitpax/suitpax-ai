import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createDuffelClient } from "@/lib/duffel"

const schema = z.object({
  origin: z.string().length(3).optional(),
  destination: z.string().length(3).optional(),
  departure_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  adults: z.number().int().min(1).max(9).optional(),
  cabin_class: z.enum(['economy','premium_economy','business','first']).optional(),
  query: z.string().optional(),
})

function parseFromQuery(q: string) {
  const res: any = {}
  const m = q.match(/([A-Z]{3})\s*(?:to|→|-)\s*([A-Z]{3})/i)
  if (m) { res.origin = m[1].toUpperCase(); res.destination = m[2].toUpperCase() }
  const d = q.match(/(20\d{2}-\d{2}-\d{2})/)
  if (d) { res.departure_date = d[1] }
  const cabin = q.match(/\b(economy|premium economy|business|first)\b/i)
  if (cabin) {
    const map: any = { 'premium economy': 'premium_economy' }
    res.cabin_class = (map[cabin[1].toLowerCase()] || cabin[1].toLowerCase())
  }
  const adults = q.match(/(\d+)\s*(adult|adults|pax|passengers)/i)
  if (adults) res.adults = Math.min(9, Math.max(1, parseInt(adults[1], 10)))
  return res
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid params" }, { status: 400 })

    let { origin, destination, departure_date, adults = 1, cabin_class = 'economy', query = '' } = parsed.data
    if (query && (!origin || !destination || !departure_date)) {
      const auto = parseFromQuery(query)
      origin = origin || auto.origin
      destination = destination || auto.destination
      departure_date = departure_date || auto.departure_date
      cabin_class = (cabin_class || auto.cabin_class || 'economy') as any
      adults = adults || auto.adults || 1
    }

    if (!origin || !destination) {
      return NextResponse.json({ success: false, error: "Missing origin/destination" }, { status: 400 })
    }

    if (!departure_date) {
      const dt = new Date(); dt.setDate(dt.getDate() + 14)
      departure_date = dt.toISOString().slice(0,10)
    }

    const duffel = createDuffelClient()

    const offerRequest = await duffel.offerRequests.create({
      slices: [{ origin, destination, departure_date }],
      passengers: Array.from({ length: adults }).map(() => ({ type: 'adult' })),
      cabin_class,
      max_connections: 2,
    } as any)

    const offersRaw = offerRequest?.data?.offers || []

    const offers = offersRaw.slice(0, 5).map((o: any) => {
      const first = o.slices?.[0]
      const seg0 = first?.segments?.[0]
      const lastSeg = first?.segments?.[first?.segments?.length - 1]
      return {
        id: o.id,
        price: `${o.total_currency} ${o.total_amount}`,
        airline: seg0?.marketing_carrier?.name || o.owner?.name,
        airline_iata: seg0?.marketing_carrier?.iata_code || o.owner?.iata_code,
        logo: seg0?.airline?.logo_symbol_url || o.owner?.logo_symbol_url || null,
        depart: seg0?.departing_at,
        arrive: lastSeg?.arriving_at,
        origin: seg0?.origin?.iata_code,
        destination: lastSeg?.destination?.iata_code,
        stops: Math.max(0, (first?.segments?.length || 1) - 1),
      }
    })

    return NextResponse.json({ success: true, params: { origin, destination, departure_date, adults, cabin_class }, offers })
  } catch (e) {
    console.error("chat flight tool error", e)
    return NextResponse.json({ success: false, error: "Search failed" }, { status: 500 })
  }
}