import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'Valid email required' }, { status: 400 })
    }

    const apiKey = process.env.BREVO_API_KEY
    const listId = process.env.BREVO_LIST_ID
    if (!apiKey || !listId) {
      return NextResponse.json({ ok: false, error: 'Missing BREVO_API_KEY or BREVO_LIST_ID' }, { status: 500 })
    }

    const resp = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({ email, listIds: [Number(listId)] }),
    })

    if (!resp.ok) {
      // If already exists, we can update its lists
      const text = await resp.text()
      if (/exists/i.test(text)) {
        const update = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
          method: 'PUT',
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'api-key': apiKey,
          },
          body: JSON.stringify({ listIds: [Number(listId)] }),
        })
        if (!update.ok) {
          const msg = await update.text()
          return NextResponse.json({ ok: false, error: msg || 'Subscribe failed' }, { status: 500 })
        }
      } else {
        return NextResponse.json({ ok: false, error: text || 'Subscribe failed' }, { status: 500 })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}

