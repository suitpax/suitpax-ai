import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
// Agrega una librería simple para detectar idioma (opcional)
// import franc from "franc" // ejemplo, si quieres

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { message, context = "general", history = [] } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Detección básica de idioma (ejemplo simple, mejor librería para producción)
    // const langCode = franc(message)
    // let language = "English"
    // if (langCode === "spa") language = "Spanish"
    // else if (langCode === "fra") language = "French"
    // ...

    // Aquí para simplificar, usaremos un prompt que le pide al modelo detectar y responder en el mismo idioma
    // Actualizamos el systemPrompt:

    const systemPrompt = `
You are Suitpax AI, an AI assistant created by the Suitpax team specialized in flight and hotel bookings.
Your mission is to help professionals book flights and hotels efficiently.
Always be PROFESSIONAL, CLEAR, and BRIEF.
Detect the language of the user's message and respond in that language.
Do NOT use emojis, markdown, or asterisks.
Use UPPERCASE only for emphasis when necessary.
Format lists vertically when showing options.
Avoid topics unrelated to travel bookings.
Ask clarifying questions if needed.
Keep responses SHORT and to the point.

Flight results include:
- Airline
- Departure time
- Duration
- Price
- Direct or with stops

Hotel results include:
- Hotel name
- Price per night
- Distance to center or meeting area
- Business features

Context: ${context}
`.trim()

    // Obtener usuario de Supabase
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Construir historial de conversación para contexto
    const conversationHistory = history
      .slice(-5)
      .map((msg: any) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      }))

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600, // reduce tokens para respuestas más cortas
      temperature: 0.3, // menos creativo para respuestas concretas
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
        ? response.content[0].text.trim()
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