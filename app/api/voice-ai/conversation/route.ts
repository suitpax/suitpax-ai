import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { message, agent = "sophia", context = "business_travel" } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required and must be a string" }, { status: 400 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not configured")
      return NextResponse.json({ error: "AI service is not configured", success: false }, { status: 500 })
    }

    const systemPrompt = `You are ${agent}, an AI voice assistant for Suitpax business travel platform. You are having a voice conversation, so:

- Keep responses conversational and natural for speech
- Be concise but helpful (2-3 sentences max for voice)
- Use a friendly, professional tone
- Focus on business travel: flights, hotels, expenses, policies
- If you need clarification, ask one specific question

Context: ${context}`

    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 150,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    })

    const responseText =
      response.content[0]?.type === "text"
        ? response.content[0].text
        : "I'm sorry, I didn't catch that. Could you please repeat your request?"

    return NextResponse.json({
      success: true,
      response: responseText,
      agent: agent,
    })
  } catch (error) {
    console.error("Voice AI API Error:", error)

    return NextResponse.json(
      {
        error: "I'm having trouble processing your request right now. Please try again.",
        success: false,
      },
      { status: 500 },
    )
  }
}
