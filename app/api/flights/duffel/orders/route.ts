import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const token = process.env.DUFFEL_API_KEY || ''
    if (!token) return NextResponse.json({ error: 'Missing DUFFEL_API_KEY' }, { status: 500 })

    const body = await request.json()
    const url = new URL('https://api.duffel.com/air/orders')

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
    try {
      const json = text ? JSON.parse(text) : {}
      if (!resp.ok) return NextResponse.json({ error: json?.error || text || 'Duffel error' }, { status: resp.status })
      return NextResponse.json(json)
    } catch {
      if (!resp.ok) return NextResponse.json({ error: text || 'Duffel error' }, { status: resp.status })
      return NextResponse.json({ raw: text })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}