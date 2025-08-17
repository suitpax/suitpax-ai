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
    const signature = request.headers.get('x-duffel-signature')
    const rawBody = await request.text()

    if (!verifySignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(rawBody)

    // TODO: persist event and update related entities (orders/payments/services)

    return NextResponse.json({ received: true })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}