import { type NextRequest, NextResponse } from "next/server"
import { getGoCardlessClient } from "@/lib/gocardless/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const requisitionId = searchParams.get("requisitionId")

    if (!requisitionId) {
      return NextResponse.json({ error: "Requisition ID is required" }, { status: 400 })
    }

    const client = getGoCardlessClient()
    const requisition = await client.getRequisition(requisitionId)

    if (!requisition.accounts || requisition.accounts.length === 0) {
      return NextResponse.json({ accounts: [] })
    }

    // Get details for each account
    const accountsWithDetails = await Promise.all(
      requisition.accounts.map(async (accountId: string) => {
        try {
          const [details, balances] = await Promise.all([
            client.getAccountDetails(accountId),
            client.getAccountBalances(accountId),
          ])

          return {
            id: accountId,
            ...details,
            balances,
          }
        } catch (error) {
          console.error(`Error fetching account ${accountId}:`, error)
          return null
        }
      }),
    )

    const validAccounts = accountsWithDetails.filter((account) => account !== null)

    return NextResponse.json({ accounts: validAccounts })
  } catch (error) {
    console.error("Error fetching accounts:", error)
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 })
  }
}
