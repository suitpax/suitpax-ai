import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(request: NextRequest) {
  try {
    const { offerId, passengers, amount, currency } = await request.json()

    if (!offerId || !passengers || !amount || !currency) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const customer = await stripe.customers.create({
      email: passengers?.[0]?.email,
      name: `${passengers?.[0]?.given_name || ''} ${passengers?.[0]?.family_name || ''}`.trim(),
      metadata: {
        offerId,
        passengerCount: String(passengers.length),
      }
    })

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: currency.toLowerCase(),
      customer: customer.id,
      metadata: {
        offerId,
        passengers: JSON.stringify(passengers.map((p: any) => ({
          name: `${p.given_name} ${p.family_name}`.trim(),
          email: p.email,
          type: p.type
        }))),
        source: 'suitpax_flights'
      },
      automatic_payment_methods: { enabled: true }
    })

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      customerId: customer.id
    })
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}