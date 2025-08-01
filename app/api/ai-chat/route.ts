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

    // Get user from Supabase
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Build conversation history for context
    const conversationHistory = history
      .slice(-5) // Last 5 messages for context
      .map((msg: any) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      }))

    // Enhanced system prompt for business travel
    const systemPrompt = `You are Suitpax AI, an AI agent created by the Suitpax team.

🛫 FLIGHT BOOKING & SEARCH
- Find and compare flights across airlines
- Suggest optimal routes and times
- Consider business class vs economy options
- Factor in company travel policies

💰 EXPENSE MANAGEMENT
- Guide through expense reporting
- Categorize business expenses
- Explain reimbursement policies
- Track spending against budgets

🏨 ACCOMMODATION & TRAVEL
- Recommend business-friendly hotels
- Suggest ground transportation
- Plan complete itineraries
- Consider meeting locations and timing

📊 TRAVEL ANALYTICS
- Analyze travel patterns and costs
- Identify savings opportunities
- Generate travel reports
- Track policy compliance

🔧 COMPANY POLICIES
- Explain travel approval processes
- Guide policy compliance
- Handle special requests
- Manage travel preferences

COMMUNICATION STYLE:
- Be professional yet friendly
- Provide specific, actionable advice
- Ask clarifying questions when needed
- Offer multiple options when possible
- Use emojis sparingly but effectively
- Keep responses concise but comprehensive
- Always prioritize business efficiency and cost-effectiveness

CURRENT CONTEXT: ${context}

Remember: You're helping with real business travel needs. Be practical, efficient, and always consider both cost and convenience.`

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      temperature: 0.7,
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

    // Log the interaction if user is authenticated
    if (user) {
      try {
        await supabase.from("ai_chat_logs").insert({
          user_id: user.id,
          message: message,
          response: aiResponse,
          context_type: context,
          tokens_used: response.usage?.input_tokens + response.usage?.output_tokens || 0,
          model_used: "claude-3-haiku-20240307",
        })
      } catch (logError) {
        console.error("Failed to log chat interaction:", logError)
        // Don't fail the request if logging fails
      }
    }

    return NextResponse.json({
      response: aiResponse,
      tokens_used: response.usage?.input_tokens + response.usage?.output_tokens || 0,
      model: "claude-3-haiku-20240307",
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