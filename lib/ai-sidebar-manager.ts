interface NavigationItem {
  id: string
  name: string
  href: string
  icon: any
  priority?: number
  usageCount?: number
}

interface SidebarRecommendation {
  type: "move_up" | "move_down" | "group" | "default"
  item?: string
  items?: string[]
  message: string
  confidence: number
  reason?: string
}

export class AISidebarManager {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  async analyzeUsagePatterns(): Promise<SidebarRecommendation[]> {
    try {
      const response = await fetch("/api/ai-sidebar-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analyze_usage",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze usage patterns")
      }

      const data = await response.json()
      return data.recommendations || []
    } catch (error) {
      console.error("Error analyzing usage patterns:", error)
      return []
    }
  }

  async reorderNavigation(navigationOrder: string[], reason?: string): Promise<boolean> {
    try {
      const response = await fetch("/api/ai-sidebar-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reorder_navigation",
          navigationOrder,
          reason,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to reorder navigation")
      }

      const data = await response.json()
      return data.success
    } catch (error) {
      console.error("Error reordering navigation:", error)
      return false
    }
  }

  async getStoredNavigationOrder(): Promise<string[] | null> {
    try {
      const response = await fetch("/api/ai-sidebar-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_navigation_order",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get navigation order")
      }

      const data = await response.json()
      return data.navigationOrder
    } catch (error) {
      console.error("Error getting navigation order:", error)
      return null
    }
  }

  async optimizeNavigationForUser(currentNavigation: NavigationItem[]): Promise<NavigationItem[]> {
    const recommendations = await this.analyzeUsagePatterns()

    if (recommendations.length === 0) {
      return currentNavigation
    }

    const optimizedNavigation = [...currentNavigation]

    // Apply recommendations
    for (const recommendation of recommendations) {
      if (recommendation.confidence < 0.6) continue // Only apply high-confidence recommendations

      switch (recommendation.type) {
        case "move_up":
          if (recommendation.item) {
            const itemIndex = optimizedNavigation.findIndex((nav) => nav.id === recommendation.item)
            if (itemIndex > 0) {
              const [item] = optimizedNavigation.splice(itemIndex, 1)
              optimizedNavigation.unshift(item) // Move to top
            }
          }
          break

        case "move_down":
          if (recommendation.items) {
            recommendation.items.forEach((itemId) => {
              const itemIndex = optimizedNavigation.findIndex((nav) => nav.id === itemId)
              if (itemIndex !== -1) {
                const [item] = optimizedNavigation.splice(itemIndex, 1)
                optimizedNavigation.push(item) // Move to bottom
              }
            })
          }
          break
      }
    }

    // Store the optimized order
    const navigationOrder = optimizedNavigation.map((nav) => nav.id)
    await this.reorderNavigation(
      navigationOrder,
      `AI optimization based on usage patterns: ${recommendations.map((r) => r.message).join("; ")}`,
    )

    return optimizedNavigation
  }

  async resetToDefault(): Promise<boolean> {
    try {
      const response = await fetch("/api/ai-sidebar-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset_navigation",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to reset navigation")
      }

      const data = await response.json()
      return data.success
    } catch (error) {
      console.error("Error resetting navigation:", error)
      return false
    }
  }
}

export const createAISidebarManager = (userId: string) => new AISidebarManager(userId)
