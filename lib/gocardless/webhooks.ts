import { getGoCardlessClient } from "./client"
import { createClient } from "@/lib/supabase/server"

export interface WebhookEventProcessor {
  processRequisitionLinked(requisitionId: string): Promise<void>
  processAccountReady(accountId: string): Promise<void>
  syncAccountData(accountId: string): Promise<void>
}

export class GoCardlessWebhookProcessor implements WebhookEventProcessor {
  private supabase = createClient()
  private client = getGoCardlessClient()

  async processRequisitionLinked(requisitionId: string): Promise<void> {
    try {
      console.log(`Processing linked requisition: ${requisitionId}`)

      // Get requisition details from GoCardless
      const requisition = await this.client.getRequisition(requisitionId)

      if (!requisition.accounts || requisition.accounts.length === 0) {
        console.log(`No accounts found for requisition ${requisitionId}`)
        return
      }

      // Process each account
      for (const accountId of requisition.accounts) {
        await this.processAccountReady(accountId)
      }

      // Update requisition status
      await this.supabase
        .from("bank_connections")
        .update({
          status: "linked",
          accounts_synced: requisition.accounts.length,
          updated_at: new Date().toISOString(),
        })
        .eq("gocardless_requisition_id", requisitionId)

      console.log(`Successfully processed requisition ${requisitionId} with ${requisition.accounts.length} accounts`)
    } catch (error) {
      console.error(`Error processing requisition ${requisitionId}:`, error)
      throw error
    }
  }

  async processAccountReady(accountId: string): Promise<void> {
    try {
      console.log(`Processing ready account: ${accountId}`)

      // Check if we can make requests (rate limiting)
      if (!this.client.canMakeRequest(accountId, "details")) {
        console.log(`Rate limit reached for account ${accountId}, skipping sync`)
        return
      }

      // Get account details
      const accountDetails = await this.client.getAccountDetails(accountId)
      const balances = await this.client.getAccountBalances(accountId)

      // Find the connection this account belongs to
      const { data: connection } = await this.supabase
        .from("bank_connections")
        .select("id, user_id")
        .eq("status", "linked")
        .single()

      if (!connection) {
        console.error(`No linked connection found for account ${accountId}`)
        return
      }

      // Insert or update account in database
      const { error: accountError } = await this.supabase.from("bank_accounts").upsert({
        gocardless_account_id: accountId,
        connection_id: connection.id,
        user_id: connection.user_id,
        account_name: accountDetails.name,
        iban: accountDetails.iban,
        currency: accountDetails.currency,
        owner_name: accountDetails.ownerName,
        product: accountDetails.product,
        status: "ready",
        balance: balances[0]?.balanceAmount?.amount || "0",
        balance_currency: balances[0]?.balanceAmount?.currency || accountDetails.currency,
        last_synced: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (accountError) {
        console.error(`Error upserting account ${accountId}:`, accountError)
        throw accountError
      }

      // Sync initial transactions
      await this.syncAccountData(accountId)

      console.log(`Successfully processed account ${accountId}`)
    } catch (error) {
      console.error(`Error processing account ${accountId}:`, error)
      throw error
    }
  }

  async syncAccountData(accountId: string): Promise<void> {
    try {
      console.log(`Syncing data for account: ${accountId}`)

      // Check rate limits
      if (!this.client.canMakeRequest(accountId, "transactions")) {
        console.log(`Rate limit reached for account ${accountId} transactions, skipping sync`)
        return
      }

      // Get transactions from the last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const dateFrom = thirtyDaysAgo.toISOString().split("T")[0]

      const transactions = await this.client.getAccountTransactions(accountId, dateFrom)

      // Get the account record to link transactions
      const { data: account } = await this.supabase
        .from("bank_accounts")
        .select("id, user_id")
        .eq("gocardless_account_id", accountId)
        .single()

      if (!account) {
        console.error(`Account ${accountId} not found in database`)
        return
      }

      // Insert transactions
      for (const transaction of transactions) {
        const { error: transactionError } = await this.supabase.from("bank_transactions").upsert({
          gocardless_transaction_id: transaction.transactionId,
          account_id: account.id,
          user_id: account.user_id,
          booking_date: transaction.bookingDate,
          value_date: transaction.valueDate,
          amount: transaction.transactionAmount.amount,
          currency: transaction.transactionAmount.currency,
          creditor_name: transaction.creditorName,
          debtor_name: transaction.debtorName,
          description: transaction.remittanceInformationUnstructured,
          transaction_code: transaction.proprietaryBankTransactionCode,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (transactionError) {
          console.error(`Error upserting transaction ${transaction.transactionId}:`, transactionError)
          // Continue with other transactions
        }
      }

      // Update account sync timestamp
      await this.supabase
        .from("bank_accounts")
        .update({
          last_synced: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("gocardless_account_id", accountId)

      console.log(`Successfully synced ${transactions.length} transactions for account ${accountId}`)
    } catch (error) {
      console.error(`Error syncing data for account ${accountId}:`, error)
      throw error
    }
  }
}

// Singleton instance
let webhookProcessor: GoCardlessWebhookProcessor | null = null

export function getWebhookProcessor(): GoCardlessWebhookProcessor {
  if (!webhookProcessor) {
    webhookProcessor = new GoCardlessWebhookProcessor()
  }
  return webhookProcessor
}
