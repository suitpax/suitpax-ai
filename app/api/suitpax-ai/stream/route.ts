import { NextRequest } from "next/server"
import { anthropic } from "@ai-sdk/anthropic"
import { streamText } from "ai"
import { buildKernelSystemPrompt } from "@/lib/prompts/kernel"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json()
    if (!message) return new Response("Message is required", { status: 400 })

    const system = buildKernelSystemPrompt({
      intent: /flight|vuelo/i.test(message) ? "travel" : "general",
      language: "en",
      style: { tone: "professional", useHeaders: true, useBullets: true, allowTables: true },
      features: { enforceNoCOT: true, includeFlightJsonWrapper: true },
      context: { recentConversation: history, urgency: "medium" },
    })

    const result = await streamText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      system,
      messages: [...history, { role: "user", content: message }],
      maxTokens: 1000,
      temperature: 0.7,
    })

    return result.toAIStreamResponse()
  } catch (e: any) {
    return new Response("Stream error", { status: 500 })
  }
}