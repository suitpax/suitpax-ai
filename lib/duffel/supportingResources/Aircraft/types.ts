export interface Aircraft {
	id: string
	name?: string
	iata_code?: string
	icao_code?: string
	manufacturer?: string
}

export interface ListAircraftParams {
	limit?: number
	after?: string
	before?: string
	query?: string
}

export interface ListAircraftResponse {
	data: Aircraft[]
	meta?: any
}