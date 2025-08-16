import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { DOCUMENT_AI_PROMPT } from "@/lib/prompts/enhanced-system"
import { createClient as createServerSupabase } from "@/lib/supabase/server"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(request: NextRequest) {
  try {
    const {
      prompt,
      documentType = "report",
      format = "markdown",
      includeCharts = false,
      businessContext,
    } = await request.json()

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
${DOCUMENT_AI_PROMPT}

## Document Request
- **Type**: ${documentType}
- **Format**: ${format}
- **Include Charts**: ${includeCharts ? "Yes" : "No"}
- **Business Context**: ${businessContext || "General business document"}
- **User Request**: ${prompt}

## Requirements
1. Create a professional, well-structured document
2. Use appropriate formatting and layout
3. Include relevant data and insights
4. Ensure business-appropriate tone and style
5. Add visual elements if requested
6. Follow corporate document standards

Generate a comprehensive document that meets professional business standards.
    `

    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-latest",
      max_tokens: 6144,
      system: DOCUMENT_AI_PROMPT,
      messages: [{ role: "user", content: enhancedPrompt }],
    })

    const generatedDocument = response.content.find((c: any) => c.type === "text")?.text || ""

    // Log usage
    const tokensUsed = (response.usage as any)?.input_tokens + (response.usage as any)?.output_tokens || 0

    await supabase.from("ai_usage").insert({
      user_id: user.id,
      model: "claude-3-7-sonnet-latest",
      input_tokens: (response.usage as any)?.input_tokens || 0,
      output_tokens: (response.usage as any)?.output_tokens || 0,
      total_tokens: tokensUsed,
      context_type: "document_generation",
      provider: "anthropic",
      cost_usd: (tokensUsed / 1000) * 0.003,
    })

    return NextResponse.json({
      document: generatedDocument,
      documentType,
      format,
      includeCharts,
      tokenUsage: {
        total: tokensUsed,
        inputTokens: (response.usage as any)?.input_tokens || 0,
        outputTokens: (response.usage as any)?.output_tokens || 0,
      },
    })
  } catch (error) {
    console.error("Document generation error:", error)
    return NextResponse.json({ error: "Failed to generate document" }, { status: 500 })
  }
}
