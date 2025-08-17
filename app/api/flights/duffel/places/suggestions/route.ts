import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || searchParams.get('query') || ''
    const limit = searchParams.get('limit') || '8'
    if (!q) return NextResponse.json({ data: [] })

    const token = process.env.DUFFEL_API_KEY || ''
    if (!token) return NextResponse.json({ error: 'Missing DUFFEL_API_KEY' }, { status: 500 })

    const url = new URL('https://api.duffel.com/places/suggestions')
    url.searchParams.set('name_or_iata', q)
    url.searchParams.set('limit', limit)

    const resp = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!resp.ok) {
      const text = await resp.text()
      return NextResponse.json({ error: text || 'Duffel error' }, { status: resp.status })
    }

    const json = await resp.json()
    // Normalize to { data: [...] }
    const data = Array.isArray(json?.data) ? json.data : (json?.places || [])
    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}