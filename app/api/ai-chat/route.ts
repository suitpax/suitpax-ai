import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { buildSystemPrompt, buildReasoningInstruction, buildToolContext } from "@/lib/prompts/system"
import { createClient as createServerSupabase } from "@/lib/supabase/server"
import { SUITPAX_AI_SYSTEM_PROMPT } from "@/lib/prompts/enhanced-system"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const TRAVEL_AGENT_SYSTEM_PROMPT = SUITPAX_AI_SYSTEM_PROMPT

export async function POST(request: NextRequest) {
  const {
    message,
    history = [],
    includeReasoning = false,
    webSearch = false,
    deepSearch = false,
  } = await request.json()
  if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 })

  const conversationHistory = history.map((msg: any) => ({ role: msg.role, content: msg.content }))

  try {
    let text = ""
    const sources: Array<{ title: string; url?: string; snippet?: string }> = []
    const supabase = createServerSupabase()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Estimate tokens needed (rough calculation: 1 token ≈ 4 characters)
    const estimatedInputTokens = Math.ceil((message + JSON.stringify(conversationHistory)).length / 4)
    const estimatedOutputTokens = 1000 // Conservative estimate for response

    // Check if user can use AI tokens
    const { data: canUseTokens, error: tokenCheckError } = await supabase.rpc("can_use_ai_tokens", {
      user_uuid: user.id,
      tokens_needed: estimatedInputTokens + estimatedOutputTokens,
    })

    if (tokenCheckError) {
      console.error("Token check error:", tokenCheckError)
      return NextResponse.json({ error: "Failed to check token limits" }, { status: 500 })
    }

    if (!canUseTokens) {
      // Get user's current plan limits for error message
      const { data: planLimits } = await supabase.rpc("get_user_plan_limits", { user_uuid: user.id })
      const limits = planLimits?.[0]

      return NextResponse.json(
        {
          error: "Token limit exceeded",
          details: {
            message: `You've reached your AI token limit for the ${limits?.plan_name || "current"} plan.`,
            tokensUsed: limits?.ai_tokens_used || 0,
            tokensLimit: limits?.ai_tokens_limit || 0,
            planName: limits?.plan_name || "free",
            upgradeRequired: true,
          },
        },
        { status: 429 },
      )
    }

    const isFlightIntent =
      /\b([A-Z]{3})\b.*\b(to|→|-|from)\b.*\b([A-Z]{3})\b/i.test(message) ||
      /\b(flight|flights|vuelo|vuelos|fly|flying|book|search)\b/i.test(message) ||
      /\b(madrid|barcelona|london|paris|new york|tokyo|dubai)\b.*\b(to|from)\b/i.test(message)

    const isCodeIntent =
      /\b(code|coding|program|programming|script|function|class|algorithm)\b/i.test(message) ||
      /\b(javascript|python|typescript|react|node|html|css|sql)\b/i.test(message) ||
      /\b(create|build|generate|write).*\b(app|website|function|component)\b/i.test(message)

    const isDocumentIntent =
      /\b(pdf|document|report|analyze|extract|ocr|scan)\b/i.test(message) ||
      /\b(generate|create).*\b(report|document|pdf|invoice)\b/i.test(message)

    const isExpenseIntent =
      /\b(expense|expenses|cost|costs|spending|budget|financial)\b/i.test(message) ||
      /\b(analyze|review).*\b(expenses|costs|spending)\b/i.test(message)

    let toolData: any = null
    let toolType = "general"

    if (isFlightIntent) {
      toolType = "flight_search"
      try {
        const toolRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ai-chat/tools/flight-search`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: message }),
          },
        )
        if (toolRes.ok) {
          toolData = await toolRes.json()
        }
      } catch (error) {
        console.error("Flight search tool error:", error)
      }
    } else if (isCodeIntent) {
      toolType = "code_generation"
      try {
        const toolRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ai-chat/tools/code-generator`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: message }),
          },
        )
        if (toolRes.ok) {
          toolData = await toolRes.json()
        }
      } catch (error) {
        console.error("Code generation tool error:", error)
      }
    } else if (isDocumentIntent) {
      toolType = "document_processing"
      try {
        const toolRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ai-chat/tools/document-processor`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: message }),
          },
        )
        if (toolRes.ok) {
          toolData = await toolRes.json()
        }
      } catch (error) {
        console.error("Document processing tool error:", error)
      }
    } else if (isExpenseIntent) {
      toolType = "expense_analysis"
      try {
        const toolRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ai-chat/tools/expense-analyzer`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: message, userId: user.id }),
          },
        )
        if (toolRes.ok) {
          toolData = await toolRes.json()
        }
      } catch (error) {
        console.error("Expense analysis tool error:", error)
      }
    }

    const systemPrompt = isFlightIntent
      ? TRAVEL_AGENT_SYSTEM_PROMPT
      : buildSystemPrompt({ domain: ["general", "travel", "coding", "business", "documents"] })

    let enhancedMessage = message
    if (toolData?.success) {
      enhancedMessage += buildToolContext(toolType, toolData)
    }

    const initial = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [...conversationHistory, { role: "user", content: enhancedMessage }],
    })

    text = initial.content.find((c: any) => c.type === "text")?.text || ""

    const actualInputTokens = (initial.usage as any)?.input_tokens || estimatedInputTokens
    const actualOutputTokens = (initial.usage as any)?.output_tokens || Math.ceil(text.length / 4)
    const totalTokensUsed = actualInputTokens + actualOutputTokens

    const { data: tokenUpdateSuccess, error: tokenUpdateError } = await supabase.rpc("increment_ai_tokens", {
      user_uuid: user.id,
      tokens_used: totalTokensUsed,
    })

    if (tokenUpdateError || !tokenUpdateSuccess) {
      console.error("Failed to update token usage:", tokenUpdateError)
      // Continue with response but log the error
    }

    if (toolData?.success) {
      if (toolType === "flight_search" && toolData.offers?.length > 0) {
        const offers = toolData.offers
        const searchParams = toolData.search_params

        // Add destination image
        const destinationName = getDestinationName(searchParams.destination)
        const destinationImage = `/placeholder.svg?height=200&width=400&query=${encodeURIComponent(`${destinationName} city skyline travel destination`)}`

        text += `\n\n![${destinationName}](${destinationImage})\n\n`

        // Format flight offers as rich markdown
        text += `## ✈️ Available Flights: ${searchParams.origin} → ${searchParams.destination}\n\n`

        offers.forEach((offer: any, index: number) => {
          const departureTime = new Date(offer.route.departure_time).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC",
          })
          const arrivalTime = new Date(offer.route.arrival_time).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC",
          })

          const stopsText =
            offer.route.stops === 0 ? "Direct" : `${offer.route.stops} stop${offer.route.stops > 1 ? "s" : ""}`

          text += `### ${index + 1}. ${offer.airline.name} (${offer.airline.code})\n\n`
          text += `| Detail | Information |\n`
          text += `|--------|-------------|\n`
          text += `| **Price** | **${offer.price} ${offer.currency}** |\n`
          text += `| **Departure** | ${departureTime} |\n`
          text += `| **Arrival** | ${arrivalTime} |\n`
          text += `| **Duration** | ${formatDuration(offer.route.duration)} |\n`
          text += `| **Stops** | ${stopsText} |\n`

          if (offer.airline.logo) {
            text += `| **Airline** | ![${offer.airline.name}](${offer.airline.logo}) ${offer.airline.name} |\n`
          }

          text += `\n[**Book This Flight →**](${offer.booking_url})\n\n---\n\n`
        })

        text += `\n💡 **Travel Tip**: Book early for better prices and seat selection. All prices shown are subject to availability.\n\n`
      } else if (toolType === "code_generation" && toolData.code) {
        text += `\n\n## 💻 Generated Code\n\n`
        text += `\`\`\`${toolData.language || "javascript"}\n${toolData.code}\n\`\`\`\n\n`
        if (toolData.explanation) {
          text += `### Explanation\n${toolData.explanation}\n\n`
        }
        if (toolData.usage) {
          text += `### Usage\n${toolData.usage}\n\n`
        }
      } else if (toolType === "document_processing" && toolData.analysis) {
        text += `\n\n## 📄 Document Analysis\n\n`
        text += `${toolData.analysis}\n\n`
        if (toolData.extractedData) {
          text += `### Extracted Data\n\`\`\`json\n${JSON.stringify(toolData.extractedData, null, 2)}\n\`\`\`\n\n`
        }
      } else if (toolType === "expense_analysis" && toolData.analysis) {
        text += `\n\n## 💰 Expense Analysis\n\n`
        text += `${toolData.analysis}\n\n`
        if (toolData.insights) {
          text += `### Key Insights\n`
          toolData.insights.forEach((insight: string, index: number) => {
            text += `${index + 1}. ${insight}\n`
          })
          text += `\n`
        }
      }
    }

    let reasoning: string | undefined
    if (includeReasoning) {
      const reasoningPrompt = toolData?.success
        ? `Explain the ${toolType.replace("_", " ")} process and recommendations for this query: ${message}`
        : `Mensaje del usuario: ${message}\n\nRespuesta: ${text}\n\nExplica en 3–5 puntos el razonamiento de alto nivel.`

      const r = await anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 300,
        system: buildReasoningInstruction("es"),
        messages: [{ role: "user", content: reasoningPrompt }],
      })
      reasoning = r.content.find((c: any) => c.type === "text")?.text?.trim()

      const reasoningTokens = (r.usage as any)?.input_tokens + (r.usage as any)?.output_tokens || 100
      await supabase.rpc("increment_ai_tokens", {
        user_uuid: user.id,
        tokens_used: reasoningTokens,
      })
    }

    try {
      await supabase.from("ai_usage").insert({
        user_id: user.id,
        model: "claude-3-5-sonnet-20241022",
        input_tokens: actualInputTokens,
        output_tokens: actualOutputTokens,
        total_tokens: totalTokensUsed,
        context_type: toolType,
        provider: "anthropic",
        cost_usd: calculateTokenCost(totalTokensUsed, "claude-3-5-sonnet-20241022"),
      })

      // Also log to ai_chat_logs for backward compatibility
      await supabase.from("ai_chat_logs").insert({
        user_id: user.id,
        message: message,
        response: text,
        tokens_used: totalTokensUsed,
        model_used: "claude-3-5-sonnet-20241022",
        context_type: toolType,
      })
    } catch (e) {
      console.error("Failed to log AI usage:", e)
    }

    return NextResponse.json({
      response: text,
      reasoning,
      sources,
      tokenUsage: {
        used: totalTokensUsed,
        inputTokens: actualInputTokens,
        outputTokens: actualOutputTokens,
      },
      toolUsed: toolType !== "general" ? toolType : undefined,
    })
  } catch (e: any) {
    const errorId = Math.random().toString(36).slice(2)
    console.error("AI Chat API Error:", errorId, e?.stack || e)
    return NextResponse.json({ error: "We're experiencing technical difficulties.", errorId }, { status: 500 })
  }
}

