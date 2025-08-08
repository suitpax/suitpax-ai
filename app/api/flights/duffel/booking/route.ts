import { NextRequest, NextResponse } from "next/server"
import { createDuffelClient, handleDuffelError, getPaymentMethod } from "@/lib/duffel-config"
import { createClient } from "@/lib/supabase/server"

interface BookingRequest {
  offerId: string
  passengers: Array<{
    title: string
    given_name: string
    family_name: string
    born_on: string
    email: string
    phone_number: string
    type: 'adult' | 'child' | 'infant_without_seat'
    id?: string
  }>
}

export async function POST(request: NextRequest) {
  try {
    const duffel = createDuffelClient();
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { offerId, passengers }: BookingRequest = await request.json()

    // Validaciones
    if (!offerId || !passengers || passengers.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Offer ID and passengers are required"
      }, { status: 400 })
    }

    // Validar datos de pasajeros
    for (const passenger of passengers) {
      if (!passenger.given_name || !passenger.family_name || !passenger.email) {
        return NextResponse.json({
          success: false,
          error: "Each passenger must have given_name, family_name, and email"
        }, { status: 400 })
      }
    }

    // Obtener oferta actualizada
    const offer = await duffel.offers.get(offerId)

    if (!offer.data) {
      return NextResponse.json({
        success: false,
        error: "Offer not found or expired"
      }, { status: 404 })
    }

    // Configurar método de pago según environment
    const paymentMethod = getPaymentMethod(offer.data.total_currency, offer.data.total_amount);

    console.log("Creating order with:", {
      offerId,
      passengersCount: passengers.length,
      environment: process.env.NODE_ENV,
      paymentType: paymentMethod.type
    });

    // Crear orden
    const order = await duffel.orders.create({
      selected_offers: [offerId],
      passengers: passengers.map(passenger => ({
        id: passenger.id || undefined,
        title: passenger.title,
        given_name: passenger.given_name,
        family_name: passenger.family_name,
        born_on: passenger.born_on,
        email: passenger.email,
        phone_number: passenger.phone_number,
        type: passenger.type
      })),
      payments: [paymentMethod],
      metadata: {
        user_id: user.id,
        booking_source: 'suitpax_web',
        environment: process.env.NODE_ENV,
        created_at: new Date().toISOString()
      }
    })

    if (!order.data) {
      throw new Error("No order data received from Duffel")
    }

    // Guardar en base de datos
    const { error: dbError } = await supabase
      .from("flight_bookings")
      .insert({
        user_id: user.id,
        duffel_order_id: order.data.id,
        offer_id: offerId,
        status: 'confirmed',
        total_amount: order.data.total_amount,
        total_currency: order.data.total_currency,
        passengers: passengers,
        booking_reference: order.data.booking_reference,
        metadata: {
          duffel_response: order.data,
          environment: process.env.NODE_ENV
        }
      })

    if (dbError) {
      console.error("Database error:", dbError)
      // Continuar aunque falle la DB, la orden ya se creó en Duffel
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.data.id,
        booking_reference: order.data.booking_reference,
        status: 'confirmed',
        total_amount: order.data.total_amount,
        total_currency: order.data.total_currency,
        passengers: order.data.passengers,
        slices: order.data.slices,
        conditions: order.data.conditions,
        documents: order.data.documents,
        services: order.data.services || []
      }
    })

  } catch (error) {
    console.error("Booking Error:", error)
    const errorResponse = handleDuffelError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}
