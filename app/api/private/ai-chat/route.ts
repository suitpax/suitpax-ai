import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { streamText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    const result = await streamText({
      model: anthropic("claude-3-haiku-20240307"),
      messages: [
        {
          role: "system",
          content: `You are Suitpax AI, a helpful travel assistant for business travelers. You help with:
          - Flight bookings and recommendations
          - Hotel suggestions
          - Travel policy compliance
          - Expense management
          - Travel itinerary planning
          - Local recommendations for business travelers
          
          Always be professional, concise, and focused on business travel needs. If asked about non-travel topics, politely redirect to travel-related assistance.`,
        },
        ...messages,
      ],
      temperature: 0.7,
      maxTokens: 1000,
    })

    return result.toAIStreamResponse()
  } catch (error) {
    console.error("AI Chat error:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
