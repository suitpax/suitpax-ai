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

    const wantsWeb = (webSearch === true) || /\b(search|buscar|who\s+is|what\s+is|news|latest|cite|source|sources)\b/i.test(message)

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

    // Web search context (Brave) → citations
    let webContext = ""
    if (wantsWeb) {
      try {
        const ws = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/web-search/brave`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: message })
        })
        if (ws.ok) {
          const json = await ws.json()
          const items = (json?.results || []).slice(0, 5)
          for (const r of items) {
            sources.push({ title: r.title, url: r.url, snippet: r.snippet })
          }
          if (items.length > 0) {
            const lines = items.map((r: any, i: number) => `- [${i + 1}] ${r.title} — ${r.url}`)
            webContext = `\n\nWeb context:\n${lines.join("\n")}\nUse and cite sources when applicable.`
          }
        }
      } catch (e) { console.error("Web search error:", e) }
    }

    // Always use central System prompt; add inline-thinking instruction if requested + web context
    const thinkingInlineInstruction = includeReasoningInline
      ? "\n\nWhen requested, include your high-level thinking wrapped in <thinking>...</thinking> (3–5 bullets), then the main answer. Do not include private chain-of-thought; keep it brief."
      : ""
    const systemPrompt = `${SUITPAX_AI_SYSTEM_PROMPT}${thinkingInlineInstruction}${webContext}`.trim()

    let enhancedMessage = message

    if (includeReasoning) {
      enhancedMessage = `${message}\n\n${buildReasoningInstruction()}`
    }

    const initial: any = await (anthropic as any).messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: Math.min(maxTokensForResponse, 1024),
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        ...conversationHistory,
        { role: "user", content: enhancedMessage },
      ],
    })

    text = initial.content?.[0]?.text || initial.content?.[0]?.type === "text" ? initial.content?.[0]?.text : ""

    // Build tool context (sources etc.) if any tool succeeded
    if (toolData?.success) {
      const toolContext = buildToolContext(toolData)
      if (toolContext?.sources) {
        sources.push(...toolContext.sources)
      }
    }

    return NextResponse.json({ response: text, reasoning: reasoningInline, sources })
  } catch (error) {
    console.error("AI Chat error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}