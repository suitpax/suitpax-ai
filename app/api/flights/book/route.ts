import { type NextRequest, NextResponse } from "next/server"
import { getDuffelClient } from "@/lib/duffel/client"
import { validatePassengerData } from "@/lib/duffel/utils"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { offer_id, passengers, payment_amount, payment_currency } = body

    // Validate required fields
    if (!offer_id || !passengers || !payment_amount || !payment_currency) {
      return NextResponse.json(
        { error: "Missing required fields: offer_id, passengers, payment_amount, payment_currency" },
        { status: 400 },
      )
    }

    // Validate passenger data (array)
    if (!Array.isArray(passengers) || passengers.length === 0) {
      return NextResponse.json(
        { error: "Passengers must be a non-empty array" },
        { status: 400 },
      )
    }
    const allValid = passengers.every((p: any) => validatePassengerData(p).isValid)
    if (!allValid) {
      const errors = passengers.map((p: any, i: number) => ({ index: i, ...validatePassengerData(p) })).filter((r) => !r.isValid)
      return NextResponse.json(
        {
          error: "Invalid passenger data",
          details: errors,
        },
        { status: 400 },
      )
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

    // First, get the latest offer to verify it's still valid
    const offerResponse = await duffel.getOffer(offer_id)
    const offer = offerResponse.data

    // Check if offer is expired
    if (new Date(offer.expires_at) <= new Date()) {
      return NextResponse.json(
        {
          error: "Offer has expired",
          expired: true,
        },
        { status: 400 },
      )
    }

    // Check if price matches
    if (offer.total_amount !== payment_amount || offer.total_currency !== payment_currency) {
      return NextResponse.json(
        {
          error: "Price has changed",
          current_amount: offer.total_amount,
          current_currency: offer.total_currency,
        },
        { status: 400 },
      )
    }

    // Create booking
    const booking = await duffel.createFlightBooking(offer_id, passengers, payment_amount, payment_currency)

    // Store booking in database
    await supabase.from("flight_bookings").insert({
      user_id: user.id,
      duffel_order_id: booking.data.id,
      booking_reference: booking.data.booking_reference,
      total_amount: booking.data.total_amount,
      total_currency: booking.data.total_currency,
      passenger_details: passengers,
      flight_details: offer,
      status: "confirmed",
    })

    return NextResponse.json({
      success: true,
      booking: booking.data,
    })
  } catch (error) {
    console.error("Flight booking error:", error)

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
