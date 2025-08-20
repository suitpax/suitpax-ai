export { POST } from "../ai-chat/route"

import { type NextRequest, NextResponse } from "next/server"
import { SuitpaxIntelligenceService } from "@/lib/intelligence"

export async function POST(request: NextRequest) {
  try {
    const { message, userId, conversationHistory } = await request.json()

    if (!message || !userId) {
      return NextResponse.json({ error: "Message and userId are required" }, { status: 400 })
    }

    const aiService = new SuitpaxIntelligenceService(userId)

    const result = await aiService.generateResponse(message, {
      conversationHistory: conversationHistory || [],
      useMemory: true,
      context: "suitpax-ai-chat",
    })

    return NextResponse.json({
      response: result.response,
      reasoning: result.reasoning,
      sources: result.sources,
    })
  } catch (error) {
    console.error("Error in Suitpax AI API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    const aiService = new SuitpaxIntelligenceService(userId)
    const preferences = await aiService.getUserPreferences()

    return NextResponse.json({ preferences })
  } catch (error) {
    console.error("Error getting user preferences:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
