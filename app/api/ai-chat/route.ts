import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { buildReasoningInstruction, buildToolContext, System as SUITPAX_AI_SYSTEM_PROMPT } from "@/lib/prompts/system"
import { createClient as createServerSupabase } from "@/lib/supabase/server"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const TRAVEL_AGENT_SYSTEM_PROMPT = SUITPAX_AI_SYSTEM_PROMPT

export async function POST(request: NextRequest) {
  const {
    message,
    history = [],
    includeReasoning = false,
    includeReasoningInline = false,
    webSearch = false,
    deepSearch = false,
    sessionId,
  } = await request.json()
  if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 })

  const conversationHistory = history.map((msg: any) => ({ role: msg.role, content: msg.content }))

  try {
    let text = ""
    let reasoningInline: string | undefined
    const sources: Array<{ title: string; url?: string; snippet?: string }> = []
    const supabase = createServerSupabase()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Estimate tokens
    const estimatedInputTokens = Math.ceil((message + JSON.stringify(conversationHistory)).length / 4)
    const estimatedOutputTokens = 1000

    // Token limits
    const { data: canUseTokens } = await supabase.rpc("can_use_ai_tokens_v2", {
      user_uuid: user.id,
      tokens_needed: estimatedInputTokens + estimatedOutputTokens,
    })
    if (!canUseTokens) {
      const { data: planLimits } = await supabase.rpc("get_user_plan_limits", { user_uuid: user.id })
      const limits = planLimits?.[0]
      return NextResponse.json(
        {
          error: "Token limit exceeded",
          details: {
            message: `You've reached your AI token limit for the ${limits?.plan_name || "current"} plan.`,
            tokensUsed: limits?.ai_tokens_used || 0,
            tokensLimit: limits?.ai_tokens_limit || 0,
            planName: limits?.plan_name || "free",
            upgradeRequired: true,
          },
        },
        { status: 429 },
      )
    }

    // Per-plan max tokens
    const { data: planLimitsOk } = await supabase.rpc("get_user_plan_limits", { user_uuid: user.id })
    const planName = planLimitsOk?.[0]?.plan_name?.toLowerCase?.() || "free"
    const planToMaxTokens: Record<string, number> = { free: 1024, basic: 2048, premium: 4096, pro: 4096, enterprise: 8192 }
    const maxTokensForResponse = planToMaxTokens[planName] ?? 2048

    // Intent detection (tools)
    const isFlightIntent =
      /\b([A-Z]{3})\b.*\b(to|→|-|from)\b.*\b([A-Z]{3})\b/i.test(message) ||
      /\b(flight|flights|vuelo|vuelos|fly|flying|book|search)\b/i.test(message) ||
      /\b(madrid|barcelona|london|paris|new york|tokyo|dubai)\b.*\b(to|from)\b/i.test(message)

    const isCodeIntent =
      /\b(code|coding|program|programming|script|function|class|algorithm)\b/i.test(message) ||
      /\b(javascript|python|typescript|react|node|html|css|sql)\b/i.test(message) ||
      /\b(create|build|generate|write).*\b(app|website|function|component)\b/i.test(message)

    const isDocumentIntent =
      /\b(pdf|document|report|analyze|extract|ocr|scan)\b/i.test(message) ||
      /\b(generate|create).*\b(report|document|pdf|invoice)\b/i.test(message)

    const isExpenseIntent =
      /\b(expense|expenses|cost|costs|spending|budget|financial)\b/i.test(message) ||
      /\b(analyze|review).*\b(expenses|costs|spending)\b/i.test(message)

    let toolData: any = null
    let toolType = "general"

    if (isFlightIntent) {
      toolType = "flight_search"
      try {
        const toolRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ai-chat/tools/flight-search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: message }),
        })
        if (toolRes.ok) toolData = await toolRes.json()
      } catch (error) { console.error("Flight search tool error:", error) }
    } else if (isCodeIntent) {
      toolType = "code_generation"
      try {
        const toolRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ai-chat/tools/code-generator`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: message }),
        })
        if (toolRes.ok) toolData = await toolRes.json()
      } catch (error) { console.error("Code generation tool error:", error) }
    } else if (isDocumentIntent) {
      toolType = "document_processing"
      try {
        const toolRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ai-chat/tools/document-processor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: message }),
        })
        if (toolRes.ok) toolData = await toolRes.json()
      } catch (error) { console.error("Document processing tool error:", error) }
    } else if (isExpenseIntent) {
      toolType = "expense_analysis"
      try {
        const toolRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ai-chat/tools/expense-analyzer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: message, userId: user.id }),
        })
        if (toolRes.ok) toolData = await toolRes.json()
      } catch (error) { console.error("Expense analysis tool error:", error) }
    }

    // Always use central System prompt; add inline-thinking instruction if requested
    const thinkingInlineInstruction = includeReasoningInline
      ? "\n\nWhen requested, include your high-level thinking wrapped in <thinking>...</thinking> (3–5 bullets), then the main answer. Do not include private chain-of-thought; keep it brief."
      : ""
    const systemPrompt = `${SUITPAX_AI_SYSTEM_PROMPT}${thinkingInlineInstruction}`.trim()

    let enhancedMessage = message
    if (toolData?.success) {
      enhancedMessage += buildToolContext(toolType, toolData)
    }

    const initial: any = await anthropic.beta.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: Math.min(20000, maxTokensForResponse),
      temperature: 1,
      system: systemPrompt,
      messages: [...conversationHistory, { role: "user", content: enhancedMessage }],
      tools: [{ name: "web_search", type: "web_search_20250305" as any }],
      betas: ["web-search-2025-03-05"],
    } as any)

    const raw = initial.content.find((c: any) => c.type === "text")?.text || ""

    let text = raw.trim()
    let reasoningInline: string | undefined
    if (includeReasoningInline) {
      const match = raw.match(/<thinking>[\s\S]*?<\/thinking>/)
      if (match) {
        reasoningInline = match[0].replace(/<\/?thinking>/g, "").trim()
        text = raw.replace(/<thinking>[\s\S]*?<\/thinking>/, "").trim()
      }
    }

    const actualInputTokens = (initial.usage as any)?.input_tokens || estimatedInputTokens
    const actualOutputTokens = (initial.usage as any)?.output_tokens || Math.ceil(text.length / 4)
    const totalTokensUsed = actualInputTokens + actualOutputTokens

    await supabase.rpc("increment_ai_tokens", { user_uuid: user.id, tokens_used: totalTokensUsed })

    // Secondary reasoning pass (only if requested and not inline)
    let reasoning: string | undefined = reasoningInline
    if (includeReasoning && !includeReasoningInline) {
      const r = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 300,
        system: buildReasoningInstruction("es"),
        messages: [{ role: "user", content: `Mensaje del usuario: ${message}\n\nRespuesta: ${text}\n\nExplica en 3–5 puntos el razonamiento de alto nivel.` }],
      })
      reasoning = r.content.find((c: any) => c.type === "text")?.text?.trim()
      const reasoningTokens = (r.usage as any)?.input_tokens + (r.usage as any)?.output_tokens || 100
      await supabase.rpc("increment_ai_tokens", { user_uuid: user.id, tokens_used: reasoningTokens })
    }

    // Logging & sessions
    let newSessionId: string | undefined
    try {
      if (!sessionId) {
        const { data: created } = await supabase
          .from("chat_sessions")
          .insert({ user_id: user.id, title: message.slice(0, 60) || "New chat" })
          .select("id")
          .single()
        newSessionId = created?.id
      } else {
        newSessionId = sessionId
        await supabase.from("chat_sessions").update({ last_message_at: new Date().toISOString() }).eq("id", sessionId).eq("user_id", user.id)
      }

      await supabase.from("ai_usage").insert({
        user_id: user.id,
        model: "claude-3-7-sonnet-20250219",
        input_tokens: actualInputTokens,
        output_tokens: actualOutputTokens,
        total_tokens: totalTokensUsed,
        context_type: toolType,
        provider: "anthropic",
      })

      await supabase.rpc("increment_ai_tokens_v2", { user_uuid: user.id, tokens_needed: totalTokensUsed })
      if (isCodeIntent) {
        await supabase.rpc("increment_code_tokens", { p_user: user.id, p_tokens: totalTokensUsed })
      }

      await supabase.from("ai_chat_logs").insert({
        user_id: user.id,
        message: message,
        response: text,
        tokens_used: totalTokensUsed,
        model_used: "claude-3-7-sonnet-20250219",
        context_type: toolType,
        session_id: newSessionId || null,
        reasoning_included: Boolean(includeReasoningInline || includeReasoning),
        reasoning_content: reasoning || null,
      })
    } catch (e) {
      console.error("Failed to log AI usage:", e)
    }

    return NextResponse.json({
      response: text,
      reasoning,
      sources,
      tokenUsage: { used: totalTokensUsed, inputTokens: actualInputTokens, outputTokens: actualOutputTokens },
      toolUsed: toolType !== "general" ? toolType : undefined,
      sessionId: newSessionId || sessionId,
    })
  } catch (e: any) {
    const errorId = Math.random().toString(36).slice(2)
    console.error("AI Chat API Error:", errorId, e?.stack || e)
    return NextResponse.json({ error: "We're experiencing technical difficulties.", errorId }, { status: 500 })
  }
}

function calculateTokenCost(totalTokens: number, model: string): number {
  // Anthropic Claude 3.5 Sonnet pricing (approximate)
  const costPer1kTokens = 0.003 // $3 per 1M tokens = $0.003 per 1k tokens
  return (totalTokens / 1000) * costPer1kTokens
}

function getDestinationName(code: string) {
  const map: Record<string, string> = { MAD: "Madrid", BCN: "Barcelona", LHR: "London", CDG: "Paris", JFK: "New York", NRT: "Tokyo", DXB: "Dubai" }
  return map[code] || code
}

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}
