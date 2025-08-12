import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break

      case "customer.subscription.deleted":
        await handleSubscriptionCancellation(event.data.object as Stripe.Subscription)
        break

      case "invoice.payment_succeeded":
        await handlePaymentSuccess(event.data.object as Stripe.Invoice)
        break

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case "customer.created":
        await handleCustomerCreated(event.data.object as Stripe.Customer)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 })
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  const subscriptionId = subscription.id
  const priceId = subscription.items.data[0]?.price.id

  // Get plan name from price ID
  const planName = getPlanFromPriceId(priceId)

  // Find user by Stripe customer ID
  const { data: existingSubscription } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single()

  if (existingSubscription) {
    // Update existing subscription
    await supabase
      .from("subscriptions")
      .update({
        stripe_subscription_id: subscriptionId,
        stripe_price_id: priceId,
        plan_name: planName,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_customer_id", customerId)

    // Update user's plan in profiles table
    await supabase
      .from("profiles")
      .update({
        subscription_plan: planName,
        subscription_status: subscription.status,
        stripe_subscription_id: subscriptionId,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_customer_id", customerId)

    // Update user's plan in users table
    await supabase
      .from("users")
      .update({
        plan_type: planName,
        plan_updated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingSubscription.user_id)
  }
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId)

  // Downgrade user to free plan
  await supabase
    .from("profiles")
    .update({
      subscription_plan: "free",
      subscription_status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId)

  const { data: subscription_data } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single()

  if (subscription_data) {
    await supabase
      .from("users")
      .update({
        plan_type: "free",
        plan_updated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription_data.user_id)
  }
}

async function handlePaymentSuccess(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string

  await supabase
    .from("subscriptions")
    .update({
      status: "active",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId)

  await supabase
    .from("profiles")
    .update({
      subscription_status: "active",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId)
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string

  await supabase
    .from("subscriptions")
    .update({
      status: "past_due",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId)

  await supabase
    .from("profiles")
    .update({
      subscription_status: "past_due",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId)
}

async function handleCustomerCreated(customer: Stripe.Customer) {
  // This is mainly for logging purposes
  console.log(`New Stripe customer created: ${customer.id}`)
}

function getPlanFromPriceId(priceId: string): string {
  // You'll need to replace these with your actual Stripe price IDs
  const priceToPlans: Record<string, string> = {
    price_basic_monthly: "basic",
    price_basic_yearly: "basic",
    price_pro_monthly: "pro",
    price_pro_yearly: "pro",
    price_enterprise_monthly: "enterprise",
    price_enterprise_yearly: "enterprise",
  }

  return priceToPlans[priceId] || "free"
}
