import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { SuitpaxMemoryService } from "../memory/memory-service"
import { SuitpaxKnowledgeService } from "../knowledge/knowledge-service"

export interface IntelligenceConfig {
  userId: string
  model?: string
}

export interface IntelligenceResponse {
  response: string
  sources: string[]
  memoriesUsed: number
  knowledgeUsed: number
}

export class SuitpaxIntelligenceService {
  private memoryService: SuitpaxMemoryService
  private knowledgeService: SuitpaxKnowledgeService
  private model: string

  constructor(config: IntelligenceConfig) {
    this.memoryService = new SuitpaxMemoryService(config.userId)
    this.knowledgeService = new SuitpaxKnowledgeService()
    this.model = config.model || "claude-3-5-sonnet-20241022"
  }

  async initializeKnowledge(documents: any[]) {
    return await this.knowledgeService.initializeKnowledgeBase(documents)
  }

  async enhancedChat(message: string, context?: string): Promise<IntelligenceResponse> {
    try {
      // Get relevant memories and knowledge
      const [memories, knowledge] = await Promise.all([
        this.memoryService.searchRelevantMemories(message, 3),
        this.knowledgeService.searchKnowledge(message, 2),
      ])

      // Build enhanced context
      const memoryContext =
        memories.length > 0 ? `Previous context:\n${memories.map((m) => `- ${m.content}`).join("\n")}\n` : ""

      const knowledgeContext =
        knowledge.length > 0 ? `Relevant information:\n${knowledge.map((k) => `- ${k.content}`).join("\n")}\n` : ""

      const systemPrompt = `You are Suitpax AI, an intelligent business travel assistant.

${context ? `Current context: ${context}\n` : ""}
${memoryContext}
${knowledgeContext}

Provide helpful, contextual responses for business travel needs. Be concise and actionable.`

      // Generate response using Anthropic
      const { text } = await generateText({
        model: anthropic(this.model),
        system: systemPrompt,
        prompt: message,
        temperature: 0.7,
        maxTokens: 1000,
      })

      // Store conversation in memory
      await this.memoryService.addConversation(message, text)

      return {
        response: text,
        sources: knowledge.map((k) => k.metadata.title),
        memoriesUsed: memories.length,
        knowledgeUsed: knowledge.length,
      }
    } catch (error) {
      console.error("Enhanced chat error:", error)
      throw error
    }
  }

  async addTravelPreference(preference: string, category: string) {
    return await this.memoryService.addTravelPreference(preference, category)
  }

  async getTravelPreferences() {
    return await this.memoryService.getTravelPreferences()
  }

  async addKnowledgeDocument(document: any) {
    return await this.knowledgeService.addDocument(document)
  }
}
