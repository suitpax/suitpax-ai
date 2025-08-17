import { NextResponse } from 'next/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function verifySignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.DUFFEL_WEBHOOK_SECRET || ''
  if (!secret || !signature) return false

  // Duffel uses HMAC SHA-256 signatures
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(rawBody, 'utf8')
  const expected = hmac.digest('hex')

  try {
    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
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