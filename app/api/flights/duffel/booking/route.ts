import { NextRequest, NextResponse } from 'next/server'
import { createDuffelClient, getPaymentMethod } from '@/lib/duffel'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const bookingSchema = z.object({
  selected_offers: z.array(z.string()).min(1),
  passengers: z.array(z.object({
    given_name: z.string().min(1),
    family_name: z.string().min(1),
    title: z.enum(['mr', 'ms', 'mrs', 'miss', 'dr']).optional(),
    gender: z.enum(['male', 'female']).optional(),
    born_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    phone_number: z.string().min(6),
    email: z.string().email(),
    loyalty_programme_accounts: z.array(z.object({ airline_iata_code: z.string().length(2), account_number: z.string().min(3) })).optional(),
    seat_preference: z.string().optional(),
    meal_preference: z.string().optional(),
  })).min(1),
  payments: z.array(z.object({
    type: z.string(),
    amount: z.string(),
    currency: z.string().length(3),
  })).min(1),
  metadata: z.record(z.any()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const bookingData = bookingSchema.parse(body)

    const duffel = createDuffelClient();

    // Create the order in Duffel
    const order = await duffel.orders.create({
      selected_offers: bookingData.selected_offers,
      passengers: bookingData.passengers,
      payments: bookingData.payments,
      metadata: { ...(bookingData.metadata || {}), user_id: user.id },
    })

    const orderData = order.data

    // Persist booking record
    const firstSlice = orderData.slices?.[0]
    const lastSlice = orderData.slices?.[orderData.slices.length - 1]

    await supabase
      .from('flight_bookings')
      .insert({
        user_id: user.id,
        duffel_order_id: orderData.id,
        booking_reference: orderData.booking_reference,
        status: orderData.status || 'confirmed',
        total_amount: orderData.total_amount,
        total_currency: orderData.total_currency,
        departure_date: firstSlice?.segments?.[0]?.departing_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
        return_date: lastSlice?.segments?.[lastSlice.segments.length - 1]?.arriving_at?.slice(0, 10) || null,
        origin: firstSlice?.origin?.iata_code || '',
        destination: lastSlice?.destination?.iata_code || firstSlice?.destination?.iata_code || '',
        passenger_count: orderData.passengers?.length || 1,
        metadata: {
          passengers: orderData.passengers,
          slices: orderData.slices,
          available_actions: orderData.available_actions,
          created_at: new Date().toISOString(),
        },
        payment_status: 'paid',
      })
      .catch((e) => {
        console.warn('Failed to insert flight_bookings:', e)
      })

    return NextResponse.json({
      success: true,
      data: {
        id: orderData.id,
        booking_reference: orderData.booking_reference,
        passengers: orderData.passengers,
        slices: orderData.slices,
        total_amount: orderData.total_amount,
        available_actions: orderData.available_actions,
        status: orderData.status,
      }
    })

  } catch (error) {
    console.error('Booking error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid booking data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
