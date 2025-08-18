"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import PassengerForm from "@/components/flights/booking/passenger-form"
import PaymentForm from "@/components/flights/booking/payment-form"
import Ancillaries from "@/components/flights/booking/ancillaries"
import { Input } from "@/components/ui/input"
import ResultCard from "@/components/flights/results/result-card"

export default function BookOfferPage({ params }: { params: { offerId: string } }) {
  const router = useRouter()
  const { offerId } = params
  const [offer, setOffer] = useState<any | null>(null)
  const [step, setStep] = useState<"review" | "passengers" | "documents" | "extras" | "payment">("review")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/flights/duffel/offers/${offerId}`)
        const data = await res.json()
        setOffer(data?.data || data?.offer || null)
      } catch {}
    }
    load()
  }, [offerId])

  if (!offer) return <div className="p-6 text-sm text-gray-600">Loading offer…</div>

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium tracking-tight">Complete your booking</h1>
        <button className="text-sm text-gray-600 hover:text-black" onClick={() => router.back()}>Back</button>
      </div>

      <ResultCard offer={offer} onSelect={() => {}} />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {step === "review" && (
            <div className="space-y-4">
              <button onClick={() => setStep("passengers")} className="w-full h-11 rounded-2xl bg-black text-white hover:bg-gray-900">Continue</button>
            </div>
          )}
          {step === "passengers" && (
            <div className="space-y-4">
              <PassengerForm />
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
                <button onClick={() => setStep("extras")} className="h-11 rounded-2xl bg-black text-white px-5">Next: Extras</button>
              </div>
            </div>
          )}
          {step === "extras" && (
            <div className="space-y-4">
              <Ancillaries />
              <div className="flex justify-end">
                <button onClick={() => setStep("payment")} className="h-11 rounded-2xl bg-black text-white px-5">Next: Payment</button>
              </div>
            </div>
          )}
          {step === "payment" && (
            <div className="space-y-4">
              <PaymentForm />
              <div className="flex justify-end">
                <button className="h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-5">Pay and book</button>
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

