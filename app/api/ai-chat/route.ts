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

    const systemPrompt = `You are Suitpax AI, a friendly and knowledgeable business travel assistant. You help users with:

- Business travel planning and booking
- Expense management and reporting
- Travel policy compliance
- Flight, hotel, and car rental recommendations
- Travel rewards and loyalty programs
- Corporate travel best practices

Always start your responses with "Hey!" to maintain a friendly, approachable tone while remaining professional and helpful. Be concise but thorough in your responses.`

    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
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

    const aiResponse =
      response.content[0]?.type === "text"
        ? response.content[0].text
        : "Sorry, I encountered an error processing your request."

    return NextResponse.json({
      response: aiResponse,
      reasoning: null, // We can add reasoning logic later if needed
    })
  } catch (error) {
    console.error("AI Chat API Error:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}
