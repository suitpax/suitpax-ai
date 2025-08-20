"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import PassengerForm from "@/components/flights/booking/passenger-form"
import PaymentForm from "@/components/flights/booking/payment-form"
import Ancillaries from "@/components/flights/booking/ancillaries"
import SeatSelection from "@/components/flights/booking-flow/seat-selection"
import { Input } from "@/components/ui/input"
import ResultCard from "@/components/flights/results/result-card"

type Step = "review" | "passengers" | "documents" | "seats" | "extras" | "payment"

export default function BookOfferPage({ params }: { params: { offerId: string } }) {
  const router = useRouter()
  const { offerId } = params
  const [offer, setOffer] = useState<any | null>(null)
  const [step, setStep] = useState<Step>("review")
  const [passengers, setPassengers] = useState<any[]>([])
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)
  const [selectedExtras, setSelectedExtras] = useState<Record<string, any>>({})
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/flights/duffel/offers/${offerId}`)
        const data = await res.json()
        setOffer(data?.data || data?.offer || null)
      } catch {}
    }
    load()
    // Restore payment intent after 3DS return
    try {
      const storedOffer = localStorage.getItem('suitpax_payment_offer')
      const storedIntent = localStorage.getItem('suitpax_payment_intent')
      if (storedOffer === offerId && storedIntent) {
        setPaymentIntentId(storedIntent)
        localStorage.removeItem('suitpax_payment_offer')
        localStorage.removeItem('suitpax_payment_intent')
      }
    } catch {}
  }, [offerId])

  if (!offer) return <div className="p-6 text-sm text-gray-600">Loading offer…</div>

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col items-center text-center gap-2">
        <h1 className="text-2xl md:text-3xl font-medium tracking-tighter">Complete your booking</h1>
        <p className="text-sm text-gray-600">Secure checkout, seat selection, and extras — all in one place.</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {['3D Secure', 'PCI-safe', 'Seat maps', 'Extras'].map(x => (
            <span key={x} className="inline-flex items-center rounded-full px-3 py-1 text-xs border border-gray-300 bg-white/70 text-gray-800">{x}</span>
          ))}
        </div>
        <button className="text-xs text-gray-500 hover:text-gray-800" onClick={() => router.back()}>Back</button>
      </div>

      <div className="glass-card rounded-2xl border border-gray-200">
        <ResultCard offer={offer} onSelect={() => {}} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {step === "review" && (
            <div className="space-y-4">
              <button onClick={() => setStep("passengers")} className="w-full h-11 rounded-2xl bg-black text-white hover:bg-gray-900">Continue</button>
            </div>
          )}
          {step === "passengers" && (
            <div className="space-y-4">
              <PassengerForm onSubmit={(p) => { setPassengers(p); setStep("documents") }} />
              <div className="flex justify-end">
                <button onClick={() => setStep("documents")} className="h-11 rounded-2xl bg-black text-white px-5">Next: Documents</button>
              </div>
            </div>
          )}
          {step === "documents" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200 p-4 bg-white/70">
                <div className="text-sm font-medium mb-2">Travel documents</div>
                <p className="text-xs text-gray-600 mb-3">Upload passport/ID if required for destination.</p>
                <Input type="file" accept="image/*,application/pdf" />
              </div>
              <div className="flex justify-end">
                <button onClick={() => setStep("seats")} className="h-11 rounded-2xl bg-black text-white px-5">Next: Seats</button>
              </div>
            </div>
          )}
          {step === "seats" && (
            <div className="space-y-4">
              <SeatSelection offerId={offerId} onSelect={(s) => setSelectedSeat(s.designator)} />
              <div className="flex justify-between">
                <button onClick={() => setStep("documents")} className="h-11 rounded-2xl bg-white border border-gray-300 text-gray-900 px-5">Back</button>
                <button onClick={() => setStep("extras")} className="h-11 rounded-2xl bg-black text-white px-5" disabled={!selectedSeat}>Next: Extras</button>
              </div>
            </div>
          )}
          {step === "extras" && (
            <div className="space-y-4">
              <Ancillaries offerId={offerId} onChange={setSelectedExtras} />
              <div className="flex justify-end">
                <button onClick={() => setStep("payment")} className="h-11 rounded-2xl bg-black text-white px-5">Next: Payment</button>
              </div>
            </div>
          )}
          {step === "payment" && (
            <div className="space-y-4">
              <PaymentForm offer={offer} onReady={setPaymentIntentId} />
              <div className="flex justify-end">
                <button
                  disabled={!paymentIntentId || submitting}
                  onClick={async () => {
                    setSubmitting(true)
                    try {
                      const orderBody: any = {
                        selected_offers: [offer.id],
                        payments: [{ type: 'balance', payment_intent_id: paymentIntentId }],
                        passengers: (passengers.length ? passengers : [{ given_name: 'John', family_name: 'Doe', born_on: '1990-01-01', phone_number: '000', email: 'john@example.com' }]).map((p: any) => ({
                          type: 'adult',
                          given_name: p.given_name,
                          family_name: p.family_name,
                          born_on: p.born_on,
                          phone_number: p.phone_number,
                          email: p.email,
                        })),
                        services: [] as any[],
                      }
                      // Seat service (Duffel expects service with type 'seat' and metadata.designator or seat_id if known)
                      if (selectedSeat) {
                        orderBody.services.push({ type: 'seat', metadata: { designator: selectedSeat } })
                      }
                      // Ancillaries: map by id if present in our selection
                      Object.values(selectedExtras || {}).forEach((a: any) => {
                        if (a?.code) {
                          orderBody.services.push({ type: 'ancillary', id: a.code })
                        }
                      })
                      const res = await fetch('/api/flights/duffel/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderBody) })
                      const json = await res.json()
                      if (!res.ok) throw new Error(json?.error || 'Failed to create order')
                      toast.success('Booking confirmed')
                      router.push('/dashboard/billing')
                    } catch (e: any) {
                      console.error(e)
                      toast.error(e?.message || 'Booking failed')
                    } finally {
                      setSubmitting(false)
                    }
                  }}
                  className="h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-5"
                >
                  {submitting ? 'Processing…' : 'Pay and book'}
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl border border-gray-200 p-4 bg-white/70">
            <div className="text-sm font-medium">Order summary</div>
            <div className="mt-2 text-sm text-gray-700">Total: {new Intl.NumberFormat("en-US", { style: "currency", currency: offer.total_currency }).format(parseFloat(offer.total_amount))}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

