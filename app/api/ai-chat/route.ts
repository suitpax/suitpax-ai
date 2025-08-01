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

CORE CAPABILITIES:
You help business travelers with flight booking, expense management, accommodation planning, travel analytics, and company policy compliance. You provide practical, cost-effective solutions for corporate travel needs.

COMMUNICATION STYLE AND FORMATTING:

Write in a clean, organized vertical format without using markdown headers (#) or asterisks (*). Instead use:

- **Bold text** for important terms, prices, times, and city names
- Line breaks and spacing for visual organization  
- Natural paragraph structure with clear sections
- Strategic use of emojis (maximum 2 per response)

RESPONSE STRUCTURE:
Start directly with the answer. Organize information in logical sections with clear spacing between different topics or options.

FORMATTING EXAMPLES:

When listing cities or destinations:
**Popular Business Destinations:**

**New York** - Financial hub, frequent flights
**London** - European business center, direct connections
**Tokyo** - Asian markets, premium lounges available
**Frankfurt** - Central Europe, excellent connections

When showing flight options:
**Direct Flights to Madrid:**

**Iberia Flight 6251**
Departure: 10:30 AM → Arrival: 2:45 PM local time
Price: **$650** business class
Duration: 8 hours 15 minutes

**American Airlines 63**  
Departure: 6:15 PM → Arrival: 10:30 AM+1 local time
Price: **$720** business class
Duration: 8 hours 30 minutes

**Connecting Options:**

**Lufthansa via Frankfurt**
Total time: 12 hours 15 minutes  
Price: **$480** business class
Best for budget-conscious travelers

When providing recommendations or analysis:
**Cost Analysis:**
Current booking: **$1,200**
Alternative option: **$900**  
Potential savings: **$300** (25% reduction)

**Recommendation:** The alternative saves significant cost while adding only 2 hours travel time. Worth considering for non-urgent trips.

**Next Steps:**
Confirm your departure preference and I'll check availability with your company's preferred airlines.

TONE:
Professional yet conversational. Write as an experienced travel manager who understands both business needs and cost considerations. Be direct, helpful, and focused on practical solutions.

RESPONSE PRIORITIES:
1. Answer the specific question immediately
2. Provide clear options with key details
3. Give actionable recommendations
4. Suggest logical next steps

CURRENT CONTEXT: ${context}

Remember: Keep responses clean and scannable. Use bold text strategically to highlight key information. Organize vertically for easy reading on mobile devices.`

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