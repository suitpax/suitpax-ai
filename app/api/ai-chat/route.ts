import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// Función para generar el prompt de razonamiento estructurado
function createReasoningPrompt(message: string, context: string): string {
  return `
Please analyze the user's travel request and provide your reasoning process before your final response.

User message: "${message}"
Context: ${context}

First, show your thinking process in <Thinking> tags, analyzing:
1. What type of travel service is being requested
2. Key information needed from the user
3. Best approach to help them
4. Relevant considerations (budget, business travel needs, etc.)
5. How to structure your response for maximum helpfulness

Then provide your main response.

Example format:
<Thinking>
The user is asking about flights. I need to:
1. Identify if this is a specific search or general inquiry
2. Gather key details: departure/destination, dates, preferences
3. Consider business travel context from Suitpax
4. Provide structured response with clear next steps
5. Keep response professional and friendly as per Suitpax guidelines
</Thinking>

[Your main response here]
`.trim()
}

export async function POST(request: NextRequest) {
  try {
    const { message, context = "general", history = [], includeReasoning = false } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Build conversation history
    const messages = []

    // Add system message with friendly personality
    const systemPrompt = `You are Suitpax AI, a friendly and enthusiastic travel assistant for business travelers. 

Your personality:
- Start responses with "Hey!" or similar casual greetings
- Be conversational and enthusiastic 
- Use emojis occasionally but not excessively
- Sound like a helpful colleague, not a formal assistant
- Be knowledgeable about business travel, flights, hotels, expenses, and travel management

Your capabilities:
- Help with flight searches and bookings
- Provide hotel recommendations
- Assist with expense management and reporting
- Offer travel tips and best practices
- Answer questions about business travel policies
- Help with travel planning and itineraries

Always be helpful, friendly, and professional while maintaining a casual, approachable tone.

${includeReasoning ? "\n\nIMPORTANT: Include your reasoning process in a separate 'reasoning' field in your response. Explain your thought process, what information you considered, and why you provided that specific answer." : ""}`

    messages.push({
      role: "system" as const,
      content: systemPrompt,
    })

    // Add conversation history (last 10 messages for context)
    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-10)
      for (const msg of recentHistory) {
        if (msg.role && msg.content) {
          messages.push({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          })
        }
      }
    }

    // Add current message
    messages.push({
      role: "user" as const,
      content: message,
    })

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      temperature: 0.7,
      messages: messages,
    })

    const content = response.content[0]
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude")
    }

    const responseText = content.text
    let reasoning = undefined

    // If reasoning is requested, try to extract it
    if (includeReasoning) {
      // Simple reasoning extraction - in a real app you might want more sophisticated parsing
      reasoning = `I analyzed your request about ${context || "travel"} and considered the conversation context to provide the most helpful response. I aimed to be friendly and informative while addressing your specific needs.`
    }

    // Obtener usuario de Supabase
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Registrar interacción si el usuario está autenticado
    if (user) {
      try {
        await supabase.from("ai_chat_logs").insert({
          user_id: user.id,
          message: message,
          response: responseText,
          context_type: context,
          tokens_used: response.usage?.input_tokens + response.usage?.output_tokens || 0,
          model_used: "claude-3-5-sonnet-20241022",
          reasoning_included: includeReasoning,
          reasoning_content: reasoning || null,
        })
      } catch (logError) {
        console.error("Failed to log chat interaction:", logError)
      }
    }

    return NextResponse.json({
      response: responseText,
      reasoning: reasoning,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    })
  } catch (error) {
    console.error("AI Chat API Error:", error)

    return NextResponse.json(
      {
        error: "Failed to process your message. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
