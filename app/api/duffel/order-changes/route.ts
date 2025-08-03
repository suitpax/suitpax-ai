import { NextRequest, NextResponse } from "next/server"
import { Duffel } from "@duffel/api"
import { createClient } from "@/lib/supabase/server"

const duffel = new Duffel({
  token: process.env.DUFFEL_API_KEY!,
  environment: 'test'
})

interface OrderChangeRequest {
  orderId: string
  changeType: 'date' | 'time' | 'passenger' | 'route'
  changes: {
    slices?: {
      add?: Array<{
        origin: string
        destination: string
        departure_date: string
        departure_time?: string
      }>
      remove?: Array<{
        slice_id: string
      }>
    }
    passengers?: {
      add?: Array<{
        title: string
        given_name: string
        family_name: string
        born_on: string
        email: string
        phone_number: string
        type: 'adult' | 'child' | 'infant_without_seat'
      }>
      remove?: Array<{
        passenger_id: string
      }>
    }
  }
  reason?: string
}

interface OrderChangeConfirmRequest {
  changeRequestId: string
  selectedOfferId: string
  paymentData?: {
    method: string
    card?: {
      number: string
      expiry_month: string
      expiry_year: string
      cvc: string
      name: string
    }
  }
}

// Obtener opciones de cambio para una orden
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const changeRequestId = searchParams.get('changeRequestId')

    if (!orderId && !changeRequestId) {
      return NextResponse.json({
        success: false,
        error: "Order ID or change request ID is required"
      }, { status: 400 })
    }

    try {
      if (changeRequestId) {
        // Obtener detalles de un change request específico
        const changeRequest = await duffel.orderChangeRequests.get(changeRequestId)
        
        return NextResponse.json({
          success: true,
          change_request: {
            id: changeRequest.data.id,
            status: changeRequest.data.status,
            order_id: changeRequest.data.order_id,
            change_offers: changeRequest.data.order_change_offers?.map((offer: any) => ({
              id: offer.id,
              change_total_amount: offer.change_total_amount,
              change_total_currency: offer.change_total_currency,
              new_total_amount: offer.new_total_amount,
              new_total_currency: offer.new_total_currency,
              penalty: offer.penalty,
              expires_at: offer.expires_at,
              updated_slices: offer.updated_slices,
              updated_passengers: offer.updated_passengers,
              refund: offer.refund
            })) || [],
            expires_at: changeRequest.data.expires_at,
            created_at: changeRequest.data.created_at
          }
        })
      }

      if (orderId) {
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

        // Obtener la orden actual de Duffel
        const order = await duffel.orders.get(orderId)

        if (!order.data) {
          return NextResponse.json({
            success: false,
            error: "Order not found in Duffel"
          }, { status: 404 })
        }

        // Verificar si la orden permite cambios
        const allowsChanges = order.data.conditions?.change_before_departure?.allowed || false
        const changePenalty = order.data.conditions?.change_before_departure?.penalty_amount || '0'
        const changePenaltyCurrency = order.data.conditions?.change_before_departure?.penalty_currency || 'USD'

        // Obtener histórico de cambios
        const { data: changeHistory } = await supabase
          .from("order_changes")
          .select("*")
          .eq("order_id", orderId)
          .order("created_at", { ascending: false })

        return NextResponse.json({
          success: true,
          order: {
            id: order.data.id,
            booking_reference: order.data.booking_reference,
            status: booking.status,
            allows_changes: allowsChanges,
            change_penalty: {
              amount: changePenalty,
              currency: changePenaltyCurrency
            },
            current_slices: order.data.slices,
            current_passengers: order.data.passengers,
            created_at: order.data.created_at
          },
          change_history: changeHistory || [],
          change_policies: {
            allowed: allowsChanges,
            penalty_amount: changePenalty,
            penalty_currency: changePenaltyCurrency,
            deadline: order.data.slices?.[0]?.segments?.[0]?.departing_at,
            restrictions: order.data.conditions?.change_before_departure?.restrictions || []
          }
        })
      }

    } catch (duffelError: any) {
      console.error("Duffel order changes error:", duffelError)
      
      if (duffelError.message?.includes('order not found')) {
        return NextResponse.json({
          success: false,
          error: "Order not found",
          error_code: "ORDER_NOT_FOUND"
        }, { status: 404 })
      }

      return NextResponse.json({
        success: false,
        error: "Failed to retrieve change options",
        error_code: "CHANGE_OPTIONS_FAILED"
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Order changes API Error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 })
  }
}

