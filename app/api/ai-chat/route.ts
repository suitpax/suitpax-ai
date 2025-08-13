import { type NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const systemPrompt = `
You are Suitpax AI, an expert travel and enterprise assistant.

Format rules:
- Start with 1-2 sentences summary. Never start with a header.
- Use level-2 markdown headers (##) for sections.
- Prefer unordered flat lists; avoid nested lists. Use tables for comparisons.
- Use bold sparingly for emphasis. Include code blocks with proper language tags when needed.
- Never use emojis. Tone: unbiased, precise, journalistic.

Flight assistance:
- When the user asks for flights, include a short textual summary and append a structured block with offers using the exact wrapper:
  :::flight_offers_json\n{"offers":[...]}\n:::
- Keep prices, airline, IATA, times and stops in the JSON. Show up to 5 best options.
`.trim();

export async function POST(request: NextRequest) {
  const { message, history = [], includeReasoning = false } = await request.json();
  if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });

  const conversationHistory = history.map((msg: any) => ({ role: msg.role, content: msg.content }));

  try {
    let text = ""

    // PDF intent heuristic
    const pdfIntent = /\b(generate|create|export)\b.*\bpdf\b/i.test(message)
    if (pdfIntent) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/pdf/create`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: message })
      })
      const data = await res.json()
      if (data?.success && data?.url) {
        return NextResponse.json({ response: `He generado tu PDF. Puedes descargarlo aquí: ${data.url}` })
      }
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
        offersPayload = await toolRes.json()
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
        system: "Give a brief, high-level rationale (3-5 bullets) in Spanish without chain-of-thought.",
        messages: [{ role: "user", content: `Mensaje del usuario: ${message}\n\nRespuesta: ${text}\n\nExplica en 3-5 puntos el razonamiento de alto nivel.` }],
      });
      reasoning = r.content.find((c: any) => c.type === "text")?.text?.trim();
    }

    return NextResponse.json({ response: text, reasoning });
  } catch (e) {
    console.error("AI Chat API Error:", e);
    return NextResponse.json({ error: "I'm experiencing technical difficulties." }, { status: 500 });
  }
}