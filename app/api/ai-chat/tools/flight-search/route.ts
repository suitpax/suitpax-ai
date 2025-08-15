import { type NextRequest, NextResponse } from "next/server"
import { createDuffelClient } from "@/lib/duffel"
import { z } from "zod"

const flightSearchSchema = z.object({
  query: z.string().min(1),
  origin: z.string().length(3).optional(),
  destination: z.string().length(3).optional(),
  departure_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  return_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  passengers: z
    .object({
      adults: z.number().int().min(1).max(9).default(1),
      children: z.number().int().min(0).max(8).default(0),
      infants: z.number().int().min(0).max(4).default(0),
    })
    .optional(),
})

function extractFlightParams(query: string) {
  const params: any = {
    passengers: { adults: 1, children: 0, infants: 0 },
  }

  // Extract airport codes (3-letter IATA codes)
  const airportCodes = query.match(/\b[A-Z]{3}\b/g) || []
  if (airportCodes.length >= 2) {
    params.origin = airportCodes[0]
    params.destination = airportCodes[1]
  }

  // Extract dates (various formats)
  const datePatterns = [/\b(\d{4}-\d{2}-\d{2})\b/g, /\b(\d{1,2}\/\d{1,2}\/\d{4})\b/g, /\b(\d{1,2}-\d{1,2}-\d{4})\b/g]

  for (const pattern of datePatterns) {
    const matches = query.match(pattern)
    if (matches) {
      const date = new Date(matches[0])
      if (!isNaN(date.getTime())) {
        if (!params.departure_date) {
          params.departure_date = date.toISOString().split("T")[0]
        } else if (!params.return_date) {
          params.return_date = date.toISOString().split("T")[0]
        }
      }
    }
  }

  // If no dates found, use tomorrow as default
  if (!params.departure_date) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    params.departure_date = tomorrow.toISOString().split("T")[0]
  }

  // Extract passenger count
  const passengerMatch = query.match(/(\d+)\s*(passenger|adult|person)/i)
  if (passengerMatch) {
    params.passengers.adults = Number.parseInt(passengerMatch[1])
  }

  return params
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = flightSearchSchema.parse(body)

    const flightParams = extractFlightParams(query)

    if (!flightParams.origin || !flightParams.destination) {
      return NextResponse.json({
        success: false,
        error: "Could not extract origin and destination from query. Please specify airport codes (e.g., 'MAD to NYC')",
        offers: [],
      })
    }

    const duffel = createDuffelClient()

    // Build slices for the search
    const slices = [
      {
        origin: flightParams.origin,
        destination: flightParams.destination,
        departure_date: flightParams.departure_date,
      },
    ]

    if (flightParams.return_date) {
      slices.push({
        origin: flightParams.destination,
        destination: flightParams.origin,
        departure_date: flightParams.return_date,
      })
    }

    // Build passengers array
    const passengers = []
    for (let i = 0; i < flightParams.passengers.adults; i++) {
      passengers.push({ type: "adult" })
    }
    for (let i = 0; i < flightParams.passengers.children; i++) {
      passengers.push({ type: "child" })
    }
    for (let i = 0; i < flightParams.passengers.infants; i++) {
      passengers.push({ type: "infant_without_seat" })
    }

    const offerRequest = await duffel.offerRequests.create({
      slices,
      passengers,
      cabin_class: "economy",
      max_connections: 2,
    })

    const rawOffers = offerRequest?.data?.offers || []

    const offers = await Promise.all(
      rawOffers.slice(0, 5).map(async (offer: any) => {
        // Get airline logo
        let airlineLogo = null
        try {
          const airlineCode = offer.owner?.iata_code
          if (airlineCode) {
            const airlineData = await (await import("@/lib/duffel")).getAirlineData(duffel, airlineCode)
            airlineLogo = airlineData?.logo_symbol_url || airlineData?.logo_lockup_url
          }
        } catch (e) {
          console.warn("Failed to fetch airline logo:", e)
        }

        return {
          id: offer.id,
          price: Number.parseFloat(offer.total_amount),
          currency: offer.total_currency,
          airline: {
            name: offer.owner?.name || "Unknown Airline",
            code: offer.owner?.iata_code || "",
            logo: airlineLogo,
          },
          route: {
            origin: offer.slices[0]?.origin?.iata_code || flightParams.origin,
            destination: offer.slices[0]?.destination?.iata_code || flightParams.destination,
            departure_time: offer.slices[0]?.segments[0]?.departing_at,
            arrival_time: offer.slices[0]?.segments[offer.slices[0].segments.length - 1]?.arriving_at,
            duration: offer.slices[0]?.duration,
            stops: offer.slices[0]?.segments?.length - 1 || 0,
          },
          return_route: offer.slices[1]
            ? {
                origin: offer.slices[1]?.origin?.iata_code,
                destination: offer.slices[1]?.destination?.iata_code,
                departure_time: offer.slices[1]?.segments[0]?.departing_at,
                arrival_time: offer.slices[1]?.segments[offer.slices[1].segments.length - 1]?.arriving_at,
                duration: offer.slices[1]?.duration,
                stops: offer.slices[1]?.segments?.length - 1 || 0,
              }
            : null,
          booking_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/flights/book/${offer.id}`,
        }
      }),
    )

    return NextResponse.json({
      success: true,
      offers,
      search_params: flightParams,
    })
  } catch (error) {
    console.error("Flight search tool error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid search parameters",
          offers: [],
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to search flights. Please try again.",
        offers: [],
      },
      { status: 500 },
    )
  }
}
