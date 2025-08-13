import { type NextRequest, NextResponse } from "next/server"
import { createDuffelClient } from "@/lib/duffel"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { quote_id, guest_info, special_requests } = body

    // Validate required fields
    if (!quote_id || !guest_info) {
      return NextResponse.json(
        { error: "Missing required fields: quote_id, guest_info" },
        { status: 400 },
      )
    }

    const duffel = createDuffelClient()
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const booking = await (duffel as any).stays.bookings.create({
      quote_id,
      guests: [guest_info],
      phone_number: guest_info.phone_number,
      email: guest_info.email,
      accommodation_special_requests: special_requests,
    })

    await supabase.from("hotel_bookings").insert({
      user_id: user.id,
      duffel_booking_id: booking?.data?.id,
      confirmation_number: booking?.data?.confirmation_number,
      total_amount: booking?.data?.total_amount,
      total_currency: booking?.data?.total_currency,
      status: "confirmed",
    })

    return NextResponse.json({
      success: true,
      booking: booking?.data,
    })
  } catch (error) {
    console.error("Hotel booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
