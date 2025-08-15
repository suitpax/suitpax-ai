// Next.js API Route - Flight Search
// Using Domain-Driven Design with clean imports

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { 
  FlightService, 
  FlightSearchParams,
  createFlightService 
} from '@/domains/travel/flights';
import { createDuffelRepository } from '@/infrastructure/duffel/repository.factory';
import { createCacheService } from '@/infrastructure/cache/cache.factory';
import { createAnalyticsService } from '@/infrastructure/analytics/analytics.factory';

// Request validation schema
const searchSchema = z.object({
  origin: z.string().length(3, "Origin must be a valid IATA code"),
  destination: z.string().length(3, "Destination must be a valid IATA code"),
  departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format").optional(),
  passengers: z.object({
    adults: z.number().min(1).max(9),
    children: z.number().min(0).max(8).optional(),
    infantsWithoutSeat: z.number().min(0).max(8).optional(),
    infantsWithSeat: z.number().min(0).max(8).optional(),
  }),
  cabinClass: z.enum(['economy', 'premium_economy', 'business', 'first']).optional(),
  currency: z.string().length(3).optional(),
  maxConnections: z.number().min(0).max(3).optional(),
  sortBy: z.enum([
    'price_asc', 'price_desc', 
    'duration_asc', 'duration_desc',
    'departure_asc', 'departure_desc'
  ]).optional(),
  filters: z.object({
    airlines: z.array(z.string()).optional(),
    maxStops: z.number().min(0).max(3).optional(),
    departureTimeRange: z.object({
      start: z.string().regex(/^\d{2}:\d{2}$/),
      end: z.string().regex(/^\d{2}:\d{2}$/)
    }).optional(),
    arrivalTimeRange: z.object({
      start: z.string().regex(/^\d{2}:\d{2}$/),
      end: z.string().regex(/^\d{2}:\d{2}$/)
    }).optional(),
    price: z.object({
      min: z.number().min(0),
      max: z.number().min(0),
      currency: z.string().length(3)
    }).optional()
  }).optional()
});

// Initialize services (this would typically be done via DI container)
function createFlightServiceInstance(): FlightService {
  const repository = createDuffelRepository();
  const cacheService = createCacheService();
  const analyticsService = createAnalyticsService();
  
  return createFlightService(repository, cacheService, analyticsService);
}

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    // Parse complex objects from query string
    if (queryParams.passengers) {
      queryParams.passengers = JSON.parse(queryParams.passengers);
    }
    if (queryParams.filters) {
      queryParams.filters = JSON.parse(queryParams.filters);
    }

    // Validate request
    const validationResult = searchSchema.safeParse(queryParams);
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors
      }, { status: 400 });
    }

    const searchParams_validated = validationResult.data as FlightSearchParams;

    // Create service instance
    const flightService = createFlightServiceInstance();

    // Search flights
    const result = await flightService.searchFlights(searchParams_validated);

    return NextResponse.json({
      success: true,
      data: result,
      requestId: generateRequestId(),
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Flight search error:', error);

    // Handle known flight errors
    if (error.name === 'FlightError') {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details
      }, { 
        status: getStatusCodeFromError(error.code) 
      });
    }

    // Handle unknown errors
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse JSON body
    const body = await request.json();

    // Validate request
    const validationResult = searchSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors
      }, { status: 400 });
    }

    const searchParams = validationResult.data as FlightSearchParams;

    // Create service instance
    const flightService = createFlightServiceInstance();

    // Search flights
    const result = await flightService.searchFlights(searchParams);

    return NextResponse.json({
      success: true,
      data: result,
      requestId: generateRequestId(),
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Flight search error:', error);

    if (error.name === 'FlightError') {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details
      }, { 
        status: getStatusCodeFromError(error.code) 
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    }, { status: 500 });
  }
}

// Helper functions
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getStatusCodeFromError(errorCode: string): number {
  const statusMap: Record<string, number> = {
    'INVALID_SEARCH_PARAMS': 400,
    'NO_FLIGHTS_FOUND': 404,
    'OFFER_EXPIRED': 410,
    'OFFER_UNAVAILABLE': 409,
    'BOOKING_FAILED': 422,
    'PAYMENT_FAILED': 402,
    'INVALID_PASSENGER_INFO': 400,
    'SEAT_UNAVAILABLE': 409,
    'AIRLINE_ERROR': 502,
    'NETWORK_ERROR': 503,
    'VALIDATION_ERROR': 400,
    'UNAUTHORIZED': 401,
    'RATE_LIMITED': 429,
    'SERVER_ERROR': 500
  };

  return statusMap[errorCode] || 500;
}