import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { buildSystemPrompt, buildReasoningInstruction } from "@/lib/prompts/system"
import { createClient as createServerSupabase } from "@/lib/supabase/server"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const TRAVEL_AGENT_SYSTEM_PROMPT = `You are Suitpax AI, an advanced travel agent assistant with access to real-time flight data through the Duffel API. You specialize in business travel and can help users find, compare, and book flights.

Key capabilities:
- Search real flights using current market data
- Provide detailed flight information with airline logos and route details
- Format responses with rich markdown including flight cards
- Generate destination images and travel recommendations
- Handle complex travel queries with multiple destinations and dates

When users ask about flights, always:
1. Extract origin, destination, and travel dates from their query
2. Use the flight search tool to get real data
3. Present results in a visually appealing markdown format with:
   - Flight cards showing airline logos, times, prices, and duration
   - Destination images when relevant
   - Clear booking links
   - Travel tips and recommendations

Response format for flight results:
- Use markdown tables and cards for flight information
- Include airline logos using the provided URLs
- Add destination images using placeholder URLs with descriptive queries
- Provide clear next steps for booking

Always be helpful, professional, and focus on providing actionable travel solutions.`

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

    const isFlightIntent =
      /\b([A-Z]{3})\b.*\b(to|→|-|from)\b.*\b([A-Z]{3})\b/i.test(message) ||
      /\b(flight|flights|vuelo|vuelos|fly|flying|book|search)\b/i.test(message) ||
      /\b(madrid|barcelona|london|paris|new york|tokyo|dubai)\b.*\b(to|from)\b/i.test(message)

    let flightData: any = null

    if (isFlightIntent) {
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
          flightData = await toolRes.json()
        }
      } catch (error) {
        console.error("Flight search tool error:", error)
      }
    }

    const systemPrompt = isFlightIntent
      ? TRAVEL_AGENT_SYSTEM_PROMPT
      : buildSystemPrompt({ domain: ["general", "travel", "coding", "business"] })

    let enhancedMessage = message
    if (flightData?.success && flightData.offers?.length > 0) {
      enhancedMessage += `\n\nFlight search results:\n${JSON.stringify(flightData, null, 2)}`
    }

    const initial = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [...conversationHistory, { role: "user", content: enhancedMessage }],
    })

    text = initial.content.find((c: any) => c.type === "text")?.text || ""

    if (flightData?.success && flightData.offers?.length > 0) {
      const offers = flightData.offers
      const searchParams = flightData.search_params

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
    }

    let reasoning: string | undefined
    if (includeReasoning) {
      const reasoningPrompt = isFlightIntent
        ? `Explain the flight search process and recommendations for this travel query: ${message}`
        : `Mensaje del usuario: ${message}\n\nRespuesta: ${text}\n\nExplica en 3–5 puntos el razonamiento de alto nivel.`

      const r = await anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 300,
        system: buildReasoningInstruction("es"),
        messages: [{ role: "user", content: reasoningPrompt }],
      })
      reasoning = r.content.find((c: any) => c.type === "text")?.text?.trim()
    }

    // Log AI usage
    try {
      const inputTokens = (initial.usage as any)?.input_tokens || 0
      const outputTokens = (initial.usage as any)?.output_tokens || Math.ceil(text.length / 4)
      if (user?.id) {
        await supabase.from("ai_usage").insert({
          user_id: user.id,
          model: "claude-3-5-sonnet-20241022",
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          context_type: isFlightIntent ? "flight_search" : "general",
        })
      }
    } catch (e) {
      console.error("Failed to log AI usage:", e)
    }

    return NextResponse.json({ response: text, reasoning, sources })
  } catch (e: any) {
    const errorId = Math.random().toString(36).slice(2)
    console.error("AI Chat API Error:", errorId, e?.stack || e)
    return NextResponse.json({ error: "We're experiencing technical difficulties.", errorId }, { status: 500 })
  }
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
