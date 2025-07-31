import Anthropic from "@anthropic-ai/sdk"
import { getAgentPrompt } from "./ai/system-prompts"

const apiKey = process.env.ANTHROPIC_API_KEY

if (!apiKey) {
  throw new Error("ANTHROPIC_API_KEY is not set")
}

const anthropic = new Anthropic({
  apiKey,
})

export interface ConversationMessage {
  role: "user" | "assistant"
  content: string
}

export interface AgentPersonality {
  name: string
  role: string
  personality: string
  specializations: string[]
  communicationStyle: string
}

export const VOICE_AGENTS: Record<string, AgentPersonality> = {
  emma: {
    name: "Emma",
    role: "Executive Travel Assistant",
    personality:
      "Professional, warm, and highly efficient. I specialize in executive-level travel arrangements with attention to luxury and convenience.",
    specializations: ["Executive flights", "Luxury accommodations", "VIP services", "Corporate travel policies"],
    communicationStyle: "Friendly but professional, concise, and solution-oriented",
  },
  marcus: {
    name: "Marcus",
    role: "Corporate Travel Specialist",
    personality:
      "Detail-oriented and cost-conscious with extensive knowledge of corporate travel compliance and budget optimization.",
    specializations: ["Policy compliance", "Cost optimization", "Group bookings", "Travel expense management"],
    communicationStyle: "Direct, analytical, and focused on business efficiency",
  },
  sophia: {
    name: "Sophia",
    role: "Concierge & VIP Services",
    personality:
      "Elegant and sophisticated with expertise in luxury travel experiences and personalized concierge services.",
    specializations: ["Luxury experiences", "Fine dining reservations", "Exclusive events", "Personal concierge"],
    communicationStyle: "Refined, attentive, and personalized",
  },
  alex: {
    name: "Alex",
    role: "Tech & Innovation Guide",
    personality: "Modern and tech-savvy, helping integrate the latest travel technology and digital solutions.",
    specializations: ["Travel apps", "Digital integration", "Tech solutions", "Innovation consulting"],
    communicationStyle: "Casual, enthusiastic about technology, forward-thinking",
  },
}

export async function generateAgentResponse(
  messages: ConversationMessage[],
  agentId: string,
  userContext?: {
    name?: string
    company?: string
    plan?: string
  },
): Promise<string> {
  const agent = VOICE_AGENTS[agentId]

  if (!agent) {
    throw new Error(`Agent ${agentId} not found`)
  }

  const systemPrompt = getAgentPrompt(agentId, userContext ? JSON.stringify(userContext) : undefined)

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022", // Using the latest Claude model
      max_tokens: 200,
      temperature: 0.7,
      system: systemPrompt,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    })

    return response.content[0].type === "text"
      ? response.content[0].text
      : "I apologize, but I had trouble generating a response. Could you please try again?"
  } catch (error) {
    console.error("Error generating agent response:", error)
    throw error
  }
}

export async function generateWelcomeMessage(agentId: string): Promise<string> {
  const agent = VOICE_AGENTS[agentId]

  if (!agent) {
    throw new Error(`Agent ${agentId} not found`)
  }

  const welcomeMessages = {
    emma: "Hello! I'm Emma, your Suitpax executive travel assistant. I specialize in luxury business travel and VIP services. How can I help elevate your next business trip?",
    marcus:
      "Good day! I'm Marcus, your corporate travel specialist at Suitpax. I focus on policy compliance and cost optimization. What travel requirements can I help you optimize today?",
    sophia:
      "Bonjour! I'm Sophia, your Suitpax concierge specialist. I create exceptional luxury travel experiences and personalized services. How may I curate your perfect business journey?",
    alex: "Hey there! I'm Alex, your tech-focused travel guide at Suitpax. I help integrate cutting-edge travel technology into your business trips. What digital solutions can I set up for you?",
  }

  return welcomeMessages[agentId as keyof typeof welcomeMessages] || welcomeMessages.emma
}
