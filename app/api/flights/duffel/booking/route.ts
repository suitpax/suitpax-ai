import { type NextRequest, NextResponse } from "next/server"
import { createDuffelClient } from "@/lib/duffel"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

// Stripe will be initialized only when needed and properly configured

const bookingSchema = z.object({
  selected_offers: z.array(z.string()).min(1),
  passengers: z
    .array(
      z.object({
        given_name: z.string().min(1),
        family_name: z.string().min(1),
        title: z.enum(["mr", "ms", "mrs", "miss", "dr"]).optional(),
        gender: z.enum(["male", "female"]).optional(),
        born_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        phone_number: z.string().min(6),
        email: z.string().email(),
        loyalty_programme_accounts: z
          .array(z.object({ airline_iata_code: z.string().length(2), account_number: z.string().min(3) }))
          .optional(),
        seat_preference: z.string().optional(),
        meal_preference: z.string().optional(),
        type: z.enum(["adult", "child", "infant_without_seat"]).optional(),
      }),
    )
    .min(1),
  hold_order: z.boolean().optional(),
  payments: z
    .array(
      z.object({
        type: z.string(),
        amount: z.string(),
        currency: z.string().length(3),
      }),
    )
    .optional(), // Made optional for hold orders
  metadata: z.record(z.any()).optional(),
})

const paymentFlowSchema = z.object({
  offerId: z.string(),
  passengers: z
    .array(
      z.object({
        given_name: z.string().min(1),
        family_name: z.string().min(1),
        title: z.string().optional(),
        born_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        phone_number: z.string().optional(),
        email: z.string().email(),
        type: z.enum(["adult", "child", "infant_without_seat"]),
      }),
    )
    .min(1),
  paymentIntentId: z.string().optional(), // Made optional for hold orders
  hold_order: z.boolean().optional(),
})

async function handleDuffelError(error: any) {
  console.error("Duffel API Error:", error)

  if (error?.response?.data?.errors) {
    const duffelErrors = error.response.data.errors
    return {
      error: "Booking failed",
      details: duffelErrors,
      status: error.response.status || 400,
    }
  }

  if (error?.message?.includes("offer_expired")) {
    return {
      error: "Offer has expired. Please search for new flights.",
      expired: true,
      status: 410,
    }
  }

  if (error?.message?.includes("price_changed")) {
    return {
      error: "Flight price has changed. Please review the updated price.",
      price_changed: true,
      status: 409,
    }
  }

  return {
    error: "Failed to create booking. Please try again.",
    status: 500,
  }
}

