import { type NextRequest, NextResponse } from "next/server"
import { getAnthropicClient, PLAN_CONFIGS } from "@/lib/anthropic"
import { buildReasoningInstruction, buildToolContext, System as SYSTEM_PROMPT } from "@/lib/prompts/system"
import { FLIGHTS_EXPERT_SYSTEM_PROMPT } from "@/lib/prompts/agents/flights-expert"
import { HOTELS_EXPERT_SYSTEM_PROMPT } from "@/lib/prompts/agents/hotels-expert"
import { createClient as createServerSupabase } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const {
    message,
    history = [],
    includeReasoning = false,
    includeReasoningInline = false,
    webSearch = false,
    agent,
  } = await request.json();

  if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });

  const conversationHistory = history.map((msg: any) => ({
    role: msg.role,
    content: msg.content,
  }));

  try {
    let text = "";
    let reasoningInline: string | undefined;
    const sources: Array<{ title: string; url?: string; snippet?: string }> = [];
    const supabase = createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    const userId = user?.id || null;

    // Calcular plan y límites
    let planName: keyof typeof PLAN_CONFIGS = "free";
    let ai_tokens_used = 0, ai_tokens_limit = PLAN_CONFIGS['free'].monthlyTokens;

    if (userId) {
      const { data: planLimitsOk } = await supabase.rpc("get_user_plan_limits", { user_uuid: userId });
      if (planLimitsOk?.[0]) {
        const row = planLimitsOk[0]
        const pn = (row.plan_name || "free").toLowerCase().replace("basic","starter").replace("premium","pro")
        if (pn in PLAN_CONFIGS) planName = pn as keyof typeof PLAN_CONFIGS
        ai_tokens_used = row.ai_tokens_used || 0;
        ai_tokens_limit = row.ai_tokens_limit ?? PLAN_CONFIGS['free'].monthlyTokens;
      }
      // Llamada de control de límite
      const estimatedInputTokens = Math.ceil((message + JSON.stringify(conversationHistory)).length / 4);
      const estimatedOutputTokens = PLAN_CONFIGS[planName].maxTokensPerCall || 1000;
      const { data: canUseTokens } = await supabase.rpc("can_use_ai_tokens_v2", {
        user_uuid: userId,
        tokens_needed: estimatedInputTokens + estimatedOutputTokens,
      });
      if (!canUseTokens) {
        return NextResponse.json(
          {
            error: "Token limit exceeded",
            details: {
              message: `You've reached your AI token limit for the ${planName} plan.`,
              tokensUsed: ai_tokens_used,
              tokensLimit: ai_tokens_limit,
              planName: planName,
              upgradeRequired: true,
            },
          },
          { status: 429 },
        );
      }
    }

    // Intent detection (igual que tienes)
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

    let toolData: any = null;
    let toolType = "general";

    if (isFlightIntent) {
      toolType = "flight_search";
      try {
        const toolRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/chat/tools/flight-search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: message }),
        })
        if (toolRes.ok) toolData = await toolRes.json()
      } catch (error) { console.error("Flight search tool error:", error) }
    } else if (isCodeIntent) {
      toolType = "code_generation";
      try {
        const toolRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/chat/tools/code-generator`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: message }),
        })
        if (toolRes.ok) toolData = await toolRes.json()
      } catch (error) { console.error("Code generation tool error:", error) }
    } else if (isDocumentIntent) {
      toolType = "document_processing";
      try {
        const toolRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/chat/tools/document-processor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: message }),
        })
        if (toolRes.ok) toolData = await toolRes.json()
      } catch (error) { console.error("Document processing tool error:", error) }
    } else if (isExpenseIntent) {
      toolType = "expense_analysis";
      try {
        const toolRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/chat/tools/expense-analyzer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: message, userId: user?.id }),
        })
        if (toolRes.ok) toolData = await toolRes.json()
      } catch (error) { console.error("Expense analysis tool error:", error) }
    }

    // Web context (Brave) → citations
    let webContext = "";
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
          for (const r of items) { sources.push({ title: r.title, url: r.url, snippet: r.snippet }) }
          if (items.length > 0) {
            const lines = items.map((r: any, i: number) => `- [${i + 1}] ${r.title} — ${r.url}`)
            webContext = `\n\nWeb context:\n${lines.join("\n")}\nUse and cite sources when applicable.`
          }
        }
      } catch (e) { console.error("Web search error:", e) }
    }

    const thinkingInlineInstruction = includeReasoningInline
      ? "\n\nWhen requested, include your high-level thinking wrapped in <thinking>...</thinking> (3–5 bullets), then the main answer. Do not include private chain-of-thought; keep it brief."
      : "";

    const baseSystem = agent === "flights"
      ? FLIGHTS_EXPERT_SYSTEM_PROMPT
      : agent === "hotels"
      ? HOTELS_EXPERT_SYSTEM_PROMPT
      : SYSTEM_PROMPT;

    const systemPrompt = `${baseSystem}${thinkingInlineInstruction}${webContext}`.trim();

    let enhancedMessage = message;
    if (includeReasoning) { enhancedMessage = `${message}\n\n${buildReasoningInstruction()}`; }

    const anthropic = getAnthropicClient();
    const maxTokensForResponse = PLAN_CONFIGS[planName].maxTokensPerCall || 1000;

    const initial: any = await (anthropic as any).messages.create({
      model: PLAN_CONFIGS[planName].model,
      max_tokens: maxTokensForResponse,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        ...conversationHistory,
        { role: "user", content: enhancedMessage },
      ],
    });

    const responseBlock = initial?.content?.[0];
    text = responseBlock && responseBlock.type === "text" && typeof responseBlock.text === "string"
      ? responseBlock.text.trim()
      : "";

    if (toolData?.success) {
      const toolContext = buildToolContext(toolData);
      if ((toolContext as any)?.sources) { sources.push(...(toolContext as any).sources) }
    }

    if (userId) {
      try {
        await supabase.from("ai_chat_logs").insert({
          user_id: userId,
          message: message,
          response: text,
          tokens_used: initial?.usage?.input_tokens + initial?.usage?.output_tokens || null,
          model_used: PLAN_CONFIGS[planName].model,
          reasoning_included: includeReasoningInline,
          reasoning_content: reasoningInline || null,
        });
      } catch (logError) { console.error("Failed to log chat interaction:", logError) }
    }

    return NextResponse.json({
      response: text,
      reasoning: reasoningInline,
      sources,
      toolType,
      tool: toolData,
      offers: toolData?.offers || null,
    });
  } catch (error) {
    console.error("AI Chat error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}