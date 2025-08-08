import { NextRequest, NextResponse } from 'next/server'
import { duffel } from '@/lib/duffel'
import { z } from 'zod'

const searchSchema = z.object({
  origin: z.string().length(3),
  destination: z.string().length(3),
  departure_date: z.string().regex(/^d{4}-d{2}-d{2}$/),
  return_date: z.string().regex(/^d{4}-d{2}-d{2}$/).optional(),
  passengers: z.object({
    adults: z.number().min(1).max(9),
    children: z.number().min(0).max(8).optional(),
    infants: z.number().min(0).max(2).optional(),
  }),
  cabin_class: z.enum(['economy', 'premium_economy', 'business', 'first']).optional(),
})

const airlineCache = new Map<string, any>()

async function getAirlineData(iataCode: string) {
  if (airlineCache.has(iataCode)) {
    return airlineCache.get(iataCode)
  }

  try {
    const airlines = await duffel.airlines.list({ 
      iata_code: iataCode 
    })
    
    if (airlines.data.length > 0) {
      const airlineData = {
        id: airlines.data[0].id,
        name: airlines.data[0].name,
        iata_code: airlines.data[0].iata_code,
        logo_lockup_url: airlines.data[0].logo_lockup_url,
        logo_symbol_url: airlines.data[0].logo_symbol_url,
      }
      airlineCache.set(iataCode, airlineData)
      return airlineData
    }
  } catch (error) {
    console.error(`Error fetching airline ${iataCode}:`, error)
  }
  
  return null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = searchSchema.parse(body)

    const slices = [
      {
        origin: searchParams.origin,
        destination: searchParams.destination,
        departure_date: searchParams.departure_date,
      }
    ]

    if (searchParams.return_date) {
      slices.push({
        origin: searchParams.destination,
        destination: searchParams.origin,
        departure_date: searchParams.return_date,
      })
    }

    const passengers = []
    
    for (let i = 0; i < searchParams.passengers.adults; i++) {
      passengers.push({ type: 'adult' as const })
    }
    
    if (searchParams.passengers.children) {
      for (let i = 0; i < searchParams.passengers.children; i++) {
        passengers.push({ type: 'child' as const })
      }
    }
    
    if (searchParams.passengers.infants) {
      for (let i = 0; i < searchParams.passengers.infants; i++) {
        passengers.push({ type: 'infant_without_seat' as const })
      }
    }

    const offerRequest = await duffel.offerRequests.create({
      slices,
      passengers,
      cabin_class: searchParams.cabin_class || 'economy',
      return_offers: true,
    })

    const enrichedOffers = await Promise.all(
      offerRequest.data.offers.map(async (offer: any) => {
        const airlineCodes = new Set<string>()
        
        offer.slices.forEach((slice: any) => {
          slice.segments.forEach((segment: any) => {
            if (segment.marketing_carrier?.iata_code) {
              airlineCodes.add(segment.marketing_carrier.iata_code)
            }
            if (segment.operating_carrier?.iata_code) {
              airlineCodes.add(segment.operating_carrier.iata_code)
            }
          })
        })

        const airlinePromises = Array.from(airlineCodes).map(code => 
          getAirlineData(code)
        )
        
        const airlineData = await Promise.all(airlinePromises)
        const airlineMap = new Map()
        
        airlineData.forEach((data, index) => {
          if (data) {
            airlineMap.set(Array.from(airlineCodes)[index], data)
          }
        })

        const enrichedSlices = offer.slices.map((slice: any) => ({
          ...slice,
          segments: slice.segments.map((segment: any) => ({
            ...segment,
            marketing_carrier: segment.marketing_carrier ? {
              ...segment.marketing_carrier,
              ...airlineMap.get(segment.marketing_carrier.iata_code)
            } : segment.marketing_carrier,
            operating_carrier: segment.operating_carrier ? {
              ...segment.operating_carrier,
              ...airlineMap.get(segment.operating_carrier.iata_code)
            } : segment.operating_carrier,
          }))
        }))

        return {
          ...offer,
          slices: enrichedSlices,
          primary_airline: airlineMap.get(
            offer.slices[0]?.segments[0]?.marketing_carrier?.iata_code
          ),
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        id: offerRequest.data.id,
        slices: offerRequest.data.slices,
        passengers: offerRequest.data.passengers,
        offers: enrichedOffers,
      }
    })

  } catch (error) {
    console.error('Flight search error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to search flights' },
      { status: 500 }
    )
  }
}