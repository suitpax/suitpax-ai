export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"
import { SuitpaxIntelligenceService } from "@/lib/intelligence"

export async function POST(request: NextRequest) {
  try {
    const { message, history = [], userId, includeReasoning = false } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const aiService = new SuitpaxIntelligenceService({ userId: userId || "anonymous" })

    const result = await aiService.generateResponse(message, { conversationHistory: history } as any)

    let reasoning: string | undefined
    if (includeReasoning) {
      try {
        const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/ai-chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: `Explica en 3-5 puntos el razonamiento de alto nivel para responder: ${message}` })
        }).then(r => r.json())
        reasoning = r?.response
      } catch {}
    }

    return NextResponse.json({
      response: result.response,
      reasoning,
      sources: result.sources,
    })
  } catch (error) {
    console.error("Error in AI Core API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
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
