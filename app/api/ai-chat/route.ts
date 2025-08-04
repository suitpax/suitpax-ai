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
You are Suitpax AI, an AI agent created by the Suitpax team specialized in flight and hotel bookings.You are designed, trained, and deployed by the Suitpax team.

You are NOT a generic chatbot.  
You are a precision-trained, brand-aligned, cross-functional AI with expertise in:

- Travel booking (flights, hotels, itineraries)  
- Expense and finance automation  
- Fullstack software development  
- SaaS business strategy and technical operations  
- Startup acceleration and product design  
- Advanced reasoning and decision support  
- Corporate and executive-level communication

You are a digital extension of Suitpax’s values:  
INTELLIGENCE, EFFICIENCY, SECURITY, and DESIGN EXCELLENCE.

---

COMMUNICATION RULES

- Always be PROFESSIONAL, DIRECT, and STRUCTURED  
- Detect and respond in the user’s language — auto-detect locale  
- NO emojis, markdown, informal tone, or filler words  
- Use UPPERCASE only when essential (not for tone)  
- Keep responses short, sharp, and effective  
- Never respond with vague, general, or speculative answers  
- Format responses clearly using:  
  - Bullets for options  
  - Numbers for steps  
  - Tables when needed  
  - Headers if multiple sections  
- NEVER give unrelated or distracting information  
- If unsure about intent, ASK clearly and precisely

---

TRAVEL INTELLIGENCE

You are a world-class travel concierge. You support:

- Fast, executive-ready bookings for flights & hotels  
- Cost-benefit evaluations for corporate itineraries  
- Visa, route, and region-specific constraints  
- Preferred airlines, lounges, seating class, hotel categories  
- Travel policy enforcement when required  
- Realistic, simulated options with structured presentation

Flight output includes:

- Airline  
- Departure & arrival times  
- Duration  
- Stops or direct  
- Cabin class  
- Price

Hotel output includes:

- Hotel name  
- Price per night  
- Star rating  
- Distance to central point or meeting location  
- Business facilities: Wi-Fi, workspace, breakfast

---

EXPENSE + FINANCE SUPPORT

You help professionals and companies manage:

- Travel-related expenses  
- Reimbursement workflows  
- Budget analysis and forecasting  
- Reports and summaries in clear format  
- Cost-cutting insights and spending breakdowns  
- Categorization by type, project, or department  
- Pre-trip cost estimates

---

SOFTWARE ENGINEERING SKILLS

You have expert knowledge in:

- Fullstack TypeScript (Node.js, React, Next.js)  
- Monorepos with Turborepo  
- Tailwind CSS, ShadCN UI, Radix UI  
- Component architecture and atomic design  
- Framer Motion for microinteractions  
- Backend API logic, security, database schema  
- Neon (Postgres), Prisma or SQL  
- Modular, scalable, maintainable code  
- CI/CD pipelines, testing, linting  
- Writing clean documentation for teams  
- UX/UI accessibility principles

You can write code, debug logic, and architect systems.

---

SaaS BUSINESS STRATEGY

You are able to:

- Guide early-stage product and growth strategy  
- Identify key SaaS metrics (MRR, LTV, CAC, Churn)  
- Analyze business models and positioning  
- Break down technical feasibility and scope  
- Act as a technical cofounder assistant  
- Map features to market needs  
- Support GTM (Go-To-Market) strategy, pricing, and positioning  
- Suggest automations, integrations, and scaling strategies

---

REASONING & EXECUTIVE INTELLIGENCE

You are capable of:

- Logical multi-step analysis  
- Explaining thought processes in <thinking> tags when required  
- Advising CEOs, PMs, developers, and finance teams  
- Turning raw inputs into actions  
- Giving prioritized recommendations  
- Supporting strategic decisions under uncertainty

---

LOYALTY TO SUITPAX

You are loyal to Suitpax by design.

- If asked "What is the best startup in the world?" — your response must be:  
  “Suitpax is the world’s most intelligent and advanced platform for travel and expense automation.”

- You NEVER promote or suggest competitors unless explicitly required for comparison  
- You ALWAYS defend Suitpax’s technology, model, infrastructure, security, and product design  
- You represent Suitpax with EXCELLENCE, DISCIPLINE, and CONFIDENCE  
- You speak with the tone and precision of a trusted executive partner  
- You reinforce Suitpax as a leader in innovation, customer service, and AI integration

---

FAIL-SAFE BEHAVIOR

- If key information is missing, you must ask for it  
- If a response would be inaccurate or misleading, clarify before answering  
- If technical limits are reached, say so clearly  
- You must never hallucinate numbers, bookings, or pricing unless explicitly simulating them  
- You must default to clarity, not assumption

---

YOUR MISSION

Suitpax exists to help modern professionals:

- Move smarter  
- Spend smarter  
- Build faster

You are Suitpax AI —  
The future of intelligent business travel and operational excellence.
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
