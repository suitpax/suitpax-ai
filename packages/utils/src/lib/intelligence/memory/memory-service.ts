import { MemoryClient } from "mem0ai"

export interface EnhancedUserMemory {
  id: string
  content: string
  metadata: {
    type: "preference" | "conversation" | "travel_history" | "expense_pattern" | "location_preference"
    timestamp: string
    category?: string
    confidence_score?: number
    tags?: string[]
    context?: string
  }
}

export class MemoryService {
  private memoryClient: MemoryClient
  private userId: string

  constructor(userId: string) {
    this.userId = userId
    this.memoryClient = new MemoryClient({
      apiKey: process.env.MEM0_API_KEY || 'demo-key',
    })
  }

  async addTravelPreference(preference: string, category: string, context?: string, tags?: string[]) {
    return await this.memoryClient.add(preference, {
      user_id: this.userId,
      metadata: {
        type: "preference",
        category,
        timestamp: new Date().toISOString(),
        confidence_score: 0.8,
        tags: tags || [],
        context: context || "",
      },
    })
  }

  async addConversationWithContext(message: string, response: string, extractedEntities?: string[]) {
    const conversationMemory = `User: ${message} | Assistant: ${response}`

    // Extract travel-related entities automatically
    const travelEntities = this.extractTravelEntities(message + " " + response)

    return await this.memoryClient.add(conversationMemory, {
      user_id: this.userId,
      metadata: {
        type: "conversation",
        timestamp: new Date().toISOString(),
        tags: [...(extractedEntities || []), ...travelEntities],
        confidence_score: 0.9,
      },
    })
  }

  async addExpensePattern(expenseData: {
    amount: number
    category: string
    location: string
    description: string
  }) {
    const pattern = `Expense: ${expenseData.amount} ${expenseData.category} in ${expenseData.location} - ${expenseData.description}`

    return await this.memoryClient.add(pattern, {
      user_id: this.userId,
      metadata: {
        type: "expense_pattern",
        category: expenseData.category,
        timestamp: new Date().toISOString(),
        tags: [expenseData.location, expenseData.category],
        confidence_score: 1.0,
      },
    })
  }

  async addLocationPreference(location: string, preference: string, rating: number) {
    const locationMemory = `Location: ${location} - Preference: ${preference} (Rating: ${rating}/5)`

    return await this.memoryClient.add(locationMemory, {
      user_id: this.userId,
      metadata: {
        type: "location_preference",
        category: "location",
        timestamp: new Date().toISOString(),
        tags: [location, "rating_" + rating],
        confidence_score: rating / 5,
      },
    })
  }

  async searchMemoriesWithContext(query: string, memoryTypes?: string[], limit = 10): Promise<EnhancedUserMemory[]> {
    try {
      const searchFilters: any = {}
      if (memoryTypes && memoryTypes.length > 0) {
        searchFilters.type = memoryTypes
      }

      const memories = await this.memoryClient.search(query, {
        user_id: this.userId,
        limit,
        filters: searchFilters,
      })

      return memories.map((m) => ({
        id: m.id,
        content: m.memory,
        metadata: {
          ...m.metadata,
          confidence_score: m.score || 0.5,
        },
      }))
    } catch (error) {
      console.error("Error searching memories with context:", error)
      return []
    }
  }

  async getMemoryInsights() {
    try {
      const allMemories = await this.memoryClient.getAll({
        user_id: this.userId,
        limit: 100,
      })

      const insights = {
        totalMemories: allMemories.length,
        preferenceCount: allMemories.filter((m) => m.metadata?.type === "preference").length,
        conversationCount: allMemories.filter((m) => m.metadata?.type === "conversation").length,
        expensePatternCount: allMemories.filter((m) => m.metadata?.type === "expense_pattern").length,
        topCategories: this.getTopCategories(allMemories),
        recentActivity: allMemories.slice(0, 5),
      }

      return insights
    } catch (error) {
      console.error("Error getting memory insights:", error)
      return null
    }
  }

  async cleanupOldMemories(daysOld = 90, minConfidence = 0.3) {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)

      const allMemories = await this.memoryClient.getAll({
        user_id: this.userId,
        limit: 1000,
      })

      const memoriesToDelete = allMemories.filter((m) => {
        const memoryDate = new Date(m.metadata?.timestamp || 0)
        const confidence = m.metadata?.confidence_score || 0
        return memoryDate < cutoffDate && confidence < minConfidence
      })

      for (const memory of memoriesToDelete) {
        await this.memoryClient.delete(memory.id)
      }

      return memoriesToDelete.length
    } catch (error) {
      console.error("Error cleaning up memories:", error)
      return 0
    }
  }

  private extractTravelEntities(text: string): string[] {
    const entities: string[] = []
    const travelKeywords = [
      "flight",
      "hotel",
      "airport",
      "airline",
      "booking",
      "reservation",
      "business trip",
      "travel",
      "destination",
      "itinerary",
      "expense",
    ]

    travelKeywords.forEach((keyword) => {
      if (text.toLowerCase().includes(keyword)) {
        entities.push(keyword)
      }
    })

    return entities
  }

  private getTopCategories(memories: any[]): { category: string; count: number }[] {
    const categoryCount: { [key: string]: number } = {}

    memories.forEach((m) => {
      const category = m.metadata?.category || "uncategorized"
      categoryCount[category] = (categoryCount[category] || 0) + 1
    })

    return Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }
}
