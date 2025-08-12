import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Define your Stripe price IDs here
    const plans = [
      {
        name: "free",
        displayName: "Free",
        price: 0,
        interval: "month",
        priceId: null,
        features: {
          aiTokensLimit: 10000,
          teamMembersLimit: 1,
          travelSearchesLimit: 5,
          hasAiExpenseManagement: false,
          hasCustomPolicies: false,
          hasPrioritySupport: false,
          hasBankIntegration: false,
          hasCrmIntegration: false,
        },
      },
      {
        name: "basic",
        displayName: "Basic",
        price: 49,
        interval: "month",
        priceId: "price_basic_monthly", // Replace with actual Stripe price ID
        yearlyPriceId: "price_basic_yearly", // Replace with actual Stripe price ID
        yearlyPrice: 39,
        features: {
          aiTokensLimit: 50000,
          teamMembersLimit: 5,
          travelSearchesLimit: 50,
          hasAiExpenseManagement: true,
          hasCustomPolicies: false,
          hasPrioritySupport: false,
          hasBankIntegration: false,
          hasCrmIntegration: false,
        },
      },
      {
        name: "pro",
        displayName: "Pro",
        price: 89,
        interval: "month",
        priceId: "price_pro_monthly", // Replace with actual Stripe price ID
        yearlyPriceId: "price_pro_yearly", // Replace with actual Stripe price ID
        yearlyPrice: 71,
        features: {
          aiTokensLimit: 200000,
          teamMembersLimit: 20,
          travelSearchesLimit: 200,
          hasAiExpenseManagement: true,
          hasCustomPolicies: true,
          hasPrioritySupport: true,
          hasBankIntegration: true,
          hasCrmIntegration: false,
        },
      },
      {
        name: "enterprise",
        displayName: "Enterprise",
        price: null,
        interval: "month",
        priceId: null,
        features: {
          aiTokensLimit: -1, // Unlimited
          teamMembersLimit: -1, // Unlimited
          travelSearchesLimit: -1, // Unlimited
          hasAiExpenseManagement: true,
          hasCustomPolicies: true,
          hasPrioritySupport: true,
          hasBankIntegration: true,
          hasCrmIntegration: true,
        },
      },
    ]

    return NextResponse.json({ plans })
  } catch (error) {
    console.error("Plans fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 })
  }
}
