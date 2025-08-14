export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"
import { getGoCardlessClient } from "@/lib/gocardless/client"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get("accountId")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    if (!accountId) {
      return NextResponse.json({ error: "Account ID is required" }, { status: 400 })
    }

    const client = getGoCardlessClient()
    const transactions = await client.getAccountTransactions(accountId, dateFrom || undefined, dateTo || undefined)

    // Persist transactions
    try {
      const supabase = createClient()
      const { data: account } = await supabase
        .from("bank_accounts")
        .select("id, user_id")
        .eq("gocardless_account_id", accountId)
        .single()

      if (account?.id && account.user_id) {
        for (const t of transactions) {
          await supabase.from("bank_transactions").upsert({
            gocardless_transaction_id: t.transactionId,
            account_id: account.id,
            user_id: account.user_id,
            amount: Number(t.transactionAmount?.amount || 0),
            currency: t.transactionAmount?.currency || "EUR",
            transaction_date: t.bookingDate?.slice(0, 10) || t.valueDate?.slice(0, 10) || new Date().toISOString().slice(0, 10),
            booking_date: t.bookingDate?.slice(0, 10) || null,
            value_date: t.valueDate?.slice(0, 10) || null,
            merchant_name: t.creditorName || null,
            counterparty_name: t.debtorName || null,
            description: t.remittanceInformationUnstructured || null,
            transaction_code: t.proprietaryBankTransactionCode || null,
            updated_at: new Date().toISOString(),
          })
        }
      }
    } catch (e) {
      console.error("Persist transactions error", e)
    }

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
