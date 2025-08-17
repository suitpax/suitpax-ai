import type { DuffelService, HasServiceInput } from "./hasService"

/**
 * Returns true if there is at least one seat-related service available.
 * It detects by service.type containing the substring "seat" and checks
 * .available (boolean | number) or .remaining > 0.
 */
export function hasAvailableSeatService(servicesOrOffer: HasServiceInput): boolean {
  if (!servicesOrOffer) return false

  const services: DuffelService[] = Array.isArray(servicesOrOffer)
    ? servicesOrOffer
    : servicesOrOffer.available_services || []

  for (const service of services) {
    const t = String(service?.type || "").toLowerCase()
    if (!t || !t.includes("seat")) continue

    const available = service.available
    const remaining = service.remaining

    if (typeof available === "boolean" && available) return true
    if (typeof available === "number" && available > 0) return true
    if (typeof remaining === "number" && remaining > 0) return true
  }

  return false
}