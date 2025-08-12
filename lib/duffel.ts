import { Duffel } from "@duffel/api"
import { v4 as uuidv4 } from "uuid"
import crypto from "crypto"

// Cache para datos frecuentemente accedidos
const CACHE_TTL = 3600000 // 1 hora en milisegundos
const airlineCache = new Map<string, { data: any; expires: number }>()
const airportCache = new Map<string, { data: any; expires: number }>()
const duffelClientCache = new Map<string, Duffel>()

/**
 * Crea un cliente Duffel estandarizado con caché
 */
export const createDuffelClient = (options?: {
  token?: string
  environment?: "test" | "production"
}) => {
  const isProduction = process.env.NODE_ENV === "production"
  const token = options?.token || process.env.DUFFEL_API_KEY || process.env.DUFFEL_ACCESS_TOKEN
  const envOverride = process.env.DUFFEL_ENVIRONMENT as "test" | "production" | undefined
  const environment = options?.environment || envOverride || (isProduction ? "production" : "test")

  // Usar cliente en caché si existe
  const cacheKey = `${token}-${environment}`
  if (duffelClientCache.has(cacheKey)) {
    return duffelClientCache.get(cacheKey)!
  }

  if (!token) {
    console.warn(`Duffel API key not configured for ${environment} environment`)
    if (process.env.NODE_ENV === "development" && !process.env.CI) {
      throw new Error(`Duffel API key not configured for ${environment} environment`)
    }
    // Return a minimal mock client for build time
    return {
      offerRequests: { create: () => Promise.reject(new Error("Duffel not configured")) },
      offers: { get: () => Promise.reject(new Error("Duffel not configured")) },
      orders: { create: () => Promise.reject(new Error("Duffel not configured")) },
      airlines: { list: () => Promise.reject(new Error("Duffel not configured")) },
      airports: { list: () => Promise.reject(new Error("Duffel not configured")) },
      cities: { list: () => Promise.reject(new Error("Duffel not configured")) },
    } as any
  }

  console.log(`Creating Duffel client for ${environment} environment`)

  const client = new Duffel({
    token,
    apiVersion: "v2",
    userAgent: `Suitpax/1.0.0 (${environment})`,
  } as any)

  // Guardar en caché
  duffelClientCache.set(cacheKey, client)

  return client
}

// ... [Todo tu código existente se mantiene igual] ...

/**
 * Manejo estandarizado de errores de Duffel con más detalle
 */
export const handleDuffelError = (error: any) => {
  console.error("Duffel API Error:", error)

  // Extraer mensaje más detallado si está disponible
  const errorMessage = error.message || (error.errors && error.errors[0]?.message) || "Unknown error"

  // Mapear tipos de errores comunes
  if (errorMessage.includes("authentication") || errorMessage.includes("unauthorized") || error.status === 401) {
    return {
      success: false,
      error: "API authentication failed",
      error_code: "AUTH_FAILED",
      status: 401,
      details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    }
  }

  if (errorMessage.includes("rate limit") || error.status === 429) {
    return {
      success: false,
      error: "Too many requests. Please try again in a moment.",
      error_code: "RATE_LIMIT",
      status: 429,
      details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    }
  }

  if (errorMessage.includes("airport not found")) {
    return {
      success: false,
      error: "Invalid airport codes",
      error_code: "AIRPORT_NOT_FOUND",
      status: 400,
      details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    }
  }

  if (errorMessage.includes("no offers available") || errorMessage.includes("no results found")) {
    return {
      success: true,
      offers: [],
      message: "No flights available for selected dates",
      status: 200,
    }
  }

  if (error.status === 404) {
    return {
      success: false,
      error: "Resource not found",
      error_code: "NOT_FOUND",
      status: 404,
      details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    }
  }

  if (error.status === 422) {
    return {
      success: false,
      error: "Invalid parameters",
      error_code: "INVALID_PARAMS",
      status: 422,
      details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    }
  }

  // Error general
  return {
    success: false,
    error: "Service temporarily unavailable",
    error_code: "SERVICE_ERROR",
    status: error.status || 500,
    details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
  }
}

