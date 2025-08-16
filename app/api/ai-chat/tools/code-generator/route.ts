import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { CODE_GENERATION_PROMPT } from "@/lib/prompts/enhanced-system"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(request: NextRequest) {
  try {
    const { query, language, framework } = await request.json()
    if (!query) return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 })

    const enhanced = `\n${CODE_GENERATION_PROMPT}\n\n## Request\n- User request: ${query}\n- Language: ${language || "best-fit"}\n- Framework: ${framework || "best-fit"}\n\nProvide concise, production-ready code with minimal explanation. Include imports.`

    const res = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      system: CODE_GENERATION_PROMPT,
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