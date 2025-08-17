import { NextResponse } from 'next/server'
import { getDuffelClient } from '@/lib/duffel'
import crypto from 'crypto'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const token = process.env.DUFFEL_API_KEY || ''
    if (!token) return NextResponse.json({ error: 'Missing DUFFEL_API_KEY' }, { status: 500 })

    const { searchParams } = new URL(request.url)
    const order_id = searchParams.get('order_id') || undefined

    const duffel = getDuffelClient() as any
    // If SDK supports list with filter, otherwise GET /duffel/refunds direct
    const res = await duffel.refunds.list(order_id ? { order_id } : undefined)
    const data = res?.data || res

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const token = process.env.DUFFEL_API_KEY || ''
    if (!token) return NextResponse.json({ error: 'Missing DUFFEL_API_KEY' }, { status: 500 })

    const body = await request.json()
    const duffel = getDuffelClient() as any

    const created = await duffel.refunds.create(body, { idempotencyKey: crypto.randomUUID?.() || undefined })
    const refund = created?.data || created

    return NextResponse.json({ data: refund })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}