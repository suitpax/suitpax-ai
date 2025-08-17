export type DuffelService = {
  id?: string
  type?: string
  slice_id?: string
  passenger_id?: string
  available?: number | boolean
  remaining?: number
  [extra: string]: any
}

export type HasServiceInput =
  | { available_services?: DuffelService[] | null }
  | DuffelService[]
  | null
  | undefined

/**
 * Returns true if the provided services (or offer.available_services) include a given type.
 * Type comparison is case-insensitive and matches exact type.
 */
export function hasService(servicesOrOffer: HasServiceInput, type: string): boolean {
  if (!servicesOrOffer || !type) return false
  const normalizedType = String(type).toLowerCase()

  const services: DuffelService[] = Array.isArray(servicesOrOffer)
    ? servicesOrOffer
    : servicesOrOffer.available_services || []

  for (const service of services) {
    const serviceType = String(service?.type || "").toLowerCase()
    if (!serviceType) continue
    if (serviceType === normalizedType) return true
  }
  return false
}