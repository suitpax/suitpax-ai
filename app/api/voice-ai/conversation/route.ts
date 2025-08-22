import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookieStore } from "@/lib/supabase/cookies"
import Anthropic from "@anthropic-ai/sdk"
import { SUITPAX_VOICE_SYSTEM_PROMPT } from "@/lib/prompts/voice"

function getAnthropic() {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return null
  return new Anthropic({ apiKey: key })
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: cookieStore
      }
    )

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

    const client = getAnthropic()
    if (!client) return NextResponse.json({ error: "AI not configured" }, { status: 500 })

    const response = await client.messages.create({
      model: "claude-3-7-sonnet-latest",
      max_tokens: 500,
      temperature: 0.7,
      system: `${SUITPAX_VOICE_SYSTEM_PROMPT}

Context: ${context || "No additional context provided"}`,
      messages: [
        {
          role: "user",
          content: transcript,
        },
      ],
    })

    const aiResponse = response.content[0]?.type === "text" 
      ? response.content[0].text 
      : "I apologize, but I couldn't process your request properly. Please try again."

    return NextResponse.json({
      response: aiResponse,
      tokens_used: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0),
    })
  } catch (error) {
    console.error("Voice AI error:", error)
    return NextResponse.json({ error: "Failed to process voice request" }, { status: 500 })
  }
}
