export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createDuffelClient } from "@/lib/duffel"


interface SeatSelectionRequest {
  orderId: string
  selections: Array<{
    passenger_id: string
    seat_id: string
    segment_id: string
  }>
}

interface SeatMapRequest {
  offerId: string
  passengers: Array<{
    id: string
    type: 'adult' | 'child' | 'infant_without_seat'
  }>
}

// Obtener mapa de asientos disponibles para una oferta
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const offerId = searchParams.get("offerId")

    if (!offerId) {
      return NextResponse.json({ error: "offerId is required" }, { status: 400 })
    }

    const duffel = createDuffelClient()

    // Obtener seat maps
    const seatMaps = await duffel.getSeatMaps(offerId)

    return NextResponse.json({ seat_maps: seatMaps })
  } catch (error) {
    console.error("Seat map fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch seat maps" }, { status: 500 })
  }
}

// Seleccionar asientos para una orden
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body: SeatSelectionRequest = await request.json()
    const { orderId, selections } = body

    if (!orderId || !Array.isArray(selections) || selections.length === 0) {
      return NextResponse.json({ error: "orderId and selections are required" }, { status: 400 })
    }

    const duffel = createDuffelClient()

    const seatServiceResponse = await duffel.selectSeats(orderId, selections)

    return NextResponse.json({ success: true, details: seatServiceResponse })
  } catch (error) {
    console.error("Seat selection error:", error)
    return NextResponse.json({ error: "Failed to select seats" }, { status: 500 })
  }
}

// Remover selección de asientos
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const seatServiceId = searchParams.get('seatServiceId')

    if (!orderId || !seatServiceId) {
      return NextResponse.json({
        success: false,
        error: "Order ID and seat service ID are required"
      }, { status: 400 })
    }

    // Verificar que la orden pertenece al usuario
    const { data: booking } = await supabase
      .from("flight_bookings")
      .select("*")
      .eq("duffel_order_id", orderId)
      .eq("user_id", user.id)
      .single()

    if (!booking) {
      return NextResponse.json({
        success: false,
        error: "Order not found"
      }, { status: 404 })
    }

    try {
      const duffel = createDuffelClient()
      // Crear change request para remover servicio de asiento
      const changeRequest = await duffel.orderChangeRequests.create({
        order_id: orderId,
        slices: {
          add: [],
          remove: []
        },
        // services field may not be typed in SDK; cast payload to any
        services: {
          add: [],
          remove: [{ id: seatServiceId }]
        }
      } as any)

      return NextResponse.json({
        success: true,
        message: "Seat selection removed successfully",
        change_request_id: changeRequest.data.id
      })

    } catch (duffelError: any) {
      console.error("Duffel seat removal error:", duffelError)

      return NextResponse.json({
        success: false,
        error: "Failed to remove seat selection",
        error_code: "SEAT_REMOVAL_FAILED"
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Seat removal API Error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 })
  }
}
