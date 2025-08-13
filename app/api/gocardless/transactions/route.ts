import { type NextRequest, NextResponse } from "next/server"
import { getGoCardlessClient } from "@/lib/gocardless/client"

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

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
