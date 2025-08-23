import { NextResponse } from "next/server"
import Exa from "exa-js"
import Anthropic from "@anthropic-ai/sdk"

export async function POST(request: Request) {
  try {
    const { q, numResults = 5 } = await request.json().catch(() => ({ q: undefined }))
    const EXA_API_KEY = process.env.EXA_API_KEY
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
    if (!EXA_API_KEY || !ANTHROPIC_API_KEY) {
      return NextResponse.json({ ok: false, error: "Missing EXA_API_KEY or ANTHROPIC_API_KEY" }, { status: 500 })
    }
    if (!q || typeof q !== "string") {
      return NextResponse.json({ ok: false, error: "Missing 'q'" }, { status: 400 })
    }

    const exa = new Exa(EXA_API_KEY)
    const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY })

    const results = await exa.searchAndContents(q, { numResults })

    const summaryPrompt = `You are a research assistant. Summarize the following web results into a concise brief with sources.\n\n${results?.results?.map((r: any, i: number) => `(${i + 1}) ${r.title}\n${r.url}\n${r.text?.slice(0, 1000) || ""}`).join("\n\n")}`

    const completion = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 600,
      messages: [{ role: "user", content: summaryPrompt }],
    } as any)

    return NextResponse.json({ ok: true, query: q, results, summary: (completion as any)?.content?.[0]?.text || "" })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Search failed" }, { status: 500 })
  }
}