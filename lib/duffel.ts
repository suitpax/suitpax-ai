import { getDuffelClient, type DuffelOffer, type DuffelOrder } from "@/lib/duffel/client"

// Legacy compatibility exports
export function createDuffelClient() {
  return getDuffelClient()
}

export function handleDuffelError(error: any) {
  console.error("Duffel Error:", error)

  if (error.name === "DuffelError") {
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

export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  // In production, implement proper webhook signature verification
  // This is a placeholder implementation
  return true
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
