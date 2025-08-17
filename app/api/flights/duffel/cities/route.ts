import { NextResponse } from 'next/server'
import { getDuffelClient } from '@/lib/duffel'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const after = searchParams.get('after') || undefined
    const before = searchParams.get('before') || undefined
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : undefined

    const duffel = getDuffelClient()
    const params: any = {}
    if (after) params.after = after
    if (before) params.before = before
    if (typeof limit === 'number') params.limit = limit

    const res = await (duffel as any).cities.list(params)
    const data = res?.data || res?.cities || []
    const meta = res?.meta || {}

    return NextResponse.json({ data, meta })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}