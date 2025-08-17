import { NextResponse } from 'next/server'
import { getDuffelClient } from '@/lib/duffel'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const token = process.env.DUFFEL_API_KEY || ''
    if (!token) return NextResponse.json({ error: 'Missing DUFFEL_API_KEY' }, { status: 500 })

    const { searchParams } = new URL(request.url)
    const offer_id = searchParams.get('offer_id') || undefined
    if (!offer_id) return NextResponse.json({ error: 'offer_id is required' }, { status: 400 })

    const duffel = getDuffelClient() as any
    const res = await duffel.ancillaries.list({ offer_id })
    const data = res?.data || res

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}