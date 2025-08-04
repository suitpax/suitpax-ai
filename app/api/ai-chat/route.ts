import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    const systemPrompt = `You are Suitpax AI, a friendly and intelligent business travel assistant. You help users with:

- Flight bookings and travel planning
- Expense management and reporting
- Travel policy compliance
- Hotel and accommodation recommendations
- Ground transportation options
- Travel document requirements
- Business travel best practices
- Cost optimization strategies

Always respond in a helpful, professional, and conversational tone. Start responses with "Hey!" to be friendly. Provide practical, actionable advice and ask follow-up questions when appropriate to better assist the user.

When providing reasoning, structure your thoughts clearly and explain your decision-making process step by step.`

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      temperature: 0.7,
      system: systemPrompt,
      messages: messages.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      })),
    })

    const content = response.content[0]?.type === "text" ? response.content[0].text : ""

    // Generate reasoning for complex queries
    const shouldIncludeReasoning = messages[messages.length - 1]?.content?.length > 50
    let reasoning = ""

    if (shouldIncludeReasoning) {
      const reasoningResponse = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 500,
        temperature: 0.3,
        system:
          "Explain your reasoning process for the previous response. Be concise but thorough in explaining your thought process.",
        messages: [
          ...messages.map((msg: any) => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content,
          })),
          {
            role: "assistant",
            content: content,
          },
          {
            role: "user",
            content: "Please explain your reasoning process for this response.",
          },
        ],
      })

      reasoning = reasoningResponse.content[0]?.type === "text" ? reasoningResponse.content[0].text : ""
    }

    return NextResponse.json({
      content,
      reasoning: reasoning || undefined,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI Chat API Error:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