function calculateTokenCost(totalTokens: number, model: string): number {
  // Anthropic Claude 3.5 Sonnet pricing (approximate)
  const costPer1kTokens = 0.003 // $3 per 1M tokens = $0.003 per 1k tokens
  return (totalTokens / 1000) * costPer1kTokens
}

function getDestinationName(iataCode: string): string {
  const cityMap: Record<string, string> = {
    MAD: "Madrid",
    BCN: "Barcelona",
    LHR: "London",
    CDG: "Paris",
    JFK: "New York",
    LAX: "Los Angeles",
    DXB: "Dubai",
    NRT: "Tokyo",
    SIN: "Singapore",
    SYD: "Sydney",
    FRA: "Frankfurt",
    AMS: "Amsterdam",
    ZUR: "Zurich",
    MUC: "Munich",
    FCO: "Rome",
    MXP: "Milan",
  }
  return cityMap[iataCode] || iataCode
}

function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!match) return duration

  const hours = match[1] ? Number.parseInt(match[1]) : 0
  const minutes = match[2] ? Number.parseInt(match[2]) : 0

  if (hours && minutes) {
    return `${hours}h ${minutes}m`
  } else if (hours) {
    return `${hours}h`
  } else if (minutes) {
    return `${minutes}m`
  }
  return duration
}
