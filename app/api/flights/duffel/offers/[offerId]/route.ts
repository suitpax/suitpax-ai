import { type NextRequest, NextResponse } from "next/server"
import { createDuffelClient, getAirlineData, handleDuffelError, processConditions, processStops } from "@/lib/duffel"

export async function GET(_req: NextRequest, { params }: { params: { offerId: string } }) {
  try {
    const duffel = createDuffelClient()

    const res = await duffel.offers.get(params.offerId)
    const raw = res.data

    const now = new Date()
    const expiresAt = new Date(raw.expires_at)
    const isExpired = expiresAt <= now
    const timeUntilExpiry = expiresAt.getTime() - now.getTime()
    const minutesUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60))

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
        } catch (e) {
          console.warn(`Failed to fetch airline data for ${code}:`, e)
        }
      }),
    )

    const ownerCode = raw.owner?.iata_code || ""

    const offer = {
      id: raw.id,
      total_amount: raw.total_amount,
      total_currency: raw.total_currency,
      base_amount: raw.base_amount,
      base_currency: raw.base_currency,
      tax_amount: raw.tax_amount,
      tax_currency: raw.tax_currency,
      expires_at: raw.expires_at,
      expired: isExpired,
      minutes_until_expiry: isExpired ? 0 : minutesUntilExpiry,
      urgency_level: minutesUntilExpiry < 30 ? "critical" : minutesUntilExpiry < 60 ? "high" : "normal",
      owner: {
        ...raw.owner,
        logo_lockup_url: ownerCode ? carrierCodeToAirline[ownerCode]?.logo_lockup_url : undefined,
        logo_symbol_url: ownerCode ? carrierCodeToAirline[ownerCode]?.logo_symbol_url : undefined,
      },
      slices: processStops(
        (raw.slices || []).map((slice: any) => ({
          id: slice.id,
          origin: slice.origin,
          destination: slice.destination,
          duration: slice.duration,
          departure_date: slice.segments?.[0]?.departing_at?.split("T")[0],
          arrival_date: slice.segments?.[slice.segments.length - 1]?.arriving_at?.split("T")[0],
          segments: (slice.segments || []).map((segment: any) => {
            const airlineInfo = carrierCodeToAirline[segment?.marketing_carrier?.iata_code || ""]
            return {
              id: segment.id,
              origin: segment.origin,
              destination: segment.destination,
              departing_at: segment.departing_at,
              arriving_at: segment.arriving_at,
              duration: segment.duration,
              marketing_carrier: segment.marketing_carrier,
              operating_carrier: segment.operating_carrier,
              aircraft: segment.aircraft,
              flight_number: segment.flight_number,
              airline: airlineInfo
                ? {
                    name: airlineInfo.name,
                    logo_symbol_url: airlineInfo.logo_symbol_url,
                    logo_lockup_url: airlineInfo.logo_lockup_url,
                  }
                : {
                    name: segment.marketing_carrier?.name || "Unknown Airline",
                  },
              cabin_class: segment.cabin_class,
              fare_basis_code: segment.fare_basis_code,
              booking_class: segment.booking_class,
            }
          }),
        })),
      ),
      passengers: raw.passengers,
      conditions: processConditions(raw.conditions),
      available_services: raw.available_services || [],
      payment_requirements: raw.payment_requirements || {},
      booking_requirements: raw.booking_requirements || {},
      pricing: {
        base_amount: raw.base_amount,
        tax_amount: raw.tax_amount,
        total_amount: raw.total_amount,
        currency: raw.total_currency,
        breakdown: raw.tax_breakdown || [],
      },
    }

    const response: any = { success: true, offer }

    if (minutesUntilExpiry < 60 && !isExpired) {
      response.warning = `This offer expires in ${minutesUntilExpiry} minutes. Please complete your booking soon.`
    }

    if (isExpired) {
      response.error = "This offer has expired. Please search for new flights."
      response.expired = true
      return NextResponse.json(response, { status: 410 }) // Gone
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error("Offer fetch error:", error)

    const errorResponse = handleDuffelError(error)
    return NextResponse.json(errorResponse, {
      status: errorResponse.status || 500,
    })
  }
}
