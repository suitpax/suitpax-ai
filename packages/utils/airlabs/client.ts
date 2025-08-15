/**
 * AirLabs API Client
 * Provides access to real-time flight data, airport information, and aviation databases
 */

const AIRLABS_API_KEY = "86989372-7e37-4743-b60a-48ba1df29434"
const AIRLABS_BASE_URL = "https://airlabs.co/api/v9"

export interface AirLabsResponse<T> {
  response: T
  error?: {
    code: string
    message: string
  }
}

export interface Flight {
  hex: string
  reg_number: string
  flag: string
  lat: number
  lng: number
  alt: number
  dir: number
  speed: number
  v_speed: number
  squawk: string
  flight_number: string
  flight_icao: string
  flight_iata: string
  dep_icao: string
  dep_iata: string
  arr_icao: string
  arr_iata: string
  airline_icao: string
  airline_iata: string
  aircraft_icao: string
  updated: number
  status: string
}

export interface Airport {
  name: string
  iata_code: string
  icao_code: string
  lat: number
  lng: number
  alt: number
  city: string
  city_code: string
  un_locode: string
  timezone: string
  country_code: string
}

export interface Airline {
  name: string
  iata_code: string
  icao_code: string
  fleet_average_age: number
  fleet_size: number
  callsign: string
  hub_code: string
  country_code: string
  country_name: string
}

export interface FlightSchedule {
  airline_iata: string
  airline_icao: string
  flight_iata: string
  flight_icao: string
  flight_number: string
  dep_iata: string
  dep_icao: string
  dep_terminal: string
  dep_gate: string
  dep_time: string
  dep_time_utc: string
  arr_iata: string
  arr_icao: string
  arr_terminal: string
  arr_gate: string
  arr_time: string
  arr_time_utc: string
  duration: number
  delayed: number
  status: string
  aircraft_icao: string
  arr_baggage: string
}

export class AirLabsClient {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string = AIRLABS_API_KEY) {
    this.apiKey = apiKey
    this.baseUrl = AIRLABS_BASE_URL
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}/${endpoint}`)
    url.searchParams.append("api_key", this.apiKey)

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString())
      }
    })

    try {
      const response = await fetch(url.toString())
      const data = await response.json()

      if (data.error) {
        throw new Error(`AirLabs API Error: ${data.error.message} (${data.error.code})`)
      }

      return data
    } catch (error) {
      console.error("AirLabs API request failed:", error)
      throw error
    }
  }

  // Real-time flights
  async getFlights(
    params: {
      bbox?: string // "lat_min,lng_min,lat_max,lng_max"
      airline_icao?: string
      airline_iata?: string
      flight_icao?: string
      flight_iata?: string
      flight_number?: string
      dep_icao?: string
      dep_iata?: string
      arr_icao?: string
      arr_iata?: string
      aircraft_icao?: string
      flag?: string
      limit?: number
    } = {},
  ): Promise<AirLabsResponse<Flight[]>> {
    return this.makeRequest("flights", params)
  }

  // Airport schedules
  async getSchedules(params: {
    dep_icao?: string
    dep_iata?: string
    arr_icao?: string
    arr_iata?: string
    airline_icao?: string
    airline_iata?: string
    flight_icao?: string
    flight_iata?: string
    flight_number?: string
  }): Promise<AirLabsResponse<FlightSchedule[]>> {
    return this.makeRequest("schedules", params)
  }

  // Flight information
  async getFlightInfo(params: {
    flight_icao?: string
    flight_iata?: string
    flight_number?: string
  }): Promise<AirLabsResponse<any>> {
    return this.makeRequest("flight", params)
  }

  // Airports database
  async getAirports(
    params: {
      iata_code?: string
      icao_code?: string
      country_code?: string
      city_code?: string
      name?: string
    } = {},
  ): Promise<AirLabsResponse<Airport[]>> {
    return this.makeRequest("airports", params)
  }

  // Airlines database
  async getAirlines(
    params: {
      iata_code?: string
      icao_code?: string
      name?: string
      country_code?: string
    } = {},
  ): Promise<AirLabsResponse<Airline[]>> {
    return this.makeRequest("airlines", params)
  }

  // Nearby airports
  async getNearbyAirports(params: {
    lat: number
    lng: number
    distance?: number
  }): Promise<AirLabsResponse<Airport[]>> {
    return this.makeRequest("nearby", params)
  }

  // Name suggestions
  async getSuggestions(params: {
    query: string
  }): Promise<AirLabsResponse<any[]>> {
    return this.makeRequest("suggest", params)
  }

  // Cities database
  async getCities(
    params: {
      city_code?: string
      country_code?: string
      name?: string
    } = {},
  ): Promise<AirLabsResponse<any[]>> {
    return this.makeRequest("cities", params)
  }

  // Countries database
  async getCountries(): Promise<AirLabsResponse<any[]>> {
    return this.makeRequest("countries")
  }

  // Flight delays
  async getDelays(
    params: {
      dep_icao?: string
      dep_iata?: string
      arr_icao?: string
      arr_iata?: string
      airline_icao?: string
      airline_iata?: string
    } = {},
  ): Promise<AirLabsResponse<any[]>> {
    return this.makeRequest("delays", params)
  }

  // Routes database
  async getRoutes(
    params: {
      dep_icao?: string
      dep_iata?: string
      arr_icao?: string
      arr_iata?: string
      airline_icao?: string
      airline_iata?: string
    } = {},
  ): Promise<AirLabsResponse<any[]>> {
    return this.makeRequest("routes", params)
  }

  // Aircraft fleets
  async getFleets(
    params: {
      airline_icao?: string
      airline_iata?: string
      aircraft_icao?: string
    } = {},
  ): Promise<AirLabsResponse<any[]>> {
    return this.makeRequest("fleets", params)
  }
}

export const airLabsClient = new AirLabsClient()
