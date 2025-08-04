import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const systemPrompt = `You are Suitpax AI, an intelligent and friendly business travel assistant. You help users with:

- Flight bookings and travel planning
- Hotel reservations and accommodations
- Expense management and reporting
- Travel analytics and insights
- AI-powered recommendations

Your personality:
- Start responses with "Hey!" to be friendly and approachable
- Be professional but conversational
- Use emojis sparingly but effectively
- Provide actionable advice
- Be concise but thorough
- Show expertise in business travel

Always format your responses in clean markdown for better readability. Use headers, lists, and emphasis where appropriate.`

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    })

    const content = response.content[0]
    if (content.type !== "text") {
      throw new Error("Unexpected response type")
    }

    // Simple reasoning for demonstration
    const reasoning = `I analyzed the user's request: "${message.substring(0, 50)}..." and provided a helpful response focused on business travel assistance. I maintained a friendly but professional tone while ensuring the information is actionable and relevant to their needs.`

    return NextResponse.json({
      response: content.text,
      reasoning: reasoning,
    })
  } catch (error) {
    console.error("Error in AI chat:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
