import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createCheckoutSession, STRIPE_PLANS } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json()

    if (!plan || !STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const selectedPlan = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS]

    if (!selectedPlan.priceId) {
      return NextResponse.json({ error: "Plan not available for purchase" }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const session = await createCheckoutSession({
      priceId: selectedPlan.priceId,
      userId: user.id,
      userEmail: user.email!,
      successUrl: `${baseUrl}/dashboard?success=true&plan=${plan}`,
      cancelUrl: `${baseUrl}/pricing?canceled=true`,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
