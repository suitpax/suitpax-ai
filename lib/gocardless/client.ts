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
  private accessToken: string | null = null
  private tokenExpiry = 0

  constructor(config: GoCardlessConfig) {
    this.config = config
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    const response = await fetch(`${this.config.baseUrl}/api/v2/token/new/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        secret_id: this.config.secretId,
        secret_key: this.config.secretKey,
      }),
    })

    if (!response.ok) {
      throw new Error(`GoCardless auth error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    this.accessToken = data.access
    // Token expires in 1 hour, refresh 5 minutes early
    this.tokenExpiry = Date.now() + (data.access_expires - 300) * 1000

    return this.accessToken
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = await this.getAccessToken()
    const url = `${this.config.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("GoCardless API Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url,
      })
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

let goCardlessClient: GoCardlessClient | null = null

export function getGoCardlessClient(): GoCardlessClient {
  if (!goCardlessClient) {
    const secretId = process.env.GOCARDLESS_SECRET_ID
    const secretKey = process.env.GOCARDLESS_SECRET_KEY
    const baseUrl = process.env.GOCARDLESS_BASE_URL

    if (!secretId || !secretKey) {
      throw new Error(
        "GoCardless credentials not configured. Please set GOCARDLESS_SECRET_ID and GOCARDLESS_SECRET_KEY environment variables.",
      )
    }

    goCardlessClient = new GoCardlessClient({
      secretId,
      secretKey,
      baseUrl: baseUrl || "https://bankaccountdata.gocardless.com",
    })
  }
  return goCardlessClient
}
