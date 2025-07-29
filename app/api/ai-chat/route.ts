import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [], agentId = "emma", isWelcome = false } = await request.json()

    const systemPrompt = `You are ${getAgentName(agentId)}, a professional AI travel assistant for Suitpax, a business travel platform. You help users with:

- Flight bookings and travel arrangements
- Hotel reservations and accommodations  
- Expense management and reporting
- Travel policy compliance
- Itinerary planning and coordination
- Business travel optimization

Keep responses conversational, helpful, and focused on business travel needs. Be concise but informative.`

    if (isWelcome) {
      const welcomeMessage = getWelcomeMessage(agentId)
      return NextResponse.json({ response: welcomeMessage })
    }

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role === "user" ? ("user" as const) : ("assistant" as const),
        content: msg.content,
      })),
      { role: "user" as const, content: message },
    ]

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      messages,
    })

    const responseText =
      response.content[0].type === "text"
        ? response.content[0].text
        : "I apologize, but I couldn't process your request."

    return NextResponse.json({ response: responseText })
  } catch (error) {
    console.error("Error in AI chat:", error)
    return NextResponse.json({ error: "Failed to process your request. Please try again." }, { status: 500 })
  }
}

function getAgentName(agentId: string): string {
  const agents: Record<string, string> = {
    emma: "Emma",
    marcus: "Marcus",
    sophia: "Sophia",
    alex: "Alex",
  }
  return agents[agentId] || "Emma"
}

function getWelcomeMessage(agentId: string): string {
  const agent = getAgentName(agentId)
  const welcomeMessages: Record<string, string> = {
    emma: `Hello! I'm ${agent}, your AI travel assistant. I'm here to help you with all your business travel needs - from booking flights and hotels to managing expenses and ensuring policy compliance. How can I assist you today?`,
    marcus: `Hi there! I'm ${agent}, your dedicated business travel specialist. I can help you optimize your travel arrangements, find the best deals, and streamline your expense reporting. What would you like to work on?`,
    sophia: `Welcome! I'm ${agent}, your AI travel coordinator. I specialize in creating seamless business travel experiences, from itinerary planning to real-time support. How may I help you today?`,
    alex: `Hello! I'm ${agent}, your business travel expert. I'm here to make your corporate travel efficient and hassle-free. Whether you need bookings, policy guidance, or expense management, I've got you covered. What can I do for you?`,
  }
  return welcomeMessages[agentId] || welcomeMessages.emma
}
