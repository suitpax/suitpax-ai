import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { EXPENSE_ANALYSIS_PROMPT } from "@/lib/prompts/specialized-prompts"

function getAnthropic() {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return null
  return new Anthropic({ apiKey: key })
}

export async function POST(request: NextRequest) {
  try {
    const { query, userId } = await request.json()
    if (!query) return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 })

    const input = `\n${EXPENSE_ANALYSIS_PROMPT}\n\n## Task\n- User: ${userId || "anonymous"}\n- Request: ${query}\n\nProvide a concise analysis with 3-5 key insights and a short action plan.`

    const client = getAnthropic()
    if (!client) return NextResponse.json({ success: false, error: "AI not configured" }, { status: 500 })

    const res = await client.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1200,
      system: EXPENSE_ANALYSIS_PROMPT,
      messages: [{ role: "user", content: input }],
      temperature: 0.4,
    })

    const text = (res as any).content?.find?.((c: any) => c.type === "text")?.text || ""

    const insights = text
      .split(/\n+/)
      .filter((l: string) => /^[\-*\d]/.test(l))
      .slice(0, 5)

    return NextResponse.json({ success: true, analysis: text, insights, usage: (res as any).usage })
  } catch (e) {
    console.error("expense-analyzer tool error:", e)
    return NextResponse.json({ success: false, error: "Failed to analyze expenses" }, { status: 500 })
  }
}