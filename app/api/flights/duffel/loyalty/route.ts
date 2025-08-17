import { NextResponse } from 'next/server'

// Simple in-memory store placeholder (replace with Supabase later)
const memoryStore: Record<string, any[]> = {}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id') || 'anonymous'
  const items = memoryStore[userId] || []
  return NextResponse.json({ data: items })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { user_id, programme } = body || {}
  const owner = user_id || 'anonymous'
  memoryStore[owner] = memoryStore[owner] || []
  memoryStore[owner].push(programme)
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id') || 'anonymous'
  const iata = searchParams.get('airline_iata_code')
  if (!iata) return NextResponse.json({ error: 'airline_iata_code required' }, { status: 400 })
  memoryStore[userId] = (memoryStore[userId] || []).filter(p => p.airline_iata_code !== iata)
  return NextResponse.json({ ok: true })
}