import { NextRequest, NextResponse } from "next/server"
import { Duffel } from "@duffel/api"

const duffel = new Duffel({
  token: process.env.DUFFEL_API_KEY!,
  environment: 'test' // Cambia a 'production' cuando vayas a producción
})

export async function POST(request: NextRequest) {
  try {
    const {
      origin,
      destination,
      departureDate,
      returnDate,
      passengers,
      cabinClass
    } = await request.json()

    // Crear la oferta de vuelo
    const offerRequest = await duffel.offerRequests.create({
      slices: [
        {
          origin,
          destination,
          departure_date: departureDate,
        },
        ...(returnDate ? [{
          origin: destination,
          destination: origin,
          departure_date: returnDate,
        }] : [])
      ],
      passengers: Array(passengers).fill({ type: "adult" }),
      cabin_class: cabinClass,
    })

    return NextResponse.json({
      success: true,
      offers: offerRequest.data.offers,
      request_id: offerRequest.data.id
    })

  } catch (error) {
    console.error("Duffel API Error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to search flights",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}