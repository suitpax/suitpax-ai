import { NextResponse } from 'next/server'
import { enrichOffersWithAirlineInfo } from '@/lib/duffel-enrichment'
import { enrichOffersWithAircraftInfo } from '@/lib/duffel-aircraft'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const token = process.env.DUFFEL_API_KEY || ''
    if (!token) return NextResponse.json({ error: 'Missing DUFFEL_API_KEY' }, { status: 500 })

    const body = await request.json()
    const url = new URL('https://api.duffel.com/air/offer_requests')

    const resp = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Duffel-Version': 'v2',
        'Accept-Encoding': 'gzip',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    })

    const requestId = resp.headers.get('x-request-id') || undefined
    if (!resp.ok) {
      const text = await resp.text()
      return NextResponse.json({ error: text || 'Duffel error', request_id: requestId }, { status: resp.status })
    }

    const json = await resp.json()
    const offerRequestId = json?.data?.id || json?.id

    // Fetch offers for the returned request id
    const offersUrl = new URL('https://api.duffel.com/air/offers')
    offersUrl.searchParams.set('offer_request_id', offerRequestId)
    offersUrl.searchParams.set('limit', '20')
    const offersResp = await fetch(offersUrl.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Duffel-Version': 'v2',
        'Accept-Encoding': 'gzip',
      },
      cache: 'no-store',
    })
    const offersJson = await offersResp.json()
    const offers = Array.isArray(offersJson?.data) ? offersJson.data : []
    const withAirlines = await enrichOffersWithAirlineInfo(offers)
    const withAircraft = await enrichOffersWithAircraftInfo(withAirlines)

    return NextResponse.json({ data: withAircraft, offer_request_id: offerRequestId, meta: offersJson?.meta || {}, request_id: requestId })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}

