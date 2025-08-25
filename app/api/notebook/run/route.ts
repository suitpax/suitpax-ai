import { type NextRequest, NextResponse } from "next/server"
import { routeChat } from "@/lib/chat/router"

export async function POST(request: NextRequest) {
  try {
    const { prompt, history = [], userId, agent } = await request.json()
    if (!prompt) return NextResponse.json({ error: 'prompt is required' }, { status: 400 })
    const result = await routeChat({ message: prompt, history, userId, includeReasoning: false, agent: agent || 'core' })
    return NextResponse.json({ text: result.text, model: result.model, tokenUsage: result.tokenUsage })
  } catch (e) {
    console.error('notebook run error', e)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}

