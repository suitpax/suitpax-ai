import { NextResponse } from 'next/server'
import { enrichOffersWithAirlineInfo } from '@/lib/duffel-enrichment'
import { enrichOffersWithAircraftInfo } from '@/lib/duffel-aircraft'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const token = process.env.DUFFEL_API_KEY || ''
    if (!token) return NextResponse.json({ error: 'Missing DUFFEL_API_KEY' }, { status: 500 })

    const { searchParams } = new URL(request.url)
    const offer_request_id = searchParams.get('offer_request_id') || ''
    const limit = searchParams.get('limit') || '20'
    const after = searchParams.get('after') || undefined

    const url = new URL('https://api.duffel.com/air/offers')
    url.searchParams.set('offer_request_id', offer_request_id)
    if (limit) url.searchParams.set('limit', limit)
    if (after) url.searchParams.set('after', after)

    const resp = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Duffel-Version': 'v2',
        'Accept-Encoding': 'gzip',
      },
      cache: 'no-store',
    })

    const requestId = resp.headers.get('x-request-id') || undefined
    if (!resp.ok) {
      const text = await resp.text()
      return NextResponse.json({ error: text || 'Duffel error', request_id: requestId }, { status: resp.status })
    }

    const json = await resp.json()
    const offers = Array.isArray(json?.data) ? json.data : []
    const withAirlines = await enrichOffersWithAirlineInfo(offers)
    const withAircraft = await enrichOffersWithAircraftInfo(withAirlines)

    return NextResponse.json({ data: withAircraft, meta: json?.meta || {}, request_id: requestId })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}