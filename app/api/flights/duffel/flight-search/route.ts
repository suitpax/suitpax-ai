import { NextRequest, NextResponse } from "next/server";
import { createDuffelClient, handleDuffelError } from "@/lib/duffel";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

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
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Search request body:', body);
    
    const searchParams = searchSchema.parse(body);
    const duffel = createDuffelClient();
    
    // Validar códigos de aeropuerto
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
    
    // Preparar slices
    const slices = [
      {
        origin: searchParams.origin,
        destination: searchParams.destination,
        departure_date: searchParams.departure_date,
      }
    ];
    
    if (searchParams.return_date) {
      slices.push({
        origin: searchParams.destination,
        destination: searchParams.origin,
        departure_date: searchParams.return_date,
      });
    }
    
    // Preparar pasajeros correctamente para Duffel
    const passengers = [];
    
    // Adultos
    for (let i = 0; i < searchParams.passengers.adults; i++) {
      passengers.push({ type: 'adult' });
    }
    
    // Niños
    if (searchParams.passengers.children) {
      for (let i = 0; i < searchParams.passengers.children; i++) {
        passengers.push({ type: 'child' });
      }
    }
    
    // Bebés
    if (searchParams.passengers.infants) {
      for (let i = 0; i < searchParams.passengers.infants; i++) {
        passengers.push({ type: 'infant_without_seat' });
      }
    }
    
    // Configuración de búsqueda para Duffel
    const offerRequestData = {
      slices,
      passengers,
      cabin_class: searchParams.cabin_class || 'economy',
      max_connections: 2,
    };
    
    console.log('Duffel request:', JSON.stringify(offerRequestData, null, 2));
    
    // Realizar búsqueda
    const offerRequest = await duffel.offerRequests.create(offerRequestData);
    
    if (!offerRequest?.data?.offers) {
      return NextResponse.json({
        success: true,
        data: {
          offers: [],
          message: "No flights found for the selected criteria"
        }
      });
    }
    
    // Procesar ofertas
    const offers = offerRequest.data.offers.map(offer => ({
      id: offer.id,
      total_amount: offer.total_amount,
      total_currency: offer.total_currency,
      expires_at: offer.expires_at,
      slices: offer.slices.map(slice => ({
        id: slice.id,
        origin: slice.origin,
        destination: slice.destination,
        duration: slice.duration,
        segments: slice.segments.map(segment => ({
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
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        id: offerRequest.data.id,
        offers,
        search_criteria: searchParams
      }
    });
    
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