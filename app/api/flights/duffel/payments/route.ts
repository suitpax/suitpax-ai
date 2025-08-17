import { NextResponse } from 'next/server'
import { createClient as createSupabase } from '@/lib/supabase/server'
import { getDuffelClient } from '@/lib/duffel'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const token = process.env.DUFFEL_API_KEY || ''
    if (!token) return NextResponse.json({ error: 'Missing DUFFEL_API_KEY' }, { status: 500 })

    const body = await request.json()
    const duffel = getDuffelClient() as any

    const created = await duffel.payments.create(body, { idempotencyKey: crypto.randomUUID?.() || undefined })
    const pay = created?.data || created

    // Persist payment minimally
    try {
      const supabase = createSupabase()
      const userRes = await supabase.auth.getUser()
      const userId = userRes.data.user?.id
      if (userId) {
        await supabase.from('flight_payments').insert({
          user_id: userId,
          duffel_payment_id: pay?.id,
          duffel_order_id: pay?.order_id || body?.order_id || null,
          amount: pay?.amount ? Number(pay.amount) : null,
          currency: pay?.currency || null,
          status: pay?.status || null,
          method: pay?.type || 'card',
          raw: pay,
        })
      }
    } catch {}

    return NextResponse.json({ data: pay })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}