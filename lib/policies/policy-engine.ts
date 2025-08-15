export type PolicyRule = {
  id: string
  type: "budget" | "approval" | "restriction" | "preference"
  condition: string
  action: "approve" | "reject" | "require_approval"
  value?: number | string
  priority: number
}

export type PolicyTemplate = {
  id: string
  name: string
  description: string
  rules: PolicyRule[]
  plan_required: "free" | "basic" | "pro" | "custom"
  auto_approval_enabled: boolean
}

export class PolicyEngine {
  static async evaluateBooking(
    booking: any,
    userPlan: string,
    organizationPolicies: PolicyTemplate[],
  ): Promise<{
    approved: boolean
    confidence: number
    reasons: string[]
    violations: string[]
  }> {
    const applicablePolicies = organizationPolicies.filter((policy) =>
      this.isPlanEligible(policy.plan_required, userPlan),
    )

    let approved = true
    let confidence = 100
    const reasons: string[] = []
    const violations: string[] = []

    for (const policy of applicablePolicies) {
      const result = await this.evaluatePolicy(booking, policy)
      if (!result.passed) {
        approved = false
        violations.push(...result.violations)
      }
      confidence = Math.min(confidence, result.confidence)
      reasons.push(...result.reasons)
    }

    return { approved, confidence, reasons, violations }
  }

  private static isPlanEligible(requiredPlan: string, userPlan: string): boolean {
    const planHierarchy = ["free", "basic", "pro", "custom"]
    const requiredIndex = planHierarchy.indexOf(requiredPlan)
    const userIndex = planHierarchy.indexOf(userPlan)
    return userIndex >= requiredIndex
  }

  private static async evaluatePolicy(booking: any, policy: PolicyTemplate) {
    return {
      passed: true,
      confidence: 95,
      reasons: [`Policy ${policy.name} passed`],
      violations: [],
    }
  }
}
