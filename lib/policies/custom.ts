import type { PolicyTemplate } from "./policy-engine"

export const CUSTOM_POLICY_TEMPLATES: PolicyTemplate[] = [
  {
    id: "custom-enterprise-travel",
    name: "Enterprise Custom Travel Policy",
    description: "Fully customizable enterprise travel policy",
    plan_required: "custom",
    auto_approval_enabled: true,
    rules: [], // Completely customizable by the enterprise
  },
]

export const CUSTOM_PLAN_LIMITS = {
  max_policies: "unlimited",
  max_rules_per_policy: "unlimited",
  auto_approval: true,
  custom_rules: true,
  ai_recommendations: true,
  advanced_analytics: true,
  multi_currency: true,
  api_access: true,
  dedicated_support: true,
  custom_integrations: true,
}
