import { type NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, buildReasoningInstruction } from "@/lib/prompts/system";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(request: NextRequest) {
  const { message, history = [], includeReasoning = false, webSearch = false, deepSearch = false } = await request.json();
  if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });

  const conversationHistory = history.map((msg: any) => ({ role: msg.role, content: msg.content }));

  const systemPrompt = buildSystemPrompt({ domain: ["general", "travel", "coding", "business"] });

  try {
    let text = "";
    let sources: Array<{ title: string; url?: string; snippet?: string }> = [];

    // PDF intent heuristic
    const pdfIntent = /\b(generate|create|export)\b.*\bpdf\b/i.test(message);
    if (pdfIntent) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/pdf/create`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: message })
        })
        const data = await res.json()
        if (data?.success && data?.url) {
          return NextResponse.json({ response: `He generado tu PDF. Puedes descargarlo aquí: ${data.url}` })
        }
      } catch {}
    }

    // Optional sources via web/deep search (best-effort)
    if (webSearch || deepSearch) {
      try {
        // Placeholder simple fetch to a web search service or internal tool
        const q = encodeURIComponent(message.slice(0, 180))
        const res = await fetch(`https://r.jina.ai/http://duckduckgo.com/html/?q=${q}`, { next: { revalidate: 60 } })
        if (res.ok) {
          const html = await res.text()
          // Very naive extraction of titles/links snippets from HTML fallback
          const matches = Array.from(html.matchAll(/<a[^>]+class="result__a"[^>]*>(.*?)<\/a>.*?<a[^>]+href="(.*?)"/gis)).slice(0, 3)
          sources = matches.map((m: any) => ({ title: m[1]?.replace(/<[^>]+>/g, '') || 'Source', url: m[2] }))
        }
      } catch {}
    }

    // Flight intent heuristic
    const isFlightIntent = /\b([A-Z]{3})\b.*\b(to|→|-)\b.*\b([A-Z]{3})\b/i.test(message) || /\bflight|vuelo|vuelos\b/i.test(message)
    let offersPayload: any = null
    if (isFlightIntent) {
      try {
        const toolRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/ai-chat/tools/flight-search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: message })
        })
        if (toolRes.ok) offersPayload = await toolRes.json()
      } catch {}
    }

    const initial = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [...conversationHistory, { role: "user", content: message }],
    });

    text = initial.content.find((c: any) => c.type === "text")?.text || "";

    if (offersPayload?.success) {
      text += `\n\n:::flight_offers_json\n${JSON.stringify({ offers: offersPayload.offers })}\n:::`
    }

    let reasoning: string | undefined
    if (includeReasoning) {
      const r = await anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 300,
        system: buildReasoningInstruction("es"),
        messages: [{ role: "user", content: `Mensaje del usuario: ${message}\n\nRespuesta: ${text}\n\nExplica en 3–5 puntos el razonamiento de alto nivel.` }],
      });
      reasoning = r.content.find((c: any) => c.type === "text")?.text?.trim();
    }

    return NextResponse.json({ response: text, reasoning, sources });
  } catch (e: any) {
    const errorId = Math.random().toString(36).slice(2)
    console.error("AI Chat API Error:", errorId, e?.stack || e)
    return NextResponse.json({ error: "We're experiencing technical difficulties.", errorId }, { status: 500 });
  }
}
