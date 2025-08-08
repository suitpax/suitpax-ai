import { NextRequest, NextResponse } from "next/server"
import { createDuffelClient, handleDuffelError } from "@/lib/duffel-config"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const duffel = createDuffelClient()
    const supabase = createClient()
    const { orderId } = params

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400 })
    }

    const orderResponse = await duffel.orders.get(orderId)

    if (!orderResponse.data) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }
    
    // Security check: ensure the user requesting the order is the one who booked it
    if (orderResponse.data.metadata?.user_id !== user.id) {
        return NextResponse.json({ success: false, error: "Unauthorized access to order" }, { status: 403 })
    }

    return NextResponse.json({ success: true, order: orderResponse.data })
  } catch (error) {
    const errorResponse = handleDuffelError(error)
    return NextResponse.json(errorResponse, { status: errorResponse.status })
  }
}
