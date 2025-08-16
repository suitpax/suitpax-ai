import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { SUITPAX_CODE_SYSTEM_PROMPT } from "@/lib/prompts/code"
import { createClient as createServerSupabase } from "@/lib/supabase/server"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(request: NextRequest) {
  try {
    const { prompt, language, framework, complexity = "intermediate" } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const supabase = createServerSupabase()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const enhancedPrompt = `
${SUITPAX_CODE_SYSTEM_PROMPT}

## Request Details
- **Language/Framework**: ${language || "Best choice for the task"} ${framework ? `with ${framework}` : ""}
- **Complexity Level**: ${complexity}
- **User Request**: ${prompt}

## Requirements
1. Generate complete, production-ready code
2. Include proper error handling and validation
3. Provide setup and deployment instructions
4. Follow best practices for the chosen technology stack
5. Include testing strategies where applicable
    `

    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 8192,
      system: SUITPAX_CODE_SYSTEM_PROMPT,
      messages: [{ role: "user", content: enhancedPrompt }],
    })

    const generatedCode = response.content.find((c: any) => c.type === "text")?.text || ""

    // Log usage
    const tokensUsed = (response.usage as any)?.input_tokens + (response.usage as any)?.output_tokens || 0

    await supabase.from("ai_usage").insert({
      user_id: user.id,
      model: "claude-3-7-sonnet-20250219",
      input_tokens: (response.usage as any)?.input_tokens || 0,
      output_tokens: (response.usage as any)?.output_tokens || 0,
      total_tokens: tokensUsed,
      context_type: "code_generation",
      provider: "anthropic",
      cost_usd: (tokensUsed / 1000) * 0.003,
    })

    return NextResponse.json({
      code: generatedCode,
      language,
      framework,
      complexity,
      tokenUsage: {
        total: tokensUsed,
        inputTokens: (response.usage as any)?.input_tokens || 0,
        outputTokens: (response.usage as any)?.output_tokens || 0,
      },
    })
  } catch (error) {
    console.error("Code generation error:", error)
    return NextResponse.json({ error: "Failed to generate code" }, { status: 500 })
  }
}
