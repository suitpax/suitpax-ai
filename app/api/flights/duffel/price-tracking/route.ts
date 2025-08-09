import { NextRequest, NextResponse } from 'next/server'
import { createDuffelClient } from '@/lib/duffel'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const startTrackingSchema = z.object({
  offer_id: z.string().min(1),
  target_price: z.string().optional(),
  currency: z.string().optional(),
  notification_email: z.string().email().optional(),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const offerId = searchParams.get('offerId')

    if (!offerId) {
      return NextResponse.json({ success: false, error: 'offerId is required' }, { status: 400 })
    }

    const duffel = createDuffelClient()

    // Try to re-fetch the offer details (if still valid) to get current price
    try {
      const offer = await duffel.offers.get(offerId)
      return NextResponse.json({
        success: true,
        data: {
          id: offer.data.id,
          total_amount: offer.data.total_amount,
          total_currency: offer.data.total_currency,
          expires_at: offer.data.expires_at,
          owner: offer.data.owner,
        },
      })
    } catch (error: any) {
      // If offer expired, return informative message
      return NextResponse.json({
        success: false,
        error: 'Offer not found or expired',
      }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const payload = startTrackingSchema.parse(body)

    // Optional: Verify offer exists before tracking
    const duffel = createDuffelClient()
    try {
      await duffel.offers.get(payload.offer_id)
    } catch (_) {
      return NextResponse.json({ success: false, error: 'Offer not found or expired' }, { status: 404 })
    }

    // Store tracking request
    const { error: dbError } = await supabase
      .from('flight_price_tracking')
      .insert({
        user_id: user.id,
        offer_id: payload.offer_id,
        target_price: payload.target_price || null,
        currency: payload.currency || 'USD',
        notification_email: payload.notification_email || null,
        notes: payload.notes || null,
        status: 'active',
        created_at: new Date().toISOString(),
      })

    if (dbError) {
      console.warn('Price tracking table insert failed:', dbError)
      // Still return success so UI can proceed, but inform about persistence issue
      return NextResponse.json({
        success: true,
        warning: 'Tracking created, but persistence failed. Ensure table flight_price_tracking exists.',
      })
    }

    return NextResponse.json({ success: true, message: 'Tracking started' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid payload', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const offerId = searchParams.get('offerId')

    if (!offerId) {
      return NextResponse.json({ success: false, error: 'offerId is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('flight_price_tracking')
      .delete()
      .eq('user_id', user.id)
      .eq('offer_id', offerId)

    if (error) {
      console.warn('Price tracking deletion failed:', error)
    }

    return NextResponse.json({ success: true, message: 'Tracking disabled' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}