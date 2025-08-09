import { NextRequest, NextResponse } from 'next/server'
import { createDuffelClient } from '@/lib/duffel'
import { z } from 'zod'

const bookingSchema = z.object({
  selected_offers: z.array(z.string()),
  passengers: z.array(z.object({
    given_name: z.string().min(1),
    family_name: z.string().min(1),
    title: z.enum(['mr', 'ms', 'mrs', 'miss', 'dr']),
    gender: z.enum(['male', 'female']),
    born_on: z.string().regex(/^d{4}-d{2}-d{2}$/),
    phone_number: z.string(),
    email: z.string().email(),
  })),
  payments: z.array(z.object({
    type: z.literal('balance'),
    amount: z.string(),
    currency: z.string(),
  })),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const bookingData = bookingSchema.parse(body)

    const duffel = createDuffelClient();

    const order = await duffel.orders.create({
      selected_offers: bookingData.selected_offers,
      passengers: bookingData.passengers,
      payments: bookingData.payments,
    })

    return NextResponse.json({
      success: true,
      data: {
        id: order.data.id,
        booking_reference: order.data.booking_reference,
        passengers: order.data.passengers,
        slices: order.data.slices,
        total_amount: order.data.total_amount,
        available_actions: order.data.available_actions,
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