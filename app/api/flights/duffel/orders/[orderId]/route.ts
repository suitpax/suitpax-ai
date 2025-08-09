import { NextRequest, NextResponse } from "next/server"
import { createDuffelClient, handleDuffelError } from '@/lib/duffel';
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const duffel = createDuffelClient()
    const supabase = createClient()
    const { orderId } = params

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400 })
    }

    const orderResponse = await duffel.orders.get(orderId)

    if (!orderResponse.data) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }
    
    // Security check: ensure the user requesting the order is the one who booked it
    if (orderResponse.data.metadata?.user_id !== user.id) {
        return NextResponse.json({ success: false, error: "Unauthorized access to order" }, { status: 403 })
    }

    // Enrich with airline logos
    const order = orderResponse.data as any
    const codes = new Set<string>()
    for (const slice of order.slices || []) {
      for (const segment of slice.segments || []) {
        if (segment?.marketing_carrier?.iata_code) codes.add(segment.marketing_carrier.iata_code)
      }
    }
    const { getAirlineData } = await import('@/lib/duffel')
    const map: Record<string, any> = {}
    await Promise.all(Array.from(codes).map(async (c) => {
      try {
        const a = await getAirlineData(duffel as any, c)
        if (a) map[c] = a
      } catch {}
    }))
    const enriched = {
      ...order,
      slices: order.slices.map((s: any) => ({
        ...s,
        segments: s.segments.map((seg: any) => {
          const info = map[seg?.marketing_carrier?.iata_code]
          return { ...seg, airline: info ? { name: info.name, logo_symbol_url: info.logo_symbol_url, logo_lockup_url: info.logo_lockup_url } : { name: seg.marketing_carrier?.name } }
        })
      }))
    }

    return NextResponse.json({ success: true, order: enriched })
  } catch (error) {
    const errorResponse = handleDuffelError(error)
    return NextResponse.json(errorResponse, { status: errorResponse.status })
  }
}
