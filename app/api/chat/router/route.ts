import { type NextRequest, NextResponse } from "next/server"
import { routeChat } from "@/lib/chat/router"
import { createClient as createServerSupabase } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { message, history = [], includeReasoning = false } = await request.json()
    if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 })

    const supabase = createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.id) return NextResponse.json({ error: "Authentication required" }, { status: 401 })

    // Rough estimate: 1 token ~ 4 chars
    const estimatedInputTokens = Math.ceil((message + JSON.stringify(history)).length / 4)
    const estimatedOutputTokens = 1000

    const { data: canUseTokens } = await supabase.rpc("can_use_ai_tokens", {
      user_uuid: user.id,
      tokens_needed: estimatedInputTokens + estimatedOutputTokens,
    })

    if (!canUseTokens) {
      const { data: planLimits } = await supabase.rpc("get_user_plan_limits", { user_uuid: user.id })
      const limits = planLimits?.[0]
      return NextResponse.json({
        error: "Token limit exceeded",
        details: {
          message: `You've reached your AI token limit for the ${limits?.plan_name || "current"} plan.`,
          tokensUsed: limits?.ai_tokens_used || 0,
          tokensLimit: limits?.ai_tokens_limit || 0,
          planName: limits?.plan_name || "free",
          upgradeRequired: true,
        },
      }, { status: 429 })
    }

    const result = await routeChat({ message, history, includeReasoning, userId: user.id, baseUrl: process.env.NEXT_PUBLIC_BASE_URL })

    const used = (result.tokenUsage?.total || 0)
    const inputTokens = result.tokenUsage?.inputTokens || 0
    const outputTokens = result.tokenUsage?.outputTokens || 0

    await supabase.rpc("increment_ai_tokens", { user_uuid: user.id, tokens_used: used })

    try {
      await supabase.from("ai_usage").insert({
        user_id: user.id,
        model: result.model,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        total_tokens: used,
        context_type: result.toolUsed || "general",
        provider: "anthropic",
        cost_usd: (used / 1000) * 0.003,
      })
    } catch {}

    return NextResponse.json({
      response: result.text,
      reasoning: result.reasoning,
      toolUsed: result.toolUsed,
      tokenUsage: result.tokenUsage,
    })
  } catch (e: any) {
    console.error("Chat router error:", e)
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 })
  }
}