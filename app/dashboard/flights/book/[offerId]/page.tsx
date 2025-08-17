"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"
import PaymentForm from "@/components/flights/booking-flow/payment-form"
import BookingSummary from "@/components/flights/booking-summary"
import Ancillaries from "@/components/flights/booking-flow/ancillaries"
import SeatSelection from "@/components/flights/booking-flow/seat-selection"

export default function BookOfferPage() {
	const params = useParams() as { offerId: string }
	const router = useRouter()
	const offerId = params?.offerId

	const [loading, setLoading] = useState(true)
	const [offer, setOffer] = useState<any>(null)
	const [submitting, setSubmitting] = useState(false)
	const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)

	// Simple passenger form (1 adulto)
	const [givenName, setGivenName] = useState("")
	const [familyName, setFamilyName] = useState("")
	const [email, setEmail] = useState("")
	const [bornOn, setBornOn] = useState("")

	useEffect(() => {
		const run = async () => {
			try {
				if (!offerId) return
				const res = await fetch(`/api/flights/duffel/offers/${offerId}`)
				const json = await res.json()
				if (!res.ok) throw new Error(json?.error || "Failed to load offer")
				const data = json?.data || json
				setOffer(data)
			} catch (e: any) {
				toast.error(e?.message || "Error loading offer")
			} finally {
				setLoading(false)
			}
		}
		run()
	}, [offerId])

	const submitOrder = async () => {
		if (!offer) return
		if (!givenName || !familyName || !email || !bornOn) {
			toast.error("Please complete passenger info")
			return
		}
		setSubmitting(true)
		try {
			const payments = paymentIntentId
				? [{ type: 'card', payment_intent_id: paymentIntentId }]
				: [{ type: 'balance' }]
			const body = {
				selected_offers: [offer.id],
				passengers: [
					{
						type: "adult",
						given_name: givenName,
						family_name: familyName,
						born_on: bornOn,
						email,
					},
				],
				payments,
			}
			const res = await fetch('/api/flights/duffel/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
			const json = await res.json()
			if (!res.ok) throw new Error(json?.error || 'Order failed')
			toast.success('Booking confirmed')
			router.push('/dashboard/trips')
		} catch (e: any) {
			toast.error(e?.message || 'Failed to place order')
		} finally {
			setSubmitting(false)
		}
	}

	if (loading) return <div className="p-6">Loading…</div>
	if (!offer) return <div className="p-6">Offer not found</div>

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Checkout</h1>
				<div className="text-right">
					<div className="text-xl font-semibold">
						{new Intl.NumberFormat('en-US', { style: 'currency', currency: offer.total_currency, maximumFractionDigits: 0 }).format(parseFloat(offer.total_amount))}
					</div>
					<div className="text-xs text-gray-500">Offer ID: {offer.id}</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="md:col-span-2 space-y-4">
					<Card className="border-gray-200">
						<CardHeader>
							<CardTitle>Passenger</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								<div>
									<Label>Given name</Label>
									<Input value={givenName} onChange={e => setGivenName(e.target.value)} className="bg-white text-gray-900" />
								</div>
								<div>
									<Label>Family name</Label>
									<Input value={familyName} onChange={e => setFamilyName(e.target.value)} className="bg-white text-gray-900" />
								</div>
								<div>
									<Label>Email</Label>
									<Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-white text-gray-900" />
								</div>
								<div>
									<Label>Date of birth</Label>
									<Input type="date" value={bornOn} onChange={e => setBornOn(e.target.value)} className="bg-white text-gray-900" />
								</div>
							</div>
						</CardContent>
					</Card>

					<PaymentForm offer={offer} onReady={setPaymentIntentId} />
					<Ancillaries offerId={offer.id} />
					<SeatSelection offerId={offer.id} />
				</div>

				<div className="space-y-4">
					<BookingSummary offer={offer} />
					<Button onClick={submitOrder} disabled={submitting} className="w-full bg-black text-white hover:bg-gray-800 rounded-2xl">
						{submitting ? 'Processing…' : 'Confirm booking'}
					</Button>
				</div>
			</div>

			<Card className="border-gray-200">
				<CardHeader>
					<CardTitle>Itinerary</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 text-sm text-gray-800">
					{offer.slices?.map((s: any, i: number) => (
						<div key={s.id} className="rounded-lg border border-gray-200 p-3">
							<div className="font-medium">Leg {i + 1}: {s.origin?.iata_code} → {s.destination?.iata_code}</div>
							<div className="mt-1 grid gap-2">
								{s.segments?.map((seg: any) => (
									<div key={seg.id} className="flex items-center justify-between text-xs">
										<div>{seg.origin?.iata_code} → {seg.destination?.iata_code}</div>
										<div>{seg.marketing_carrier?.iata_code}{seg.flight_number}</div>
									</div>
								))}
							</div>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	)
}