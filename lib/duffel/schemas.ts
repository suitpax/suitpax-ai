// Duffel API schemas (airlines and aircraft) - simplified TypeScript interfaces

export interface DuffelAirline {
  id: string
  iata_code: string | null
  name: string | null
  logo_symbol_url?: string | null
  logo_lockup_url?: string | null
  conditions_of_carriage_url?: string | null
}

export interface DuffelAircraft {
  id: string
  iata_code: string | null
  name: string | null
}

export interface DuffelListResponse<T> {
  data: T[]
  meta?: { before?: string | null; after?: string | null }
}

export interface DuffelAirport {
  id: string
  name: string | null
  iata_code: string | null
  icao_code?: string | null
  iata_country_code?: string | null
  iata_city_code?: string | null
  city_name?: string | null
  time_zone?: string | null
  latitude?: number | null
  longitude?: number | null
  city?: DuffelCity | null
}

export interface DuffelCity {
  id: string
  name: string | null
  iata_code: string | null
  iata_country_code?: string | null
  airports?: Array<{
    id: string
    name: string | null
    iata_code: string | null
    icao_code?: string | null
    iata_country_code?: string | null
    time_zone?: string | null
    latitude?: number | null
    longitude?: number | null
  }>
}

export interface DuffelLoyaltyProgramme {
  id: string
  name: string | null
  alliance?: string | null
  owner_airline_id?: string | null
  logo_url?: string | null
}

