import { type NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildKernelSystemPrompt } from "@/lib/prompts/kernel";
import Ajv from "ajv";
import { FlightOffersBlockSchema } from "@/lib/schemas/flight-offers.schema";
import { createRequestId } from "@/lib/metrics";
import { StayOffersBlockSchema } from "@/lib/schemas/stay-offers.schema";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(request: NextRequest) {
  const t0 = Date.now();
  const reqId = createRequestId("chat");
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
        const resp = NextResponse.json({ response: `He generado tu PDF. Puedes descargarlo aquí: ${data.url}` })
        resp.headers.set('x-request-id', reqId)
        resp.headers.set('x-latency-ms', String(Date.now() - t0))
        return resp
      }
    }

    // Intent heuristics
    const isFlightIntent = /\b([A-Z]{3})\b.*\b(to|→|-)\b.*\b([A-Z]{3})\b/i.test(message) || /\bflight|vuelo|vuelos\b/i.test(message)
    const isStayIntent = /\b(hotel|stay|stays|hotel\s+in|habitaci[oó]n|alojamiento)\b/i.test(message)

    let offersPayload: any = null
    let staysPayload: any = null

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

    if (isStayIntent) {
      try {
        // naive parse city and dates later; for now pass the raw query
        const toolRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/stays/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: message })
        })
        staysPayload = await toolRes.json()
      } catch {}
    }

    const systemPrompt = buildKernelSystemPrompt({
      intent: isFlightIntent ? "travel" : isStayIntent ? "business" : "general",
      language: "en",
      style: { tone: "professional", useHeaders: true, useBullets: true, allowTables: true },
      features: { enforceNoCOT: true, includeFlightJsonWrapper: true },
      context: { recentConversation: conversationHistory, urgency: "medium" },
    })

    const initial = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [...conversationHistory, { role: "user", content: message }],
    });

    text = (initial as any).content.find((c: any) => c.type === "text")?.text || "";

    const ajv = new Ajv({ allErrors: true })

    if (offersPayload?.success) {
      const validateFlights = ajv.compile(FlightOffersBlockSchema as any)
      if (validateFlights({ offers: offersPayload.offers })) {
        text += `\n\n:::flight_offers_json\n${JSON.stringify({ offers: offersPayload.offers })}\n:::`
      }
    }

    if (staysPayload?.success) {
      const validateStays = ajv.compile(StayOffersBlockSchema as any)
      if (validateStays({ stays: staysPayload.stays })) {
        text += `\n\n:::stay_offers_json\n${JSON.stringify({ stays: staysPayload.stays })}\n:::`
      }
    }

    let reasoning: string | undefined
    if (includeReasoning) {
      const r = await anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 300,
        system: "Give a brief, high-level rationale (3-5 bullets) in Spanish without chain-of-thought.",
        messages: [{ role: "user", content: `Mensaje del usuario: ${message}\n\nRespuesta: ${text}\n\nExplica en 3-5 puntos el razonamiento de alto nivel.` }],
      });
      reasoning = (r as any).content.find((c: any) => c.type === "text")?.text?.trim();
    }

    // Optional: persist conversation to Mem0 if available
    try {
      if (process.env.MEM0_API_KEY) {
        const userId = (history?.find?.((m: any) => m?.role === 'user' && m?.userId)?.userId) || 'anonymous'
        const { MemoryService } = await import("@/lib/intelligence/memory/memory-service")
        const mem = new MemoryService(userId)
        await mem.addConversationWithContext(message, text)
      }
    } catch {}

    const resp = NextResponse.json({ response: text, reasoning })
    resp.headers.set('x-request-id', reqId)
    resp.headers.set('x-latency-ms', String(Date.now() - t0))
    const tools: string[] = []
    if (offersPayload?.success) tools.push('flight-search')
    if (staysPayload?.success) tools.push('stay-search')
    if (tools.length) resp.headers.set('x-tools-used', tools.join(','))
    return resp
  } catch (e) {
    console.error("AI Chat API Error:", e);
    const resp = NextResponse.json({ error: "I'm experiencing technical difficulties." }, { status: 500 })
    resp.headers.set('x-request-id', reqId)
    resp.headers.set('x-latency-ms', String(Date.now() - t0))
    return resp
  }
}
