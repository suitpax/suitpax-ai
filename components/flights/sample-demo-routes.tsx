"use client"

import { useMemo } from "react"
import CityImage from "@/components/flights/ui/city-image"
import CarrierLogo from "@/components/flights/ui/carrier-logo"

type SampleRoute = {
	id: string
	origin: { code: string; city: string }
	destination: { code: string; city: string }
	airline: { name: string; iata?: string }
	cabin?: string
	stops?: number
	duration?: string
	flightNumber?: string
	price?: { amount: number; currency: string }
}

const SAMPLES: SampleRoute[] = [
	{ id: "nyc-lon-ba", origin: { code: "JFK", city: "New York" }, destination: { code: "LHR", city: "London" }, airline: { name: "British Airways", iata: "BA" }, cabin: "Economy", stops: 0, duration: "7h 10m", flightNumber: "BA 178", price: { amount: 689, currency: "USD" } },
	{ id: "nyc-lon-vs", origin: { code: "JFK", city: "New York" }, destination: { code: "LHR", city: "London" }, airline: { name: "Virgin Atlantic", iata: "VS" }, cabin: "Premium", stops: 0, duration: "6h 55m", flightNumber: "VS 4", price: { amount: 842, currency: "USD" } },
	{ id: "nyc-lon-aa", origin: { code: "JFK", city: "New York" }, destination: { code: "LHR", city: "London" }, airline: { name: "American Airlines", iata: "AA" }, cabin: "Business", stops: 0, duration: "6h 50m", flightNumber: "AA 100", price: { amount: 2140, currency: "USD" } },
	{ id: "rom-mad-ib", origin: { code: "FCO", city: "Rome" }, destination: { code: "MAD", city: "Madrid" }, airline: { name: "Iberia", iata: "IB" }, cabin: "Economy", stops: 0, duration: "2h 30m", flightNumber: "IB 3239", price: { amount: 129, currency: "EUR" } },
	{ id: "rom-mad-az", origin: { code: "FCO", city: "Rome" }, destination: { code: "MAD", city: "Madrid" }, airline: { name: "ITA Airways", iata: "AZ" }, cabin: "Economy", stops: 1, duration: "4h 15m", flightNumber: "AZ 58", price: { amount: 149, currency: "EUR" } },
	{ id: "par-ams-af", origin: { code: "CDG", city: "Paris" }, destination: { code: "AMS", city: "Amsterdam" }, airline: { name: "Air France", iata: "AF" }, cabin: "Economy", stops: 0, duration: "1h 15m", flightNumber: "AF 1340", price: { amount: 89, currency: "EUR" } },
	{ id: "ber-lis-lh", origin: { code: "BER", city: "Berlin" }, destination: { code: "LIS", city: "Lisbon" }, airline: { name: "Lufthansa", iata: "LH" }, cabin: "Economy", stops: 1, duration: "4h 05m", flightNumber: "LH 173", price: { amount: 139, currency: "EUR" } },
	{ id: "sfo-tyo-nh", origin: { code: "SFO", city: "San Francisco" }, destination: { code: "HND", city: "Tokyo" }, airline: { name: "ANA", iata: "NH" }, cabin: "Premium", stops: 0, duration: "10h 45m", flightNumber: "NH 107", price: { amount: 1180, currency: "USD" } },
	{ id: "lax-syd-qf", origin: { code: "LAX", city: "Los Angeles" }, destination: { code: "SYD", city: "Sydney" }, airline: { name: "Qantas", iata: "QF" }, cabin: "Economy", stops: 0, duration: "14h 50m", flightNumber: "QF 12", price: { amount: 1299, currency: "USD" } },
	{ id: "dub-sin-sq", origin: { code: "DXB", city: "Dubai" }, destination: { code: "SIN", city: "Singapore" }, airline: { name: "Singapore Airlines", iata: "SQ" }, cabin: "Business", stops: 0, duration: "7h 35m", flightNumber: "SQ 495", price: { amount: 2240, currency: "USD" } },
	{ id: "yyz-lhr-ac", origin: { code: "YYZ", city: "Toronto" }, destination: { code: "LHR", city: "London" }, airline: { name: "Air Canada", iata: "AC" }, cabin: "Economy", stops: 0, duration: "6h 45m", flightNumber: "AC 848", price: { amount: 740, currency: "CAD" } },
]

function formatPrice(amount?: number, currency?: string) {
	if (amount == null || !currency) return ""
	try {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency,
			maximumFractionDigits: 0,
		}).format(amount)
	} catch {
		return `${amount} ${currency}`
	}
}

export default function SampleDemoRoutes() {
	const picks = useMemo(() => {
		const items = [...SAMPLES]
		for (let i = items.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[items[i], items[j]] = [items[j], items[i]]
		}
		return items.slice(0, 3)
	}, [])

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{picks.map((r: any) => (
				<div key={r.id} className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
					<div className="p-3 pb-0 flex items-center justify-between gap-3">
						<div className="flex items-center gap-2 min-w-0">
							<CarrierLogo iata={r.airline.iata} name={r.airline.name} className="h-5 w-5" width={18} height={18} />
							<div className="truncate">
								<div className="text-sm font-medium text-gray-900 truncate">{r.airline.name}</div>
								<div className="text-[11px] text-gray-500">{r.origin.code} → {r.destination.code}</div>
							</div>
						</div>
						{r.price && (
							<div className="text-sm font-semibold text-gray-900">{formatPrice(r.price.amount, r.price.currency)}</div>
						)}
					</div>

					<div className="p-3">
						<div className="relative w-full h-40 rounded-md overflow-hidden border border-gray-200">
							<CityImage city={r.destination.city} sizes="(min-width: 1024px) 33vw, 100vw" />
						</div>

						<div className="mt-3 flex flex-wrap gap-2">
							<span className="inline-flex items-center rounded-2xl border border-gray-300 bg-white px-3 py-1.5 text-[12px] text-gray-800 shadow-sm">
								{r.origin.city} ({r.origin.code}) → {r.destination.city} ({r.destination.code})
							</span>
							{r.duration && (
								<span className="inline-flex items-center rounded-2xl border border-gray-300 bg-white px-3 py-1.5 text-[12px] text-gray-800 shadow-sm">
									{r.stops === 0 ? "Nonstop" : `${r.stops} stop${r.stops! > 1 ? "s" : ""}`} • {r.duration}
								</span>
							)}
							{r.cabin && (
								<span className="inline-flex items-center rounded-2xl border border-gray-300 bg-white px-3 py-1.5 text-[12px] text-gray-800 shadow-sm">
									{r.cabin}
								</span>
							)}
							{r.flightNumber && (
								<span className="inline-flex items-center rounded-2xl border border-gray-300 bg-white px-3 py-1.5 text-[12px] text-gray-800 shadow-sm">
									{r.flightNumber}
								</span>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	)
}