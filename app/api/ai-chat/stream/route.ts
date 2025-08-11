import { NextRequest } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { buildSystemPrompt } from "@/lib/prompts/system"

export const runtime = "edge"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: NextRequest) {
  const { message, history = [] } = await req.json()
  if (!message) return new Response("Message is required", { status: 400 })

  const systemPrompt = buildSystemPrompt({ domain: ["general", "travel", "coding", "business"] })

  const stream = await anthropic.messages.stream({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [...history.map((m: any) => ({ role: m.role, content: m.content })), { role: "user", content: message }],
  })

  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      try {
        stream.on("text", (delta: string) => {
          controller.enqueue(encoder.encode(delta))
        })
        stream.on("end", () => controller.close())
        stream.on("error", (err: any) => {
          controller.error(err)
        })
        await stream.done()
      } catch (e) {
        controller.error(e)
      }
    }
  })

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    }
  })
}