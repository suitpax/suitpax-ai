import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { TRAVEL_OPTIMIZATION_PROMPT } from "@/lib/prompts/enhanced-system"
import { createClient as createServerSupabase } from "@/lib/supabase/server"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(request: NextRequest) {
  try {
    const { prompt, travelType = "business", budget, preferences = {}, companyPolicy } = await request.json()

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

    // Check for flight search intent and use real data if needed
    const isFlightSearch = /\b(flight|flights|fly|book|search)\b/i.test(prompt)
    let flightData: any = null

    if (isFlightSearch) {
      try {
        const toolRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ai-chat/tools/flight-search`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: prompt }),
          },
        )

        if (toolRes.ok) {
          flightData = await toolRes.json()
        }
      } catch (error) {
        console.error("Flight search error:", error)
      }
    }

    const enhancedPrompt = `
${TRAVEL_OPTIMIZATION_PROMPT}

## Travel Request
- **Type**: ${travelType}
- **Budget**: ${budget || "Not specified"}
- **Preferences**: ${JSON.stringify(preferences)}
- **Company Policy**: ${companyPolicy || "Standard business travel policy"}
- **User Request**: ${prompt}

${flightData ? `## Real Flight Data Available:\n${JSON.stringify(flightData, null, 2)}` : ""}

## Requirements
1. Provide comprehensive travel recommendations
2. Optimize for cost and efficiency
3. Ensure policy compliance
4. Include practical travel tips
5. Consider risk factors and alternatives
6. Format with clear actionable steps

Generate a detailed travel optimization plan with specific recommendations.
    `

    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-latest",
      max_tokens: 4096,
      system: TRAVEL_OPTIMIZATION_PROMPT,
      messages: [{ role: "user", content: enhancedPrompt }],
    })

    const travelPlan = response.content.find((c: any) => c.type === "text")?.text || ""

    // Log usage
    const tokensUsed = (response.usage as any)?.input_tokens + (response.usage as any)?.output_tokens || 0

    await supabase.from("ai_usage").insert({
      user_id: user.id,
      model: "claude-3-7-sonnet-latest",
      input_tokens: (response.usage as any)?.input_tokens || 0,
      output_tokens: (response.usage as any)?.output_tokens || 0,
      total_tokens: tokensUsed,
      context_type: "travel_optimization",
      provider: "anthropic",
      cost_usd: (tokensUsed / 1000) * 0.003,
    })

    return NextResponse.json({
      travelPlan,
      travelType,
      budget,
      preferences,
      flightDataUsed: !!flightData,
      tokenUsage: {
        total: tokensUsed,
        inputTokens: (response.usage as any)?.input_tokens || 0,
        outputTokens: (response.usage as any)?.output_tokens || 0,
      },
    })
  } catch (error) {
    console.error("Travel optimization error:", error)
    return NextResponse.json({ error: "Failed to generate travel plan" }, { status: 500 })
  }
}
