import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const base = (searchParams.get('base') || 'USD').toUpperCase()
    const target = (searchParams.get('target') || 'EUR').toUpperCase()
    if (base === target) return NextResponse.json({ data: { base_currency: base, target_currency: target, rate: 1, updated_at: new Date().toISOString() } })

    const url = `https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}&symbols=${encodeURIComponent(target)}`
    const resp = await fetch(url, { cache: 'no-store' })
    if (!resp.ok) {
      const txt = await resp.text()
      return NextResponse.json({ error: txt || 'Rate error' }, { status: resp.status })
    }
    const json = await resp.json()
    const rate = json?.rates?.[target]
    if (!rate) return NextResponse.json({ error: 'Rate not found' }, { status: 404 })
    return NextResponse.json({ data: { base_currency: base, target_currency: target, rate, updated_at: new Date().toISOString() } })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}