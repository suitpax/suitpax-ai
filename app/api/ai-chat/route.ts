import { NextResponse } from "next/server"
import { anthropic } from "@ai-sdk/anthropic"
import { streamText } from "ai"

// Tipos para los mensajes
export interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

// Respuestas predefinidas basadas en palabras clave
const PREDEFINED_RESPONSES: Record<string, string[]> = {
  flight: [
    "I found several flight options for you. The best one departs at 10:30 AM with a direct route and costs $450.",
    "There are 3 flights available. Would you prefer the morning departure or the evening one?",
    "I can book a business class flight for you with extra legroom. Would you like me to proceed?",
  ],
  hotel: [
    "I've found 5 hotels near your destination. The highest rated is the Grand Plaza Hotel with 4.8 stars.",
    "There's a boutique hotel just 5 minutes from your meeting location. They have availability for your dates.",
    "Would you like me to book a hotel with a gym and pool? I can filter the results based on your preferences.",
  ],
  meeting: [
    "I've scheduled your meeting for tomorrow at 2:00 PM. All participants have been notified.",
    "There's a conflict with your existing calendar. Would you like me to suggest alternative times?",
    "Meeting room A102 has been reserved for your team discussion. It includes video conferencing equipment.",
  ],
  expense: [
    "Your current travel expenses this month are $2,340, which is under your monthly budget of $3,000.",
    "I've processed your recent expense report. All receipts have been verified and submitted for approval.",
    "Your last hotel stay exceeded the company policy limit by $75. Would you like me to request an exception?",
  ],
  weather: [
    "The weather in your destination will be sunny with temperatures around 75°F (24°C) during your stay.",
    "There's a 30% chance of rain on the day of your arrival. Don't forget to pack an umbrella.",
    "The forecast shows clear skies for your entire trip, with mild temperatures perfect for business attire.",
  ],
  transport: [
    "I've arranged a car service to pick you up from the airport. The driver will meet you at the arrivals hall.",
    "The best way to get around the city is by subway. Your hotel is just two blocks from the nearest station.",
    "Would you like me to book a rental car for your stay? I can find options with GPS and automatic transmission.",
  ],
  default: [
    "I'm here to assist with your business travel needs. How can I help you today?",
    "I can help you book flights, find hotels, manage your schedule, and track expenses. What would you like to do?",
    "Is there anything specific about your upcoming trip that you'd like me to handle?",
    "I'm analyzing your request and will find the best options for you shortly.",
  ],
}

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request format. Expected an array of messages." }, { status: 400 })
    }

    const result = await streamText({
      model: anthropic("claude-3-haiku-20240307"),
      system: `You are Suitpax, a helpful and friendly AI assistant specialized in business travel. 
               Your goal is to help users book flights, manage expenses, and organize their business trips efficiently.
               Provide concise, helpful, and friendly responses. Use markdown for formatting if necessary.`,
      messages,
    })

    return result.toAIStreamResponse()
  } catch (error) {
    console.error("Error processing AI chat request:", error)
    return NextResponse.json({ error: "Failed to process your request. Please try again." }, { status: 500 })
  }
}
