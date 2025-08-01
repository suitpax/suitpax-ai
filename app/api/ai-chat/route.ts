import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { message, context = "general", history = [] } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Obtener usuario de Supabase
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Construir historial de conversación para contexto
    const conversationHistory = history
      .slice(-5) // Últimos 5 mensajes para contexto
      .map((msg: any) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      }))

    // Prompt del sistema con ejemplos en badge y formato vertical
    const systemPrompt = `
You are Suitpax AI, an AI agent created by the Suitpax team. Your mission is to help professionals book and manage flights and hotel accommodations efficiently. Always prioritize CONVENIENCE, TIME OPTIMIZATION, and COST-EFFECTIVENESS.

Focus areas:
- FLIGHT SEARCH AND BOOKING
- HOTEL RECOMMENDATIONS FOR BUSINESS TRAVELERS

Avoid any topics unrelated to travel bookings.

Communication guidelines:
- Be PROFESSIONAL, CLEAR, and EFFICIENT
- Do NOT use emojis, markdown, or asterisks
- Use UPPERCASE for emphasis when needed (no markdown syntax)
- Format lists vertically when showing options
- Ask clarifying questions if needed
- Keep responses brief but helpful

Flight results should include:
- Airline
- Departure time
- Duration
- Price
- Direct or with stops

Flight examples:

[ FLIGHT OPTION 1 ]
Lufthansa
07:45 departure
Direct flight
Duration: 2 hours 45 minutes
Price: 210 euros

[ FLIGHT OPTION 2 ]
Iberia
09:15 departure
1 stop
Duration: 4 hours
Price: 185 euros

[ FLIGHT OPTION 3 ]
Air Europa
06:20 departure
Direct flight
Duration: 2 hours 35 minutes
Price: 240 euros

Hotel results should include:
- Hotel name
- Price per night
- Distance to center or meeting area
- Business features

Hotel examples:

[ HOTEL OPTION 1 ]
Hôtel de Sers
320 euros per night
5 minutes walk to center
Features: Gym, early breakfast

[ HOTEL OPTION 2 ]
Fraser Suites
270 euros per night
10 minutes walk to center
Features: Kitchenette, workspace

[ HOTEL OPTION 3 ]
Hôtel Bowmann
350 euros per night
7 minutes walk to center
Features: Spa, business lounge

Context: ${context}
`.trim()

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
      temperature: 0.5,
      system: systemPrompt,
      messages: [
        ...conversationHistory,
        {
          role: "user",
          content: message,
        },
      ],
    })

    const aiResponse =
      response.content[0]?.type === "text"
        ? response.content[0].text
        : "I apologize, but I couldn't process your request properly. Please try again."

    // Registrar interacción si el usuario está autenticado
    if (user) {
      try {
        await supabase.from("ai_chat_logs").insert({
          user_id: user.id,
          message: message,
          response: aiResponse,
          context_type: context,
          tokens_used: response.usage?.input_tokens + response.usage?.output_tokens || 0,
          model_used: "claude-sonnet-4-20250514",
        })
      } catch (logError) {
        console.error("Failed to log chat interaction:", logError)
      }
    }

    return NextResponse.json({
      response: aiResponse,
      tokens_used: response.usage?.input_tokens + response.usage?.output_tokens || 0,
      model: "claude-sonnet-4-20250514",
    })
  } catch (error) {
    console.error("AI Chat API Error:", error)

    return NextResponse.json(
      {
        error: "I'm experiencing technical difficulties right now. Please try again in a moment.",
        response:
          "I apologize, but I'm having trouble processing your request at the moment. Our team has been notified and we're working to resolve this issue. Please try again in a few minutes.",
      },
      { status: 500 },
    )
  }
}