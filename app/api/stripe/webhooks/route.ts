import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe, STRIPE_CONFIG } from "@/lib/stripe/client"
import { createClient } from "@/lib/supabase/server"
import type Stripe from "stripe"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature provided" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_CONFIG.webhookSecret)
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = createClient()

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const planType = session.metadata?.planType as keyof typeof STRIPE_CONFIG.plans

        if (!userId || !planType) {
          console.error("Missing metadata in checkout session:", session.id)
          break
        }

        const planConfig = STRIPE_CONFIG.plans[planType]

        // Update user profile with subscription info
        await supabase
          .from("profiles")
          .update({
            subscription_plan: planType,
            subscription_status: "active",
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            ai_tokens_limit: planConfig.limits.aiTokens,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)

        console.log(`Subscription activated for user ${userId}, plan: ${planType}`)
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by customer ID
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single()

        if (!profile) {
          console.error("User not found for customer:", customerId)
          break
        }

        // Determine plan type from price ID
        let planType: keyof typeof STRIPE_CONFIG.plans = "free"
        for (const [key, config] of Object.entries(STRIPE_CONFIG.plans)) {
          if (config.priceId && subscription.items.data.some((item) => item.price.id === config.priceId)) {
            planType = key as keyof typeof STRIPE_CONFIG.plans
            break
          }
        }

        const planConfig = STRIPE_CONFIG.plans[planType]

        await supabase
          .from("profiles")
          .update({
            subscription_plan: planType,
            subscription_status: subscription.status === "active" ? "active" : "inactive",
            stripe_subscription_id: subscription.id,
            ai_tokens_limit: planConfig.limits.aiTokens,
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id)

        console.log(`Subscription updated for customer ${customerId}, status: ${subscription.status}`)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by customer ID
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single()

        if (!profile) {
          console.error("User not found for customer:", customerId)
          break
        }

        // Revert to free plan
        const freeConfig = STRIPE_CONFIG.plans.free

        await supabase
          .from("profiles")
          .update({
            subscription_plan: "free",
            subscription_status: "cancelled",
            stripe_subscription_id: null,
            ai_tokens_limit: freeConfig.limits.aiTokens,
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id)

        console.log(`Subscription cancelled for customer ${customerId}`)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Find user by customer ID
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single()

        if (!profile) {
          console.error("User not found for customer:", customerId)
          break
        }

        await supabase
          .from("profiles")
          .update({
            subscription_status: "inactive",
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id)

        console.log(`Payment failed for customer ${customerId}`)
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Find user by customer ID
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single()

        if (!profile) {
          console.error("User not found for customer:", customerId)
          break
        }

        await supabase
          .from("profiles")
          .update({
            subscription_status: "active",
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id)

        console.log(`Payment succeeded for customer ${customerId}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
