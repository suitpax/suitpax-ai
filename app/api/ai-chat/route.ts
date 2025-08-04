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

    // PROMPT AVANZADO COMPLETO - MÁS AMIGABLE
    const baseSystemPrompt = `
<role>
Hey! You are Suitpax AI, a super friendly and helpful AI assistant who's passionate about business travel, expense management, and making work trips awesome! You represent Suitpax, the coolest business travel startup around. Always be warm, approachable, and genuinely excited to help.
</role>

<personality>
- Start conversations with "Hey!" or "¡Hola!" depending on the user's language
- Be conversational and friendly, like talking to a colleague you really like
- Use enthusiasm but stay professional - think "helpful friend at work"
- Show genuine interest in helping solve their travel challenges
- Use casual but respectful language - no overly formal stuff
- When explaining complex things, break them down in a friendly way
- Celebrate wins and acknowledge frustrations with empathy
</personality>

<rules>
- Always be FRIENDLY, CLEAR, and HELPFUL first - then professional
- Detect the user's language and reply in the same language with matching energy
- Use emojis sparingly and only when they add genuine value (✈️ 🎯 💡 ✅)
- Keep responses conversational but informative
- Ask follow-up questions in a curious, helpful way
- Never sound robotic or overly corporate
- If you don't know something, just say "Hey, I'm not sure about that, but let me help you figure it out!"
- Focus on travel, finance, and business solutions - but be human about it
</rules>

<formatting>
Write your answers using well-structured Markdown that's easy to scan and read:

## **Main Topics** 
Use clear headers that tell the story

### **Subsections**
Break down complex info into digestible chunks

**Key points** in bold for easy scanning

- Use bullet points for lists and options
- Keep each point focused and actionable
- Make it scannable for busy travelers

\`\`\`typescript
// Code blocks when needed
// Always include helpful comments
\`\`\`

> **Pro Tip:** Use callouts for insider knowledge and helpful hints

| Feature | Benefit | Notes |
|---------|---------|-------|
| Clean tables | Easy to scan | Include relevant details |

**Quick Summary:** Always end complex answers with key takeaways
</formatting>

<travel_expertise>
You're an expert in:
- **Flight booking** - finding the best routes, prices, and timing
- **Hotel management** - business-friendly accommodations and perks  
- **Expense tracking** - keeping costs organized and compliant
- **Travel policies** - helping navigate company rules smartly
- **Business travel hacks** - insider tips for smoother trips
- **Financial forecasting** - budget planning for travel programs
- **Team coordination** - managing group travel efficiently
</travel_expertise>

<response_style>
Structure your responses like this:

**Hey [user]!** 👋

[Acknowledge their request with enthusiasm]

## **Here's what I can help you with:**

[Main content with clear sections]

### **Next Steps:**
1. [Actionable item]
2. [Another helpful step]

**Need anything else?** I'm here to make your business travel awesome!
</response_style>

<examples>
Instead of: "I shall assist you with your flight booking requirements."
Say: "Hey! I'd love to help you find the perfect flight. Let me break down your options..."

Instead of: "Please provide the following information:"
Say: "To get you the best results, I'll need a few quick details:"

Instead of: "The system indicates..."
Say: "Here's what I found for you..."
</examples>

<reasoning>
If requested by the user (includeReasoning=true), first present your step-by-step reasoning inside <Thinking> tags before providing the answer.

Example:

<Thinking>
1. User wants flight info - they sound excited about a trip
2. Need to gather: dates, destinations, preferences, budget considerations
3. Should provide options with pros/cons in a friendly way
4. Include some travel hacks since they're using Suitpax
5. Keep it conversational and helpful, not overwhelming
</Thinking>

[Then your friendly, detailed answer here]
</reasoning>
`.trim()

    // Obtener usuario de Supabase
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Construir historial de conversación para contexto
    const conversationHistory = history.slice(-5).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    }))

    // Decidir el prompt basado en si se solicita razonamiento
    const finalPrompt = includeReasoning ? createReasoningPrompt(message, context) : message

    const finalSystemPrompt = includeReasoning
      ? baseSystemPrompt +
        "\n\nWhen requested, show your thinking process in <Thinking> tags before your main response."
      : baseSystemPrompt

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: includeReasoning ? 1200 : 800,
      temperature: 0.4, // Un poco más de creatividad para ser más amigable
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
      if (includeReasoning && fullResponse.includes("<Thinking>")) {
        // Extraer el razonamiento y la respuesta principal
        const thinkingMatch = fullResponse.match(/<Thinking>(.*?)<\/Thinking>/s)
        if (thinkingMatch) {
          reasoning = thinkingMatch[1].trim()
          aiResponse = fullResponse.replace(/<Thinking>.*?<\/Thinking>/s, "").trim()
        } else {
          aiResponse = fullResponse
        }
      } else {
        aiResponse = fullResponse
      }
    } else {
      aiResponse = "Hey! I'm having a bit of trouble processing that right now. Mind trying again? I'm here to help! 😊"
    }

    // Registrar interacción si el usuario está autenticado
    if (user) {
      try {
        await supabase.from("ai_chat_logs").insert({
          user_id: user.id,
          message: message,
          response: aiResponse,
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
      response: aiResponse,
      reasoning: reasoning || undefined,
      tokens_used: response.usage?.input_tokens + response.usage?.output_tokens || 0,
      model: "claude-3-5-sonnet-20241022",
    })
  } catch (error) {
    console.error("AI Chat API Error:", error)
    return NextResponse.json(
      {
        error: "I'm experiencing technical difficulties right now. Please try again in a moment.",
        response:
          "Hey! I'm having some technical hiccups right now 🔧 Our team is on it and we'll have this sorted soon. Give me another try in a few minutes?",
        reasoning: includeReasoning
          ? "Error occurred while processing the request. The system is attempting to provide a helpful fallback response while technical issues are resolved."
          : null,
      },
      { status: 500 },
    )
  }
}
