import { Mem0 } from "@mem0ai/mem0"

if (!process.env.MEM0_API_KEY) {
  throw new Error("MEM0_API_KEY is not set")
}

export const mem0Client = new Mem0({
  apiKey: process.env.MEM0_API_KEY,
})

export interface UserMemory {
  id: string
  userId: string
  content: string
  category: "travel_preference" | "expense_pattern" | "policy_compliance" | "general"
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export class TravelMemoryManager {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  async addMemory(content: string, category: UserMemory["category"], metadata?: Record<string, any>) {
    try {
      const memory = await mem0Client.add({
        messages: [{ role: "user", content }],
        user_id: this.userId,
        metadata: {
          category,
          ...metadata,
        },
      })
      return memory
    } catch (error) {
      console.error("Error adding memory:", error)
      throw new Error("Failed to add memory")
    }
  }

  async getMemories(category?: UserMemory["category"], limit = 10) {
    try {
      const memories = await mem0Client.getAll({
        user_id: this.userId,
        limit,
      })

      if (category) {
        return memories.filter((memory: any) => memory.metadata?.category === category)
      }

      return memories
    } catch (error) {
      console.error("Error getting memories:", error)
      throw new Error("Failed to get memories")
    }
  }

  async searchMemories(query: string, limit = 5) {
    try {
      const memories = await mem0Client.search({
        query,
        user_id: this.userId,
        limit,
      })
      return memories
    } catch (error) {
      console.error("Error searching memories:", error)
      throw new Error("Failed to search memories")
    }
  }

  async updateMemory(memoryId: string, content: string, metadata?: Record<string, any>) {
    try {
      const memory = await mem0Client.update({
        memory_id: memoryId,
        data: content,
        metadata,
      })
      return memory
    } catch (error) {
      console.error("Error updating memory:", error)
      throw new Error("Failed to update memory")
    }
  }

  async deleteMemory(memoryId: string) {
    try {
      await mem0Client.delete({
        memory_id: memoryId,
      })
      return true
    } catch (error) {
      console.error("Error deleting memory:", error)
      throw new Error("Failed to delete memory")
    }
  }

  // Travel-specific memory methods
  async addTravelPreference(preference: string, metadata?: Record<string, any>) {
    return this.addMemory(preference, "travel_preference", metadata)
  }

  async addExpensePattern(pattern: string, metadata?: Record<string, any>) {
    return this.addMemory(pattern, "expense_pattern", metadata)
  }

  async addPolicyCompliance(compliance: string, metadata?: Record<string, any>) {
    return this.addMemory(compliance, "policy_compliance", metadata)
  }

  async getTravelPreferences() {
    return this.getMemories("travel_preference")
  }

  async getExpensePatterns() {
    return this.getMemories("expense_pattern")
  }

  async getPolicyCompliance() {
    return this.getMemories("policy_compliance")
  }

  async getContextualMemory(query: string) {
    const relevantMemories = await this.searchMemories(query)
    return relevantMemories.map((memory: any) => memory.data).join("\n")
  }
}

// Helper function to create memory manager for user
export function createMemoryManager(userId: string) {
  return new TravelMemoryManager(userId)
}

// Memory categories for travel context
export const MEMORY_CATEGORIES = {
  TRAVEL_PREFERENCE: "travel_preference",
  EXPENSE_PATTERN: "expense_pattern",
  POLICY_COMPLIANCE: "policy_compliance",
  GENERAL: "general",
} as const
