import { NextRequest } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: NextRequest) {
  const { message, history = [], system, model = "claude-3-5-sonnet-20240620" } = await req.json()
  if (!message) {
    return new Response("Message required", { status: 400 })
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const msg = await anthropic.messages.create({
          model,
          system: system || "You are Suitpax AI. Answer in Markdown.",
          max_tokens: 4096,
          messages: [...history, { role: "user", content: message }],
          stream: true,
        } as any)

        // @ts-expect-error: stream events typing
        for await (const ev of msg) {
          if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") {
            const text = ev.delta.text as string
            controller.enqueue(new TextEncoder().encode(text))
          }
        }
      } catch (e) {
        controller.error(e)
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Transfer-Encoding": "chunked",
    },
  })
}