import { createClient } from "@/lib/supabase/client"

export interface TravelPolicy {
  id: string
  name: string
  category: "travel" | "expense" | "approval" | "compliance"
  status: "active" | "draft" | "archived"
  description: string
  rules: PolicyRule[]
  applicable_roles: string[]
  created_at: string
  updated_at: string
  created_by: string
  user_id: string
  violations_count: number
  compliance_rate: number
}

export interface PolicyRule {
  id: string
  type: "budget_limit" | "approval_required" | "booking_class" | "advance_booking" | "preferred_vendor"
  condition: string
  value: string | number
  action: "allow" | "require_approval" | "block"
  priority: number
}

export interface PolicyViolation {
  id: string
  policy_id: string
  user_id: string
  violation_type: string
  description: string
  severity: "low" | "medium" | "high"
  resolved: boolean
  created_at: string
}

export class PolicyService {
  private supabase = createClient()

  async createPolicy(policy: Omit<TravelPolicy, "id" | "created_at" | "updated_at">): Promise<TravelPolicy> {
    const { data, error } = await this.supabase.from("travel_policies").insert([policy]).select().single()

    if (error) throw error

    // Store policy context in Mem0 for AI understanding
    await this.storePolicyInMemory(data)

    return data
  }

  async getUserPolicies(userId: string): Promise<TravelPolicy[]> {
    const { data, error } = await this.supabase
      .from("travel_policies")
      .select(`
        *,
        policy_violations!inner(count)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  async checkCompliance(
    userId: string,
    bookingData: any,
  ): Promise<{
    compliant: boolean
    violations: PolicyViolation[]
    warnings: string[]
    approvals_required: string[]
  }> {
    const policies = await this.getUserPolicies(userId)
    const violations: PolicyViolation[] = []
    const warnings: string[] = []
    const approvals_required: string[] = []

    for (const policy of policies.filter((p) => p.status === "active")) {
      const result = await this.evaluatePolicy(policy, bookingData)
      violations.push(...result.violations)
      warnings.push(...result.warnings)
      approvals_required.push(...result.approvals_required)
    }

    return {
      compliant: violations.length === 0,
      violations,
      warnings,
      approvals_required,
    }
  }

  private async storePolicyInMemory(policy: TravelPolicy): Promise<void> {
    try {
      const response = await fetch("/api/suitpax-intelligence/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: policy.user_id,
          memory_type: "policy",
          content: {
            policy_id: policy.id,
            name: policy.name,
            category: policy.category,
            rules: policy.rules,
            description: policy.description,
          },
          metadata: {
            type: "travel_policy",
            category: policy.category,
            status: policy.status,
          },
        }),
      })

      if (!response.ok) {
        console.error("Failed to store policy in memory:", await response.text())
      }
    } catch (error) {
      console.error("Error storing policy in memory:", error)
    }
  }

  private async evaluatePolicy(
    policy: TravelPolicy,
    bookingData: any,
  ): Promise<{
    violations: PolicyViolation[]
    warnings: string[]
    approvals_required: string[]
  }> {
    const violations: PolicyViolation[] = []
    const warnings: string[] = []
    const approvals_required: string[] = []

    for (const rule of policy.rules) {
      switch (rule.type) {
        case "budget_limit":
          if (bookingData.total_amount > rule.value) {
            if (rule.action === "block") {
              violations.push({
                id: crypto.randomUUID(),
                policy_id: policy.id,
                user_id: bookingData.user_id,
                violation_type: "budget_exceeded",
                description: `Amount ${bookingData.total_amount} exceeds limit of ${rule.value}`,
                severity: "high",
                resolved: false,
                created_at: new Date().toISOString(),
              })
            } else if (rule.action === "require_approval") {
              approvals_required.push(`Budget approval required for amount exceeding ${rule.value}`)
            }
          }
          break

        case "booking_class":
          if (bookingData.booking_class !== rule.value && rule.action === "block") {
            violations.push({
              id: crypto.randomUUID(),
              policy_id: policy.id,
              user_id: bookingData.user_id,
              violation_type: "booking_class_violation",
              description: `Booking class ${bookingData.booking_class} not allowed, only ${rule.value} permitted`,
              severity: "medium",
              resolved: false,
              created_at: new Date().toISOString(),
            })
          }
          break

        case "advance_booking":
          const bookingDate = new Date(bookingData.departure_date)
          const today = new Date()
          const daysInAdvance = Math.ceil((bookingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

          if (daysInAdvance < rule.value) {
            warnings.push(`Booking should be made at least ${rule.value} days in advance`)
          }
          break
      }
    }

    return { violations, warnings, approvals_required }
  }

  async getPolicyAnalytics(userId: string): Promise<{
    total_policies: number
    active_policies: number
    total_violations: number
    compliance_rate: number
    top_violations: { type: string; count: number }[]
  }> {
    const policies = await this.getUserPolicies(userId)

    const { data: violations } = await this.supabase
      .from("policy_violations")
      .select("violation_type")
      .eq("user_id", userId)

    const violationCounts =
      violations?.reduce(
        (acc, v) => {
          acc[v.violation_type] = (acc[v.violation_type] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ) || {}

    const topViolations = Object.entries(violationCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      total_policies: policies.length,
      active_policies: policies.filter((p) => p.status === "active").length,
      total_violations: violations?.length || 0,
      compliance_rate:
        policies.length > 0
          ? Math.round(policies.reduce((sum, p) => sum + p.compliance_rate, 0) / policies.length)
          : 100,
      top_violations: topViolations,
    }
  }
}

export const policyService = new PolicyService()
