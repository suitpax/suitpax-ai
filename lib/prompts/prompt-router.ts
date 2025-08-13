import {
  SUITPAX_CORE_SYSTEM_PROMPT,
  TRAVEL_SPECIALIST_PROMPT,
  CODE_GENERATION_PROMPT,
  DOCUMENT_AI_PROMPT,
} from "./system-prompts"

export interface PromptContext {
  intent: "travel" | "code" | "document" | "general"
  userPreferences?: any
  conversationHistory?: any[]
  urgency?: "low" | "medium" | "high"
}

export class PromptRouter {
  static getSystemPrompt(context: PromptContext): string {
    const basePrompt = SUITPAX_CORE_SYSTEM_PROMPT

    switch (context.intent) {
      case "travel":
        return `${basePrompt}\n\n${TRAVEL_SPECIALIST_PROMPT}`
      case "code":
        return `${basePrompt}\n\n${CODE_GENERATION_PROMPT}`
      case "document":
        return `${basePrompt}\n\n${DOCUMENT_AI_PROMPT}`
      default:
        return basePrompt
    }
  }

  static detectIntent(message: string): PromptContext["intent"] {
    const travelKeywords = ["flight", "hotel", "travel", "booking", "trip", "airport", "airline"]
    const codeKeywords = ["code", "function", "component", "api", "database", "react", "next"]
    const documentKeywords = ["document", "pdf", "report", "analysis", "extract", "ocr"]

    const lowerMessage = message.toLowerCase()

    if (travelKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      return "travel"
    }
    if (codeKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      return "code"
    }
    if (documentKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      return "document"
    }

    return "general"
  }

  static enhancePromptWithContext(basePrompt: string, context: PromptContext): string {
    let enhancedPrompt = basePrompt

    if (context.userPreferences) {
      enhancedPrompt += `\n\nUser Preferences:\n${JSON.stringify(context.userPreferences, null, 2)}`
    }

    if (context.conversationHistory?.length) {
      const recentHistory = context.conversationHistory.slice(-3)
      enhancedPrompt += `\n\nRecent Conversation:\n${recentHistory.map((h) => `${h.role}: ${h.content}`).join("\n")}`
    }

    if (context.urgency) {
      enhancedPrompt += `\n\nUrgency Level: ${context.urgency.toUpperCase()}`
    }

    return enhancedPrompt
  }
}
