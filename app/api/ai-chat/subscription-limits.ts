export interface PlanLimits {
  aiRequestsPerMonth: number
  flightSearchesPerMonth: number
  expenseReportsPerMonth: number
  teamMembers: number
  analyticsRetention: number // days
  prioritySupport: boolean
  customIntegrations: boolean
  advancedAnalytics: boolean
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    aiRequestsPerMonth: 50,
    flightSearchesPerMonth: 10,
    expenseReportsPerMonth: 5,
    teamMembers: 3,
    analyticsRetention: 30,
    prioritySupport: false,
    customIntegrations: false,
    advancedAnalytics: false,
  },
  premium: {
    aiRequestsPerMonth: 500,
    flightSearchesPerMonth: 100,
    expenseReportsPerMonth: 50,
    teamMembers: 25,
    analyticsRetention: 365,
    prioritySupport: true,
    customIntegrations: false,
    advancedAnalytics: true,
  },
  enterprise: {
    aiRequestsPerMonth: -1, // unlimited
    flightSearchesPerMonth: -1, // unlimited
    expenseReportsPerMonth: -1, // unlimited
    teamMembers: -1, // unlimited
    analyticsRetention: -1, // unlimited
    prioritySupport: true,
    customIntegrations: true,
    advancedAnalytics: true,
  },
}

export async function checkUsageLimits(
  userId: string,
  plan: string,
  action: string,
): Promise<{
  allowed: boolean
  remaining?: number
  limit?: number
  message?: string
}> {
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free

  // This would typically check against a database
  // For now, we'll return a mock response

  switch (action) {
    case "ai_request":
      if (limits.aiRequestsPerMonth === -1) {
        return { allowed: true, message: "Unlimited requests available" }
      }
      // Mock current usage - in real implementation, query database
      const currentAiUsage = 25 // This would come from database
      const remaining = limits.aiRequestsPerMonth - currentAiUsage

      return {
        allowed: remaining > 0,
        remaining: Math.max(0, remaining),
        limit: limits.aiRequestsPerMonth,
        message:
          remaining > 0
            ? `${remaining} AI requests remaining this month`
            : "Monthly AI request limit reached. Upgrade to continue.",
      }

    case "flight_search":
      if (limits.flightSearchesPerMonth === -1) {
        return { allowed: true, message: "Unlimited searches available" }
      }
      const currentFlightUsage = 5
      const flightRemaining = limits.flightSearchesPerMonth - currentFlightUsage

      return {
        allowed: flightRemaining > 0,
        remaining: Math.max(0, flightRemaining),
        limit: limits.flightSearchesPerMonth,
        message:
          flightRemaining > 0
            ? `${flightRemaining} flight searches remaining this month`
            : "Monthly flight search limit reached. Upgrade to continue.",
      }

    default:
      return { allowed: true }
  }
}

export function getPlanFeatures(plan: string): string[] {
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free
  const features: string[] = []

  if (limits.aiRequestsPerMonth === -1) {
    features.push("Unlimited AI requests")
  } else {
    features.push(`${limits.aiRequestsPerMonth} AI requests per month`)
  }

  if (limits.flightSearchesPerMonth === -1) {
    features.push("Unlimited flight searches")
  } else {
    features.push(`${limits.flightSearchesPerMonth} flight searches per month`)
  }

  if (limits.teamMembers === -1) {
    features.push("Unlimited team members")
  } else {
    features.push(`Up to ${limits.teamMembers} team members`)
  }

  if (limits.prioritySupport) {
    features.push("Priority support")
  }

  if (limits.advancedAnalytics) {
    features.push("Advanced analytics")
  }

  if (limits.customIntegrations) {
    features.push("Custom integrations")
  }

  return features
}
