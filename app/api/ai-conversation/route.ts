import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

export async function POST(request: NextRequest) {
  try {
    const { message, agentId, conversationHistory = [] } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Agent personalities
    const agentPersonalities = {
      emma: {
        name: "Emma",
        role: "Executive Travel Assistant",
        personality:
          "Professional, warm, and efficient. I specialize in flight booking, itinerary management, and VIP services. I speak in a friendly but professional manner and always focus on providing practical solutions.",
      },
      marcus: {
        name: "Marcus",
        role: "Corporate Travel Specialist",
        personality:
          "Authoritative, detail-oriented, and cost-conscious. I focus on policy compliance, expense optimization, and corporate travel management. I speak in a clear, business-focused manner and always consider budget implications.",
      },
    }

    const agent = agentPersonalities[agentId as keyof typeof agentPersonalities]
    if (!agent) {
      return NextResponse.json({ error: "Invalid agent ID" }, { status: 400 })
    }

    // Build conversation context
    const systemPrompt = `You are ${agent.name}, a ${agent.role}. ${agent.personality}

Key guidelines:
- Keep responses conversational and natural for voice interaction
- Responses should be 1-3 sentences maximum for voice calls
- Be helpful and actionable
- Stay in character as ${agent.name}
- Focus on travel-related assistance
- If asked about booking or actions, explain that this is a demo but describe what you would normally do`

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user" as const, content: message },
    ]

    const { text } = await generateText({
      model: xai("grok-3"),
      messages,
      maxTokens: 150,
      temperature: 0.7,
    })

    return NextResponse.json({
      response: text,
      agentId,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in AI conversation:", error)
    return NextResponse.json({ error: "Failed to process conversation" }, { status: 500 })
  }
}
