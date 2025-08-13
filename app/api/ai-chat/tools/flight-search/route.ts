import { NextRequest, NextResponse } from "next/server"

// Helper: airline logo CDN (fallback to Brandfetch or Duffel assets if needed)
const airlineLogo = (iata?: string) =>
  iata ? `https://duffel-platform-public-assets.s3.eu-west-1.amazonaws.com/airlines/logos/colour/${iata}.svg` : null

// Helper: destination image mapping (simple Pexels placeholder by IATA)
const destinationImage = (iata?: string) =>
  iata ? `https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg` : null

function deriveBadges(offer: any) {
  const badges: Array<{ kind: string; label: string }> = []
  if (offer?.slices?.every((s: any) => (s?.segments?.length || 1) === 1)) {
    badges.push({ kind: "nonstop", label: "Nonstop" })
  }
  if (offer?.owner?.name) {
    badges.push({ kind: "carrier", label: offer.owner.name })
  }
  // Heuristic best value if price below median placeholder
  try {
    const p = Number.parseFloat(offer?.total_amount)
    if (!Number.isNaN(p) && p < 200) badges.push({ kind: "best_value", label: "Best value" })
  } catch {}
  return badges
}

function normalizeOffers(raw: any[]): any[] {
  return (raw || []).slice(0, 5).map((o: any, idx: number) => {
    const slice = o?.slices?.[0]
    const lastSlice = o?.slices?.[o?.slices?.length - 1]
    const firstSeg = slice?.segments?.[0]
    const lastSeg = lastSlice?.segments?.[lastSlice?.segments?.length - 1]

    const origin = firstSeg?.origin?.iata_code || slice?.origin?.iata_code
    const destination = lastSeg?.destination?.iata_code || slice?.destination?.iata_code

    const depart = firstSeg?.departing_at || slice?.departing_at
    const arrive = lastSeg?.arriving_at || lastSlice?.arriving_at

    const stops = (slice?.segments?.length || 1) - 1
    const airline = o?.owner?.name || firstSeg?.operating_carrier?.name
    const airline_iata = o?.owner?.iata_code || firstSeg?.operating_carrier?.iata_code

    return {
      id: o?.id || String(idx),
      price: o?.total_currency ? `${o?.total_currency} ${o?.total_amount}` : `$${o?.total_amount || ""}`,
      currency: o?.total_currency || "USD",
      airline: airline || airline_iata || "",
      airline_iata: airline_iata || "",
      airline_logo: airlineLogo(airline_iata || ""),
      origin: origin || "",
      destination: destination || "",
      origin_city: firstSeg?.origin?.city_name || null,
      destination_city: lastSeg?.destination?.city_name || null,
      destination_image: destinationImage(destination || ""),
      depart: depart || "",
      arrive: arrive || "",
      duration_minutes: slice?.duration ? Number.parseInt(String(slice.duration)) : null,
      stops: typeof stops === "number" && stops >= 0 ? stops : 0,
      fare_class: o?.cabin_class || null,
      refundable: o?.refundable ?? null,
      loyalty: { program: null, miles: null, status_bonus: null },
      badges: deriveBadges(o),
      booking_url: `/dashboard/flights/book/${o?.id || idx}`,
    }
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Proxy to the canonical flights search API
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/flights/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    if (!res.ok || !data?.success) {
      return NextResponse.json({ success: false, error: data?.error || 'Flight search failed' }, { status: res.status || 500 })
    }

    const offers = normalizeOffers(data.offers || [])
    return NextResponse.json({ success: true, offers })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Internal error' }, { status: 500 })
  }
}