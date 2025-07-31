export interface SubscriptionLimits {
  messagesPerMonth: number
  voiceMinutesPerMonth: number
  expenseReportsPerMonth: number
  teamMembers: number
  apiCallsPerDay: number
  features: string[]
}

export const SUBSCRIPTION_LIMITS: Record<string, SubscriptionLimits> = {
  free: {
    messagesPerMonth: 50,
    voiceMinutesPerMonth: 10,
    expenseReportsPerMonth: 5,
    teamMembers: 1,
    apiCallsPerDay: 100,
    features: ["basic_chat", "flight_search", "basic_expense_tracking"],
  },
  starter: {
    messagesPerMonth: 500,
    voiceMinutesPerMonth: 60,
    expenseReportsPerMonth: 25,
    teamMembers: 5,
    apiCallsPerDay: 1000,
    features: [
      "advanced_chat",
      "flight_booking",
      "hotel_search",
      "expense_management",
      "basic_analytics",
      "email_support",
    ],
  },
  professional: {
    messagesPerMonth: 2000,
    voiceMinutesPerMonth: 300,
    expenseReportsPerMonth: 100,
    teamMembers: 25,
    apiCallsPerDay: 5000,
    features: [
      "full_chat_access",
      "advanced_booking",
      "policy_compliance",
      "advanced_analytics",
      "team_management",
      "priority_support",
      "api_access",
    ],
  },
  enterprise: {
    messagesPerMonth: -1, // unlimited
    voiceMinutesPerMonth: -1, // unlimited
    expenseReportsPerMonth: -1, // unlimited
    teamMembers: -1, // unlimited
    apiCallsPerDay: -1, // unlimited
    features: [
      "unlimited_access",
      "custom_integrations",
      "dedicated_support",
      "custom_policies",
      "advanced_security",
      "sso_integration",
      "custom_branding",
    ],
  },
}

export interface UsageStats {
  messagesUsed: number
  voiceMinutesUsed: number
  expenseReportsUsed: number
  apiCallsToday: number
  resetDate: Date
}

export class SubscriptionManager {
  static checkLimit(
    subscription: string,
    limitType: keyof SubscriptionLimits,
    currentUsage: number,
  ): { allowed: boolean; remaining: number; limit: number } {
    const limits = SUBSCRIPTION_LIMITS[subscription]
    if (!limits) {
      throw new Error(`Invalid subscription type: ${subscription}`)
    }

    const limit = limits[limitType] as number

    // -1 means unlimited
    if (limit === -1) {
      return { allowed: true, remaining: -1, limit: -1 }
    }

    const remaining = Math.max(0, limit - currentUsage)
    const allowed = currentUsage < limit

    return { allowed, remaining, limit }
  }

  static hasFeature(subscription: string, feature: string): boolean {
    const limits = SUBSCRIPTION_LIMITS[subscription]
    return limits?.features.includes(feature) || false
  }

  static getUpgradeMessage(subscription: string, limitType: string): string {
    const messages = {
      free: "Upgrade to Starter plan to get more messages and advanced features.",
      starter: "Upgrade to Professional plan for unlimited access and team features.",
      professional: "Contact us for Enterprise features and custom solutions.",
    }

    return messages[subscription as keyof typeof messages] || "Contact support for upgrade options."
  }

  static calculateUsagePercentage(used: number, limit: number): number {
    if (limit === -1) return 0 // unlimited
    return Math.min(100, (used / limit) * 100)
  }
}

export default SubscriptionManager
