import { NextRequest, NextResponse } from "next/server"
import { createDuffelClient, handleDuffelError } from "@/lib/duffel-config"

export async function POST(request: NextRequest) {
  try {
    const duffel = createDuffelClient();
    
    const {
      origin,
      destination,
      departureDate,
      returnDate,
      passengers,
      cabinClass
    } = await request.json()

    // Validaciones mejoradas
    if (!origin || !destination || !departureDate || !passengers) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields: origin, destination, departureDate, passengers"
      }, { status: 400 })
    }

    // Validar códigos IATA
    if (origin.length !== 3 || destination.length !== 3) {
      return NextResponse.json({
        success: false,
        error: "Origin and destination must be valid 3-letter IATA codes"
      }, { status: 400 })
    }

    // Validar fechas
    const departure = new Date(departureDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (departure < today) {
      return NextResponse.json({
        success: false,
        error: "Departure date cannot be in the past"
      }, { status: 400 })
    }

    if (returnDate) {
      const returnDateObj = new Date(returnDate)
      if (returnDateObj <= departure) {
        return NextResponse.json({
          success: false,
          error: "Return date must be after departure date"
        }, { status: 400 })
      }
    }

    // Construir slices
    const slices = [
      {
        origin,
        destination,
        departure_date: departureDate,
      }
    ]

    if (returnDate) {
      slices.push({
        origin: destination,
        destination: origin,
        departure_date: returnDate,
      })
    }

    // Construir pasajeros
    const passengerArray = Array(passengers).fill({ type: "adult" })

    // Realizar búsqueda
    const offerRequest = await duffel.offerRequests.create({
      slices,
      passengers: passengerArray,
      cabin_class: cabinClass || "economy",
      max_connections: 2
    })

    const offers = offerRequest.data.offers || []

    return NextResponse.json({
      success: true,
      offers,
      request_id: offerRequest.data.id,
      search_metadata: {
        total_offers: offers.length,
        search_params: { origin, destination, departureDate, returnDate, passengers, cabinClass },
        environment: process.env.NODE_ENV
      }
    })

  } catch (error) {
    const errorResponse = handleDuffelError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}
