import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import type Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
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

        if (!userId) {
          console.error("No userId in session metadata")
          break
        }

        // Update user subscription status
        const { error } = await supabase
          .from("profiles")
          .update({
            stripe_customer_id: session.customer as string,
            subscription_id: session.subscription as string,
            subscription_status: "active",
            plan: session.metadata?.plan || "premium",
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)

        if (error) {
          console.error("Error updating user subscription:", error)
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Get user by customer ID
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single()

        if (profile) {
          const { error } = await supabase
            .from("profiles")
            .update({
              subscription_status: subscription.status,
              updated_at: new Date().toISOString(),
            })
            .eq("id", profile.id)

          if (error) {
            console.error("Error updating subscription status:", error)
          }
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Get user by customer ID
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single()

        if (profile) {
          const { error } = await supabase
            .from("profiles")
            .update({
              subscription_status: "canceled",
              plan: "free",
              updated_at: new Date().toISOString(),
            })
            .eq("id", profile.id)

          if (error) {
            console.error("Error updating canceled subscription:", error)
          }
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Get user by customer ID
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single()

        if (profile) {
          const { error } = await supabase
            .from("profiles")
            .update({
              subscription_status: "past_due",
              updated_at: new Date().toISOString(),
            })
            .eq("id", profile.id)

          if (error) {
            console.error("Error updating payment failed status:", error)
          }
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
