import { createClient } from "@/lib/supabase/server"

export interface DuffelConfig {
  token: string
  environment: "test" | "production"
  apiVersion: string
}

export interface FlightSearchParams {
  origin: string
  destination: string
  departure_date: string
  return_date?: string
  passengers: Array<{
    type: "adult" | "child" | "infant_without_seat"
    age?: number
  }>
  cabin_class?: "economy" | "premium_economy" | "business" | "first"
}

export interface HotelSearchParams {
  location: {
    latitude: number
    longitude: number
    radius: number
  }
  check_in_date: string
  check_out_date: string
  guests: Array<{
    type: "adult" | "child"
    age?: number
  }>
  rooms: number
}

export interface DuffelOffer {
  id: string
  total_amount: string
  total_currency: string
  expires_at: string
  slices: Array<{
    origin: any
    destination: any
    duration: string
    segments: Array<{
      id: string
      origin: any
      destination: any
      departing_at: string
      arriving_at: string
      marketing_carrier: any
      operating_carrier: any
      aircraft: any
      duration: string
    }>
  }>
  passengers: Array<{
    id: string
    type: string
  }>
  conditions: any
}

export interface DuffelOrder {
  id: string
  booking_reference: string
  total_amount: string
  total_currency: string
  created_at: string
  documents: Array<{
    type: string
    url: string
  }>
}

export class DuffelClient {
  private config: DuffelConfig
  private baseUrl: string
  private supabase = createClient()

  constructor(config: DuffelConfig) {
    this.config = config
    this.baseUrl = config.environment === "production" ? "https://api.duffel.com" : "https://api.duffel.com"
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Duffel-Version": this.config.apiVersion,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Duffel API Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url,
      })

      throw new DuffelError(`Duffel API error: ${response.status} ${response.statusText}`, response.status, errorText)
    }

    return response.json()
  }

  // Flight Search
  async searchFlights(params: FlightSearchParams): Promise<{ data: DuffelOffer[] }> {
    const slices = [
      {
        origin: params.origin,
        destination: params.destination,
        departure_date: params.departure_date,
      },
    ]

    if (params.return_date) {
      slices.push({
        origin: params.destination,
        destination: params.origin,
        departure_date: params.return_date,
      })
    }

    const payload = {
      slices,
      passengers: params.passengers,
      cabin_class: params.cabin_class || "economy",
    }

    // Store search in database
    await this.supabase.from("flight_searches").insert({
      search_params: payload,
      created_at: new Date().toISOString(),
    })

    const response = await this.makeRequest("/air/offer_requests", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return response
  }

  // Get Single Offer
  async getOffer(offerId: string): Promise<{ data: DuffelOffer }> {
    return this.makeRequest(`/air/offers/${offerId}`)
  }

  // Create Flight Booking
  async createFlightBooking(
    offerId: string,
    passengers: Array<{
      id: string
      given_name: string
      family_name: string
      title: string
      gender: string
      born_on: string
      phone_number: string
      email: string
    }>,
    paymentAmount: string,
    paymentCurrency: string,
  ): Promise<{ data: DuffelOrder }> {
    const payload = {
      selected_offers: [offerId],
      passengers,
      payments: [
        {
          type: "balance",
          amount: paymentAmount,
          currency: paymentCurrency,
        },
      ],
    }

    const response = await this.makeRequest("/air/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    // Store booking in database
    await this.supabase.from("flight_bookings").insert({
      duffel_order_id: response.data.id,
      booking_reference: response.data.booking_reference,
      total_amount: response.data.total_amount,
      total_currency: response.data.total_currency,
      status: "confirmed",
      created_at: new Date().toISOString(),
    })

    return response
  }

  // Hotel Search
  async searchHotels(params: HotelSearchParams): Promise<{ data: any[] }> {
    const payload = {
      location: params.location,
      check_in_date: params.check_in_date,
      check_out_date: params.check_out_date,
      guests: params.guests,
      rooms: params.rooms,
    }

    // Store search in database
    await this.supabase.from("hotel_searches").insert({
      search_params: payload,
      created_at: new Date().toISOString(),
    })

    const response = await this.makeRequest("/stays/search", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return response
  }

  // Get Hotel Rates
  async getHotelRates(searchResultId: string): Promise<{ data: any }> {
    return this.makeRequest(`/stays/search_results/${searchResultId}/rates`)
  }

  // Create Hotel Quote
  async createHotelQuote(rateId: string): Promise<{ data: any }> {
    const response = await this.makeRequest("/stays/quotes", {
      method: "POST",
      body: JSON.stringify({ rate_id: rateId }),
    })

    return response
  }

  // Create Hotel Booking
  async createHotelBooking(
    quoteId: string,
    guestInfo: {
      given_name: string
      family_name: string
      born_on: string
      phone_number: string
      email: string
    },
    specialRequests?: string,
  ): Promise<{ data: any }> {
    const payload = {
      quote_id: quoteId,
      guests: [guestInfo],
      phone_number: guestInfo.phone_number,
      email: guestInfo.email,
      accommodation_special_requests: specialRequests,
    }

    const response = await this.makeRequest("/stays/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    // Store booking in database
    await this.supabase.from("hotel_bookings").insert({
      duffel_booking_id: response.data.id,
      confirmation_number: response.data.confirmation_number,
      total_amount: response.data.total_amount,
      total_currency: response.data.total_currency,
      status: "confirmed",
      created_at: new Date().toISOString(),
    })

    return response
  }

  // Get Booking Details
  async getFlightBooking(orderId: string): Promise<{ data: DuffelOrder }> {
    return this.makeRequest(`/air/orders/${orderId}`)
  }

  async getHotelBooking(bookingId: string): Promise<{ data: any }> {
    return this.makeRequest(`/stays/bookings/${bookingId}`)
  }
}

export class DuffelError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: string,
  ) {
    super(message)
    this.name = "DuffelError"
  }
}

// Singleton client instance
let duffelClient: DuffelClient | null = null

export function getDuffelClient(): DuffelClient {
  if (!duffelClient) {
    const token = process.env.DUFFEL_API_KEY
    const environment = (process.env.DUFFEL_ENVIRONMENT as "test" | "production") || "test"

    if (!token) {
      throw new Error("Duffel API key not configured. Please set DUFFEL_API_KEY environment variable.")
    }

    duffelClient = new DuffelClient({
      token,
      environment,
      apiVersion: "v2",
    })
  }

  return duffelClient
}
