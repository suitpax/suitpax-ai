export interface Airline {
	id: string
	name?: string
	iata_code?: string
	icao_code?: string
	logo_symbol_url?: string | null
	logo_lockup_url?: string | null
	conditions_of_carriage_url?: string | null
}

export interface ListAirlinesParams {
	limit?: number
	after?: string
	before?: string
	iata_code?: string
	name?: string
}

export interface ListAirlinesResponse {
	data: Airline[]
	meta?: any
}