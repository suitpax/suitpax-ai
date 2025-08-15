import type { PolicyTemplate } from "./policy-engine"

export const PRO_POLICY_TEMPLATES: PolicyTemplate[] = [
  {
    id: "pro-advanced-travel",
    name: "Advanced AI-Powered Travel Policy",
    description: "Intelligent travel policy with AI auto-approval",
    plan_required: "pro",
    auto_approval_enabled: true,
    rules: [
      {
        id: "dynamic-budget",
        type: "budget",
        condition: "ai_evaluate_budget_reasonableness(destination, duration, role)",
        action: "approve",
        priority: 1,
      },
      {
        id: "smart-class-selection",
        type: "preference",
        condition: "ai_recommend_flight_class(duration, cost_difference, employee_level)",
        action: "approve",
        priority: 2,
      },
      {
        id: "risk-assessment",
        type: "restriction",
        condition: 'destination_risk_level <= "medium"',
        action: "approve",
        priority: 3,
      },
    ],
  },
]

export const PRO_PLAN_LIMITS = {
  max_policies: 10,
  max_rules_per_policy: 20,
  auto_approval: true,
  custom_rules: true,
  ai_recommendations: true,
  advanced_analytics: true,
  multi_currency: true,
}
