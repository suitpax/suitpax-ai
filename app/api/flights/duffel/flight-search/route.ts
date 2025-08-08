import { NextRequest, NextResponse } from "next/server"
import { Duffel } from "@duffel/api"

const duffel = new Duffel({
  token: process.env.DUFFEL_API_KEY!,
  environment: 'test'
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

    if (!origin || !destination || !departureDate || !passengers) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields"
      }, { status: 400 })
    }

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

    const passengerArray = Array(passengers).fill({ type: "adult" })

    const offerRequest = await duffel.offerRequests.create({
      slices,
      passengers: passengerArray,
      cabin_class: cabinClass || "economy"
    })

    return NextResponse.json({
      success: true,
      offers: offerRequest.data.offers || [],
      request_id: offerRequest.data.id
    })

  } catch (error) {
    console.error("Duffel API Error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to search flights"
    }, { status: 500 })
  }
}

// app/api/flights/duffel/booking/route.ts (CORREGIDO)
export async function POST(request: NextRequest) {
  try {
    const {
      offerId,
      passengers
    } = await request.json()

    if (!offerId || !passengers) {
      return NextResponse.json({
        success: false,
        error: "Offer ID and passengers required"
      }, { status: 400 })
    }

    // Primero obtener la oferta actualizada
    const offer = await duffel.offers.get(offerId)

    const order = await duffel.orders.create({
      selected_offers: [offerId],
      passengers: passengers.map((passenger: any) => ({
        id: passenger.id,
        phone_number: passenger.phone_number,
        email: passenger.email,
        born_on: passenger.born_on,
        title: passenger.title,
        gender: passenger.gender,
        family_name: passenger.family_name,
        given_name: passenger.given_name
      })),
      payments: [{
        type: "balance",
        currency: offer.data.total_currency,
        amount: offer.data.total_amount
      }]
    })

    return NextResponse.json({
      success: true,
      order: order.data
    })

  } catch (error) {
    console.error("Booking Error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to create booking"
    }, { status: 500 })
  }
}

// app/api/flights/route.ts (SIMPLIFICADO)
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const params = await req.json();

  try {
    // Usar fetch interno para llamar al endpoint de Duffel
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const duffelResponse = await fetch(`${baseUrl}/api/flights/duffel/flight-search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    const duffelData = await duffelResponse.json();
    
    return NextResponse.json({
      success: true,
      offers: duffelData.offers || [],
      providers: ['duffel']
    });

  } catch (error) {
    console.error("Flight search error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to search flights",
      offers: []
    }, { status: 500 });
  }
}