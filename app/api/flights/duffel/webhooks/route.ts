import { NextResponse } from 'next/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function isProbablyBase64(input: string): boolean {
  // Rough heuristic; avoids throwing on non-base64
  if (!input || input.length % 4 !== 0) return false
  return /^[A-Za-z0-9+/]+={0,2}$/.test(input)
}

function parseSignatureHeader(header: string | null): { timestamp?: string; signature?: string } {
  if (!header) return {}
  // Support either raw signature or key=value pairs (e.g., t=..., v1=...)
  if (header.includes('=')) {
    const parts = header.split(',').map((p) => p.trim())
    const map: Record<string, string> = {}
    for (const part of parts) {
      const [k, v] = part.split('=')
      if (k && v) map[k] = v
    }
    return { timestamp: map['t'], signature: map['v1'] || map['signature'] }
  }
  return { signature: header }
}

function timingSafeEqualString(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a)
    const bufB = Buffer.from(b)
    return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB)
  } catch {
    return false
  }
}

function verifySignature(rawBody: string, signatureHeader: string | null): boolean {
  const secretEnv = process.env.DUFFEL_WEBHOOK_SECRET || ''
  if (!secretEnv || !signatureHeader) return false

  const { timestamp, signature } = parseSignatureHeader(signatureHeader)
  if (!signature) return false

  // Use base64-decoded key when appropriate
  const key: crypto.BinaryLike = isProbablyBase64(secretEnv) ? Buffer.from(secretEnv, 'base64') : secretEnv

  const payloadCandidates: string[] = [rawBody]
  if (timestamp) payloadCandidates.push(`${timestamp}.${rawBody}`)

  for (const payload of payloadCandidates) {
    const hmac = crypto.createHmac('sha256', key)
    hmac.update(payload, 'utf8')
    const digest = hmac.digest()

    const expectedHex = digest.toString('hex')
    const expectedBase64 = digest.toString('base64')

    // Compare against provided signature as-is, case-insensitive for hex
    if (timingSafeEqualString(signature, expectedHex) || timingSafeEqualString(signature.toLowerCase(), expectedHex.toLowerCase())) {
      return true
    }
    if (timingSafeEqualString(signature, expectedBase64)) {
      return true
    }
  }

  return false
}

export async function POST(request: Request) {
  try {
    const signature =
      request.headers.get('x-duffel-signature') ||
      request.headers.get('duffel-signature') ||
      request.headers.get('x-signature')
    const rawBody = await request.text()

    if (!verifySignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(rawBody)

    // Persist event (best-effort). Use service role to bypass RLS.
    try {
      const { getAdminClient } = await import('@/lib/supabase/admin')
      const admin = getAdminClient()

      // Extract common fields defensively
      const eventType = event?.type || event?.event_type || event?.event || null
      const eventId = event?.id || event?.event_id || null
      const resourceType = event?.data?.type || event?.resource_type || null
      const resourceId = event?.data?.id || event?.resource_id || null
      const orderId = event?.data?.order_id || (resourceType === 'order' ? resourceId : null)

      const headers: Record<string, string> = {}
      request.headers.forEach((v, k) => (headers[k] = v))

      await admin.from('webhook_events').insert({
        provider: 'duffel',
        event_id: eventId,
        event_type: eventType,
        resource_type: resourceType,
        resource_id: resourceId,
        order_id: orderId,
        signature: signature || null,
        headers: headers as any,
        payload: event as any,
        status: 'received',
      })
    } catch (persistError) {
      console.error('Failed to persist Duffel webhook event:', persistError)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}