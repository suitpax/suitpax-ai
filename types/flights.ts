export interface Airport {
  id: string
  iata_code: string
  name: string
  city_name: string
  country_name: string
  country_code?: string
  time_zone?: string
  latitude?: number
  longitude?: number
  is_major?: boolean
  search_score?: number
}

export interface Airline {
  id: string
  iata_code: string
  icao_code?: string
  name: string
  logo_lockup_url?: string
  logo_symbol_url?: string
}

export interface Aircraft {
  id: string
  name: string
  iata_code?: string
}

export interface FlightSegment {
  id: string
  origin: {
    iata_code: string
    name: string
    city_name?: string
    time_zone?: string
  }
  destination: {
    iata_code: string
    name: string
    city_name?: string
    time_zone?: string
  }
  departing_at: string
  arriving_at: string
  duration: string
  marketing_carrier: Airline
  operating_carrier?: Airline
  flight_number: string
  aircraft?: Aircraft
}

export interface FlightSlice {
  id: string
  origin: {
    iata_code: string
    name: string
    city_name?: string
  }
  destination: {
    iata_code: string
    name: string
    city_name?: string
  }
  duration: string
  segments: FlightSegment[]
}

export interface FlightPassenger {
  id?: string
  type: 'adult' | 'child' | 'infant_without_seat'
  title?: 'mr' | 'ms' | 'mrs' | 'miss' | 'dr'
  given_name?: string
  family_name?: string
  born_on?: string
  email?: string
  phone_number?: string
  loyalty_programme_accounts?: Array<{
    airline_iata_code: string
    account_number: string
  }>
}

export interface FlightOffer {
  id: string
  total_amount: string
  total_currency: string
  expires_at: string
  owner: Airline
  slices: FlightSlice[]
  passengers: FlightPassenger[]
  conditions?: any
  private_fares?: any[]
}

export interface FlightSearchParams {
  origin: string
  destination: string
  departure_date: string
  return_date?: string
  passengers: {
    adults: number
    children: number
    infants: number
  }
  cabin_class: 'economy' | 'premium_economy' | 'business' | 'first'
  currency?: string
  filters?: {
    max_connections?: number
    airlines?: string[]
    departure_time_window?: [string, string]
    arrival_time_window?: [string, string]
    direct_only?: boolean
  }
  loyalty_programmes?: Array<{ airline_iata_code: string; account_number: string }>
  sort_by?: 'price' | 'duration' | 'relevance'
}

export interface FlightSearchResponse {
  success: boolean
  data?: {
    id: string
    offers: FlightOffer[]
    search_criteria: FlightSearchParams
  }
  error?: string
  cached?: boolean
}

export interface FlightOrder {
  id: string
  booking_reference: string
  status: string
  total_amount: string
  total_currency: string
  passengers: FlightPassenger[]
  slices: FlightSlice[]
  created_at: string
  available_actions?: string[]
}

export interface ApiError {
  success: false
  error: string
  details?: any
  status?: number
}

export interface ApiSuccess<T> {
  success: true
  data: T
  cached?: boolean
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError