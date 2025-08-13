import { type NextRequest, NextResponse } from "next/server"
import { getGoCardlessClient } from "@/lib/gocardless/client"

export async function POST(request: NextRequest) {
  try {
    const { institutionId, redirectUrl } = await request.json()

    if (!institutionId || !redirectUrl) {
      return NextResponse.json({ error: "Institution ID and redirect URL are required" }, { status: 400 })
    }

    const client = getGoCardlessClient()

    // Create end user agreement
    const agreement = await client.createEndUserAgreement(institutionId)

    // Create requisition
    const requisition = await client.createRequisition(institutionId, redirectUrl, agreement.id)

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
