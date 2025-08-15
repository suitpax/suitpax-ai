import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { MemoryService } from "../memory/memory-service"
import { SuitpaxKnowledgeService } from "../knowledge/knowledge-service"
import { PromptRouter, type PromptContext } from "../../prompts/prompt-router"

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
  private memoryService: MemoryService
  private knowledgeService: SuitpaxKnowledgeService
  private model: string

  constructor(config: IntelligenceConfig) {
    this.memoryService = new MemoryService(config.userId)
    this.knowledgeService = new SuitpaxKnowledgeService()
    this.model = config.model || "claude-3-5-sonnet-20241022"
  }

  async initializeKnowledge(documents: any[]) {
    return await this.knowledgeService.initializeKnowledgeBase(documents)
  }

  async enhancedChat(message: string, context?: string): Promise<IntelligenceResponse> {
    try {
      const promptContext: PromptContext = {
        intent: PromptRouter.detectIntent(message),
        conversationHistory: [],
        urgency: "medium",
      }

      // Get relevant memories and knowledge
      const [memories, knowledge] = await Promise.all([
        this.memoryService.searchMemoriesWithContext(message, undefined, 3),
        this.knowledgeService.searchKnowledge(message, 2),
      ])

      const baseSystemPrompt = PromptRouter.getSystemPrompt(promptContext)

      // Build enhanced context
      const memoryContext =
        memories.length > 0 ? `Previous context:\n${memories.map((m) => `- ${m.content}`).join("\n")}\n` : ""

      const knowledgeContext =
        knowledge.length > 0 ? `Relevant information:\n${knowledge.map((k) => `- ${k.content}`).join("\n")}\n` : ""

      const systemPrompt = `${baseSystemPrompt}

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
      await this.memoryService.addConversationWithContext(message, text)

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

  async generateResponse(message: string, context?: string): Promise<IntelligenceResponse> {
    return await this.enhancedChat(message, context)
  }

  async addTravelPreference(preference: string, category: string) {
    return await this.memoryService.addTravelPreference(preference, category)
  }

  async getUserPreferences() {
    const insights = await this.memoryService.getMemoryInsights()
    return insights?.recentActivity || []
  }

  async getTravelPreferences() {
    const insights = await this.memoryService.getMemoryInsights()
    return insights?.recentActivity || []
  }

  async addKnowledgeDocument(document: any) {
    return await this.knowledgeService.addDocument(document)
  }
}