// Crear una solicitud de cambio
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const {
      orderId,
      changeType,
      changes,
      reason
    }: OrderChangeRequest = await request.json()

    if (!orderId || !changeType || !changes) {
      return NextResponse.json({
        success: false,
        error: "Order ID, change type, and changes are required"
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
      // Preparar la estructura de cambios para Duffel
      const changeRequestData: any = {
        order_id: orderId,
        slices: {
          add: changes.slices?.add || [],
          remove: changes.slices?.remove || []
        }
      }

      // Agregar cambios de pasajeros si existen
      if (changes.passengers) {
        changeRequestData.passengers = {
          add: changes.passengers.add || [],
          remove: changes.passengers.remove || []
        }
      }

      // Crear el change request en Duffel
      const changeRequest = await duffel.orderChangeRequests.create(changeRequestData)

      if (!changeRequest.data) {
        throw new Error("No change request data received")
      }

      // Guardar en la base de datos
      const { error: dbError } = await supabase
        .from("order_changes")
        .insert({
          order_id: orderId,
          user_id: user.id,
          duffel_change_request_id: changeRequest.data.id,
          change_type: changeType,
          status: 'pending',
          reason: reason,
          original_data: booking.metadata,
          requested_changes: changes,
          created_at: new Date().toISOString()
        })

      if (dbError) {
        console.error("Database error:", dbError)
      }

      // Procesar las ofertas de cambio
      const changeOffers = changeRequest.data.order_change_offers?.map((offer: any) => ({
        id: offer.id,
        change_total_amount: offer.change_total_amount,
        change_total_currency: offer.change_total_currency,
        new_total_amount: offer.new_total_amount,
        new_total_currency: offer.new_total_currency,
        penalty: {
          amount: offer.penalty?.amount || '0',
          currency: offer.penalty?.currency || 'USD'
        },
        refund: offer.refund ? {
          amount: offer.refund.amount,
          currency: offer.refund.currency
        } : null,
        expires_at: offer.expires_at,
        updated_slices: offer.updated_slices,
        updated_passengers: offer.updated_passengers
      })) || []

      return NextResponse.json({
        success: true,
        change_request: {
          id: changeRequest.data.id,
          status: changeRequest.data.status,
          change_type: changeType,
          expires_at: changeRequest.data.expires_at,
          available_offers: changeOffers,
          total_offers: changeOffers.length,
          requires_confirmation: changeOffers.length > 0
        },
        next_steps: {
          action: "select_offer",
          message: "Please select from the available change offers to proceed",
          deadline: changeRequest.data.expires_at
        }
      })

    } catch (duffelError: any) {
      console.error("Duffel change request error:", duffelError)
      
      if (duffelError.message?.includes('changes not allowed')) {
        return NextResponse.json({
          success: false,
          error: "Changes are not allowed for this booking",
          error_code: "CHANGES_NOT_ALLOWED"
        }, { status: 400 })
      }

      if (duffelError.message?.includes('change deadline passed')) {
        return NextResponse.json({
          success: false,
          error: "The deadline for changes has passed",
          error_code: "CHANGE_DEADLINE_PASSED"
        }, { status: 400 })
      }

      return NextResponse.json({
        success: false,
        error: "Failed to create change request",
        error_code: "CHANGE_REQUEST_FAILED"
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Order change request API Error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 })
  }
}

// Confirmar una solicitud de cambio
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const {
      changeRequestId,
      selectedOfferId,
      paymentData
    }: OrderChangeConfirmRequest = await request.json()

    if (!changeRequestId || !selectedOfferId) {
      return NextResponse.json({
        success: false,
        error: "Change request ID and selected offer ID are required"
      }, { status: 400 })
    }

    try {
      // Verificar que el change request pertenece al usuario
      const { data: changeRecord } = await supabase
        .from("order_changes")
        .select("*")
        .eq("duffel_change_request_id", changeRequestId)
        .eq("user_id", user.id)
        .single()

      if (!changeRecord) {
        return NextResponse.json({
          success: false,
          error: "Change request not found"
        }, { status: 404 })
      }

      // Confirmar el cambio en Duffel
      const confirmedChange = await duffel.orderChangeOffers.create({
        order_change_request_id: changeRequestId,
        selected_order_change_offer: selectedOfferId,
        payment: paymentData ? {
          type: paymentData.method,
          card: paymentData.card
        } : undefined
      })

      if (!confirmedChange.data) {
        throw new Error("No confirmed change data received")
      }

      // Actualizar el estado en la base de datos
      const { error: updateError } = await supabase
        .from("order_changes")
        .update({
          status: 'confirmed',
          selected_offer_id: selectedOfferId,
          confirmation_data: confirmedChange.data,
          confirmed_at: new Date().toISOString()
        })
        .eq("duffel_change_request_id", changeRequestId)

      if (updateError) {
        console.error("Database update error:", updateError)
      }

      // Actualizar la reserva principal si es necesario
      if (confirmedChange.data.order) {
        const newOrder = confirmedChange.data.order
        await supabase
          .from("flight_bookings")
          .update({
            status: 'confirmed',
            total_amount: newOrder.total_amount,
            metadata: {
              ...changeRecord.original_data,
              last_change: {
                date: new Date().toISOString(),
                type: changeRecord.change_type,
                change_id: changeRequestId
              },
              updated_order: newOrder
            }
          })
          .eq("duffel_order_id", changeRecord.order_id)
      }

      return NextResponse.json({
        success: true,
        confirmed_change: {
          id: confirmedChange.data.id,
          status: 'confirmed',
          order_id: changeRecord.order_id,
          change_type: changeRecord.change_type,
          new_total: {
            amount: confirmedChange.data.order?.total_amount || '0',
            currency: confirmedChange.data.order?.total_currency || 'USD'
          },
          penalty_applied: {
            amount: confirmedChange.data.penalty?.amount || '0',
            currency: confirmedChange.data.penalty?.currency || 'USD'
          },
          refund: confirmedChange.data.refund ? {
            amount: confirmedChange.data.refund.amount,
            currency: confirmedChange.data.refund.currency
          } : null,
          new_booking_reference: confirmedChange.data.order?.booking_reference,
          confirmed_at: new Date().toISOString()
        },
        message: "Your booking has been successfully changed"
      })

    } catch (duffelError: any) {
      console.error("Duffel change confirmation error:", duffelError)
      
      if (duffelError.message?.includes('offer expired')) {
        return NextResponse.json({
          success: false,
          error: "The selected change offer has expired",
          error_code: "OFFER_EXPIRED"
        }, { status: 400 })
      }

      if (duffelError.message?.includes('payment failed')) {
        return NextResponse.json({
          success: false,
          error: "Payment failed for the change request",
          error_code: "PAYMENT_FAILED"
        }, { status: 402 })
      }

      return NextResponse.json({
        success: false,
        error: "Failed to confirm change request",
        error_code: "CHANGE_CONFIRMATION_FAILED"
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Order change confirmation API Error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 })
  }
}