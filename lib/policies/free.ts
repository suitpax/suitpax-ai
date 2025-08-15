import type { PolicyTemplate } from "./policy-engine"

export const FREE_POLICY_TEMPLATES: PolicyTemplate[] = [
  {
    id: "free-basic-travel",
    name: "Basic Travel Policy",
    description: "Simple travel policy for small teams",
    plan_required: "free",
    auto_approval_enabled: false,
    rules: [
      {
        id: "budget-limit",
        type: "budget",
        condition: "total_cost <= 500",
        action: "approve",
        value: 500,
        priority: 1,
      },
      {
        id: "economy-only",
        type: "restriction",
        condition: 'flight_class == "economy"',
        action: "approve",
        priority: 2,
      },
      {
        id: "advance-booking",
        type: "restriction",
        condition: "booking_days_ahead >= 7",
        action: "require_approval",
        value: 7,
        priority: 3,
      },
    ],
  },
]

export const FREE_PLAN_LIMITS = {
  max_policies: 1,
  max_rules_per_policy: 3,
  auto_approval: false,
  custom_rules: false,
  ai_recommendations: false,
}
