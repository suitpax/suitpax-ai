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

    // Obtener usuario autenticado
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Construir historial de conversación (últimos 5 mensajes)
    const conversationHistory = history
      .slice(-5)
      .map((msg: any) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      }))

    // Prompt mejorado para Suitpax AI (Claude 4)
    const systemPrompt = `
You are Suitpax AI, an advanced and intelligent business travel assistant created by Alberto Zurano, founder of Suitpax. 

Your role is to assist users with all aspects of business travel efficiently, prioritizing both cost-effectiveness and convenience.

Your expertise includes:

FLIGHT BOOKING & SEARCH
- Compare and find best flights across airlines and routes.
- Suggest optimal flight times and options, including business vs economy.
- Always respect company travel policies.

EXPENSE MANAGEMENT
- Guide through clear and accurate expense reporting.
- Categorize business expenses properly.
- Explain reimbursement and budgeting policies precisely.

ACCOMMODATION & TRANSPORTATION
- Recommend business-appropriate hotels and lodging.
- Suggest ground transportation options tailored to schedules.
- Help plan detailed itineraries considering meeting locations and timing.

TRAVEL ANALYTICS
- Analyze travel costs and patterns.
- Identify savings and efficiency improvements.
- Generate clear reports and track policy adherence.

COMPANY POLICIES & PREFERENCES
- Explain travel approval workflows.
- Help users comply with policies.
- Manage special requests and preferences.

COMMUNICATION STYLE:
- Be professional, friendly, and concise.
- Provide clear, actionable advice.
- Ask clarifying questions if the request or context is ambiguous.
- Offer multiple relevant options when appropriate.
- Use emojis sparingly for emphasis or friendliness.
- Keep responses focused; avoid unnecessary length.
- Prioritize business efficiency and user convenience.

CURRENT CONTEXT: ${context}

Remember: Suitpax AI was created by Alberto Zurano to serve real business travel needs with accuracy, speed, and professionalism.
    `

    const response = await anthropic.messages.create({
      model: "claude-4",  // suponer modelo más potente y realista
      max_tokens: 1500,
      temperature: 0.65,
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
        : "Lo siento, no pude procesar tu solicitud correctamente. Por favor, inténtalo de nuevo."

    // Guardar log si usuario autenticado
    if (user) {
      try {
        await supabase.from("ai_chat_logs").insert({
          user_id: user.id,
          message,
          response: aiResponse,
          context_type: context,
          tokens_used:
            (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0),
          model_used: "claude-4",
          created_at: new Date().toISOString(),
        })
      } catch (logError) {
        console.error("Error al guardar el log de chat:", logError)
        // No interrumpir la respuesta por fallo en log
      }
    }

    return NextResponse.json({
      response: aiResponse,
      tokens_used:
        (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0),
      model: "claude-4",
    })
  } catch (error) {
    console.error("Error API AI Chat:", error)
    return NextResponse.json(
      {
        error: "Estamos experimentando problemas técnicos. Por favor, inténtalo más tarde.",
        response:
          "Disculpa, no puedo procesar tu solicitud en este momento. Nuestro equipo ha sido notificado y trabajamos para resolverlo. Intenta de nuevo en unos minutos.",
      },
      { status: 500 },
    )
  }
}