/**
 * Obtiene el método de pago adecuado según el entorno
 */
export const getPaymentMethod = (currency: string, amount: string) => {
  const isProduction = process.env.NODE_ENV === "production"

  if (isProduction) {
    return {
      type: "arc_bsp_cash",
      currency,
      amount,
    }
  } else {
    return {
      type: "balance",
      currency,
      amount,
    }
  }
}

/**
 * Construye parámetros de paginación estandarizados
 */
export function buildPaginationParams(limit = 50, after?: string, before?: string) {
  const params: any = { limit }
  if (after) params.after = after
  if (before) params.before = before
  return params
}

/**
 * Genera una clave de idempotencia para operaciones seguras
 */
export function generateIdempotencyKey(): string {
  return uuidv4()
}

/**
 * Verifica la firma de webhooks de Duffel con seguridad mejorada
 */
export function verifyWebhookSignature(payload: string, signature?: string | null): boolean {
  if (!signature || !process.env.DUFFEL_WEBHOOK_SECRET) {
    console.warn("Missing signature or webhook secret")
    return false
  }

  try {
    const hmac = crypto.createHmac("sha256", process.env.DUFFEL_WEBHOOK_SECRET)
    hmac.update(payload)
    const calculatedSignature = hmac.digest("hex")

    // Comparación segura para evitar ataques de timing
    return crypto.timingSafeEqual(Buffer.from(calculatedSignature, "hex"), Buffer.from(signature, "hex"))
  } catch (error) {
    console.error("Signature verification error:", error)
    return false
  }
}

/**
 * Mapea estados de Duffel a estados internos de la aplicación
 */
export function mapDuffelStatus(duffelStatus: string): string {
  const statusMap: Record<string, string> = {
    confirmed: "confirmed",
    cancelled: "cancelled",
    draft: "pending",
    pending_payment: "pending_payment",
    hold: "hold",
    awaiting_passenger_information: "awaiting_passenger_info",
    ready_for_ticketing: "ready_for_ticketing",
    ticketed: "ticketed",
    in_process: "in_process",
    voided: "voided",
  }

  return statusMap[duffelStatus] || "unknown"
}

/**
 * Obtiene información de aerolínea con caché inteligente
 */
export async function getAirlineData(duffel: Duffel, iataCode: string | null | undefined) {
  if (!iataCode) return null
  const now = Date.now()
  const cacheKey = `airline-${iataCode}`

  // Verificar caché
  if (airlineCache.has(cacheKey)) {
    const cached = airlineCache.get(cacheKey)!
    if (now < cached.expires) {
      return cached.data
    }
  }

  try {
    const resp = await duffel.airlines.list({ limit: 50 } as any)
    const match = (resp?.data || []).find((a: any) => a.iata_code === iataCode)

    if (match) {
      const airlineData = {
        id: match.id,
        name: match.name,
        iata_code: match.iata_code,
        logo_lockup_url: match.logo_lockup_url,
        logo_symbol_url: match.logo_symbol_url,
        conditions_of_carriage_url: match.conditions_of_carriage_url,
      }

      // Guardar en caché
      airlineCache.set(cacheKey, {
        data: airlineData,
        expires: now + CACHE_TTL,
      })

      return airlineData
    }

    return null
  } catch (error) {
    console.error(`Error fetching airline ${iataCode}:`, error)
    return null
  }
}

/**
 * Obtiene información de aeropuerto con caché inteligente
 */
export async function getAirportData(duffel: Duffel, iataCode: string | null | undefined) {
  if (!iataCode) return null
  const now = Date.now()
  const cacheKey = `airport-${iataCode}`

  // Verificar caché
  if (airportCache.has(cacheKey)) {
    const cached = airportCache.get(cacheKey)!
    if (now < cached.expires) {
      return cached.data
    }
  }

  try {
    const resp = await duffel.airports.list({ limit: 50 } as any)
    const match = (resp?.data || []).find((a: any) => a.iata_code === iataCode)

    if (match) {
      // Guardar en caché
      airportCache.set(cacheKey, {
        data: match,
        expires: now + CACHE_TTL,
      })

      return match
    }

    return null
  } catch (error) {
    console.error(`Error fetching airport ${iataCode}:`, error)
    return null
  }
}

