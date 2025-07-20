import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: anthropic("claude-3-haiku-20240307"),
      system: `You are Zia, Suitpax's AI travel assistant. You help users with:
      - Business travel planning and booking
      - Expense management and reporting  
      - Travel policy compliance
      - Flight, hotel, and car rental recommendations
      - Travel itinerary optimization
      
      Keep responses helpful, professional, and focused on business travel needs.`,
      prompt: message,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("AI Chat error:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}
