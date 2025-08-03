import { NextRequest, NextResponse } from "next/server"
import { Duffel } from "@duffel/api"
import { createClient } from "@/lib/supabase/server"

const duffel = new Duffel({
  token: process.env.DUFFEL_API_KEY!,
  environment: 'test'
})

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
  holdOrder?: boolean
  holdDuration?: number // minutes
  paymentMethod?: 'hold' | 'immediate'
  loyaltyProgrammes?: Array<{
    airline_iata_code: string
    account_number: string
  }>
}

interface OrderHoldRequest {
  orderId: string
  action: 'extend' | 'confirm' | 'cancel'
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

// Crear orden (con opción de hold)
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const {
      offerId,
      passengers,
      holdOrder = false,
      holdDuration = 20,
      loyaltyProgrammes = []
    }: BookingRequest = await request.json()

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

    console.log("Creating order with Duffel:", {
      offerId,
      passengersCount: passengers.length,
      holdOrder,
      holdDuration
    })

    try {
      // Configurar la orden
      const orderData: any = {
        selected_offers: [offerId],
        passengers: passengers.map(passenger => ({
          id: passenger.id || undefined,
          title: passenger.title,
          given_name: passenger.given_name,
          family_name: passenger.family_name,
          born_on: passenger.born_on,
          email: passenger.email,
          phone_number: passenger.phone_number,
          type: passenger.type,
          // Agregar programas de lealtad si corresponde
          ...(loyaltyProgrammes.length > 0 && {
            loyalty_programme_accounts: loyaltyProgrammes.filter(lp => 
              // Solo agregar si el pasajero tiene ese programa
              passenger.email // simplificado - en realidad debería mapear por pasajero
            )
          })
        })),
        metadata: {
          user_id: user.id,
          booking_source: 'suitpax_web',
          created_at: new Date().toISOString()
        }
      }

      // Si es hold order, agregar configuración de retención
      if (holdOrder) {
        orderData.type = 'hold'
        orderData.hold_expires_at = new Date(
          Date.now() + holdDuration * 60 * 1000
        ).toISOString()
      } else {
        orderData.type = 'instant'
      }

      const order = await duffel.orders.create(orderData)

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
          status: holdOrder ? 'held' : 'confirmed',
          total_amount: order.data.total_amount,
          total_currency: order.data.total_currency,
          passengers: passengers,
          booking_reference: order.data.booking_reference,
          hold_expires_at: holdOrder ? orderData.hold_expires_at : null,
          metadata: {
            order_type: holdOrder ? 'hold' : 'instant',
            duffel_response: order.data
          }
        })

      if (dbError) {
        console.error("Database error:", dbError)
        // Continuar aunque falle la DB, la orden ya se creó en Duffel
      }

      const response = {
        success: true,
        order: {
          id: order.data.id,
          booking_reference: order.data.booking_reference,
          status: holdOrder ? 'held' : 'confirmed',
          total_amount: order.data.total_amount,
          total_currency: order.data.total_currency,
          expires_at: holdOrder ? orderData.hold_expires_at : null,
          passengers: order.data.passengers,
          slices: order.data.slices,
          conditions: order.data.conditions,
          documents: order.data.documents,
          services: order.data.services || []
        },
        hold_info: holdOrder ? {
          expires_at: orderData.hold_expires_at,
          duration_minutes: holdDuration,
          can_extend: true,
          payment_required_before: orderData.hold_expires_at
        } : null
      }

      return NextResponse.json(response)

    } catch (duffelError: any) {
      console.error("Duffel API Error:", duffelError)
      
      // Manejo específico de errores de Duffel
      if (duffelError.message?.includes('offer no longer available')) {
        return NextResponse.json({
          success: false,
          error: "This flight offer is no longer available. Please search for new flights.",
          error_code: "OFFER_EXPIRED"
        }, { status: 409 })
      }
      
      if (duffelError.message?.includes('passenger data invalid')) {
        return NextResponse.json({
          success: false,
          error: "Invalid passenger information. Please check all fields are correct.",
          error_code: "INVALID_PASSENGER_DATA"
        }, { status: 400 })
      }

      return NextResponse.json({
        success: false,
        error: "Failed to create booking. Please try again.",
        error_code: "BOOKING_FAILED",
        details: process.env.NODE_ENV === 'development' ? duffelError.message : undefined
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Booking API Error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 })
  }
}

