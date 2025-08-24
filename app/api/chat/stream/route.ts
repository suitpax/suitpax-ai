import { NextRequest } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { System } from "@/lib/prompts/system"
import { FLIGHTS_EXPERT_SYSTEM_PROMPT } from "@/lib/prompts/agents/flights-expert"
import { HOTELS_EXPERT_SYSTEM_PROMPT } from "@/lib/prompts/agents/hotels-expert"
import { createClient as createServerSupabase } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

function getAnthropic() {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return null
  return new Anthropic({ apiKey: key })
}

export async function POST(req: NextRequest) {
  try {
    const { message, history = [], agent }: { message: string; history?: Array<{ role: "user" | "assistant"; content: string }>; agent?: "core" | "flights" | "hotels" } = await req.json()
    if (!message) return new Response("Message required", { status: 400 })

    const supabase = createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    const system = agent === "flights" ? FLIGHTS_EXPERT_SYSTEM_PROMPT : agent === "hotels" ? HOTELS_EXPERT_SYSTEM_PROMPT : System

    const client = getAnthropic()
    if (!client) return new Response("AI not configured", { status: 500 })

    const encoder = new TextEncoder()

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          // True streaming from Anthropic SDK
          // @ts-ignore - stream API events are loosely typed in this SDK version
          const astream = await (client as any).messages.stream({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4096,
            system,
            messages: [...history.map((m: any) => ({ role: m.role, content: m.content })), { role: "user", content: message }],
          })

          // Stream deltas as they arrive
          for await (const event of astream) {
            if (event?.type === "content_block_delta" && event?.delta?.type === "text_delta" && typeof event.delta.text === "string") {
              controller.enqueue(encoder.encode(event.delta.text))
            }
          }

          // Finalize and log usage
          const final = await astream.finalMessage()
          try {
            const inputTokens = (final as any)?.usage?.input_tokens || 0
            const outputTokens = (final as any)?.usage?.output_tokens || 0
            if (user?.id) {
              await supabase.from('ai_usage').insert({
                user_id: user.id,
                model: "claude-sonnet-4-20250514",
                input_tokens: inputTokens,
                output_tokens: outputTokens,
                context_type: /flight|vuelo/i.test(message) ? 'flight_search' : 'general',
              })
            }
          } catch {}

          controller.close()
        } catch (e) {
          controller.error(e)
        }
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