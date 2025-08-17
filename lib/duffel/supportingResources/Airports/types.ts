export interface AirportCity {
	name?: string
	iata_code?: string
}

export interface Airport {
	id: string
	name?: string
	city_name?: string
	city?: AirportCity
	iata_code?: string
	icao_code?: string
	country_name?: string
}

export interface ListAirportsParams {
	limit?: number
	after?: string
	before?: string
	query?: string
	iata_code?: string
	name?: string
}

export interface ListAirportsResponse {
	data: Airport[]
	meta?: any
}