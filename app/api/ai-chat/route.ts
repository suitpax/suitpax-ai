import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSystemPrompt } from "@/lib/ai/system-prompts"
import { SubscriptionManager } from "./subscription-limits"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { message, conversationType = "main", userId } = await request.json()

    if (!message || !userId) {
      return NextResponse.json({ error: "Message and userId are required" }, { status: 400 })
    }

    // Initialize Supabase client
    const supabase = createClient()

    // Get user profile and subscription
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("subscription_type, usage_stats")
      .eq("id", userId)
      .single()

    if (profileError) {
      console.error("Profile fetch error:", profileError)
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    const subscriptionType = profile.subscription_type || "free"
    const usageStats = profile.usage_stats || { messagesUsed: 0, resetDate: new Date() }

    // Check message limits
    const messageLimit = SubscriptionManager.checkLimit(subscriptionType, "messagesPerMonth", usageStats.messagesUsed)

    if (!messageLimit.allowed) {
      return NextResponse.json(
        {
          error: "Message limit exceeded",
          upgradeMessage: SubscriptionManager.getUpgradeMessage(subscriptionType, "messages"),
          limit: messageLimit.limit,
          used: usageStats.messagesUsed,
        },
        { status: 429 },
      )
    }

    // Get appropriate system prompt
    const systemPrompt = getSystemPrompt(conversationType as any)

    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    })

    const aiResponse =
      response.content[0].type === "text" ? response.content[0].text : "Sorry, I could not process your request."

    // Update usage stats
    const newUsageStats = {
      ...usageStats,
      messagesUsed: usageStats.messagesUsed + 1,
    }

    await supabase.from("profiles").update({ usage_stats: newUsageStats }).eq("id", userId)

    // Log the conversation
    await supabase.from("ai_chat_logs").insert({
      user_id: userId,
      message: message,
      response: aiResponse,
      conversation_type: conversationType,
      tokens_used: response.usage?.input_tokens + response.usage?.output_tokens || 0,
    })

    return NextResponse.json({
      response: aiResponse,
      usage: {
        messagesRemaining: messageLimit.remaining - 1,
        messagesLimit: messageLimit.limit,
        subscriptionType,
      },
    })
  } catch (error) {
    console.error("AI Chat API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
