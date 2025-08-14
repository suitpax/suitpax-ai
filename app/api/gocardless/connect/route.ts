import { type NextRequest, NextResponse } from "next/server"
import { getGoCardlessClient } from "@/lib/gocardless/client"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { institutionId, redirectUrl, institutionName } = await request.json()

    if (!institutionId || !redirectUrl) {
      return NextResponse.json({ error: "Institution ID and redirect URL are required" }, { status: 400 })
    }

    const client = getGoCardlessClient()

    // Create end user agreement
    const agreement = await client.createEndUserAgreement(institutionId)

    // Create requisition
    const requisition = await client.createRequisition(institutionId, redirectUrl, agreement.id)

    // Persist connection stub for current user
    try {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.id) {
        await supabase.from("bank_connections").upsert({
          user_id: user.id,
          gocardless_requisition_id: requisition.id,
          institution_id: institutionId,
          institution_name: institutionName || "",
          status: "created",
          agreement_status: "created",
          gocardless_agreement_id: agreement.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
    } catch (e) {
      console.error("Failed to persist bank connection", e)
    }

    return NextResponse.json({
      requisitionId: requisition.id,
      authLink: requisition.link,
      agreementId: agreement.id,
    })
  } catch (error) {
    console.error("Error creating bank connection:", error)
    return NextResponse.json({ error: "Failed to create bank connection" }, { status: 500 })
  }
}
