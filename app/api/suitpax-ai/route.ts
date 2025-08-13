import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const url = new URL(req.url)
  const target = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/ai-chat`
  const res = await fetch(target, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: await req.text() })
  const data = await res.text()
  return new NextResponse(data, { status: res.status, headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json', 'x-aliased-to': '/api/ai-chat' } })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "anonymous"

    const aiService = new SuitpaxIntelligenceService({ userId })
    const preferences = await aiService.getUserPreferences()

    return NextResponse.json({ preferences })
  } catch (error) {
    console.error("Error getting user preferences:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
