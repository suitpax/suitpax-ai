import { NextRequest, NextResponse } from "next/server";
import { createDuffelClient, handleDuffelError } from "@/lib/duffel";
import { z } from "zod";

// Lightweight in-memory cache for recent search results
const serverCache = new Map<string, { data: any; expiresAt: number }>()
const SERVER_CACHE_TTL_MS = 2 * 60 * 1000 // 2 minutes

const searchSchema = z.object({
  origin: z.string().length(3, 'Origin must be a valid 3-letter IATA code'),
  destination: z.string().length(3, 'Destination must be a valid 3-letter IATA code'),
  departure_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  return_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  passengers: z.object({
    adults: z.number().int().min(1).max(9),
    children: z.number().int().min(0).max(8).optional(),
    infants: z.number().int().min(0).max(4).optional(),
  }),
  cabin_class: z.enum(['economy', 'premium_economy', 'business', 'first']).optional(),
  loyalty_programmes: z.array(z.object({ airline_iata_code: z.string().length(2), account_number: z.string().min(3) })).optional(),
  filters: z.object({
    max_connections: z.number().int().min(0).max(3).optional(),
    airlines: z.array(z.string().length(2)).optional(),
    departure_time_window: z.tuple([z.string(), z.string()]).optional(), // [HH:mm, HH:mm]
    arrival_time_window: z.tuple([z.string(), z.string()]).optional(),
    direct_only: z.boolean().optional(),
  }).optional(),
  currency: z.string().length(3).optional(),
  sort_by: z.enum(['price', 'duration', 'relevance']).optional(),
});

