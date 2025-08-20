import { NextResponse } from 'next/server'
import { createClient as createSupabase } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const supabase = createSupabase()
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id
    if (!userId) return NextResponse.json({ orders: [], payments: [] })

    const { data: orders } = await supabase
      .from('flight_orders')
      .select('id, duffel_order_id, total_amount, total_currency, status, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(25)

    const { data: payments } = await supabase
      .from('flight_payments')
      .select('id, duffel_payment_id, duffel_order_id, amount, currency, status, method, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(25)

    return NextResponse.json({ orders: orders || [], payments: payments || [] })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}

// Duplicate block removed