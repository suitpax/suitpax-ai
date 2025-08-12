import { type NextRequest, NextResponse } from "next/server"
import { SuitpaxIntelligenceService } from "@/lib/suitpax-intelligence"

export async function POST(request: NextRequest) {
  try {
    const { message, userId, context, documents } = await request.json()

    if (!message || !userId) {
      return NextResponse.json({ error: "Message and userId are required" }, { status: 400 })
    }

    const aiService = new SuitpaxIntelligenceService({ userId })

    // Add documents if provided
    if (documents && documents.length > 0) {
      await aiService.initializeKnowledge(documents)
    }

    // Get enhanced response
    const result = await aiService.enhancedChat(message, context)

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error("Enhanced AI API error:", error)
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

    const aiService = new SuitpaxIntelligenceService({ userId })
    const memories = await aiService.getTravelPreferences()

    return NextResponse.json({
      success: true,
      memories,
    })
  } catch (error) {
    console.error("Get memories error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
