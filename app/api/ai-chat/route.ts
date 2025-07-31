import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
import { getContextualPrompt } from "@/lib/ai/system-prompts"
import { checkUsageLimits } from "./subscription-limits"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { message, context = "general", history = [] } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Get user from Supabase
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get user profile and plan
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    const userPlan = profile?.plan || "free"

    // Check usage limits
    const usageCheck = await checkUsageLimits(user.id, userPlan, "ai_request")

    if (!usageCheck.allowed) {
      return NextResponse.json(
        {
          error: "Usage limit exceeded",
          message: usageCheck.message,
          upgrade_required: true,
          current_plan: userPlan,
        },
        { status: 429 },
      )
    }

    // Build conversation history for context
    const conversationHistory = history
      .slice(-5) // Last 5 messages for context
      .map((msg: any) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      }))

    // Get contextual system prompt
    const systemPrompt = getContextualPrompt(context, userPlan)

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        ...conversationHistory,
        {
          role: "user",
          content: message,
        },
      ],
    })

    const aiResponse =
      response.content[0]?.type === "text"
        ? response.content[0].text
        : "I apologize, but I couldn't process your request properly. Please try again."

    // Log the interaction
    try {
      await supabase.from("ai_chat_logs").insert({
        user_id: user.id,
        message: message,
        response: aiResponse,
        context_type: context,
        tokens_used: response.usage?.input_tokens + response.usage?.output_tokens || 0,
        model_used: "claude-3-haiku-20240307",
        user_plan: userPlan,
      })
    } catch (logError) {
      console.error("Failed to log chat interaction:", logError)
    }

    return NextResponse.json({
      response: aiResponse,
      tokens_used: response.usage?.input_tokens + response.usage?.output_tokens || 0,
      model: "claude-3-haiku-20240307",
      usage_remaining: usageCheck.remaining,
      usage_limit: usageCheck.limit,
      current_plan: userPlan,
    })
  } catch (error) {
    console.error("AI Chat API Error:", error)

    return NextResponse.json(
      {
        error: "I'm experiencing technical difficulties right now. Please try again in a moment.",
        response:
          "I apologize, but I'm having trouble processing your request at the moment. Our team has been notified and we're working to resolve this issue. Please try again in a few minutes.",
      },
      { status: 500 },
    )
  }
}
