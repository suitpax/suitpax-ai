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

    // Find or create customer by email
    let customerId: string
    const existing = await stripe.customers.list({ email: user.email || undefined, limit: 1 })
    if (existing.data.length > 0) {
      customerId = existing.data[0].id
    } else {
      const created = await stripe.customers.create({
        email: user.email || undefined,
        name: user.user_metadata?.full_name || undefined,
        metadata: { source: 'suitpax', user_id: user.id }
      })
      customerId = created.id
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${request.nextUrl.origin}/dashboard/billing`
    })

    return NextResponse.json({ success: true, url: session.url })
  } catch (error: any) {
    console.error('Portal error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}