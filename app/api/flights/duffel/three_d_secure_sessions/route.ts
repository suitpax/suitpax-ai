import { NextResponse } from 'next/server'
import { getDuffelClient } from '@/lib/duffel'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const token = process.env.DUFFEL_API_KEY || ''
    if (!token) return NextResponse.json({ error: 'Missing DUFFEL_API_KEY' }, { status: 500 })

    const body = await request.json()
    const duffel = getDuffelClient() as any

    const created = await duffel.threeDSecureSessions.create(body, { idempotencyKey: crypto.randomUUID?.() || undefined })
    const session = created?.data || created

    return NextResponse.json({ data: session })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}