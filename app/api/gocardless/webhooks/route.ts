import { type NextRequest, NextResponse } from "next/server"
import { createHash, timingSafeEqual } from "crypto"
import { createClient } from "@/lib/supabase/server"

interface GoCardlessWebhookEvent {
  id: string
  created: string
  resource_type: string
  action: string
  links: {
    [key: string]: string
  }
  details?: {
    origin: string
    cause: string
    description: string
  }
}

interface GoCardlessWebhookPayload {
  events: GoCardlessWebhookEvent[]
}

function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  if (!signature || !secret) {
    return false
  }

  const expectedSignature = createHash("sha256")
    .update(payload + secret)
    .digest("hex")
  const providedSignature = signature.replace("sha256=", "")

  if (expectedSignature.length !== providedSignature.length) {
    return false
  }

  return timingSafeEqual(Buffer.from(expectedSignature, "hex"), Buffer.from(providedSignature, "hex"))
}

async function handleRequisitionEvent(event: GoCardlessWebhookEvent, supabase: any) {
  const requisitionId = event.links.requisition

  try {
    switch (event.action) {
      case "created":
        console.log(`Requisition ${requisitionId} created`)
        // Update requisition status in database
        await supabase
          .from("bank_connections")
          .update({
            status: "created",
            updated_at: new Date().toISOString(),
          })
          .eq("gocardless_requisition_id", requisitionId)
        break

      case "linked":
        console.log(`Requisition ${requisitionId} linked - user completed bank authentication`)
        await supabase
          .from("bank_connections")
          .update({
            status: "linked",
            updated_at: new Date().toISOString(),
          })
          .eq("gocardless_requisition_id", requisitionId)
        break

      case "expired":
        console.log(`Requisition ${requisitionId} expired`)
        await supabase
          .from("bank_connections")
          .update({
            status: "expired",
            updated_at: new Date().toISOString(),
          })
          .eq("gocardless_requisition_id", requisitionId)
        break

      case "rejected":
        console.log(`Requisition ${requisitionId} rejected by user`)
        await supabase
          .from("bank_connections")
          .update({
            status: "rejected",
            updated_at: new Date().toISOString(),
          })
          .eq("gocardless_requisition_id", requisitionId)
        break

      case "error":
        console.log(`Requisition ${requisitionId} error:`, event.details)
        await supabase
          .from("bank_connections")
          .update({
            status: "error",
            error_message: event.details?.description || "Unknown error",
            updated_at: new Date().toISOString(),
          })
          .eq("gocardless_requisition_id", requisitionId)
        break

      default:
        console.log(`Unhandled requisition action: ${event.action}`)
    }
  } catch (error) {
    console.error(`Error handling requisition event ${event.id}:`, error)
    throw error
  }
}

async function handleAccountEvent(event: GoCardlessWebhookEvent, supabase: any) {
  const accountId = event.links.account

  try {
    switch (event.action) {
      case "created":
        console.log(`Account ${accountId} created`)
        // Account creation is typically handled when we fetch account details
        break

      case "ready":
        console.log(`Account ${accountId} ready for data access`)
        await supabase
          .from("bank_accounts")
          .update({
            status: "ready",
            updated_at: new Date().toISOString(),
          })
          .eq("gocardless_account_id", accountId)
        break

      case "error":
        console.log(`Account ${accountId} error:`, event.details)
        await supabase
          .from("bank_accounts")
          .update({
            status: "error",
            error_message: event.details?.description || "Unknown error",
            updated_at: new Date().toISOString(),
          })
          .eq("gocardless_account_id", accountId)
        break

      case "expired":
        console.log(`Account ${accountId} access expired`)
        await supabase
          .from("bank_accounts")
          .update({
            status: "expired",
            updated_at: new Date().toISOString(),
          })
          .eq("gocardless_account_id", accountId)
        break

      case "suspended":
        console.log(`Account ${accountId} suspended`)
        await supabase
          .from("bank_accounts")
          .update({
            status: "suspended",
            updated_at: new Date().toISOString(),
          })
          .eq("gocardless_account_id", accountId)
        break

      default:
        console.log(`Unhandled account action: ${event.action}`)
    }
  } catch (error) {
    console.error(`Error handling account event ${event.id}:`, error)
    throw error
  }
}

async function handleEndUserAgreementEvent(event: GoCardlessWebhookEvent, supabase: any) {
  const agreementId = event.links.enduser_agreement

  try {
    switch (event.action) {
      case "created":
        console.log(`End user agreement ${agreementId} created`)
        break

      case "accepted":
        console.log(`End user agreement ${agreementId} accepted`)
        // Update any related bank connections
        await supabase
          .from("bank_connections")
          .update({
            agreement_status: "accepted",
            updated_at: new Date().toISOString(),
          })
          .eq("gocardless_agreement_id", agreementId)
        break

      case "expired":
        console.log(`End user agreement ${agreementId} expired`)
        await supabase
          .from("bank_connections")
          .update({
            agreement_status: "expired",
            updated_at: new Date().toISOString(),
          })
          .eq("gocardless_agreement_id", agreementId)
        break

      case "timed_out":
        console.log(`End user agreement ${agreementId} timed out`)
        await supabase
          .from("bank_connections")
          .update({
            agreement_status: "timed_out",
            updated_at: new Date().toISOString(),
          })
          .eq("gocardless_agreement_id", agreementId)
        break

      default:
        console.log(`Unhandled end user agreement action: ${event.action}`)
    }
  } catch (error) {
    console.error(`Error handling end user agreement event ${event.id}:`, error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("webhook-signature")
    const webhookSecret = process.env.GOCARDLESS_WEBHOOK_SECRET

    // Verify webhook signature
    if (!webhookSecret) {
      console.error("GOCARDLESS_WEBHOOK_SECRET not configured")
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    if (!signature || !verifyWebhookSignature(body, signature, webhookSecret)) {
      console.error("Invalid webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const payload: GoCardlessWebhookPayload = JSON.parse(body)
    const supabase = createClient()

    // Process each event in the webhook
    for (const event of payload.events) {
      console.log(`Processing GoCardless webhook event: ${event.id} - ${event.resource_type}.${event.action}`)

      try {
        switch (event.resource_type) {
          case "requisition":
            await handleRequisitionEvent(event, supabase)
            break

          case "account":
            await handleAccountEvent(event, supabase)
            break

          case "enduser_agreement":
            await handleEndUserAgreementEvent(event, supabase)
            break

          default:
            console.log(`Unhandled resource type: ${event.resource_type}`)
        }

        // Log the processed event
        await supabase.from("webhook_events").insert({
          id: event.id,
          provider: "gocardless",
          event_type: `${event.resource_type}.${event.action}`,
          resource_id: event.links[event.resource_type] || null,
          payload: event,
          processed_at: new Date().toISOString(),
          status: "processed",
        })
      } catch (eventError) {
        console.error(`Error processing event ${event.id}:`, eventError)

        // Log the failed event
        await supabase.from("webhook_events").insert({
          id: event.id,
          provider: "gocardless",
          event_type: `${event.resource_type}.${event.action}`,
          resource_id: event.links[event.resource_type] || null,
          payload: event,
          processed_at: new Date().toISOString(),
          status: "failed",
          error_message: eventError instanceof Error ? eventError.message : "Unknown error",
        })

        // Continue processing other events even if one fails
        continue
      }
    }

    return NextResponse.json({ success: true, processed: payload.events.length })
  } catch (error) {
    console.error("GoCardless webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "gocardless-webhooks",
    timestamp: new Date().toISOString(),
  })
}