function validatePassengerData(passengers: any[]) {
  const errors: string[] = []

  passengers.forEach((passenger, index) => {
    if (!passenger.given_name || passenger.given_name.length < 1) {
      errors.push(`Passenger ${index + 1}: Given name is required`)
    }
    if (!passenger.family_name || passenger.family_name.length < 1) {
      errors.push(`Passenger ${index + 1}: Family name is required`)
    }
    if (!passenger.email || !/\S+@\S+\.\S+/.test(passenger.email)) {
      errors.push(`Passenger ${index + 1}: Valid email is required`)
    }
    if (!passenger.born_on || !/^\d{4}-\d{2}-\d{2}$/.test(passenger.born_on)) {
      errors.push(`Passenger ${index + 1}: Valid birth date (YYYY-MM-DD) is required`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}

async function validateOfferBeforeBooking(duffel: any, offerId: string) {
  try {
    const offer = await duffel.offers.get(offerId)
    const offerData = offer.data

    // Check if offer is expired
    const now = new Date()
    const expiresAt = new Date(offerData.expires_at)

    if (now > expiresAt) {
      return {
        valid: false,
        expired: true,
        error: "Offer has expired",
      }
    }

    return {
      valid: true,
      offer: offerData,
    }
  } catch (error) {
    return {
      valid: false,
      error: "Could not validate offer",
      expired: false,
    }
  }
}

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
    let orderData: any

    const duffel = createDuffelClient()

    if (body?.offerId) {
      // Modern flow with offer ID
      const pf = paymentFlowSchema.parse({
        offerId: body.offerId,
        passengers: body.passengers,
        paymentIntentId: body.paymentIntentId,
        hold_order: body.hold_order || false,
      })

      const validation = await validateOfferBeforeBooking(duffel, pf.offerId)
      if (!validation.valid) {
        return NextResponse.json(
          {
            success: false,
            error: validation.error,
            expired: validation.expired,
          },
          { status: validation.expired ? 410 : 400 },
        )
      }

      const passengerValidation = validatePassengerData(pf.passengers)
      if (!passengerValidation.valid) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid passenger data",
            details: passengerValidation.errors,
          },
          { status: 400 },
        )
      }

      const offer = validation.offer
      const passengers = pf.passengers.map((p, idx) => ({
        id: offer.passengers[idx]?.id || `pas_${idx + 1}`,
        type: p.type,
        title: p.title as any,
        given_name: p.given_name,
        family_name: p.family_name,
        gender: (p as any).gender || "male",
        born_on: p.born_on,
        phone_number: p.phone_number || "",
        email: p.email,
      }))

      if (pf.hold_order) {
        // Create hold order without payment
        const order = await duffel.orders.create({
          selected_offers: [pf.offerId],
          passengers,
          type: "hold",
          metadata: {
            user_id: user.id,
            source: "suitpax",
            booking_timestamp: new Date().toISOString(),
            hold_order: true,
          },
        } as any)
        orderData = order.data
      } else {
        // For now, redirect to contact for payment processing
        return NextResponse.json(
          {
            success: false,
            error: "Payment processing temporarily unavailable. Please contact hello@suitpax.com for assistance.",
            contact_required: true,
          },
          { status: 503 },
        )
      }
    } else {
      // Legacy flow - simplified to hold orders only
      const bookingData = bookingSchema.parse(body)
      const passengers = bookingData.passengers.map((p, idx) => ({
        id: `pas_${idx + 1}`,
        type: (p.type || "adult") as any,
        title: p.title as any,
        given_name: p.given_name,
        family_name: p.family_name,
        gender: (p as any).gender || "male",
        born_on: p.born_on,
        phone_number: p.phone_number,
        email: p.email,
        loyalty_programme_accounts: p.loyalty_programme_accounts as any,
      }))

      if (bookingData.hold_order) {
        const order = await duffel.orders.create({
          selected_offers: bookingData.selected_offers,
          passengers,
          type: "hold",
          metadata: { ...(bookingData.metadata || {}), user_id: user.id, hold_order: true },
        } as any)
        orderData = order.data
      } else {
        return NextResponse.json(
          {
            success: false,
            error: "Payment processing temporarily unavailable. Please contact hello@suitpax.com for assistance.",
            contact_required: true,
          },
          { status: 503 },
        )
      }
    }

    const firstSlice = orderData.slices?.[0]
    const lastSlice = orderData.slices?.[orderData.slices.length - 1]

    try {
      const { error: insertError } = await supabase.from("flight_bookings").insert({
        user_id: user.id,
        duffel_order_id: orderData.id,
        booking_reference: orderData.booking_reference,
        status: orderData.status || "confirmed",
        total_amount: orderData.total_amount,
        total_currency: orderData.total_currency,
        departure_date: firstSlice?.segments?.[0]?.departing_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
        return_date: lastSlice?.segments?.[lastSlice.segments.length - 1]?.arriving_at?.slice(0, 10) || null,
        origin: firstSlice?.origin?.iata_code || "",
        destination: lastSlice?.destination?.iata_code || firstSlice?.destination?.iata_code || "",
        passenger_count: orderData.passengers?.length || 1,
        metadata: {
          passengers: orderData.passengers,
          slices: orderData.slices,
          available_actions: (orderData as any).available_actions,
          created_at: new Date().toISOString(),
          hold_order: body.hold_order || false,
        },
        payment_status: body.hold_order ? "pending" : "paid",
      })

      if (insertError) {
        console.error("Failed to insert flight_bookings:", insertError)
      }
    } catch (e) {
      console.error("Database error:", e)
    }

    return NextResponse.json({
      success: true,
      order: {
        id: orderData.id,
        booking_reference: orderData.booking_reference,
        passengers: orderData.passengers,
        slices: orderData.slices,
        total_amount: orderData.total_amount,
        available_actions: (orderData as any).available_actions,
        status: orderData.status,
        hold_order: body.hold_order || false,
        payment_required_by: (orderData as any).payment_required_by,
        confirmation: {
          booking_reference: orderData.booking_reference,
          confirmation_number: orderData.id,
          booking_date: new Date().toISOString(),
          total_paid: body.hold_order ? "0.00" : orderData.total_amount,
          currency: orderData.total_currency,
          is_hold_order: body.hold_order || false,
        },
      },
    })
  } catch (error) {
    console.error("Booking error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid booking data", details: error.errors }, { status: 400 })
    }

    const errorResponse = await handleDuffelError(error)
    return NextResponse.json(errorResponse, {
      status: errorResponse.status || 500,
    })
  }
}
