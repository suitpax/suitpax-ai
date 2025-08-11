import { NextRequest } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { buildSystemPrompt } from "@/lib/prompts/system"
import { createClient as createServerSupabase } from "@/lib/supabase/server"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json()
    if (!message) return new Response("Message required", { status: 400 })

    const supabase = createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    const system = buildSystemPrompt({ domain: ["general", "travel", "coding", "business"] })

    // We use non-streaming API to get usage, then stream the text to client for UX
    const res = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4096,
      system,
      messages: [...history.map((m: any) => ({ role: m.role, content: m.content })), { role: "user", content: message }],
    })

    const text = (res.content.find((c: any) => c.type === "text") as any)?.text || ""

    // Log usage
    try {
      const inputTokens = (res as any)?.usage?.input_tokens || 0
      const outputTokens = (res as any)?.usage?.output_tokens || Math.ceil(text.length / 4)
      if (user?.id) {
        await supabase.from('ai_usage').insert({
          user_id: user.id,
          model: "claude-3-5-sonnet-20240620",
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          context_type: /flight|vuelo/i.test(message) ? 'flight_search' : 'general',
        })
      }
    } catch {}

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        const chunkSize = 64
        for (let i = 0; i < text.length; i += chunkSize) {
          const slice = text.slice(i, i + chunkSize)
          controller.enqueue(encoder.encode(slice))
        }
        controller.close()
      }
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    })
  } catch (e: any) {
    return new Response("Error", { status: 500 })
  }
}