import { type NextRequest, NextResponse } from "next/server"
import { getGoCardlessClient } from "@/lib/gocardless/client"
import { createClient } from "@/lib/supabase/server"

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

    // Resolve current user and connection
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: connection } = await supabase
      .from("bank_connections")
      .select("id, user_id")
      .eq("gocardless_requisition_id", requisitionId)
      .single()

    // Get details for each account and upsert
    const accountsWithDetails = await Promise.all(
      requisition.accounts.map(async (accountId: string) => {
        try {
          const [details, balances] = await Promise.all([
            client.getAccountDetails(accountId),
            client.getAccountBalances(accountId),
          ])

          // Upsert into bank_accounts if we have connection and user
          if (connection?.id && (connection.user_id || user?.id)) {
            const balance = Array.isArray(balances) && balances[0]?.balanceAmount?.amount
            const avail = Array.isArray(balances) && balances[1]?.balanceAmount?.amount
            await supabase.from("bank_accounts").upsert({
              gocardless_account_id: accountId,
              connection_id: connection.id,
              user_id: connection.user_id || user?.id,
              account_name: details.name,
              account_holder_name: details.ownerName,
              iban: details.iban,
              currency: details.currency,
              account_type: details.product,
              current_balance: balance || null,
              available_balance: avail || null,
              balance_updated_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
          }

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
