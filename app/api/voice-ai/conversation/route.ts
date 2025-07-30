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

    const { transcript, context } = await request.json()

    if (!transcript) {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 })
    }

    const result = await streamText({
      model: anthropic("claude-3-haiku-20240307"),
      messages: [
        {
          role: "system",
          content: `You are Suitpax Voice AI, a conversational travel assistant. You're designed for voice interactions, so:
          - Keep responses concise and natural for speech
          - Use a friendly, professional tone
          - Ask clarifying questions when needed
          - Focus on actionable travel assistance
          - Avoid long lists or complex formatting
          
          You help with flight bookings, hotel recommendations, travel policies, and general business travel assistance.
          
          Context: ${context || "No additional context provided"}`,
        },
        {
          role: "user",
          content: transcript,
        },
      ],
      temperature: 0.8,
      maxTokens: 500,
    })

    return result.toAIStreamResponse()
  } catch (error) {
    console.error("Voice AI error:", error)
    return NextResponse.json({ error: "Failed to process voice request" }, { status: 500 })
  }
}
