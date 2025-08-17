import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(_request: Request, ctx: { params: { id: string } }) {
  try {
    const token = process.env.DUFFEL_API_KEY || ''
    if (!token) return NextResponse.json({ error: 'Missing DUFFEL_API_KEY' }, { status: 500 })

    const url = `https://api.duffel.com/air/loyalty_programmes/${ctx.params.id}`
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
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