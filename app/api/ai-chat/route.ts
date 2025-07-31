import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createServerClient } from "@/lib/supabase/server"
import { getContextualPrompt } from "@/lib/ai/system-prompts"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json()

    // Get user from Supabase
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile to check plan
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, ai_requests_used, ai_requests_limit")
      .eq("id", user.id)
      .single()

    // Check usage limits
    if (profile && profile.ai_requests_used >= profile.ai_requests_limit) {
      return NextResponse.json(
        {
          error: "AI request limit reached. Please upgrade your plan.",
          upgrade_required: true,
        },
        { status: 429 },
      )
    }

    // Generate response using Claude 4 Opus
    const systemPrompt = getContextualPrompt(context || "general business travel assistance", profile?.plan || "free")

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022", // Latest Claude model
      max_tokens: 1000,
      temperature: 0.7,
      system: systemPrompt,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    })

    const assistantMessage =
      response.content[0].type === "text"
        ? response.content[0].text
        : "I apologize, but I had trouble generating a response."

    // Update usage count
    if (profile) {
      await supabase
        .from("profiles")
        .update({ ai_requests_used: profile.ai_requests_used + 1 })
        .eq("id", user.id)
    }

    // Log the conversation
    await supabase.from("ai_chat_logs").insert({
      user_id: user.id,
      messages: [...messages, { role: "assistant", content: assistantMessage }],
      context: context || "general",
      model_used: "claude-3-5-sonnet-20241022",
    })

    return NextResponse.json({
      message: assistantMessage,
      usage: {
        requests_used: (profile?.ai_requests_used || 0) + 1,
        requests_limit: profile?.ai_requests_limit || 50,
        plan: profile?.plan || "free",
      },
    })
  } catch (error) {
    console.error("AI Chat API Error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate response. Please try again.",
      },
      { status: 500 },
    )
  }
}
