import { NextResponse } from 'next/server'
import { getDuffelClient } from '@/lib/duffel'
import crypto from 'crypto'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const token = process.env.DUFFEL_API_KEY || ''
    if (!token) return NextResponse.json({ error: 'Missing DUFFEL_API_KEY' }, { status: 500 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id') || undefined

    const duffel = getDuffelClient() as any

    if (id) {
      const res = await duffel.paymentIntents.get(id)
      const data = res?.data || res
      return NextResponse.json({ data })
    }

    const res = await duffel.paymentIntents.list()
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

    const created = await duffel.paymentIntents.create(body, { idempotencyKey: crypto.randomUUID?.() || undefined })
    const paymentIntent = created?.data || created

    return NextResponse.json({ data: paymentIntent })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}