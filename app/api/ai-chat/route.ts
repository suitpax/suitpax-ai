import { type NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const systemPrompt = `
You are Suitpax AI, a world-class autonomous travel agent. Answer in clean Markdown without emojis. Prefer concise answers with bullet lists and code fences when relevant.
`.trim();

export async function POST(request: NextRequest) {
  const { message, history = [], includeReasoning = false } = await request.json();
  if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });

  const conversationHistory = history.map((msg: any) => ({ role: msg.role, content: msg.content }));

  try {
    const initial = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [...conversationHistory, { role: "user", content: message }],
    });

    const text = initial.content.find((c: any) => c.type === "text")?.text || "";

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
