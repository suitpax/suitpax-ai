import { NextRequest, NextResponse } from "next/server";
import { createDuffelClient, handleDuffelError } from "@/lib/duffel-config";

export async function POST(req: NextRequest) {
  try {
    const duffel = createDuffelClient();
    const params = await req.json();

    // Validaciones
    if (!params.origin || !params.destination || !params.departureDate) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields",
        offers: []
      }, { status: 400 });
    }

    // Construir slices para Duffel
    const slices = [
      {
        origin: params.origin,
        destination: params.destination,
        departure_date: params.departureDate,
      }
    ];

    // Si es round trip, agregar vuelo de regreso
    if (params.tripType === 'round_trip' && params.returnDate) {
      slices.push({
        origin: params.destination,
        destination: params.origin,
        departure_date: params.returnDate,
      });
    }

    // Crear pasajeros
    const passengers = Array(params.passengers || 1).fill({ type: "adult" });

    // Realizar búsqueda en Duffel
    const offerRequest = await duffel.offerRequests.create({
      slices,
      passengers,
      cabin_class: params.cabinClass || "economy",
      max_connections: 2
    });

    return NextResponse.json({
      success: true,
      offers: offerRequest.data.offers || [],
      providers: ['duffel'],
      total_offers: offerRequest.data.offers?.length || 0,
      request_id: offerRequest.data.id
    });

  } catch (error) {
    console.error("Flight search error:", error);
    const errorResponse = handleDuffelError(error);
    return NextResponse.json({
      success: false,
      error: errorResponse.error || "Failed to search flights",
      offers: [],
      status: errorResponse.status
    }, { status: errorResponse.status || 500 });
  }
}