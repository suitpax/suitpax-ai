import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { System } from "@/lib/prompts/system"

export async function POST(req: NextRequest) {
  try {
    const { type, size = "mid-market", budget = "standard", context = {}, language = "en" } = await req.json()
    if (!type) return NextResponse.json({ error: "type is required" }, { status: 400 })

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
    const prompt = `\n${System}\n\nGenerate a professional ${type} policy.\n\nCompany profile:\n- Size: ${size}\n- Budget: ${budget}\n- Context: ${JSON.stringify(context)}\n\nRequirements:\n1) Sections: Purpose, Scope, Roles, Booking/Approval Procedures, Allowable Expenses, Exclusions, Reimbursement, Compliance, Examples/Templates.\n2) Keep it concise, editable, and enterprise-ready.\n3) Use clear headings and bullets.\n4) Output in ${language}.`

    const res = await client.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 3000,
      system: System,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    })

    const text = (res as any).content?.find?.((c: any) => c.type === "text")?.text || ""
    return NextResponse.json({ policy: text })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "failed" }, { status: 500 })
  }
}

