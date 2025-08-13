import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createCheckoutSession, createCustomer, getPlanConfig } from "@/lib/stripe/client"
import { z } from "zod"

const checkoutSchema = z.object({
  planType: z.enum(["premium", "enterprise"]),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { planType, successUrl, cancelUrl } = checkoutSchema.parse(body)

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    // Check if user already has an active subscription
    if (profile.subscription_status === "active" && profile.subscription_plan !== "free") {
      return NextResponse.json({ error: "User already has an active subscription" }, { status: 400 })
    }

    const planConfig = getPlanConfig(planType)
    if (!planConfig.priceId) {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 })
    }

    let customerId = profile.stripe_customer_id

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await createCustomer(user.email!, profile.full_name || undefined, {
        userId: user.id,
        companyName: profile.company_name || "",
      })
      customerId = customer.id

      // Update profile with customer ID
      await supabase.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id)
    }

    // Create checkout session
    const session = await createCheckoutSession({
      customerId,
      priceId: planConfig.priceId,
      successUrl: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/billing?success=true`,
      cancelUrl: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/billing?canceled=true`,
      metadata: {
        userId: user.id,
        planType,
      },
    })

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    console.error("Stripe checkout error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
