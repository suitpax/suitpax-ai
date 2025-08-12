import { type NextRequest, NextResponse } from "next/server"
import { createDuffelClient, payHoldOrder, getHoldOrderStatus } from "@/lib/duffel"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const payHoldOrderSchema = z.object({
  orderId: z.string().min(1),
  paymentAmount: z.string().min(1),
  paymentCurrency: z.string().length(3),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { orderId, paymentAmount, paymentCurrency } = payHoldOrderSchema.parse(body)

    const duffel = createDuffelClient()

    // First check the current status of the hold order
    const statusResult = await getHoldOrderStatus(duffel, orderId)

    if (!statusResult.success) {
      return NextResponse.json({ error: statusResult.error }, { status: 400 })
    }

    // Verify the order belongs to the user
    const { data: booking } = await supabase
      .from("flight_bookings")
      .select("*")
      .eq("duffel_order_id", orderId)
      .eq("user_id", user.id)
      .single()

    if (!booking) {
      return NextResponse.json({ error: "Order not found or access denied" }, { status: 404 })
    }

    // Check if payment is still possible
    if (statusResult.status.payment_expired) {
      return NextResponse.json(
        {
          error: "Payment deadline has passed",
          expired: true,
        },
        { status: 410 },
      )
    }

    if (!statusResult.status.awaiting_payment) {
      return NextResponse.json({ error: "Order is not awaiting payment" }, { status: 400 })
    }

    // Process the payment
    const paymentResult = await payHoldOrder(duffel, orderId, paymentAmount, paymentCurrency)

    if (!paymentResult.success) {
      return NextResponse.json(
        {
          error: paymentResult.error,
          error_code: paymentResult.error_code,
        },
        { status: 400 },
      )
    }

    // Update the booking record
    await supabase
      .from("flight_bookings")
      .update({
        payment_status: "paid",
        status: "confirmed",
        metadata: {
          ...booking.metadata,
          payment_completed_at: new Date().toISOString(),
          payment_method: "hold_order_payment",
        },
      })
      .eq("duffel_order_id", orderId)

    return NextResponse.json({
      success: true,
      message: "Payment processed successfully",
      order: paymentResult.order,
      payment: paymentResult.payment,
    })
  } catch (error) {
    console.error("Pay hold order error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 })
    }

    const duffel = createDuffelClient()

    // Verify the order belongs to the user
    const { data: booking } = await supabase
      .from("flight_bookings")
      .select("*")
      .eq("duffel_order_id", orderId)
      .eq("user_id", user.id)
      .single()

    if (!booking) {
      return NextResponse.json({ error: "Order not found or access denied" }, { status: 404 })
    }

    // Get current status
    const statusResult = await getHoldOrderStatus(duffel, orderId)

    if (!statusResult.success) {
      return NextResponse.json({ error: statusResult.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      order: statusResult.order,
      status: statusResult.status,
      booking: booking,
    })
  } catch (error) {
    console.error("Get hold order status error:", error)
    return NextResponse.json({ error: "Failed to get order status" }, { status: 500 })
  }
}
