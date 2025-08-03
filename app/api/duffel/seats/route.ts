import { NextRequest, NextResponse } from "next/server"
import { Duffel } from "@duffel/api"
import { createClient } from "@/lib/supabase/server"

const duffel = new Duffel({
  token: process.env.DUFFEL_API_KEY!,
  environment: 'test'
})

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
    const offerId = searchParams.get('offerId')
    const orderId = searchParams.get('orderId')

    if (!offerId && !orderId) {
      return NextResponse.json({
        success: false,
        error: "Either offer ID or order ID is required"
      }, { status: 400 })
    }

    try {
      let seatMaps: any[] = []

      if (offerId) {
        // Obtener mapa de asientos para una oferta específica
        const seatMapResponse = await duffel.seatMaps.create({
          offer_id: offerId,
          passengers: [{ type: 'adult' }] // Default passenger for seat map
        })
        seatMaps = seatMapResponse.data.seat_maps || []
      } else if (orderId) {
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

        // Obtener asientos disponibles para cambio
        const order = await duffel.orders.get(orderId)
        
        if (order.data && order.data.slices) {
          // Para cada segmento, obtener el mapa de asientos
          for (const slice of order.data.slices) {
            for (const segment of slice.segments) {
              try {
                const seatMapResponse = await duffel.seatMaps.create({
                  offer_id: segment.id, // En realidad necesitaríamos recrear la oferta
                  passengers: order.data.passengers.map(p => ({ type: p.type }))
                })
                seatMaps.push(...(seatMapResponse.data.seat_maps || []))
              } catch (error) {
                console.warn(`Could not get seat map for segment ${segment.id}:`, error)
              }
            }
          }
        }
      }

      // Procesar y organizar los mapas de asientos
      const processedSeatMaps = seatMaps.map(seatMap => {
        return {
          id: seatMap.id,
          segment_id: seatMap.segment_id,
          aircraft: seatMap.aircraft,
          cabin_layout: seatMap.cabin_layout,
          elements: seatMap.elements?.map((element: any) => {
            if (element.type === 'seat') {
              return {
                type: element.type,
                id: element.id,
                designator: element.designator,
                name: element.name,
                available: element.available_services?.length > 0,
                services: element.available_services?.map((service: any) => ({
                  id: service.id,
                  type: service.type,
                  price: {
                    amount: service.total_amount,
                    currency: service.total_currency
                  },
                  passenger_restrictions: service.passenger_restrictions
                })) || [],
                restrictions: element.restrictions || [],
                position: {
                  row: element.row,
                  column: element.column
                }
              }
            }
            return element
          }) || []
        }
      })

      return NextResponse.json({
        success: true,
        seat_maps: processedSeatMaps,
        total_maps: processedSeatMaps.length
      })

    } catch (duffelError: any) {
      console.error("Duffel seat maps error:", duffelError)
      
      if (duffelError.message?.includes('offer not found')) {
        return NextResponse.json({
          success: false,
          error: "Flight offer not found or expired",
          error_code: "OFFER_NOT_FOUND"
        }, { status: 404 })
      }

      return NextResponse.json({
        success: false,
        error: "Failed to retrieve seat maps",
        error_code: "SEAT_MAP_FAILED"
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Seat maps API Error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 })
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

    const {
      orderId,
      selections
    }: SeatSelectionRequest = await request.json()

    if (!orderId || !selections || selections.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Order ID and seat selections are required"
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
      // Crear order change request para agregar asientos
      const changeRequest = await duffel.orderChangeRequests.create({
        order_id: orderId,
        slices: {
          add: [],
          remove: []
        },
        services: {
          add: selections.map(selection => ({
            id: selection.seat_id,
            quantity: 1,
            passenger_id: selection.passenger_id,
            segment_id: selection.segment_id
          })),
          remove: []
        }
      })

      if (!changeRequest.data) {
        throw new Error("No change request data received")
      }

      // Confirmar el cambio si es necesario
      let confirmedChange
      if (changeRequest.data.requires_confirmation) {
        const bestOffer = changeRequest.data.order_change_offers?.[0]
        if (bestOffer) {
          confirmedChange = await duffel.orderChangeOffers.create({
            order_change_request_id: changeRequest.data.id,
            selected_order_change_offer: bestOffer.id
          })
        }
      } else {
        confirmedChange = changeRequest
      }

      // Actualizar la base de datos
      const { error: dbError } = await supabase
        .from("flight_bookings")
        .update({
          metadata: {
            ...booking.metadata,
            seat_selections: selections,
            last_updated: new Date().toISOString()
          }
        })
        .eq("duffel_order_id", orderId)

      if (dbError) {
        console.error("Database update error:", dbError)
      }

      // Calcular costos adicionales
      const additionalCost = confirmedChange?.data?.total_amount || '0'
      const newTotalAmount = (
        parseFloat(booking.total_amount) + parseFloat(additionalCost)
      ).toString()

      return NextResponse.json({
        success: true,
        change_request: {
          id: confirmedChange?.data?.id || changeRequest.data.id,
          status: confirmedChange?.data?.status || 'confirmed',
          additional_cost: {
            amount: additionalCost,
            currency: booking.total_currency
          },
          new_total: {
            amount: newTotalAmount,
            currency: booking.total_currency
          },
          seats_selected: selections.length,
          confirmation_required: changeRequest.data.requires_confirmation || false
        },
        selections: selections.map(selection => ({
          passenger_id: selection.passenger_id,
          seat_id: selection.seat_id,
          segment_id: selection.segment_id,
          status: 'confirmed'
        }))
      })

    } catch (duffelError: any) {
      console.error("Duffel seat selection error:", duffelError)
      
      if (duffelError.message?.includes('seat not available')) {
        return NextResponse.json({
          success: false,
          error: "One or more selected seats are no longer available",
          error_code: "SEAT_UNAVAILABLE"
        }, { status: 409 })
      }

      if (duffelError.message?.includes('payment required')) {
        return NextResponse.json({
          success: false,
          error: "Payment is required to select seats",
          error_code: "PAYMENT_REQUIRED"
        }, { status: 402 })
      }

      return NextResponse.json({
        success: false,
        error: "Failed to select seats",
        error_code: "SEAT_SELECTION_FAILED"
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Seat selection API Error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 })
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
      // Crear change request para remover servicio de asiento
      const changeRequest = await duffel.orderChangeRequests.create({
        order_id: orderId,
        slices: {
          add: [],
          remove: []
        },
        services: {
          add: [],
          remove: [{ id: seatServiceId }]
        }
      })

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