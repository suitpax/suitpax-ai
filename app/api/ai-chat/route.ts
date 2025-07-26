import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

const PREDEFINED_RESPONSES: Record<string, string[]> = {
  flight: [
    "I found several flight options for you. The best one departs at 10:30 AM with a direct route and costs $450.",
    "There are 3 flights available. Would you prefer the morning departure or the evening one?",
    "I can book a business class flight for you with extra legroom. Would you like me to proceed?",
  ],
  hotel: [
    "I've found 5 hotels near your destination. The highest rated is the Grand Plaza Hotel with 4.8 stars.",
    "There's a boutique hotel just 5 minutes from your meeting location. They have availability for your dates.",
    "Would you prefer a hotel with a gym and pool? I can filter the results based on your preferences.",
  ],
  default: [
    "I'm here to assist with your business travel needs. How can I help you today?",
    "I can help you book flights, find hotels, manage your schedule, and track expenses. What would you like to do?",
  ],
}

function generateResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  for (const [keyword, responses] of Object.entries(PREDEFINED_RESPONSES)) {
    if (lowerMessage.includes(keyword)) {
      return responses[Math.floor(Math.random() * responses.length)]
    }
  }
  const defaultResponses = PREDEFINED_RESPONSES.default
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

export async function POST(request: Request) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { messages } = await request.json()
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request format." }, { status: 400 })
    }

    const lastUserMessage = messages.filter((msg) => msg.role === "user").pop()
    if (!lastUserMessage) {
      return NextResponse.json({ error: "No user message found." }, { status: 400 })
    }

    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    const responseContent = generateResponse(lastUserMessage.content)
    const responseMessage: Message = {
      role: "assistant",
      content: responseContent,
    }

    return NextResponse.json({ message: responseMessage })
  } catch (error) {
    console.error("Error processing AI chat request:", error)
    return NextResponse.json({ error: "Failed to process your request." }, { status: 500 })
  }
}
