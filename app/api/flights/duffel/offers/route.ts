import { NextResponse } from 'next/server'
import { getDuffelClient } from '@/lib/duffel'
import { enrichOffersWithAirlineInfo } from '@/lib/duffel-enrichment'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const offer_request_id = searchParams.get('offer_request_id')
    const after = searchParams.get('after') || undefined
    const before = searchParams.get('before') || undefined
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : undefined

    if (!offer_request_id) return NextResponse.json({ error: 'offer_request_id is required' }, { status: 400 })

    const duffel = getDuffelClient()
    const params: any = { offer_request_id }
    if (after) params.after = after
    if (before) params.before = before
    if (typeof limit === 'number') params.limit = limit

    const list = await (duffel as any).offers.list(params)
    const offers = list?.data || list?.offers || []
    const meta = list?.meta || {}
    const enriched = await enrichOffersWithAirlineInfo(offers)

    return NextResponse.json({ data: enriched, meta })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}