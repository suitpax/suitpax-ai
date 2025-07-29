import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

const AGENT_PERSONALITIES = {
  1: {
    name: "Emma",
    role: "Executive Travel Assistant",
    personality:
      "Professional, warm, and highly efficient. I specialize in executive-level travel arrangements with attention to luxury and convenience.",
    specializations: ["Executive flights", "Luxury accommodations", "VIP services", "Corporate travel policies"],
  },
  2: {
    name: "Marcus",
    role: "Corporate Travel Specialist",
    personality:
      "Detail-oriented and cost-conscious with extensive knowledge of corporate travel compliance and budget optimization.",
    specializations: ["Policy compliance", "Cost optimization", "Group bookings", "Travel expense management"],
  },
  3: {
    name: "Sophia",
    role: "Concierge & VIP Services",
    personality:
      "Elegant and sophisticated with expertise in luxury travel experiences and personalized concierge services.",
    specializations: ["Luxury experiences", "Fine dining reservations", "Exclusive events", "Personal concierge"],
  },
  4: {
    name: "Alex",
    role: "Tech & Innovation Guide",
    personality: "Modern and tech-savvy, helping integrate the latest travel technology and digital solutions.",
    specializations: ["Travel apps", "Digital integration", "Tech solutions", "Innovation consulting"],
  },
}

export async function POST(request: NextRequest) {
  try {
    const { message, agentId } = await request.json()

    if (!message || !agentId) {
      return NextResponse.json({ error: "Message and agentId are required" }, { status: 400 })
    }

    const agent = AGENT_PERSONALITIES[agentId as keyof typeof AGENT_PERSONALITIES]

    if (!agent) {
      return NextResponse.json({ error: "Invalid agent ID" }, { status: 400 })
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate contextual responses based on the message content
    let response = ""

    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("flight") || lowerMessage.includes("fly")) {
      response = `I'd be happy to help you with flight arrangements! As your ${agent.role}, I can assist with finding the best flights, checking availability, and ensuring you get the most suitable options for your business travel. What's your destination and preferred travel dates?`
    } else if (lowerMessage.includes("hotel") || lowerMessage.includes("accommodation")) {
      response = `Excellent! I can help you find the perfect accommodation. I'll look for hotels that meet your business needs, whether you need meeting facilities, proximity to your business meetings, or specific amenities. Where will you be staying and what are your requirements?`
    } else if (lowerMessage.includes("policy") || lowerMessage.includes("expense")) {
      response = `I can definitely help with travel policies and expense management. I'll make sure your bookings comply with your company's travel guidelines and help streamline the expense reporting process. What specific policy questions do you have?`
    } else if (lowerMessage.includes("change") || lowerMessage.includes("cancel")) {
      response = `I understand you need to make changes to your booking. I can help you modify your travel arrangements while minimizing any fees and ensuring the changes work with your schedule. What would you like to change?`
    } else if (lowerMessage.includes("restaurant") || lowerMessage.includes("dining")) {
      response = `I'd be delighted to recommend dining options! I can suggest restaurants near your hotel or meeting locations, make reservations, and ensure they meet any dietary requirements you might have. What type of cuisine are you interested in?`
    } else {
      response = `Thank you for reaching out! As ${agent.name}, your ${agent.role}, I'm here to help with all your business travel needs. I specialize in ${agent.specializations.slice(0, 2).join(" and ")}. How can I assist you today?`
    }

    // Save conversation to database (optional)
    try {
      const supabase = createServerClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        await supabase.from("ai_conversations").insert({
          user_id: user.id,
          agent_id: agentId.toString(),
          title: message.substring(0, 50) + "...",
          messages: [
            { role: "user", content: message, timestamp: new Date().toISOString() },
            { role: "assistant", content: response, timestamp: new Date().toISOString() },
          ],
          tokens_used: Math.floor(message.length / 4) + Math.floor(response.length / 4), // Rough token estimate
        })
      }
    } catch (dbError) {
      console.error("Database error:", dbError)
      // Continue without saving to DB
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Conversation error:", error)
    return NextResponse.json({ error: "Failed to process conversation" }, { status: 500 })
  }
}
