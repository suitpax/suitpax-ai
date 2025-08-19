import { NextResponse } from 'next/server'
import { getDuffelClient } from '@/lib/duffel'

export async function GET(request: Request) {
  try {
    const token = process.env.DUFFEL_API_KEY || ''
    if (!token) return NextResponse.json({ error: 'Missing DUFFEL_API_KEY' }, { status: 500 })
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || undefined
    const after = searchParams.get('after') || undefined
    const before = searchParams.get('before') || undefined
    const duffel = getDuffelClient() as any
    const res = await duffel.airlines.list({ limit: limit ? Number(limit) : undefined, after, before })
    const data = res?.data || res
    return NextResponse.json({ data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}