/**
 * Procesa las condiciones de una oferta/orden para mejor visualización
 */
export function processConditions(conditions: any): any {
  if (!conditions) return null

  const processed: any = {
    refundable: conditions.refund_before_departure?.allowed ?? false,
    changeable: conditions.change_before_departure?.allowed ?? false,
    refund_fee: conditions.refund_before_departure?.penalty_amount,
    change_fee: conditions.change_before_departure?.penalty_amount,
    refund_currency: conditions.refund_before_departure?.penalty_currency,
    change_currency: conditions.change_before_departure?.penalty_currency,
    baggage: {
      included_checked_bags: 0,
      included_carry_on_bags: 0,
      details: [],
    },
  }

  // Procesar información de equipaje
  if (conditions.baggages) {
    conditions.baggages.forEach((baggage: any) => {
      if (baggage.type === "checked") {
        processed.baggage.included_checked_bags += baggage.quantity
      }
      if (baggage.type === "carry_on") {
        processed.baggage.included_carry_on_bags += baggage.quantity
      }

      processed.baggage.details.push({
        type: baggage.type,
        quantity: baggage.quantity,
        weight: baggage.weight,
        dimensions: baggage.dimensions,
        passenger_type: baggage.passenger_type || "adult",
      })
    })
  }

  return processed
}

/**
 * Procesa información de escalas para mejor visualización
 */
export function processStops(slices: any[]): any[] {
  return slices.map((slice) => {
    // Calcular número de paradas
    const stopCount = slice.segments.length - 1

    // Extraer aeropuertos de parada
    const stopAirports =
      stopCount > 0 ? slice.segments.slice(0, -1).map((segment: any) => segment.destination.iata_code) : []

    // Determinar si hay conexiones nocturnas
    const hasOvernightConnection =
      stopCount > 0 &&
      slice.segments.some((segment: any, index: number) => {
        if (index < slice.segments.length - 1) {
          const arrivalDate = new Date(segment.arriving_at)
          const departureDate = new Date(slice.segments[index + 1].departing_at)
          return departureDate.getDate() !== arrivalDate.getDate()
        }
        return false
      })

    return {
      ...slice,
      stops: {
        count: stopCount,
        airports: stopAirports,
        has_overnight_connection: hasOvernightConnection,
      },
    }
  })
}

/**
 * Determina si una tarifa es privada y calcula el descuento
 */
export function processPrivateFare(offer: any): any {
  // Determinar si es una tarifa privada
  const isPrivateFare = offer.private_fares?.length > 0

  // Obtener detalles de las tarifas privadas
  const privateFareDetails = isPrivateFare
    ? offer.private_fares.map((fare: any) => ({
        type: fare.type,
        code: fare.code,
        owner_code: fare.owner_code,
        owner_name: fare.owner_name,
      }))
    : []

  // Determinar si se aplicó un programa de fidelidad
  const hasLoyaltyFare = offer.private_fares?.some((fare: any) => fare.type === "loyalty_programme_account")

  // Determinar si se aplicó un código corporativo
  const hasCorporateFare = offer.private_fares?.some((fare: any) => fare.type === "corporate_code")

  // Calcular el descuento en comparación con la tarifa pública (si hay una disponible)
  let discountAmount = null
  let discountPercentage = null

  if (isPrivateFare && offer.public_base_amount && offer.base_amount) {
    discountAmount = Number.parseFloat(offer.public_base_amount) - Number.parseFloat(offer.base_amount)
    discountPercentage = (discountAmount / Number.parseFloat(offer.public_base_amount)) * 100
  }

  return {
    is_private_fare: isPrivateFare,
    private_fare_details: privateFareDetails,
    has_loyalty_fare: hasLoyaltyFare,
    has_corporate_fare: hasCorporateFare,
    discount: {
      amount: discountAmount,
      percentage: discountPercentage ? Number.parseFloat(discountPercentage.toFixed(2)) : null,
      currency: offer.total_currency,
    },
  }
}