function buildCacheKey(body: unknown) {
  return JSON.stringify(body)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const searchParams = searchSchema.parse(body);
    const duffel = createDuffelClient();

    // Server-side cache lookup
    const cacheKey = buildCacheKey({
      origin: searchParams.origin,
      destination: searchParams.destination,
      departure_date: searchParams.departure_date,
      return_date: searchParams.return_date,
      passengers: searchParams.passengers,
      cabin_class: searchParams.cabin_class,
      filters: searchParams.filters,
      currency: searchParams.currency,
      sort_by: searchParams.sort_by,
    })
    const now = Date.now()
    const cached = serverCache.get(cacheKey)
    if (cached && cached.expiresAt > now) {
      return NextResponse.json({ success: true, data: cached.data, cached: true })
    }

    // Validate airport codes in parallel
    const [originCheck, destinationCheck] = await Promise.all([
      validateAirportCode(duffel, searchParams.origin),
      validateAirportCode(duffel, searchParams.destination)
    ]);

    if (!originCheck.valid) {
      return NextResponse.json({
        success: false,
        error: `Invalid origin airport code: ${searchParams.origin}`
      }, { status: 400 });
    }

    if (!destinationCheck.valid) {
      return NextResponse.json({
        success: false,
        error: `Invalid destination airport code: ${searchParams.destination}`
      }, { status: 400 });
    }

    // Slices
    const slices: any[] = [
      {
        origin: searchParams.origin.toUpperCase(),
        destination: searchParams.destination.toUpperCase(),
        departure_date: searchParams.departure_date,
      }
    ];

    if (searchParams.return_date) {
      slices.push({
        origin: searchParams.destination.toUpperCase(),
        destination: searchParams.origin.toUpperCase(),
        departure_date: searchParams.return_date,
      });
    }

    // Passengers with optional loyalty
    const passengers: any[] = [];
    const addLoyalty = (p: any) => {
      if (searchParams.loyalty_programmes && searchParams.loyalty_programmes.length > 0) {
        p.loyalty_programme_accounts = searchParams.loyalty_programmes.map(lp => ({
          airline_iata_code: lp.airline_iata_code,
          account_number: lp.account_number,
        }))
      }
      return p
    }

    for (let i = 0; i < searchParams.passengers.adults; i++) {
      passengers.push(addLoyalty({ type: 'adult' }))
    }
    if (searchParams.passengers.children) {
      for (let i = 0; i < searchParams.passengers.children; i++) {
        passengers.push(addLoyalty({ type: 'child' }))
      }
    }
    if (searchParams.passengers.infants) {
      for (let i = 0; i < searchParams.passengers.infants; i++) {
        passengers.push({ type: 'infant_without_seat' })
      }
    }

    const maxConnections = searchParams.filters?.direct_only
      ? 0
      : (typeof searchParams.filters?.max_connections === 'number' ? searchParams.filters!.max_connections : 2)

    const offerRequestData: any = {
      slices,
      passengers,
      cabin_class: searchParams.cabin_class || 'economy',
      max_connections: maxConnections,
      // currency not always supported on request; we return amounts as provided by Duffel
    };

    const offerRequest = await duffel.offerRequests.create(offerRequestData);

    const rawOffers = offerRequest?.data?.offers || []

    // Process offers
    let offers = rawOffers.map((offer: any) => ({
      id: offer.id,
      total_amount: offer.total_amount,
      total_currency: offer.total_currency,
      expires_at: offer.expires_at,
      owner: offer.owner,
      slices: offer.slices.map((slice: any) => ({
        id: slice.id,
        origin: slice.origin,
        destination: slice.destination,
        duration: slice.duration,
        segments: slice.segments.map((segment: any) => ({
          id: segment.id,
          origin: segment.origin,
          destination: segment.destination,
          departing_at: segment.departing_at,
          arriving_at: segment.arriving_at,
          marketing_carrier: segment.marketing_carrier,
          operating_carrier: segment.operating_carrier,
          flight_number: segment.flight_number,
          aircraft: segment.aircraft,
        }))
      })),
      passengers: offer.passengers,
      conditions: offer.conditions
    }))

    // Apply advanced filters (post-processing)
    const filters = searchParams.filters
    if (filters) {
      if (filters.airlines && filters.airlines.length > 0) {
        offers = offers.filter((offer: any) =>
          offer.slices.every((s: any) => s.segments.every((seg: any) =>
            filters.airlines!.includes(seg.marketing_carrier?.iata_code)
          ))
        )
      }

      const withinWindow = (dt: string, window?: [string, string]) => {
        if (!window) return true
        const date = new Date(dt)
        const hours = date.getUTCHours()
        const minutes = date.getUTCMinutes()
        const toMinutes = (hhmm: string) => {
          const [h, m] = hhmm.split(':').map(Number)
          return h * 60 + m
        }
        const t = hours * 60 + minutes
        const [start, end] = window
        return t >= toMinutes(start) && t <= toMinutes(end)
      }

      if (filters.departure_time_window) {
        offers = offers.filter((offer: any) =>
          offer.slices.every((s: any) =>
            withinWindow(s.segments[0]?.departing_at, filters.departure_time_window)
          )
        )
      }

      if (filters.arrival_time_window) {
        offers = offers.filter((offer: any) =>
          offer.slices.every((s: any) =>
            withinWindow(s.segments[s.segments.length - 1]?.arriving_at, filters.arrival_time_window)
          )
        )
      }

      if (filters.direct_only) {
        offers = offers.filter((offer: any) =>
          offer.slices.every((s: any) => s.segments.length === 1)
        )
      }
    }

    // Sorting
    const sortBy = searchParams.sort_by || 'price'
    if (sortBy === 'price') {
      offers.sort((a: any, b: any) => parseFloat(a.total_amount) - parseFloat(b.total_amount))
    } else if (sortBy === 'duration') {
      const sliceDuration = (s: any) => {
        // ISO 8601 duration e.g., PT2H30M
        const m = /PT(?:(\d+)H)?(?:(\d+)M)?/.exec(s.duration || '')
        const h = m?.[1] ? parseInt(m[1]) : 0
        const mins = m?.[2] ? parseInt(m[2]) : 0
        return h * 60 + mins
      }
      offers.sort((a: any, b: any) =>
        a.slices.reduce((acc: number, s: any) => acc + sliceDuration(s), 0) -
        b.slices.reduce((acc: number, s: any) => acc + sliceDuration(s), 0)
      )
    }

    const response = {
      id: offerRequest.data.id,
      offers,
      search_criteria: searchParams,
    }

    // Save to server cache
    serverCache.set(cacheKey, { data: response, expiresAt: now + SERVER_CACHE_TTL_MS })

    return NextResponse.json({ success: true, data: response })

  } catch (error) {
    console.error("Flight search error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid search parameters',
        details: error.errors
      }, { status: 400 });
    }

    const errorResponse = handleDuffelError(error);
    return NextResponse.json(errorResponse, { 
      status: errorResponse.status || 500 
    });
  }
}

async function validateAirportCode(duffel: any, iataCode: string) {
  try {
    const response = await duffel.airports.list({
      iata_code: iataCode,
      limit: 1
    });

    return {
      valid: response.data && response.data.length > 0,
      airport: response.data?.[0] || null
    };
  } catch (error) {
    console.error(`Error validating airport ${iataCode}:`, error);
    return { valid: false, airport: null };
  }
}