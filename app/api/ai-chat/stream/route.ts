import { NextRequest } from "next/server"
import { routeChat } from "@/lib/chat/router"
import { createClient as createServerSupabase } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const { message, history = [], includeReasoning = false } = await req.json()
    if (!message) return new Response("Message required", { status: 400 })

    const supabase = createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    const result = await routeChat({ message, history, includeReasoning, userId: user?.id, baseUrl: process.env.NEXT_PUBLIC_BASE_URL })

    // Log usage
    try {
      if (user?.id) {
        await supabase.from('ai_usage').insert({
          user_id: user.id,
          model: "claude-3-7-sonnet-latest",
          input_tokens: result.tokenUsage?.inputTokens || 0,
          output_tokens: result.tokenUsage?.outputTokens || Math.ceil(result.text.length / 4),
          context_type: (result.toolUsed || 'general'),
        })
      }
    } catch {}

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        const content = result.text
        const chunkSize = 64
        for (let i = 0; i < content.length; i += chunkSize) {
          const slice = content.slice(i, i + chunkSize)
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
