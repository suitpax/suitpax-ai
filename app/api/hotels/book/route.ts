export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"
import { getDuffelClient } from "@/lib/duffel/client"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { quote_id, guest_info, special_requests } = body

    // Validate required fields
    if (!quote_id || !guest_info) {
      return NextResponse.json({ error: "Missing required fields: quote_id, guest_info" }, { status: 400 })
    }

    // Validate guest info
    const { given_name, family_name, born_on, phone_number, email } = guest_info
    if (!given_name || !family_name || !born_on || !phone_number || !email) {
      return NextResponse.json(
        { error: "Guest info must include: given_name, family_name, born_on, phone_number, email" },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const duffel = getDuffelClient()
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Create hotel booking
    const booking = await duffel.createHotelBooking(quote_id, guest_info, special_requests)

    // Store booking in database
    await supabase.from("hotel_bookings").insert({
      user_id: user.id,
      duffel_booking_id: booking.data.id,
      confirmation_number: booking.data.confirmation_number || booking.data.id,
      total_amount: booking.data.total_amount,
      total_currency: booking.data.total_currency,
      guest_details: guest_info,
      hotel_details: booking.data,
      check_in_date: booking.data.check_in_date,
      check_out_date: booking.data.check_out_date,
      status: "confirmed",
    })

    return NextResponse.json({
      success: true,
      booking: booking.data,
    })
  } catch (error) {
    console.error("Hotel booking error:", error)

    if ((error as any).name === "DuffelError") {
      return NextResponse.json(
        {
          error: "Booking failed",
          details: (error as any).message,
        },
        { status: (error as any).status || 500 },
      )
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
