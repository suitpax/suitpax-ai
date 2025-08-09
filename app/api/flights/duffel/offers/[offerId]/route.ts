import { NextRequest, NextResponse } from "next/server"
import { createDuffelClient, handleDuffelError } from '@/lib/duffel';

export async function GET(
  request: NextRequest,
  { params }: { params: { offerId: string } }
) {
  try {
    const duffel = createDuffelClient()
    const { offerId } = params

    if (!offerId) {
      return NextResponse.json({ success: false, error: "Offer ID is required" }, { status: 400 })
    }

    // Best practice: retrieve the offer again to get the latest price
    const offerResponse = await duffel.offers.get(offerId)

    if (!offerResponse.data) {
      return NextResponse.json({ success: false, error: "Offer not found or has expired" }, { status: 404 })
    }

    const offer = offerResponse.data as any

    // Enrich with airline logos
    const carrierCodes = new Set<string>()
    for (const slice of offer.slices || []) {
      for (const segment of slice.segments || []) {
        if (segment?.marketing_carrier?.iata_code) {
          carrierCodes.add(segment.marketing_carrier.iata_code)
        }
      }
    }

    const { getAirlineData } = await import('@/lib/duffel')
    const codeToAirline: Record<string, any> = {}
    await Promise.all(Array.from(carrierCodes).map(async (code) => {
      try {
        const airline = await getAirlineData(duffel as any, code)
        if (airline) codeToAirline[code] = airline
      } catch {}
    }))

    const enriched = {
      ...offer,
      owner: {
        ...offer.owner,
        logo_lockup_url: codeToAirline[offer.owner?.iata_code]?.logo_lockup_url,
        logo_symbol_url: codeToAirline[offer.owner?.iata_code]?.logo_symbol_url,
      },
      slices: offer.slices.map((slice: any) => ({
        ...slice,
        segments: slice.segments.map((segment: any) => {
          const info = codeToAirline[segment?.marketing_carrier?.iata_code]
          return {
            ...segment,
            airline: info ? { name: info.name, logo_symbol_url: info.logo_symbol_url, logo_lockup_url: info.logo_lockup_url } : { name: segment.marketing_carrier?.name }
          }
        })
      }))
    }

    return NextResponse.json({ success: true, offer: enriched })
  } catch (error) {
    const errorResponse = handleDuffelError(error)
    return NextResponse.json(errorResponse, { status: errorResponse.status })
  }
}
