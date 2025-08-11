import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const url = new URL(req.url)
    const offerId = url.searchParams.get('offerId')
    if (!offerId) return NextResponse.json({ success: false, error: 'offerId required' }, { status: 400 })
    const { data, error } = await supabase.from('flight_services_pending').select('*').eq('user_id', user.id).eq('offer_id', offerId).maybeSingle()
    if (error && error.code !== 'PGRST116') throw error
    return NextResponse.json({ success: true, data: data || null })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Failed to fetch pending services' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const { offerId, services } = body || {}
    if (!offerId || !Array.isArray(services)) return NextResponse.json({ success: false, error: 'offerId and services[] required' }, { status: 400 })
    // Upsert
    const { error } = await supabase.from('flight_services_pending').upsert({ user_id: user.id, offer_id: offerId, services }, { onConflict: 'user_id,offer_id' })
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Failed to save pending services' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const url = new URL(req.url)
    const offerId = url.searchParams.get('offerId')
    if (!offerId) return NextResponse.json({ success: false, error: 'offerId required' }, { status: 400 })
    await supabase.from('flight_services_pending').delete().eq('user_id', user.id).eq('offer_id', offerId)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Failed to clear pending services' }, { status: 500 })
  }
}