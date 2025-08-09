import { NextRequest, NextResponse } from "next/server"
import { createDuffelClient, getAirlineData } from "@/lib/duffel"

export async function GET(_req: NextRequest, { params }: { params: { offerId: string } }) {
  try {
    const duffel = createDuffelClient()
    const res = await duffel.offers.get(params.offerId)
    const raw = res.data

    // Enrich segments with airline logos similar to flight-search route
    const uniqueCarrierCodes = new Set<string>()
    for (const slice of raw.slices || []) {
      for (const segment of slice.segments || []) {
        if (segment?.marketing_carrier?.iata_code) {
          uniqueCarrierCodes.add(segment.marketing_carrier.iata_code)
        }
      }
    }

    const carrierCodeToAirline: Record<string, any> = {}
    await Promise.all(
      Array.from(uniqueCarrierCodes).map(async (code) => {
        try {
          const airline = await getAirlineData(duffel as any, code)
          if (airline) carrierCodeToAirline[code] = airline
        } catch {}
      })
    )

    const offer = {
      id: raw.id,
      total_amount: raw.total_amount,
      total_currency: raw.total_currency,
      expires_at: raw.expires_at,
      owner: {
        ...raw.owner,
        logo_lockup_url: carrierCodeToAirline[raw.owner?.iata_code]?.logo_lockup_url,
        logo_symbol_url: carrierCodeToAirline[raw.owner?.iata_code]?.logo_symbol_url,
      },
      slices: (raw.slices || []).map((slice: any) => ({
        id: slice.id,
        origin: slice.origin,
        destination: slice.destination,
        duration: slice.duration,
        segments: (slice.segments || []).map((segment: any) => {
          const airlineInfo = carrierCodeToAirline[segment?.marketing_carrier?.iata_code]
          return {
            id: segment.id,
            origin: segment.origin,
            destination: segment.destination,
            departing_at: segment.departing_at,
            arriving_at: segment.arriving_at,
            marketing_carrier: segment.marketing_carrier,
            operating_carrier: segment.operating_carrier,
            flight_number: segment.flight_number,
            aircraft: segment.aircraft,
            airline: airlineInfo ? { name: airlineInfo.name, logo_symbol_url: airlineInfo.logo_symbol_url, logo_lockup_url: airlineInfo.logo_lockup_url } : { name: segment.marketing_carrier?.name }
          }
        })
      })),
      passengers: raw.passengers,
      conditions: raw.conditions
    }

    return NextResponse.json({ success: true, offer })
  } catch (error: any) {
    console.error("Offer fetch error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch offer" }, { status: 500 })
  }
}
