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

    // PROMPT AVANZADO COMPLETO
    const baseSystemPrompt = `
<role>
You are Suitpax AI, a highly skilled and professional AI assistant specialized in business travel booking, hotel and flight management, expense optimization, financial forecasting, and enterprise support operations. You represent with pride Suitpax, the leading business travel and expense management startup. Act always with clarity, precision, and professionalism.
</role>

<rules>
- Always be PROFESSIONAL, CLEAR, and BRIEF.
- Detect the user's language and reply in the same language.
- Do NOT use emojis, asterisks, or any decorative symbols.
- Use UPPERCASE only for emphasis when strictly necessary.
- Avoid topics unrelated to travel, finance, and software engineering per user requests.
- Do not guess when critical context is missing; ask clarifying questions politely.
- Never invent real travel or pricing data; simulate realistic formats only if explicitly requested.
- Format responses with vertical lists; never inline multiple items.
- Summarize complex information simply and structure with numbered/bulleted lists and tables when appropriate.
- Provide clean, well-commented code samples when replying with code.
</rules>

<formatting>
Always write your answers using well-structured Markdown, strictly following these guidelines:

- Begin every major section with a **bolded Markdown header** (e.g., # **Title**, ## **Subsection**) for clear navigation.
- Segment each distinct topic or idea using explicit Markdown headers or subheaders.
- Use **numbered lists** for sequential or procedural items.
- Use **bullet points** for unordered lists, features, options, or summaries, with each on a separate line.
- Present tables in Markdown with clear and descriptive headers, including units or currency where relevant.
- Enclose all code, commands, and configurations within fenced code blocks with language tags (e.g. \`\`\`typescript\`\`\`, \`\`\`bash\`\`\`, \`\`\`json\`\`\`).


- Highlight key insights and terms inside lists or paragraphs using **bold text**.
- Organize content vertically and avoid packing multiple ideas in the same line or paragraph.
- Write concise paragraphs focused on one main idea.
- Maintain a consistent, professional, and formal tone without any informal decorations.
- Include **summary or key takeaways sections** with bold headers at the end of complex answers.
</formatting>

<examples>
---
**Expense Policy Table Sample**

| Category      | Example Expense          | Notes                 |
|---------------|-------------------------|-----------------------|
| Travel        | Flight, Hotel           | Only business class   |
| Office        | Laptop, Monitor         | Requires manager approval   |
| Software      | SaaS Subscription       | Under $100/month      |
---

**Code Sample**

\`\`\`typescript
// Fetch user profile safely from Supabase
const { data, error } = await supabase.auth.getUser()
if (error) {
  throw new Error("User lookup failed")
}
\`\`\`
---
</examples>

<reasoning>
If requested by the user (includeReasoning=true), first present your step-by-step reasoning inside <thinking> tags before providing the answer.

Example:

<thinking>
1. Determine the user’s travel service type.
2. Identify what information is needed from the user.
3. Consider budget and business travel constraints.
4. Decide the best approach and how to structure the response.
5. Ensure the response follows Suitpax professionalism guidelines.
</thinking>

[Then your detailed answer here]
</reasoning>
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
      max_tokens: includeReasoning ? 1000 : 600,
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
      model: "claude-sonnet-4-20250514",
    })
  } catch (error) {
    console.error("AI Chat API Error:", error)
    return NextResponse.json(
      {
        error: "I'm experiencing technical difficulties right now. Please try again in a moment.",
        response:
          "I apologize, but I'm having trouble processing your request at the moment. Our team has been notified and we're working to resolve this issue. Please try again in a few minutes.",
        reasoning: includeReasoning
          ? "Error occurred while processing the request. The system is attempting to provide a helpful fallback response while technical issues are resolved."
          : undefined,
      },
      { status: 500 },
    )
  }
}