import { NextResponse } from 'next/server'
import { createClient as createSupabase } from '@/lib/supabase/server'
import { getDuffelClient } from '@/lib/duffel'
import crypto from 'crypto'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const token = process.env.DUFFEL_API_KEY || ''
    if (!token) return NextResponse.json({ error: 'Missing DUFFEL_API_KEY' }, { status: 500 })

    const body = await request.json()
    const duffel = getDuffelClient() as any

    const created = await duffel.orders.create(body, { idempotencyKey: crypto.randomUUID?.() || undefined })
    const order = created?.data || created

    // Persist order minimally
    try {
      const supabase = createSupabase()
      const userRes = await supabase.auth.getUser()
      const userId = userRes.data.user?.id
      if (userId) {
        await supabase.from('flight_orders').insert({
          user_id: userId,
          duffel_order_id: order?.id,
          total_amount: order?.total_amount ? Number(order.total_amount) : null,
          total_currency: order?.total_currency || null,
          status: order?.status || null,
          raw: order,
        })
      }
    } catch {}

    return NextResponse.json({ data: order })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}