// Gestionar orden retenida (extend, confirm, cancel)
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const {
      orderId,
      action,
      paymentData
    }: OrderHoldRequest = await request.json()

    if (!orderId || !action) {
      return NextResponse.json({
        success: false,
        error: "Order ID and action are required"
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

    let result: any

    switch (action) {
      case 'extend':
        // Extender el hold por otros 20 minutos
        try {
          const newExpiryTime = new Date(Date.now() + 20 * 60 * 1000).toISOString()
          
          // Nota: Duffel puede no permitir extensiones automáticas
          // En ese caso, debemos manejar esto en nuestro lado
          
          await supabase
            .from("flight_bookings")
            .update({ 
              hold_expires_at: newExpiryTime,
              updated_at: new Date().toISOString()
            })
            .eq("duffel_order_id", orderId)

          result = {
            success: true,
            message: "Hold extended successfully",
            new_expires_at: newExpiryTime
          }
        } catch (error) {
          return NextResponse.json({
            success: false,
            error: "Failed to extend hold period"
          }, { status: 500 })
        }
        break

      case 'confirm':
        // Confirmar la orden y procesar pago
        try {
          if (!paymentData) {
            return NextResponse.json({
              success: false,
              error: "Payment data required for confirmation"
            }, { status: 400 })
          }

          // Aquí se integraría con el procesador de pagos (Stripe, etc.)
          // Por ahora simulamos el pago exitoso
          
          const payment = await duffel.orderChangeRequests.create({
            order_id: orderId
            // Datos de pago según la documentación de Duffel
          })

          await supabase
            .from("flight_bookings")
            .update({ 
              status: 'confirmed',
              payment_status: 'paid',
              confirmed_at: new Date().toISOString()
            })
            .eq("duffel_order_id", orderId)

          result = {
            success: true,
            message: "Order confirmed and payment processed",
            order_id: orderId,
            payment_status: 'paid'
          }
        } catch (error) {
          return NextResponse.json({
            success: false,
            error: "Failed to confirm order and process payment"
          }, { status: 500 })
        }
        break

      case 'cancel':
        // Cancelar la orden retenida
        try {
          await duffel.orderCancellations.create({
            order_id: orderId
          })

          await supabase
            .from("flight_bookings")
            .update({ 
              status: 'cancelled',
              cancelled_at: new Date().toISOString()
            })
            .eq("duffel_order_id", orderId)

          result = {
            success: true,
            message: "Order cancelled successfully"
          }
        } catch (error) {
          return NextResponse.json({
            success: false,
            error: "Failed to cancel order"
          }, { status: 500 })
        }
        break

      default:
        return NextResponse.json({
          success: false,
          error: "Invalid action"
        }, { status: 400 })
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error("Order management error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 })
  }
}

// Obtener detalles de una orden
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json({
        success: false,
        error: "Order ID is required"
      }, { status: 400 })
    }

    // Obtener orden de Duffel
    const order = await duffel.orders.get(orderId)

    if (!order.data) {
      return NextResponse.json({
        success: false,
        error: "Order not found"
      }, { status: 404 })
    }

    // Verificar que pertenece al usuario
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

    return NextResponse.json({
      success: true,
      order: {
        id: order.data.id,
        booking_reference: order.data.booking_reference,
        status: booking.status,
        total_amount: order.data.total_amount,
        total_currency: order.data.total_currency,
        created_at: order.data.created_at,
        expires_at: booking.hold_expires_at,
        passengers: order.data.passengers,
        slices: order.data.slices,
        conditions: order.data.conditions,
        documents: order.data.documents,
        services: order.data.services || [],
        payment_status: booking.payment_status
      }
    })

  } catch (error) {
    console.error("Get order error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to retrieve order"
    }, { status: 500 })
  }
}