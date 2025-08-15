import type { PolicyTemplate } from "./policy-engine"

export const BASIC_POLICY_TEMPLATES: PolicyTemplate[] = [
  {
    id: "basic-standard-travel",
    name: "Standard Business Travel Policy",
    description: "Comprehensive travel policy for growing companies",
    plan_required: "basic",
    auto_approval_enabled: true,
    rules: [
      {
        id: "budget-limit",
        type: "budget",
        condition: "total_cost <= 1500",
        action: "approve",
        value: 1500,
        priority: 1,
      },
      {
        id: "business-class-long-haul",
        type: "preference",
        condition: 'flight_duration >= 6 && flight_class == "business"',
        action: "approve",
        priority: 2,
      },
      {
        id: "hotel-limit",
        type: "budget",
        condition: "hotel_cost_per_night <= 200",
        action: "approve",
        value: 200,
        priority: 3,
      },
    ],
  },
]

export const BASIC_PLAN_LIMITS = {
  max_policies: 3,
  max_rules_per_policy: 8,
  auto_approval: true,
  custom_rules: true,
  ai_recommendations: false,
}
