import { NextRequest, NextResponse } from "next/server"
import { Duffel } from "@duffel/api"
import { createClient } from "@/lib/supabase/server"

const duffel = new Duffel({
  token: process.env.DUFFEL_API_KEY!,
  environment: 'test'
})

interface CancellationRequest {
  orderId: string
  reason?: string
  requestRefund?: boolean
}

interface CancellationConfirmRequest {
  cancellationId: string
  confirmRefund?: boolean
  refundMethod?: 'original' | 'bank_transfer' | 'voucher'
}

// Obtener información de cancelación para una orden
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const cancellationId = searchParams.get('cancellationId')

    if (!orderId && !cancellationId) {
      return NextResponse.json({
        success: false,
        error: "Order ID or cancellation ID is required"
      }, { status: 400 })
    }

    try {
      if (cancellationId) {
        // Obtener detalles de una cancelación específica
        const cancellation = await duffel.orderCancellations.get(cancellationId)

        return NextResponse.json({
          success: true,
          cancellation: {
            id: cancellation.data.id,
            status: cancellation.data.status,
            order_id: cancellation.data.order_id,
            refund_amount: cancellation.data.refund_amount,
            refund_currency: cancellation.data.refund_currency,
            refund_to: cancellation.data.refund_to,
            expires_at: cancellation.data.expires_at,
            confirmed_at: cancellation.data.confirmed_at,
            created_at: cancellation.data.created_at
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

        // Verificar si la orden permite cancelaciones
        const allowsCancellation = order.data.conditions?.refund_before_departure?.allowed || false
        const refundPenalty = order.data.conditions?.refund_before_departure?.penalty_amount || '0'
        const refundPenaltyCurrency = order.data.conditions?.refund_before_departure?.penalty_currency || 'USD'

        // Calcular reembolso estimado
        const orderTotal = parseFloat(order.data.total_amount)
        const penalty = parseFloat(refundPenalty)
        const estimatedRefund = Math.max(0, orderTotal - penalty)

        // Obtener histórico de cancelaciones
        const { data: cancellationHistory } = await supabase
          .from("order_cancellations")
          .select("*")
          .eq("order_id", orderId)
          .order("created_at", { ascending: false })

        // Verificar si ya hay una cancelación en proceso
        const existingCancellation = cancellationHistory?.find(c => 
          c.status === 'pending' || c.status === 'confirmed'
        )

        return NextResponse.json({
          success: true,
          order: {
            id: order.data.id,
            booking_reference: order.data.booking_reference,
            status: booking.status,
            total_amount: order.data.total_amount,
            total_currency: order.data.total_currency,
            allows_cancellation: allowsCancellation,
            departure_date: order.data.slices?.[0]?.segments?.[0]?.departing_at,
            created_at: order.data.created_at
          },
          cancellation_policy: {
            allowed: allowsCancellation,
            penalty_amount: refundPenalty,
            penalty_currency: refundPenaltyCurrency,
            estimated_refund: {
              amount: estimatedRefund.toString(),
              currency: order.data.total_currency
            },
            deadline: order.data.slices?.[0]?.segments?.[0]?.departing_at,
            restrictions: order.data.conditions?.refund_before_departure?.restrictions || []
          },
          existing_cancellation: existingCancellation ? {
            id: existingCancellation.duffel_cancellation_id,
            status: existingCancellation.status,
            created_at: existingCancellation.created_at
          } : null,
          cancellation_history: cancellationHistory || []
        })
      }

    } catch (duffelError: any) {
      console.error("Duffel cancellation info error:", duffelError)

      if (duffelError.message?.includes('order not found')) {
        return NextResponse.json({
          success: false,
          error: "Order not found",
          error_code: "ORDER_NOT_FOUND"
        }, { status: 404 })
      }

      return NextResponse.json({
        success: false,
        error: "Failed to retrieve cancellation information",
        error_code: "CANCELLATION_INFO_FAILED"
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Cancellation info API Error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 })
  }
}

// Crear una solicitud de cancelación
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const {
      orderId,
      reason,
      requestRefund = true
    }: CancellationRequest = await request.json()

    if (!orderId) {
      return NextResponse.json({
        success: false,
        error: "Order ID is required"
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

    // Verificar que no hay una cancelación existente
    const { data: existingCancellation } = await supabase
      .from("order_cancellations")
      .select("*")
      .eq("order_id", orderId)
      .eq("status", "pending")
      .single()

    if (existingCancellation) {
      return NextResponse.json({
        success: false,
        error: "A cancellation request is already pending for this order",
        error_code: "CANCELLATION_PENDING"
      }, { status: 409 })
    }

    try {
      // Crear la cancelación en Duffel
      const cancellation = await duffel.orderCancellations.create({
        order_id: orderId
      })

      if (!cancellation.data) {
        throw new Error("No cancellation data received")
      }

      // Guardar en la base de datos
      const { error: dbError } = await supabase
        .from("order_cancellations")
        .insert({
          order_id: orderId,
          user_id: user.id,
          duffel_cancellation_id: cancellation.data.id,
          status: 'pending',
          reason: reason,
          request_refund: requestRefund,
          refund_amount: cancellation.data.refund_amount,
          refund_currency: cancellation.data.refund_currency,
          created_at: new Date().toISOString()
        })

      if (dbError) {
        console.error("Database error:", dbError)
      }

      // Actualizar el estado de la reserva
      await supabase
        .from("flight_bookings")
        .update({
          status: 'cancellation_pending',
          updated_at: new Date().toISOString()
        })
        .eq("duffel_order_id", orderId)

      return NextResponse.json({
        success: true,
        cancellation: {
          id: cancellation.data.id,
          status: 'pending',
          order_id: orderId,
          refund_amount: cancellation.data.refund_amount,
          refund_currency: cancellation.data.refund_currency,
          expires_at: cancellation.data.expires_at,
          created_at: cancellation.data.created_at,
          requires_confirmation: true
        },
        refund_details: {
          eligible: requestRefund && cancellation.data.refund_amount && 
                   parseFloat(cancellation.data.refund_amount) > 0,
          amount: cancellation.data.refund_amount || '0',
          currency: cancellation.data.refund_currency || booking.total_currency,
          processing_time: "3-5 business days",
          method: "Original payment method"
        },
        next_steps: {
          action: "confirm_cancellation",
          message: "Please confirm the cancellation to proceed",
          deadline: cancellation.data.expires_at
        }
      })

    } catch (duffelError: any) {
      console.error("Duffel cancellation error:", duffelError)

      if (duffelError.message?.includes('cancellation not allowed')) {
        return NextResponse.json({
          success: false,
          error: "Cancellation is not allowed for this booking",
          error_code: "CANCELLATION_NOT_ALLOWED"
        }, { status: 400 })
      }

      if (duffelError.message?.includes('cancellation deadline passed')) {
        return NextResponse.json({
          success: false,
          error: "The deadline for cancellation has passed",
          error_code: "CANCELLATION_DEADLINE_PASSED"
        }, { status: 400 })
      }

      if (duffelError.message?.includes('order already cancelled')) {
        return NextResponse.json({
          success: false,
          error: "This order has already been cancelled",
          error_code: "ORDER_ALREADY_CANCELLED"
        }, { status: 400 })
      }

      return NextResponse.json({
        success: false,
        error: "Failed to create cancellation request",
        error_code: "CANCELLATION_REQUEST_FAILED"
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Cancellation request API Error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 })
  }
}

// Confirmar una cancelación
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const {
      cancellationId,
      confirmRefund = true,
      refundMethod = 'original'
    }: CancellationConfirmRequest = await request.json()

    if (!cancellationId) {
      return NextResponse.json({
        success: false,
        error: "Cancellation ID is required"
      }, { status: 400 })
    }

    try {
      // Verificar que la cancelación pertenece al usuario
      const { data: cancellationRecord } = await supabase
        .from("order_cancellations")
        .select("*")
        .eq("duffel_cancellation_id", cancellationId)
        .eq("user_id", user.id)
        .single()

      if (!cancellationRecord) {
        return NextResponse.json({
          success: false,
          error: "Cancellation not found"
        }, { status: 404 })
      }

      // Confirmar la cancelación en Duffel
      const confirmedCancellation = await duffel.orderCancellations.confirm(cancellationId)

      if (!confirmedCancellation.data) {
        throw new Error("No confirmed cancellation data received")
      }

      // Actualizar el estado en la base de datos
      const { error: updateError } = await supabase
        .from("order_cancellations")
        .update({
          status: 'confirmed',
          confirm_refund: confirmRefund,
          refund_method: refundMethod,
          confirmation_data: confirmedCancellation.data,
          confirmed_at: new Date().toISOString()
        })
        .eq("duffel_cancellation_id", cancellationId)

      if (updateError) {
        console.error("Database update error:", updateError)
      }

      // Actualizar la reserva principal
      await supabase
        .from("flight_bookings")
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          metadata: {
            ...cancellationRecord.original_data,
            cancellation: {
              id: cancellationId,
              confirmed_at: new Date().toISOString(),
              refund_amount: confirmedCancellation.data.refund_amount,
              refund_method: refundMethod
            }
          }
        })
        .eq("duffel_order_id", cancellationRecord.order_id)

      return NextResponse.json({
        success: true,
        confirmed_cancellation: {
          id: confirmedCancellation.data.id,
          status: 'confirmed',
          order_id: cancellationRecord.order_id,
          refund_amount: confirmedCancellation.data.refund_amount,
          refund_currency: confirmedCancellation.data.refund_currency,
          refund_to: confirmedCancellation.data.refund_to,
          confirmed_at: new Date().toISOString()
        },
        refund_info: confirmRefund ? {
          status: 'processing',
          amount: confirmedCancellation.data.refund_amount,
          currency: confirmedCancellation.data.refund_currency,
          method: refundMethod,
          estimated_arrival: "3-5 business days",
          reference: confirmedCancellation.data.id
        } : null,
        message: "Your booking has been successfully cancelled"
      })

    } catch (duffelError: any) {
      console.error("Duffel cancellation confirmation error:", duffelError)

      if (duffelError.message?.includes('cancellation expired')) {
        return NextResponse.json({
          success: false,
          error: "The cancellation request has expired",
          error_code: "CANCELLATION_EXPIRED"
        }, { status: 400 })
      }

      if (duffelError.message?.includes('already confirmed')) {
        return NextResponse.json({
          success: false,
          error: "This cancellation has already been confirmed",
          error_code: "ALREADY_CONFIRMED"
        }, { status: 400 })
      }

      return NextResponse.json({
        success: false,
        error: "Failed to confirm cancellation",
        error_code: "CANCELLATION_CONFIRMATION_FAILED"
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Cancellation confirmation API Error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 })
  }
}

// Cancelar una solicitud de cancelación (revertir)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cancellationId = searchParams.get('cancellationId')

    if (!cancellationId) {
      return NextResponse.json({
        success: false,
        error: "Cancellation ID is required"
      }, { status: 400 })
    }

    try {
      // Verificar que la cancelación pertenece al usuario y está pendiente
      const { data: cancellationRecord } = await supabase
        .from("order_cancellations")
        .select("*")
        .eq("duffel_cancellation_id", cancellationId)
        .eq("user_id", user.id)
        .eq("status", "pending")
        .single()

      if (!cancellationRecord) {
        return NextResponse.json({
          success: false,
          error: "Pending cancellation not found"
        }, { status: 404 })
      }

      // Nota: Duffel no tiene un endpoint específico para "cancelar" una cancelación
      // pero podemos marcarla como revertida en nuestro sistema

      // Actualizar el estado en la base de datos
      await supabase
        .from("order_cancellations")
        .update({
          status: 'reverted',
          reverted_at: new Date().toISOString()
        })
        .eq("duffel_cancellation_id", cancellationId)

      // Restaurar el estado de la reserva
      await supabase
        .from("flight_bookings")
        .update({
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq("duffel_order_id", cancellationRecord.order_id)

      return NextResponse.json({
        success: true,
        message: "Cancellation request has been reverted",
        order_id: cancellationRecord.order_id,
        reverted_at: new Date().toISOString()
      })

    } catch (error) {
      console.error("Cancellation revert error:", error)

      return NextResponse.json({
        success: false,
        error: "Failed to revert cancellation request",
        error_code: "CANCELLATION_REVERT_FAILED"
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Cancellation revert API Error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 })
  }
}