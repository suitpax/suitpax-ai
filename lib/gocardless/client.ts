export interface GoCardlessConfig {
  secretId: string
  secretKey: string
  baseUrl: string
}

export interface BankAccount {
  id: string
  iban: string
  name: string
  currency: string
  ownerName: string
  product: string
  resourceId: string
  status: string
}

export interface Transaction {
  transactionId: string
  bookingDate: string
  valueDate: string
  transactionAmount: {
    amount: string
    currency: string
  }
  creditorName?: string
  debtorName?: string
  remittanceInformationUnstructured: string
  proprietaryBankTransactionCode?: string
}

export interface Balance {
  balanceAmount: {
    amount: string
    currency: string
  }
  balanceType: string
  referenceDate: string
}

export class GoCardlessClient {
  private config: GoCardlessConfig

  constructor(config: GoCardlessConfig) {
    this.config = config
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.config.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.config.secretKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`GoCardless API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Get available institutions
  async getInstitutions(country = "GB") {
    return this.makeRequest(`/api/v2/institutions/?country=${country}`)
  }

  // Create end user agreement
  async createEndUserAgreement(institutionId: string, maxHistoricalDays = 90) {
    return this.makeRequest("/api/v2/agreements/enduser/", {
      method: "POST",
      body: JSON.stringify({
        institution_id: institutionId,
        max_historical_days: maxHistoricalDays,
        access_valid_for_days: 90,
        access_scope: ["balances", "details", "transactions"],
      }),
    })
  }

  // Create requisition (bank connection link)
  async createRequisition(institutionId: string, redirect: string, agreementId?: string) {
    return this.makeRequest("/api/v2/requisitions/", {
      method: "POST",
      body: JSON.stringify({
        redirect,
        institution_id: institutionId,
        agreement: agreementId,
        reference: `suitpax-${Date.now()}`,
        user_language: "EN",
      }),
    })
  }

  // Get requisition details
  async getRequisition(requisitionId: string) {
    return this.makeRequest(`/api/v2/requisitions/${requisitionId}/`)
  }

  // Get account details
  async getAccountDetails(accountId: string): Promise<BankAccount> {
    const response = await this.makeRequest(`/api/v2/accounts/${accountId}/details/`)
    return response.account
  }

  // Get account balances
  async getAccountBalances(accountId: string): Promise<Balance[]> {
    const response = await this.makeRequest(`/api/v2/accounts/${accountId}/balances/`)
    return response.balances
  }

  // Get account transactions
  async getAccountTransactions(accountId: string, dateFrom?: string, dateTo?: string): Promise<Transaction[]> {
    let endpoint = `/api/v2/accounts/${accountId}/transactions/`
    const params = new URLSearchParams()

    if (dateFrom) params.append("date_from", dateFrom)
    if (dateTo) params.append("date_to", dateTo)

    if (params.toString()) {
      endpoint += `?${params.toString()}`
    }

    const response = await this.makeRequest(endpoint)
    return response.transactions.booked || []
  }

  // Delete account connection
  async deleteAccount(accountId: string) {
    return this.makeRequest(`/api/v2/accounts/${accountId}/`, {
      method: "DELETE",
    })
  }
}

// Singleton instance
let goCardlessClient: GoCardlessClient | null = null

export function getGoCardlessClient(): GoCardlessClient {
  if (!goCardlessClient) {
    goCardlessClient = new GoCardlessClient({
      secretId: process.env.GOCARDLESS_SECRET_ID!,
      secretKey: process.env.GOCARDLESS_SECRET_KEY!,
      baseUrl: process.env.GOCARDLESS_BASE_URL || "https://bankaccountdata.gocardless.com",
    })
  }
  return goCardlessClient
}
