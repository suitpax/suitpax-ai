import { NextResponse } from 'next/server'
import { createClient as createSupabase } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const token = process.env.DUFFEL_API_KEY || ''
    if (!token) return NextResponse.json({ error: 'Missing DUFFEL_API_KEY' }, { status: 500 })

    const body = await request.json()
    const url = new URL('https://api.duffel.com/air/payments')

    const resp = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Duffel-Version': 'v2',
        'Accept-Encoding': 'gzip',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    })

    const text = await resp.text()
    let json: any = {}
    try { json = text ? JSON.parse(text) : {} } catch {}
    if (!resp.ok) return NextResponse.json({ error: json?.error || text || 'Duffel error' }, { status: resp.status })

    // Persist payment minimally
    try {
      const supabase = createSupabase()
      const userRes = await supabase.auth.getUser()
      const userId = userRes.data.user?.id
      if (userId) {
        const pay = json?.data || json
        await supabase.from('flight_payments').insert({
          user_id: userId,
          duffel_payment_id: pay?.id,
          duffel_order_id: pay?.order_id || body?.order_id || null,
          amount: pay?.amount ? Number(pay.amount) : null,
          currency: pay?.currency || null,
          status: pay?.status || null,
          method: pay?.type || 'card',
          raw: pay || json,
        })
      }
    } catch {}

    return NextResponse.json(json)
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}