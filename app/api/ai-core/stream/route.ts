import { NextRequest } from "next/server"
import { anthropic } from "@ai-sdk/anthropic"
import { streamText } from "ai"
import { buildSystemPrompt } from "@/lib/prompts/system"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json()
    if (!message) return new Response("Message is required", { status: 400 })

    const system = buildSystemPrompt({ domain: ["general", "travel", "business", "coding"] })

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
