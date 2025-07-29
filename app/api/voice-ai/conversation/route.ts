import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { generateAgentResponse, generateWelcomeMessage } from "@/lib/anthropic"
import type { Database } from "@/lib/supabase/types"

export interface ConversationMessage {
  role: "user" | "assistant"
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { message, agentId, conversationHistory = [], isWelcome = false } = await request.json()

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user data for context
    const { data: user } = await supabase.from("users").select("*").eq("id", session.user.id).single()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check token limits
    if (user.ai_tokens_used >= user.ai_tokens_limit) {
      return NextResponse.json(
        {
          error: "You've reached your AI token limit. Please upgrade your plan to continue.",
        },
        { status: 429 },
      )
    }

    if (!agentId) {
      return NextResponse.json({ error: "Agent ID is required" }, { status: 400 })
    }

    let responseText: string

    try {
      if (isWelcome) {
        // Generate welcome message
        responseText = await generateWelcomeMessage(agentId)
      } else {
        if (!message) {
          return NextResponse.json({ error: "Message is required" }, { status: 400 })
        }

        // Build conversation context
        const messages: ConversationMessage[] = [...conversationHistory, { role: "user", content: message }]

        // Generate response using Anthropic Claude
        responseText = await generateAgentResponse(messages, agentId, {
          name: user.full_name,
          company: user.company_name,
          plan: user.plan_type,
        })
      }

      // Calculate approximate tokens (estimation)
      const tokensUsed = Math.ceil((message?.length || 0 + responseText.length) / 4)

      // Update user tokens
      await supabase
        .from("users")
        .update({
          ai_tokens_used: user.ai_tokens_used + tokensUsed,
        })
        .eq("id", session.user.id)

      return NextResponse.json({
        response: responseText,
        agentId,
        tokensUsed,
        remainingTokens: user.ai_tokens_limit - (user.ai_tokens_used + tokensUsed),
        timestamp: new Date().toISOString(),
      })
    } catch (aiError) {
      console.error("AI Error:", aiError)
      return NextResponse.json(
        {
          error: "Error processing AI request. Please try again.",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in voice AI conversation:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
