import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createDuffelClient } from '@/lib/duffel'

const duffel = createDuffelClient()

export async function POST(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { orderId } = params
    const body = await request.json()
    const services = (body?.services || []) as Array<{ id: string; quantity?: number; passenger_id?: string; segment_id?: string }>

    if (!orderId || services.length === 0) {
      return NextResponse.json({ success: false, error: 'Order ID and services are required' }, { status: 400 })
    }

    // Check ownership
    const { data: booking } = await supabase
      .from('flight_bookings')
      .select('*')
      .eq('duffel_order_id', orderId)
      .eq('user_id', user.id)
      .single()

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    // Create change request
    const changeRequest = await duffel.orderChangeRequests.create({
      order_id: orderId,
      slices: { add: [], remove: [] },
      // @ts-expect-error services field may not be typed in SDK; API supports it
      services: { add: services.map(s => ({ id: s.id, quantity: s.quantity ?? 1, passenger_id: s.passenger_id, segment_id: s.segment_id })), remove: [] },
    } as any)

    let confirmed = changeRequest as any
    if ((changeRequest as any).data?.requires_confirmation) {
      const bestOffer = (changeRequest as any).data?.order_change_offers?.[0]
      if (bestOffer) {
        confirmed = await (duffel as any).orderChangeOffers.create({
          order_change_request_id: (changeRequest as any).data.id,
          selected_order_change_offer: bestOffer.id,
        })
      }
    }

    return NextResponse.json({
      success: true,
      change_request_id: confirmed.data?.id ?? changeRequest.data.id,
      status: confirmed.data?.status ?? 'confirmed',
    })
  } catch (error) {
    console.error('Services add error:', error)
    return NextResponse.json({ success: false, error: 'Failed to add services' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { orderId } = params
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('serviceId')

    if (!orderId || !serviceId) {
      return NextResponse.json({ success: false, error: 'Order ID and serviceId are required' }, { status: 400 })
    }

    // Check ownership
    const { data: booking } = await supabase
      .from('flight_bookings')
      .select('*')
      .eq('duffel_order_id', orderId)
      .eq('user_id', user.id)
      .single()

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    const changeRequest = await duffel.orderChangeRequests.create({
      order_id: orderId,
      slices: { add: [], remove: [] },
      // @ts-expect-error services field may not be typed in SDK; API supports it
      services: { add: [], remove: [{ id: serviceId }] },
    } as any)

    return NextResponse.json({ success: true, change_request_id: changeRequest.data.id })
  } catch (error) {
    console.error('Services remove error:', error)
    return NextResponse.json({ success: false, error: 'Failed to remove service' }, { status: 500 })
  }
}