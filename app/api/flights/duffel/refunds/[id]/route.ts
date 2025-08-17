import { NextResponse } from 'next/server'
import { getDuffelClient } from '@/lib/duffel'

export const runtime = 'nodejs'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const token = process.env.DUFFEL_API_KEY || ''
    if (!token) return NextResponse.json({ error: 'Missing DUFFEL_API_KEY' }, { status: 500 })

    const duffel = getDuffelClient() as any
    const res = await duffel.refunds.get(params.id)
    const data = res?.data || res
    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}