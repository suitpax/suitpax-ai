import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { DOCUMENT_AI_PROMPT } from "@/lib/prompts/enhanced-system"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(request: NextRequest) {
  try {
    const { query, documentText, documentType = "report" } = await request.json()
    if (!query && !documentText) return NextResponse.json({ success: false, error: "Query or documentText required" }, { status: 400 })

    const input = `\n${DOCUMENT_AI_PROMPT}\n\n## Task\n- User query: ${query || "Analyze document"}\n- Document type: ${documentType}\n${documentText ? `- Document content (truncated):\n${String(documentText).slice(0, 4000)}` : ""}\n\nProvide a brief analysis and, if applicable, extract structured data in JSON.`

    const res = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1500,
      system: DOCUMENT_AI_PROMPT,
      messages: [{ role: "user", content: input }],
      temperature: 0.5,
    })

    const text = (res as any).content?.find?.((c: any) => c.type === "text")?.text || ""

    return NextResponse.json({ success: true, analysis: text, usage: (res as any).usage })
  } catch (e) {
    console.error("document-processor tool error:", e)
    return NextResponse.json({ success: false, error: "Failed to process document" }, { status: 500 })
  }
}