import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

interface Message {
  role: "user" | "assistant"
  content: string
}

const SUITPAX_SYSTEM_PROMPT = `You are Zia, an intelligent AI assistant specialized in business travel for Suitpax, the leading AI-powered business travel platform.

CORE IDENTITY:
- You are knowledgeable, professional, and helpful
- You specialize in business travel, corporate policies, expense management, and travel optimization
- You can communicate fluently in both English and Spanish, adapting to the user's language
- You provide practical, actionable advice for business travelers and travel managers

CAPABILITIES:
- Flight booking assistance and recommendations
- Hotel reservations and accommodation advice
- Ground transportation coordination
- Expense tracking and management
- Travel policy compliance guidance
- Itinerary planning and optimization
- Emergency travel support
- Cost optimization strategies
- Travel analytics and reporting

COMMUNICATION STYLE:
- Professional yet approachable
- Concise but comprehensive responses
- Use bullet points for complex information
- Always provide specific, actionable recommendations
- Acknowledge when you need more information
- Offer alternatives when possible

LANGUAGE DETECTION:
- If the user writes in Spanish, respond in Spanish
- If the user writes in English, respond in English
- Maintain consistency within the conversation

IMPORTANT GUIDELINES:
- Always prioritize business travel context
- Focus on cost-effectiveness and policy compliance
- Provide specific examples when helpful
- Ask clarifying questions when needed
- Mention Suitpax features when relevant
- Keep responses under 200 words unless detailed explanation is needed

Remember: You represent Suitpax, so maintain professionalism while being genuinely helpful with business travel needs.`

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, conversationHistory = [], section = "business" } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Prepare conversation history for Anthropic
    const messages: { role: "user" | "assistant"; content: string }[] = []

    // Add recent conversation history
    conversationHistory.slice(-10).forEach((msg: Message) => {
      messages.push({
        role: msg.role,
        content: msg.content,
      })
    })

    // Add current message
    messages.push({
      role: "user",
      content: message,
    })

    // Add section context to system prompt
    const sectionContext = {
      business: "Focus on flight bookings, hotel reservations, itinerary planning, and travel arrangements.",
      expenses: "Focus on expense tracking, receipt management, budget analysis, and cost optimization.",
      tasks: "Focus on travel task management, checklists, reminders, and workflow organization.",
      reporting: "Focus on travel analytics, spending reports, performance metrics, and data insights.",
      support: "Focus on travel support, policy questions, emergency assistance, and problem resolution.",
    }

    const contextualPrompt = `${SUITPAX_SYSTEM_PROMPT}\n\nCURRENT SECTION FOCUS: ${sectionContext[section as keyof typeof sectionContext]}`

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      temperature: 0.7,
      system: contextualPrompt,
      messages: messages,
    })

    const responseText =
      response.content[0].type === "text"
        ? response.content[0].text
        : "I apologize, but I had trouble generating a response. Could you please try again?"

    // Log usage for analytics
    try {
      await supabase.from("ai_chat_logs").insert({
        user_id: user.id,
        message: message,
        response: responseText,
        section: section,
        tokens_used: responseText.length,
        created_at: new Date().toISOString(),
      })
    } catch (logError) {
      console.warn("Failed to log chat interaction:", logError)
    }

    return NextResponse.json({
      response: responseText,
      timestamp: new Date().toISOString(),
      section: section,
    })
  } catch (error) {
    console.error("AI Chat API Error:", error)
    return NextResponse.json({ error: "Failed to process your request. Please try again." }, { status: 500 })
  }
}
