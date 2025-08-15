import { NextRequest, NextResponse } from "next/server";
import { createDuffelClient, handleDuffelError } from "@/lib/duffel";
import { z } from "zod";

// Lightweight in-memory cache for recent search results
const serverCache = new Map<string, { data: any; expiresAt: number }>()
const SERVER_CACHE_TTL_MS = 2 * 60 * 1000 // 2 minutes

const searchSchema = z.object({
  origin: z.string().length(3, 'Origin must be a valid 3-letter IATA code'),
  destination: z.string().length(3, 'Destination must be different from origin'),
  departure_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  return_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  passengers: z.object({
    adults: z.number().int().min(1, 'At least 1 adult required').max(9, 'Maximum 9 adults'),
    children: z.number().int().min(0).max(8, 'Maximum 8 children').optional(),
    infants: z.number().int().min(0).max(4, 'Maximum 4 infants').optional(),
  }),
  cabin_class: z.enum(['economy', 'premium_economy', 'business', 'first']).optional(),
  loyalty_programmes: z.array(z.object({ 
    airline_iata_code: z.string().length(2), 
    account_number: z.string().min(3) 
  })).optional(),
  filters: z.object({
    max_connections: z.number().int().min(0).max(3).optional(),
    airlines: z.array(z.string().length(2)).optional(),
    departure_time_window: z.tuple([z.string(), z.string()]).optional(),
    arrival_time_window: z.tuple([z.string(), z.string()]).optional(),
    direct_only: z.boolean().optional(),
  }).optional(),
  currency: z.string().length(3).optional(),
  sort_by: z.enum(['price', 'duration', 'relevance']).optional(),
}).refine((data) => data.origin !== data.destination, {
  message: "Origin and destination must be different",
  path: ["destination"],
}).refine((data) => {
  // Validate infants don't exceed adults
  const infants = data.passengers.infants || 0;
  return infants <= data.passengers.adults;
}, {
  message: "Number of infants cannot exceed number of adults",
  path: ["passengers", "infants"],
}).refine((data) => {
  // Validate dates
  if (data.return_date && data.departure_date) {
    return new Date(data.return_date) > new Date(data.departure_date);
  }
  return true;
}, {
  message: "Return date must be after departure date",
  path: ["return_date"],
});

