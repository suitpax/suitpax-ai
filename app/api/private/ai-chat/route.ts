import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { xai } from "@ai-sdk/xai"
import { generateText } from "ai"
import type { Database } from "@/lib/supabase/types"

export interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

export async function POST(request: Request) {
  try {
    const { messages, conversationId } = await request.json()

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user data
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

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid message format" }, { status: 400 })
    }

    // Get the last user message
    const lastUserMessage = messages.filter((msg) => msg.role === "user").pop()

    if (!lastUserMessage) {
      return NextResponse.json({ error: "No user message found" }, { status: 400 })
    }

    // Specialized business travel system prompt
    const systemPrompt = `You are a specialized business travel assistant for Suitpax. Your name is Claude and you work to help professionals with their corporate travel needs.

USER INFORMATION:
- Name: ${user.full_name || "User"}
- Company: ${user.company_name || "Company"}
- Plan: ${user.plan_type}
- Tokens used: ${user.ai_tokens_used}/${user.ai_tokens_limit}

CAPABILITIES:
- Flight search and recommendations
- Business hotel suggestions
- Travel expense management
- Corporate travel policies
- Itinerary optimization
- Travel productivity tips

INSTRUCTIONS:
1. Be professional but friendly
2. Focus on business and corporate travel
3. Provide practical and actionable information
4. If you need more information, ask specifically
5. Suggest using platform features when relevant
6. Keep responses concise but complete

Always respond in English and help the user with their business travel needs.`

    try {
      // Call to xAI Grok
      const { text } = await generateText({
        model: xai("grok-3"),
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((msg) => ({
            role: msg.role === "assistant" ? "assistant" : "user",
            content: msg.content,
          })),
        ],
        maxTokens: 1000,
        temperature: 0.7,
      })

      // Calculate approximate tokens (estimation)
      const tokensUsed = Math.ceil((lastUserMessage.content.length + text.length) / 4)

      // Update user tokens
      await supabase
        .from("users")
        .update({
          ai_tokens_used: user.ai_tokens_used + tokensUsed,
          travel_searches_used: user.travel_searches_used + 1,
        })
        .eq("id", session.user.id)

      // Save or update conversation
      if (conversationId) {
        // Update existing conversation
        const { data: conversation } = await supabase
          .from("ai_conversations")
          .select("messages, tokens_used")
          .eq("id", conversationId)
          .eq("user_id", session.user.id)
          .single()

        if (conversation) {
          const updatedMessages = [
            ...(conversation.messages as Message[]),
            { role: "user", content: lastUserMessage.content },
            { role: "assistant", content: text },
          ]

          await supabase
            .from("ai_conversations")
            .update({
              messages: updatedMessages,
              tokens_used: (conversation.tokens_used || 0) + tokensUsed,
              updated_at: new Date().toISOString(),
            })
            .eq("id", conversationId)
        }
      } else {
        // Create new conversation
        const title = lastUserMessage.content.substring(0, 50) + (lastUserMessage.content.length > 50 ? "..." : "")

        await supabase.from("ai_conversations").insert({
          user_id: session.user.id,
          title,
          messages: [
            { role: "user", content: lastUserMessage.content },
            { role: "assistant", content: text },
          ],
          tokens_used: tokensUsed,
        })
      }

      return NextResponse.json({
        message: {
          role: "assistant",
          content: text,
        },
        tokensUsed,
        remainingTokens: user.ai_tokens_limit - (user.ai_tokens_used + tokensUsed),
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
    console.error("Error in AI chat:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
