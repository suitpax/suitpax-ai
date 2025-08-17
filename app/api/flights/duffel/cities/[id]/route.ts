import { NextResponse } from 'next/server'
import { getDuffelClient } from '@/lib/duffel'

export const runtime = 'nodejs'

export async function GET(_request: Request, ctx: { params: { id: string } }) {
  try {
    const duffel = getDuffelClient()
    const city = await (duffel as any).cities.get(ctx.params.id)
    return NextResponse.json(city)
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}