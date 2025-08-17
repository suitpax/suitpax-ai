import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const offer_id = searchParams.get('offer_id')
    const cabin_class = searchParams.get('cabin_class') || undefined
    if (!offer_id) return NextResponse.json({ error: 'offer_id is required' }, { status: 400 })

    const token = process.env.DUFFEL_API_KEY || ''
    if (!token) return NextResponse.json({ error: 'Missing DUFFEL_API_KEY' }, { status: 500 })

    const url = new URL('https://api.duffel.com/air/seat_maps')
    url.searchParams.set('offer_id', offer_id)
    if (cabin_class) url.searchParams.set('cabin_class', cabin_class)

    const resp = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Duffel-Version': 'v2',
        'Accept-Encoding': 'gzip',
      },
      cache: 'no-store',
    })

    if (!resp.ok) {
      const text = await resp.text()
      return NextResponse.json({ error: text || 'Duffel error' }, { status: resp.status })
    }

    const json = await resp.json()
    return NextResponse.json(json)
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}