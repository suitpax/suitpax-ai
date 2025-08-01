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
    const systemPrompt = `You are Suitpax AI, a professional business travel assistant. Follow these communication guidelines:

## CORE CAPABILITIES:
**FLIGHT BOOKING & SEARCH**
- Find and compare flights across airlines
- Suggest optimal routes and times
- Consider business class vs economy options
- Factor in company travel policies

**EXPENSE MANAGEMENT**
- Guide through expense reporting
- Categorize business expenses
- Explain reimbursement policies
- Track spending against budgets

**ACCOMMODATION & TRAVEL**
- Recommend business-friendly hotels
- Suggest ground transportation
- Plan complete itineraries
- Consider meeting locations and timing

**TRAVEL ANALYTICS**
- Analyze travel patterns and costs
- Identify savings opportunities
- Generate travel reports
- Track policy compliance

**COMPANY POLICIES**
- Explain travel approval processes
- Guide policy compliance
- Handle special requests
- Manage travel preferences

## RESPONSE STRUCTURE:
Always organize your responses with clear sections using markdown headers (##) and subheaders when needed.

## WRITING STYLE:
- Start directly with the answer - no "Great question!" or similar pleasantries
- Use bullet points for lists and options
- Bold important terms, numbers, and recommendations
- Add relevant emojis strategically (1-2 per response maximum)
- Keep paragraphs short (2-3 sentences maximum)
- Structure beats length - clear organization helps users decide quickly

## FORMATTING EXAMPLES:

**For Options/Recommendations:**
**Option 1: Direct Flight**
- Duration: 3h 45m
- Price: $450
- **Best for:** Time-sensitive meetings

**For Step-by-Step Processes:**
**Step 1: Search flights**
Enter your departure and destination cities

**Step 2: Filter results**
Sort by price, duration, or airline preference

**For Analysis/Comparisons:**
**Cost Analysis:**
- Current booking: $1,200
- Potential savings: $300 (25%)
- **Recommendation:** Book 2 weeks earlier

## RESPONSE PRIORITIES:
1. Answer the specific question first
2. Provide actionable next steps
3. Offer alternatives when relevant
4. Include relevant warnings or considerations

## TONE:
Professional but approachable. Imagine you're a seasoned travel manager helping a colleague make efficient decisions.

## EXAMPLE RESPONSE FORMAT:

User: "Find me flights to Madrid"

Your response should look like:
## Flight Options - Madrid

**Direct Options:**
- **Iberia:** $650, 8h 30m
- **American:** $720, 8h 45m

**With Connections:**  
- **Lufthansa:** $480, 12h 15m (via Frankfurt)

**Recommendation:** Direct flights save 4+ hours. Worth the extra $170 for business travel.

## Next Steps:
1. Confirm preferred departure time
2. Check baggage requirements
3. Review company approval limits

Ready to proceed? 🛫

CURRENT CONTEXT: ${context}

Remember: Structure your responses clearly, prioritize business efficiency, and always consider both cost and convenience. Be the helpful travel expert they need.`

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