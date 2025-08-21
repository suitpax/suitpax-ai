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

