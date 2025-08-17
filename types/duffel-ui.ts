export interface TravelDetails {
	origin: string
	destination: string
	departureDate: string
	returnDate?: string
	cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first'
	passengers: {
		adults: number
		children?: number
		infants?: number
	}
	loyaltyProgrammeAccounts?: Array<{ airline_iata_code: string; account_number: string }>
	corporateCodes?: string[]
}

export interface AncillaryItem {
	code: string
	title: string
	description?: string
	price_amount: string
	price_currency: string
	passenger_id?: string
	segment_id?: string
}

export interface DuffelAncillariesProps {
	offerId: string
	ancillaries: AncillaryItem[]
	onSelect: (item: AncillaryItem) => void
	onRemove?: (code: string) => void
	currency?: string
}

export interface CurrencyConversion {
	base_currency: string
	target_currency: string
	rate: number
	updated_at: string
}