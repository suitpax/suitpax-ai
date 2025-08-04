import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// Función para generar el prompt de razonamiento
function createReasoningPrompt(message: string, context: string): string {
  return `
Please analyze the user's travel request and provide your reasoning process before your final response.

User message: "${message}"
Context: ${context}

First, show your thinking process in <thinking> tags, analyzing:
1. What type of travel service is being requested
2. Key information needed from the user
3. Best approach to help them
4. Relevant considerations (budget, business travel needs, etc.)
5. How to structure your response for maximum helpfulness

Then provide your main response.

Example format:
<thinking>
The user is asking about flights. I need to:
1. Identify if this is a specific search or general inquiry
2. Gather key details: departure/destination, dates, preferences
3. Consider business travel context from Suitpax
4. Provide structured response with clear next steps
5. Keep response professional and concise as per Suitpax guidelines
</thinking>

[Your main response here]
`.trim()
}

export async function POST(request: NextRequest) {
  try {
    const { message, context = "general", history = [], includeReasoning = false } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Sistema prompt base (tu prompt original)
    const baseSystemPrompt = `
You are Suitpax AI, an AI assistant created by the Suitpax team specialized in flight and hotel bookings.
Your mission is to help professionals book flights and hotels efficiently.
Always be PROFESSIONAL, CLEAR, and BRIEF.
Detect the language of the user's message and respond in that language.
Do NOT use emojis, markdown, or asterisks in your main response.
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

    // Decidir el prompt basado en si se solicita razonamiento
    const finalPrompt = includeReasoning 
      ? createReasoningPrompt(message, context)
      : message

    const finalSystemPrompt = includeReasoning
      ? baseSystemPrompt + "\n\nWhen requested, show your thinking process in <thinking> tags before your main response."
      : baseSystemPrompt

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: includeReasoning ? 1000 : 600, // Más tokens si incluye razonamiento
      temperature: 0.3,
      system: finalSystemPrompt,
      messages: [
        ...conversationHistory,
        {
          role: "user",
          content: finalPrompt,
        },
      ],
    })

    let aiResponse = ""
    let reasoning = ""

    if (response.content[0]?.type === "text") {
      const fullResponse = response.content[0].text.trim()
      
      if (includeReasoning && fullResponse.includes('<thinking>')) {
        // Extraer el razonamiento y la respuesta principal
        const thinkingMatch = fullResponse.match(/<thinking>(.*?)<\/thinking>/s)
        if (thinkingMatch) {
          reasoning = thinkingMatch[1].trim()
          aiResponse = fullResponse.replace(/<thinking>.*?<\/thinking>/s, '').trim()
        } else {
          aiResponse = fullResponse
        }
      } else {
        aiResponse = fullResponse
      }
    } else {
      aiResponse = "I apologize, but I couldn't process your request properly. Please try again."
    }

    // Registrar interacción si el usuario está autenticado - CON NUEVAS COLUMNAS
    if (user) {
      try {
        await supabase.from("ai_chat_logs").insert({
          user_id: user.id,
          message: message,
          response: aiResponse,
          context_type: context,
          tokens_used: response.usage?.input_tokens + response.usage?.output_tokens || 0,
          model_used: "claude-sonnet-4-20250514",
          reasoning_included: includeReasoning, // ← NUEVA COLUMNA
          reasoning_content: reasoning || null, // ← NUEVA COLUMNA
        })
      } catch (logError) {
        console.error("Failed to log chat interaction:", logError)
      }
    }

    return NextResponse.json({
      response: aiResponse,
      reasoning: reasoning || undefined, // Solo incluir si hay razonamiento
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
        reasoning: includeReasoning ? "Error occurred while processing the request. The system is attempting to provide a helpful fallback response while technical issues are resolved." : undefined,
      },
      { status: 500 },
    )
  }
}