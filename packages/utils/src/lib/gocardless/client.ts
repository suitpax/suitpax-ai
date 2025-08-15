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

export interface RateLimitInfo {
  accountId: string
  scope: "details" | "balances" | "transactions"
  requestCount: number
  resetTime: number
  dailyLimit: number
}

export class GoCardlessRateLimitError extends Error {
  constructor(
    message: string,
    public accountId: string,
    public scope: string,
    public resetTime: number,
  ) {
    super(message)
    this.name = "GoCardlessRateLimitError"
  }
}

export class GoCardlessClient {
  private config: GoCardlessConfig
  private accessToken: string | null = null
  private tokenExpiry = 0
  private rateLimits = new Map<string, RateLimitInfo>()
  private readonly DAILY_LIMIT = 10 // Current GoCardless limit per scope per account

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

    return this.accessToken || ''
  }

  private checkRateLimit(accountId: string, scope: "details" | "balances" | "transactions"): void {
    const key = `${accountId}-${scope}`
    const now = Date.now()
    const rateLimitInfo = this.rateLimits.get(key)

    if (rateLimitInfo) {
      // Reset counter if it's a new day
      if (now >= rateLimitInfo.resetTime) {
        rateLimitInfo.requestCount = 0
        rateLimitInfo.resetTime = this.getNextResetTime()
      }

      // Check if we've exceeded the limit
      if (rateLimitInfo.requestCount >= this.DAILY_LIMIT) {
        throw new GoCardlessRateLimitError(
          `Rate limit exceeded for account ${accountId} scope ${scope}. Limit resets at ${new Date(rateLimitInfo.resetTime).toISOString()}`,
          accountId,
          scope,
          rateLimitInfo.resetTime,
        )
      }

      // Increment counter
      rateLimitInfo.requestCount++
    } else {
      // Initialize rate limit tracking for this account/scope
      this.rateLimits.set(key, {
        accountId,
        scope,
        requestCount: 1,
        resetTime: this.getNextResetTime(),
        dailyLimit: this.DAILY_LIMIT,
      })
    }
  }

  private getNextResetTime(): number {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    return tomorrow.getTime()
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {},
    accountId?: string,
    scope?: "details" | "balances" | "transactions",
  ) {
    // Check rate limits before making request
    if (accountId && scope) {
      this.checkRateLimit(accountId, scope)
    }

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

    // Handle rate limit responses from GoCardless
    if (response.status === 429) {
      const resetHeader = response.headers.get("HTTP_X_RATELIMIT_ACCOUNT_SUCCESS_RESET")
      const resetTime = resetHeader ? Number.parseInt(resetHeader) * 1000 : Date.now() + 24 * 60 * 60 * 1000

      if (accountId && scope) {
        // Update our local rate limit tracking
        const key = `${accountId}-${scope}`
        const rateLimitInfo = this.rateLimits.get(key)
        if (rateLimitInfo) {
          rateLimitInfo.requestCount = this.DAILY_LIMIT
          rateLimitInfo.resetTime = resetTime
        }

        throw new GoCardlessRateLimitError(
          `Rate limit exceeded for account ${accountId} scope ${scope}. Try again after ${new Date(resetTime).toISOString()}`,
          accountId,
          scope,
          resetTime,
        )
      }
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error("GoCardless API Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url,
        accountId,
        scope,
      })

      // Provide more specific error messages
      if (response.status === 400) {
        throw new Error(`GoCardless API error: Invalid request - ${errorText}`)
      } else if (response.status === 401) {
        throw new Error(`GoCardless API error: Authentication failed - check your credentials`)
      } else if (response.status === 403) {
        throw new Error(`GoCardless API error: Access forbidden - check your permissions`)
      } else if (response.status === 404) {
        throw new Error(`GoCardless API error: Resource not found - ${endpoint}`)
      } else if (response.status >= 500) {
        throw new Error(`GoCardless API error: Server error (${response.status}) - please try again later`)
      }

      throw new Error(`GoCardless API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  public getRateLimitInfo(accountId: string, scope: "details" | "balances" | "transactions"): RateLimitInfo | null {
    const key = `${accountId}-${scope}`
    return this.rateLimits.get(key) || null
  }

  public canMakeRequest(accountId: string, scope: "details" | "balances" | "transactions"): boolean {
    try {
      this.checkRateLimit(accountId, scope)
      // Decrement the counter since we only checked
      const key = `${accountId}-${scope}`
      const rateLimitInfo = this.rateLimits.get(key)
      if (rateLimitInfo) {
        rateLimitInfo.requestCount--
      }
      return true
    } catch (error) {
      return false
    }
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

  async getAccountDetails(accountId: string): Promise<BankAccount> {
    const response = await this.makeRequest(`/api/v2/accounts/${accountId}/details/`, {}, accountId, "details")
    return response.account
  }

  async getAccountBalances(accountId: string): Promise<Balance[]> {
    const response = await this.makeRequest(`/api/v2/accounts/${accountId}/balances/`, {}, accountId, "balances")
    return response.balances
  }

  async getAccountTransactions(accountId: string, dateFrom?: string, dateTo?: string): Promise<Transaction[]> {
    let endpoint = `/api/v2/accounts/${accountId}/transactions/`
    const params = new URLSearchParams()

    if (dateFrom) params.append("date_from", dateFrom)
    if (dateTo) params.append("date_to", dateTo)

    if (params.toString()) {
      endpoint += `?${params.toString()}`
    }

    const response = await this.makeRequest(endpoint, {}, accountId, "transactions")
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
