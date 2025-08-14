import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { MemoryService } from "@/lib/intelligence/memory/memory-service";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

function createReasoningPrompt(message: string, context: string): string {
  return `
Please analyze the user's travel request and provide your reasoning process before your final response.

User message: "${message}"
Context: ${context}

<thinking>
1. Identify service type
2. Missing info to ask
3. Best approach
4. Business considerations (budget, compliance, etc.)
5. Structure of the answer
</thinking>

[Your main response here]
`.trim();
}

const baseSystemPrompt = `
You are Suitpax AI, a professional assistant specialized in business travel, expense optimization, and enterprise support.

Rules:
- Be professional, clear, and brief. Detect user's language and reply in it.
- No emojis or decorative symbols. Use UPPERCASE only when necessary.
- Do not invent real travel/pricing data; simulate only if explicitly asked.
- Ask for missing critical info before proceeding.
- Use Markdown with clear sections (##), bullet/numbered lists, and tables when helpful.
- Provide code blocks with language tags when replying with code.

Flight assistance JSON wrapper for offers (append at the end when relevant):
:::flight_offers_json\n{"offers": [...]}\n:::
`.trim();

export async function POST(request: NextRequest) {
  try {
    const { message, context = "general", history = [], includeReasoning = false } = await request.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || "anonymous";
    const memory = new MemoryService(userId);

    const conversationHistory = (history || []).slice(-5).map((m: any) => ({ role: m.role === "user" ? "user" : "assistant", content: m.content }));

    const finalPrompt = includeReasoning ? createReasoningPrompt(message, String(context)) : message;
    const finalSystem = includeReasoning
      ? baseSystemPrompt + "\n\nWhen requested, show your thinking process in <thinking> tags before your main response."
      : baseSystemPrompt;

    // Optional: tools (example: flight offers)
    let offersPayload: any = null;
    const isFlightIntent = /\bflight|vuelo|vuelos\b/i.test(message);
    if (isFlightIntent) {
      try {
        const toolRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/ai-chat/tools/flight-search`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: message })
        });
        if (toolRes.ok) offersPayload = await toolRes.json();
      } catch {}
    }

    const res = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: includeReasoning ? 1200 : 800,
      temperature: 0.3,
      system: finalSystem,
      messages: [...conversationHistory, { role: "user", content: finalPrompt }],
    });

    let text = res.content.find((c: any) => c.type === "text")?.text?.trim() || "";

    // Append flight JSON block if available
    if (offersPayload?.success && Array.isArray(offersPayload.offers)) {
      text += `\n\n:::flight_offers_json\n${JSON.stringify({ offers: offersPayload.offers })}\n:::`;
    }

    // Extract reasoning block if present
    let reasoning: string | undefined;
    if (includeReasoning && text.includes('<thinking>')) {
      const m = text.match(/<thinking>(.*?)<\/thinking>/s);
      if (m) {
        reasoning = m[1].trim();
        text = text.replace(/<thinking>.*?<\/thinking>/s, '').trim();
      }
    }

    // Persist memory with Mem0
    try {
      await memory.addConversationWithContext(message, text);
    } catch (e) { console.error("Mem0 add conversation error", e); }

    // Log chat in Supabase
    try {
      await supabase.from("ai_chat_logs").insert({
        user_id: userId,
        message,
        response: text,
        context_type: context,
        tokens_used: (res as any)?.usage?.input_tokens + (res as any)?.usage?.output_tokens || 0,
        model_used: "claude-3-5-sonnet-20240620",
        reasoning_included: includeReasoning,
        reasoning_content: reasoning || null,
      });
    } catch (logError) { console.error("Failed to log chat interaction:", logError); }

    return NextResponse.json({ response: text, reasoning, model: "claude-3-5-sonnet-20240620" });
  } catch (e) {
    console.error("AI Chat API Error:", e);
    return NextResponse.json({ error: "I'm experiencing technical difficulties." }, { status: 500 });
  }
}