/**
 * Enhanced offer validation before booking
 */
export async function validateOfferBeforeBooking(duffel: Duffel, offerId: string) {
  try {
    const offer = await duffel.offers.get(offerId)

    // Check if offer is still valid
    const now = new Date()
    const expiresAt = new Date(offer.data.expires_at)

    if (expiresAt <= now) {
      return {
        valid: false,
        error: "Offer has expired",
        expired: true,
      }
    }

    // Check if price has changed significantly (more than 5%)
    const originalAmount = Number.parseFloat(offer.data.total_amount)

    return {
      valid: true,
      offer: offer.data,
      price_changed: false,
      current_amount: originalAmount,
    }
  } catch (error) {
    console.error("Error validating offer:", error)
    return {
      valid: false,
      error: "Could not validate offer",
      expired: false,
    }
  }
}

/**
 * Enhanced passenger data validation
 */
export function validatePassengerData(passengers: any[]): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  passengers.forEach((passenger, index) => {
    // Validate names
    if (!passenger.given_name || passenger.given_name.length < 2) {
      errors.push(`Passenger ${index + 1}: Given name must be at least 2 characters`)
    }

    if (!passenger.family_name || passenger.family_name.length < 2) {
      errors.push(`Passenger ${index + 1}: Family name must be at least 2 characters`)
    }

    // Validate birth date
    const birthDate = new Date(passenger.born_on)
    const now = new Date()
    const age = now.getFullYear() - birthDate.getFullYear()

    if (age > 120 || age < 0) {
      errors.push(`Passenger ${index + 1}: Invalid birth date`)
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(passenger.email)) {
      errors.push(`Passenger ${index + 1}: Invalid email format`)
    }

    // Validate phone number
    if (!passenger.phone_number || passenger.phone_number.length < 6) {
      errors.push(`Passenger ${index + 1}: Phone number must be at least 6 characters`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Checks if an offer can be held and paid for later
 */
export function canOfferBeHeld(offer: any): boolean {
  return offer.payment_requirements?.requires_instant_payment === false
}

/**
 * Gets payment requirements information from an offer
 */
export function getPaymentRequirements(offer: any) {
  const requirements = offer.payment_requirements || {}

  return {
    requires_instant_payment: requirements.requires_instant_payment ?? true,
    price_guarantee_expires_at: requirements.price_guarantee_expires_at || null,
    payment_required_by: requirements.payment_required_by || null,
    has_price_guarantee: !!requirements.price_guarantee_expires_at,
  }
}

/**
 * Creates a hold order (without payment)
 */
export async function createHoldOrder(
  duffel: Duffel,
  offerId: string,
  passengers: any[],
  metadata?: Record<string, any>,
) {
  try {
    // First validate the offer can be held
    const offer = await duffel.offers.get(offerId)

    if (!canOfferBeHeld(offer.data)) {
      throw new Error("This offer requires instant payment and cannot be held")
    }

    // Create hold order without payments
    const order = await duffel.orders.create({
      type: "hold",
      selected_offers: [offerId],
      passengers: passengers.map((p, idx) => ({
        id: `pas_${idx + 1}`,
        type: "adult",
        title: p.title,
        given_name: p.given_name,
        family_name: p.family_name,
        gender: p.gender,
        born_on: p.born_on,
        phone_number: p.phone_number,
        email: p.email,
      })),
      metadata: {
        ...metadata,
        order_type: "hold",
        created_at: new Date().toISOString(),
      },
    } as any)

    return {
      success: true,
      order: order.data,
      payment_status: order.data.payment_status,
    }
  } catch (error) {
    console.error("Error creating hold order:", error)
    return {
      success: false,
      error: error.message || "Failed to create hold order",
    }
  }
}

/**
 * Pays for a hold order
 */
export async function payHoldOrder(duffel: Duffel, orderId: string, paymentAmount: string, paymentCurrency: string) {
  try {
    // First get the latest order to check current price
    const order = await duffel.orders.get(orderId)

    if (!order.data.payment_status?.awaiting_payment) {
      throw new Error("Order is not awaiting payment")
    }

    // Check if payment is still required
    const paymentRequiredBy = new Date(order.data.payment_status.payment_required_by)
    if (paymentRequiredBy <= new Date()) {
      throw new Error("Payment deadline has passed")
    }

    // Verify the amount matches current price
    if (order.data.total_amount !== paymentAmount) {
      throw new Error("Price has changed. Please refresh and try again.")
    }

    // Create payment
    const payment = await duffel.payments.create({
      order_id: orderId,
      payment: {
        type: "balance",
        amount: paymentAmount,
        currency: paymentCurrency,
      },
    } as any)

    return {
      success: true,
      payment: payment.data,
      order: order.data,
    }
  } catch (error) {
    console.error("Error paying hold order:", error)

    // Handle specific Duffel errors
    if (error.message?.includes("price_changed")) {
      return {
        success: false,
        error: "Price has changed since booking",
        error_code: "PRICE_CHANGED",
      }
    }

    if (error.message?.includes("schedule_changed")) {
      return {
        success: false,
        error: "Flight schedule has changed",
        error_code: "SCHEDULE_CHANGED",
      }
    }

    return {
      success: false,
      error: error.message || "Failed to process payment",
    }
  }
}

/**
 * Gets the current status and pricing of a hold order
 */
export async function getHoldOrderStatus(duffel: Duffel, orderId: string) {
  try {
    const order = await duffel.orders.get(orderId)
    const paymentStatus = order.data.payment_status || {}

    const now = new Date()
    const paymentRequiredBy = paymentStatus.payment_required_by ? new Date(paymentStatus.payment_required_by) : null
    const priceGuaranteeExpiresAt = paymentStatus.price_guarantee_expires_at
      ? new Date(paymentStatus.price_guarantee_expires_at)
      : null

    return {
      success: true,
      order: order.data,
      status: {
        awaiting_payment: paymentStatus.awaiting_payment ?? false,
        payment_required_by: paymentRequiredBy,
        price_guarantee_expires_at: priceGuaranteeExpiresAt,
        payment_expired: paymentRequiredBy ? paymentRequiredBy <= now : false,
        price_guarantee_expired: priceGuaranteeExpiresAt ? priceGuaranteeExpiresAt <= now : false,
        time_remaining: paymentRequiredBy ? Math.max(0, paymentRequiredBy.getTime() - now.getTime()) : 0,
      },
    }
  } catch (error) {
    console.error("Error getting hold order status:", error)
    return {
      success: false,
      error: error.message || "Failed to get order status",
    }
  }
}

// Interfaces mejoradas
export interface FlightSearchParams {
  origin: string
  destination: string
  departure_date: string
  return_date?: string
  passengers: {
    adults: number
    children?: number
    infants?: number
  }
  cabin_class?: "economy" | "premium_economy" | "business" | "first"
  max_connections?: number
  loyalty_programme_accounts?: Array<{
    airline_iata_code: string
    account_number: string
    account_holder_first_name?: string
    account_holder_last_name?: string
  }>
  corporate_codes?: string[]
}

export interface BookingPassenger {
  given_name: string
  family_name: string
  title: "mr" | "ms" | "mrs" | "miss" | "dr"
  gender: "male" | "female"
  born_on: string
  phone_number: string
  email: string
}

export interface SeatSelection {
  passenger_id: string
  seat_id: string
  segment_id: string
}

export interface BaggageService {
  id: string
  quantity: number
  passenger_id?: string
  segment_id?: string
}

// ✅ SOLUCIÓN: Eliminar instancia por defecto para evitar creación en build time
// Antes había una exportación de instancia por defecto que causaba errores si faltaba DUFFEL_API_KEY
// export const duffel = createDuffelClient();
// export default duffel;
