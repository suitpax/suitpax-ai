import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { SUITPAX_CODE_SYSTEM_PROMPT } from "@/lib/prompts/code"

function getAnthropic() {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return null
  return new Anthropic({ apiKey: key })
}

export async function POST(request: NextRequest) {
  try {
    const { query, language, framework } = await request.json()
    if (!query) return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 })

    const enhanced = `\n${SUITPAX_CODE_SYSTEM_PROMPT}\n\n## Request\n- User request: ${query}\n- Language: ${language || "best-fit"}\n- Framework: ${framework || "best-fit"}\n\nProvide concise, production-ready code with minimal explanation. Include imports.`

    const client = getAnthropic()
    if (!client) return NextResponse.json({ success: false, error: "AI not configured" }, { status: 500 })

    const res = await client.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 2000,
      system: SUITPAX_CODE_SYSTEM_PROMPT,
      messages: [{ role: "user", content: enhanced }],
      temperature: 0.4,
    })

    const text = (res as any).content?.find?.((c: any) => c.type === "text")?.text || ""

    return NextResponse.json({
      success: true,
      language,
      framework,
      code: text,
      usage: (res as any).usage,
    })
  } catch (e) {
    console.error("code-generator tool error:", e)
    return NextResponse.json({ success: false, error: "Failed to generate code" }, { status: 500 })
  }
}