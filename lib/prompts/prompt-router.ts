import { buildKernelSystemPrompt, type KernelOptions } from "./kernel"

export interface PromptContext {
  intent: "travel" | "code" | "document" | "general"
  userPreferences?: any
  conversationHistory?: any[]
  urgency?: "low" | "medium" | "high"
  language?: "en" | "es"
}

export class PromptRouter {
  static getSystemPrompt(context: PromptContext): string {
    const options: KernelOptions = {
      intent: context.intent,
      language: context.language || "en",
      style: { tone: "professional", useHeaders: true, useBullets: true, allowTables: true },
      features: { enforceNoCOT: true, includeFlightJsonWrapper: true },
      context: {
        userPreferences: context.userPreferences,
        recentConversation: context.conversationHistory,
        urgency: context.urgency,
      },
    }

    return buildKernelSystemPrompt(options)
  }

  static detectIntent(message: string): PromptContext["intent"] {
    const travelKeywords = ["flight", "hotel", "travel", "booking", "trip", "airport", "airline", "vuelo", "vuelos"]
    const codeKeywords = ["code", "function", "component", "api", "database", "react", "next", "typescript"]
    const documentKeywords = ["document", "pdf", "report", "analysis", "extract", "ocr", "documento"]

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
    const options: KernelOptions = {
      intent: context.intent,
      language: context.language || "en",
      context: {
        userPreferences: context.userPreferences,
        recentConversation: context.conversationHistory,
        urgency: context.urgency,
      },
    }
    return buildKernelSystemPrompt(options) + "\n\n" + basePrompt
  }
}
