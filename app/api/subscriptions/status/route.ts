import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    // Get user's subscription status and plan limits
    const { data: planLimits, error } = await supabase.rpc("get_user_plan_limits", { user_uuid: userId })

    if (error) {
      console.error("Error fetching plan limits:", error)
      return NextResponse.json({ error: "Failed to fetch subscription status" }, { status: 500 })
    }

    const limits = planLimits[0]

    return NextResponse.json({
      planName: limits.plan_name,
      aiTokensLimit: limits.ai_tokens_limit,
      aiTokensUsed: limits.ai_tokens_used,
      teamMembersLimit: limits.team_members_limit,
      travelSearchesLimit: limits.travel_searches_limit,
      travelSearchesUsed: limits.travel_searches_used,
      features: {
        hasAiExpenseManagement: limits.has_ai_expense_management,
        hasCustomPolicies: limits.has_custom_policies,
        hasPrioritySupport: limits.has_priority_support,
        hasBankIntegration: limits.has_bank_integration,
        hasCrmIntegration: limits.has_crm_integration,
      },
      usage: {
        aiTokensPercentage:
          limits.ai_tokens_limit === -1 ? 0 : Math.round((limits.ai_tokens_used / limits.ai_tokens_limit) * 100),
        travelSearchesPercentage:
          limits.travel_searches_limit === -1
            ? 0
            : Math.round((limits.travel_searches_used / limits.travel_searches_limit) * 100),
      },
    })
  } catch (error) {
    console.error("Status check error:", error)
    return NextResponse.json({ error: "Failed to check subscription status" }, { status: 500 })
  }
}
