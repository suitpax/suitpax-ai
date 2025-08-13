import { Duffel } from "@duffel/api"
import type { DuffelOffer, DuffelOrder } from "@/lib/duffel/client"

// SDK client singleton
let sdkClient: Duffel | null = null

export function createDuffelClient() {
  if (!sdkClient) {
    const token = process.env.DUFFEL_API_KEY
    if (!token) {
      throw new Error("Duffel API key not configured. Please set DUFFEL_API_KEY environment variable.")
    }
    sdkClient = new Duffel({ token })
  }
  return sdkClient
}

export function handleDuffelError(error: any) {
  console.error("Duffel Error:", error)

  if (error?.name === "DuffelError") {
    return {
      success: false,
      error: error.message,
      status: error.status,
      details: error.details,
    }
  }

  return {
    success: false,
    error: "An unexpected error occurred",
    status: 500,
  }
}

export async function getAirportData(query: string) {
  try {
    const response = await fetch(`/api/flights/airports?q=${encodeURIComponent(query)}`)
    const data = await response.json()
    return data.airports || []
  } catch (error) {
    console.error("Airport data error:", error)
    return []
  }
}

export function verifyWebhookSignature(payload: string, signature?: string | null): boolean {
  const secret = process.env.DUFFEL_WEBHOOK_SECRET
  if (!secret || !signature) return false
  try {
    // Duffel signs as HMAC-SHA256 of payload using secret
    const h = require("crypto").createHmac("sha256", secret)
    h.update(payload, "utf8")
    const expected = h.digest("hex")
    return expected === signature
  } catch {
    return false
  }
}

export function mapDuffelStatus(status: string): string {
  const statusMap: Record<string, string> = {
    live: "confirmed",
    cancelled: "cancelled",
    expired: "expired",
    pending: "pending",
  }

  return statusMap[status] || status
}

// Re-export types for backward compatibility
export type { DuffelOffer, DuffelOrder }
