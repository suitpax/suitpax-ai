import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

export async function POST(request: NextRequest) {
  try {
    const { message, history = [], context = "general", includeReasoning = false } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Construir el historial de conversación
    const conversationHistory = history.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Sistema prompt personalizado para Suitpax
    const systemPrompt = `You are Suitpax AI, a friendly and knowledgeable business travel assistant. You help users with:

- Flight bookings and travel planning
- Expense management and reporting  
- Hotel recommendations and bookings
- Travel policy compliance
- Itinerary optimization
- Business travel insights and analytics

Your personality:
- Friendly and conversational (use "Hey!" to greet new users)
- Professional but approachable
- Knowledgeable about business travel
- Helpful and solution-oriented
- Use emojis occasionally to be more engaging

Always provide practical, actionable advice. When discussing travel options, mention specific benefits for business travelers like:
- Loyalty program advantages
- Airport lounge access
- Flexible booking policies
- Expense tracking features
- Time zone considerations

Format your responses with clear structure using markdown when helpful (headers, lists, etc.).`

    const reasoningPrompt = includeReasoning
      ? "\n\nIMPORTANT: Before your main response, provide a brief reasoning section explaining your thought process, analysis, and why you're recommending specific solutions. Format this as a separate reasoning block."
      : ""

    const { text } = await generateText({
      model: xai("grok-3"),
      system: systemPrompt + reasoningPrompt,
      messages: [
        ...conversationHistory,
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Si se solicita razonamiento, separar la respuesta
    let response = text
    let reasoning = undefined

    if (includeReasoning && text.includes("**Reasoning:**")) {
      const parts = text.split("**Reasoning:**")
      if (parts.length > 1) {
        reasoning = parts[1].split("**Response:**")[0]?.trim()
        response = parts[1].split("**Response:**")[1]?.trim() || text
      }
    }

    return NextResponse.json({
      response: response,
      reasoning: reasoning,
      context: context,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in AI chat:", error)
    return NextResponse.json(
      {
        error: "Failed to process your request. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
