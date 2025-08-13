import { NextRequest, NextResponse } from "next/server"
import { normalizeDuffelStays } from "../duffel/normalize"

export async function POST(req: NextRequest) {
  const start = Date.now()
  const requestId = `stays_${start.toString(36)}_${Math.random().toString(36).slice(2,6)}`
  try {
    const body = await req.json()

    // Duffel
    const duffelRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/stays/duffel/search`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    })
    const duffelJson = await duffelRes.json()
    const duffelData = duffelJson?.data || duffelJson?.stays || duffelJson?.results || []
    const duffelNormalized = normalizeDuffelStays(duffelData)

    // Expedia (placeholder mock)
    const expediaRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/stays/expedia/search`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    })
    const expediaJson = await expediaRes.json()
    const expediaNormalized = expediaJson?.stays || []

    const stays = [...duffelNormalized, ...expediaNormalized]

    return NextResponse.json({ success: true, request_id: requestId, provider_counts: { duffel: duffelNormalized.length, expedia: expediaNormalized.length }, stays }, { headers: { 'x-request-id': requestId, 'x-latency-ms': String(Date.now() - start) } })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Internal error', request_id: requestId }, { status: 500, headers: { 'x-request-id': requestId, 'x-latency-ms': String(Date.now() - start) } })
  }
}