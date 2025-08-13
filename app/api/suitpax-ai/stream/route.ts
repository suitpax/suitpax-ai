import { NextRequest } from "next/server"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  const target = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/ai-chat/stream`
  const res = await fetch(target, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: await req.text() })
  return new Response(res.body, { status: res.status, headers: { 'Content-Type': res.headers.get('Content-Type') || 'text/plain; charset=utf-8', 'x-aliased-to': '/api/ai-chat/stream' } })
}