import { MemoryClient } from "mem0ai"

export interface UserMemory {
  id: string
  content: string
  metadata: {
    type: "preference" | "conversation" | "travel_history"
    timestamp: string
    category?: string
  }
}

export class SuitpaxMemoryService {
  private memoryClient: MemoryClient
  private userId: string

  constructor(userId: string) {
    this.userId = userId
    this.memoryClient = new MemoryClient({
      apiKey: process.env.MEM0_API_KEY,
    })
  }

  async addTravelPreference(preference: string, category: string) {
    return await this.memoryClient.add(preference, {
      user_id: this.userId,
      metadata: {
        type: "preference",
        category,
        timestamp: new Date().toISOString(),
      },
    })
  }

  async addConversation(message: string, response: string) {
    return await this.memoryClient.add(`User: ${message} | Assistant: ${response}`, {
      user_id: this.userId,
      metadata: {
        type: "conversation",
        timestamp: new Date().toISOString(),
      },
    })
  }

  async getTravelPreferences(): Promise<UserMemory[]> {
    try {
      const memories = await this.memoryClient.getAll({
        user_id: this.userId,
        filters: { type: "preference" },
        limit: 20,
      })
      return memories.map((m) => ({
        id: m.id,
        content: m.memory,
        metadata: m.metadata,
      }))
    } catch (error) {
      console.error("Error getting travel preferences:", error)
      return []
    }
  }

  async searchRelevantMemories(query: string, limit = 5): Promise<UserMemory[]> {
    try {
      const memories = await this.memoryClient.search(query, {
        user_id: this.userId,
        limit,
      })
      return memories.map((m) => ({
        id: m.id,
        content: m.memory,
        metadata: m.metadata,
      }))
    } catch (error) {
      console.error("Error searching memories:", error)
      return []
    }
  }

  async clearAllMemories() {
    try {
      await this.memoryClient.deleteAll({ user_id: this.userId })
      return true
    } catch (error) {
      console.error("Error clearing memories:", error)
      return false
    }
  }
}
