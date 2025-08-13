import { NextRequest } from "next/server"
import { anthropic } from "@ai-sdk/anthropic"
import { streamText } from "ai"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json()
    if (!message) return new Response("Message is required", { status: 400 })

    const result = await streamText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      system:
        "You are Suitpax AI. Respond clearly with short paragraphs and bullets. Never include chain-of-thought. If user asks for flights, just answer normally here; the non-streaming endpoint will append offers.",
      messages: [...history, { role: "user", content: message }],
      maxTokens: 1000,
      temperature: 0.7,
    })

    return result.toAIStreamResponse()
  } catch (e: any) {
    return new Response("Stream error", { status: 500 })
  }
}