function buildCacheKey(body: any) {
  const normalizedBody = {
    ...body,
    // Normalize optional fields for consistent caching
    passengers: {
      adults: body.passengers.adults,
      children: body.passengers.children || 0,
      infants: body.passengers.infants || 0,
    },
    cabin_class: body.cabin_class || 'economy',
    sort_by: body.sort_by || 'price'
  };
  return JSON.stringify(normalizedBody);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Flight search request:', body);

    // Validate input
    const searchParams = searchSchema.parse(body);
    console.log('Validated search params:', searchParams);

    const duffel = createDuffelClient();

    // Server-side cache lookup
    const cacheKey = buildCacheKey(searchParams);
    const now = Date.now();
    const cached = serverCache.get(cacheKey);
    
    if (cached && cached.expiresAt > now) {
      console.log('Returning cached results');
      return NextResponse.json({ 
        success: true, 
        data: cached.data, 
        cached: true 
      });
    }

    // Validate airport codes in parallel
    console.log('Validating airport codes...');
    const [originCheck, destinationCheck] = await Promise.all([
      validatePlaceCode(duffel, searchParams.origin),
      validatePlaceCode(duffel, searchParams.destination)
    ]);

    if (!originCheck.valid) {
      return NextResponse.json({
        success: false,
        error: `Invalid origin airport code: ${searchParams.origin}. Please use a valid 3-letter IATA code.`
      }, { status: 400 });
    }

    if (!destinationCheck.valid) {
      return NextResponse.json({
        success: false,
        error: `Invalid destination airport code: ${searchParams.destination}. Please use a valid 3-letter IATA code.`
      }, { status: 400 });
    }

    console.log('Airport codes validated successfully');

    // Build slices
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

    // Build passengers array
    const passengers: any[] = [];
    
    // Add adults
    for (let i = 0; i < searchParams.passengers.adults; i++) {
      const passenger: any = { type: 'adult' };
      
      // Add loyalty programmes if provided
      if (searchParams.loyalty_programmes && searchParams.loyalty_programmes.length > 0) {
        passenger.loyalty_programme_accounts = searchParams.loyalty_programmes;
      }
      
      passengers.push(passenger);
    }
    
    // Add children
    if (searchParams.passengers.children) {
      for (let i = 0; i < searchParams.passengers.children; i++) {
        passengers.push({ type: 'child' });
      }
    }
    
    // Add infants
    if (searchParams.passengers.infants) {
      for (let i = 0; i < searchParams.passengers.infants; i++) {
        passengers.push({ type: 'infant_without_seat' });
      }
    }

    // Determine max connections
    const maxConnections = searchParams.filters?.direct_only
      ? 0
      : (searchParams.filters?.max_connections ?? 2);

    // Build offer request
    const offerRequestData: any = {
      slices,
      passengers,
      cabin_class: searchParams.cabin_class || 'economy',
      max_connections: maxConnections,
    };

    console.log('Creating offer request with Duffel...');
    console.log('Offer request data:', JSON.stringify(offerRequestData, null, 2));

    // Create offer request with Duffel
    const offerRequest = await duffel.offerRequests.create(offerRequestData);
    console.log('Duffel offer request created:', offerRequest.data.id);

    const rawOffers = offerRequest?.data?.offers || [];
    console.log(`Received ${rawOffers.length} offers from Duffel`);

    // Collect unique marketing carrier IATA codes
    const uniqueCarrierCodes = new Set<string>();
    for (const offer of rawOffers) {
      for (const slice of offer.slices || []) {
        for (const segment of slice.segments || []) {
          if (segment?.marketing_carrier?.iata_code) {
            uniqueCarrierCodes.add(segment.marketing_carrier.iata_code);
          }
        }
      }
    }

    // Fetch airline data with caching
    const carrierCodeToAirline: Record<string, any> = {};
    try {
      await Promise.all(
        Array.from(uniqueCarrierCodes).map(async (code) => {
          try {
            const airline = await (await import('@/lib/duffel')).getAirlineData(duffel as any, code);
            if (airline) carrierCodeToAirline[code] = airline;
          } catch (e) {
            console.warn('Failed to fetch airline data for', code, e);
          }
        })
      );
    } catch (e) {
      console.warn('Airline enrichment failed:', e);
    }

    // Process and filter offers
    let offers = rawOffers.map((offer: any) => ({
      id: offer.id,
      total_amount: offer.total_amount,
      total_currency: offer.total_currency,
      expires_at: offer.expires_at,
      owner: {
        ...offer.owner,
        logo_lockup_url: carrierCodeToAirline[offer.owner?.iata_code]?.logo_lockup_url,
        logo_symbol_url: carrierCodeToAirline[offer.owner?.iata_code]?.logo_symbol_url,
      },
      slices: offer.slices.map((slice: any) => ({
        id: slice.id,
        origin: slice.origin,
        destination: slice.destination,
        duration: slice.duration,
        segments: slice.segments.map((segment: any) => {
          const airlineInfo = carrierCodeToAirline[segment?.marketing_carrier?.iata_code];
          return ({
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
          })
        })
      })),
      passengers: offer.passengers,
      conditions: offer.conditions
    }));

    // Apply filters
    if (searchParams.filters) {
      const filters = searchParams.filters;
      
      // Filter by airlines
      if (filters.airlines && filters.airlines.length > 0) {
        offers = offers.filter((offer: any) =>
          offer.slices.every((slice: any) => 
            slice.segments.some((segment: any) =>
              filters.airlines!.includes(segment.marketing_carrier?.iata_code)
            )
          )
        );
      }

      // Filter by time windows
      const withinTimeWindow = (dateTime: string, window?: [string, string]) => {
        if (!window) return true;
        const date = new Date(dateTime);
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const totalMinutes = hours * 60 + minutes;
        
        const [startTime, endTime] = window;
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        
        return totalMinutes >= startMinutes && totalMinutes <= endMinutes;
      };

      if (filters.departure_time_window) {
        offers = offers.filter((offer: any) =>
          offer.slices.every((slice: any) =>
            withinTimeWindow(slice.segments[0]?.departing_at, filters.departure_time_window)
          )
        );
      }

      if (filters.arrival_time_window) {
        offers = offers.filter((offer: any) =>
          offer.slices.every((slice: any) =>
            withinTimeWindow(
              slice.segments[slice.segments.length - 1]?.arriving_at, 
              filters.arrival_time_window
            )
          )
        );
      }

      // Filter direct flights only
      if (filters.direct_only) {
        offers = offers.filter((offer: any) =>
          offer.slices.every((slice: any) => slice.segments.length === 1)
        );
      }
    }

    // Apply sorting
    const sortBy = searchParams.sort_by || 'price';
    if (sortBy === 'price') {
      offers.sort((a: any, b: any) => parseFloat(a.total_amount) - parseFloat(b.total_amount));
    } else if (sortBy === 'duration') {
      const getTotalDuration = (slices: any[]) => {
        return slices.reduce((total, slice) => {
          const match = slice.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
          const hours = match?.[1] ? parseInt(match[1]) : 0;
          const minutes = match?.[2] ? parseInt(match[2]) : 0;
          return total + (hours * 60 + minutes);
        }, 0);
      };
      
      offers.sort((a: any, b: any) => 
        getTotalDuration(a.slices) - getTotalDuration(b.slices)
      );
    }

    const response = {
      id: offerRequest.data.id,
      offers,
      search_criteria: searchParams,
    };

    // Cache the results
    serverCache.set(cacheKey, { 
      data: response, 
      expiresAt: now + SERVER_CACHE_TTL_MS 
    });

    console.log(`Search completed successfully with ${offers.length} offers`);

    return NextResponse.json({ 
      success: true, 
      data: response 
    });

  } catch (error) {
    console.error("Flight search error:", error);

    if (error instanceof z.ZodError) {
      console.log("Validation errors:", error.errors);
      return NextResponse.json({
        success: false,
        error: 'Invalid search parameters',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 });
    }

    // Handle Duffel-specific errors
    if (error && typeof error === 'object' && 'message' in error) {
      const errorMessage = (error as Error).message;
      
      if (errorMessage.includes('airport')) {
        return NextResponse.json({
          success: false,
          error: 'Invalid airport code. Please check your origin and destination airports.'
        }, { status: 400 });
      }
      
      if (errorMessage.includes('date')) {
        return NextResponse.json({
          success: false,
          error: 'Invalid date. Please check your departure and return dates.'
        }, { status: 400 });
      }
    }

    const errorResponse = handleDuffelError(error);
    return NextResponse.json(errorResponse, { 
      status: errorResponse.status || 500 
    });
  }
}

async function validatePlaceCode(duffel: any, iataCode: string) {
  const code = iataCode.toUpperCase()
  try {
    // Try airport first
    const airportRes = await duffel.airports.list({ iata_code: code, limit: 1 })
    if (airportRes.data && airportRes.data.length > 0) {
      console.log(`Place validation for ${code}: valid airport`)
      return { valid: true, type: 'airport', place: airportRes.data[0] }
    }
    // Then try city
    const cityRes = await duffel.cities.list({ iata_code: code, limit: 1 })
    if (cityRes.data && cityRes.data.length > 0) {
      console.log(`Place validation for ${code}: valid city`)
      return { valid: true, type: 'city', place: cityRes.data[0] }
    }
    console.log(`Place validation for ${code}: invalid`)
    return { valid: false, type: null, place: null }
  } catch (error) {
    console.error(`Error validating place ${code}:`, error)
    return { valid: false, type: null, place: null }
  }
}
