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

RESPONSE FORMATTING GUIDELINES:
- Always start your responses with "Hey!" to maintain a friendly, approachable tone
- Use proper markdown formatting for better readability:
  - **Bold text** for important points and headings
  - *Italics* for emphasis
  - \`code\` for specific terms, codes, or technical details
  - Use bullet points (-) for lists
  - Use numbered lists (1.) for step-by-step instructions
  - Use > for important tips or notes (blockquotes)
  - Use tables when displaying flight information, prices, or comparisons
  - Use ## for section headings when organizing longer responses

CONTENT GUIDELINES:
- Be concise but thorough in your responses
- Always provide actionable next steps when possible
- For flight information, include details like airlines, prices, duration
- For expenses, mention receipt requirements and approval processes
- For hotels, consider location, amenities, and business traveler needs
- Always specify currency when mentioning prices
- Include relevant policy reminders when applicable

EXAMPLE RESPONSE STRUCTURE:
"Hey! I'd be happy to help you with [topic].

## Key Information
- **Important point 1**
- **Important point 2**

## Recommendations
1. First recommendation with details
2. Second recommendation

> **Pro tip**: Include a helpful insider tip here

## Next Steps
- Action item 1
- Action item 2

Let me know if you need any clarification or have other questions!"

Keep responses professional yet friendly, and always focus on practical business travel solutions.`

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

    const aiResponse =
      response.content[0]?.type === "text"
        ? response.content[0].text
        : "Hey! I'm sorry, but I encountered an error processing your request. Please try asking your question again."

    // Log successful interaction for monitoring
    console.log("AI Chat - Success:", {
      messageLength: message.length,
      responseLength: aiResponse.length,
      timestamp: new Date().toISOString(),
      hasMarkdown: aiResponse.includes('**') || aiResponse.includes('##') || aiResponse.includes('>')
    })

    return NextResponse.json({
      response: aiResponse,
      reasoning: null, // We can add reasoning logic later if needed
    })
  } catch (error) {
    console.error("AI Chat API Error:", error)
    
    // Return a user-friendly error message that matches the AI tone
    const errorMessage = error instanceof Error 
      ? `Hey! I'm having some technical difficulties right now. Error: ${error.message}`
      : "Hey! I encountered an unexpected error. Please try asking your question again."

    return NextResponse.json({ 
      error: "Failed to process your request",
      response: `${errorMessage}

If this problem continues, please contact our support team. I'm usually much better at helping with your business travel needs! 😊`
    }, { status: 500 })
  }
}