import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    const { priceId, successUrl, cancelUrl } = await request.json()
    const price = priceId || process.env.STRIPE_PLAN_PRICE_ID
    if (!price) {
      return NextResponse.json({ success: false, error: 'Missing price ID' }, { status: 400 })
    }

    // Reuse or create customer by email
    let customerId: string | undefined
    const existing = await stripe.customers.list({ email: user.email || undefined, limit: 1 })
    if (existing.data.length > 0) {
      customerId = existing.data[0].id
    } else {
      const created = await stripe.customers.create({
        email: user.email || undefined,
        name: user.user_metadata?.full_name || undefined,
        metadata: { source: 'suitpax_plans', user_id: user.id }
      })
      customerId = created.id
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price, quantity: 1 }],
      success_url: successUrl || `${request.nextUrl.origin}/dashboard/billing?status=success`,
      cancel_url: cancelUrl || `${request.nextUrl.origin}/dashboard/billing?status=cancel`,
      metadata: { source: 'suitpax_plans', user_id: user.id },
      subscription_data: {
        metadata: { source: 'suitpax_plans', user_id: user.id }
      }
    })

    return NextResponse.json({ success: true, url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}