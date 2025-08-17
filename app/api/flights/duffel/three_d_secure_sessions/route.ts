import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const token = process.env.DUFFEL_API_KEY || ''
    if (!token) return NextResponse.json({ error: 'Missing DUFFEL_API_KEY' }, { status: 500 })

    const body = await request.json()
    const url = new URL('https://api.duffel.com/air/three_d_secure_sessions')

    const resp = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Duffel-Version': 'v2',
        'Accept-Encoding': 'gzip',
        'Content-Type': 'application/json',
        'Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    })

    const requestId = resp.headers.get('x-request-id') || undefined
    const text = await resp.text()
    let json: any = {}
    try { json = text ? JSON.parse(text) : {} } catch {}
    if (!resp.ok) return NextResponse.json({ error: json?.error || text || 'Duffel error', request_id: requestId }, { status: resp.status })

    return NextResponse.json({ ...json, request_id: requestId })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}