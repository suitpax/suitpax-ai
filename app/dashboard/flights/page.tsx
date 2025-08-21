"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import FlightSearchForm from "@/components/flights/flight-search-form"
import { FullscreenOverlay } from "@/components/prompt-kit/loader"

const FlightResults = dynamic(() => import("@/components/flights/results/results-list"), { ssr: false })
const AirlinesSlider = dynamic(() => import("@/components/flights/results/airlines-slider"), { ssr: false })

export default function FlightsPage() {
  const router = useRouter()
  const [offers, setOffers] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const searchAnchorRef = useRef<HTMLDivElement>(null)

  // Autosearch from query params (origin, destination, date, return, cabin)
  useEffect(() => {
    const url = new URL(window.location.href)
    const origin = url.searchParams.get("origin")
    const destination = url.searchParams.get("destination")
    const departure_date = url.searchParams.get("date")
    const return_date = url.searchParams.get("return") || undefined
    const cabin_class = url.searchParams.get("cabin") || undefined
    const autosearch = url.searchParams.get("autosearch") === "1"
    if (autosearch && origin && destination && departure_date) {
      ;(async () => {
        setSearching(true)
        try {
          const res = await fetch("/api/flights/duffel/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ origin, destination, departure_date, return_date, cabin_class }),
          })
          const json = await res.json()
          const data = Array.isArray(json?.data) ? json.data : json?.offers || []
          setOffers(data)
        } catch {}
        finally { setSearching(false) }
      })()
    }
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col items-center text-center gap-3">
        <div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tighter">Flights</h1>
          <p className="text-sm text-gray-600 mt-1">Find the best routes, fares and schedules — compare in seconds.</p>
        </div>

        {/* Stacked CTAs (mobile-first) */}
        <div className="flex flex-col w-full max-w-sm md:max-w-none md:flex-row items-stretch md:items-center gap-2">
          <Button className="w-full md:w-auto rounded-full md:rounded-2xl px-6 h-10 bg-gray-100 text-gray-900 border border-gray-900/50 hover:bg-white">
            Try Suitpax AI
          </Button>
          <Button
            id="primary-search-btn"
            className="w-full md:w-auto rounded-full md:rounded-2xl px-8 h-10 bg-black text-white hover:bg-gray-900"
            onClick={() => searchAnchorRef.current?.scrollIntoView({ behavior: "smooth" })}
          >
            Search flights
          </Button>
        </div>
      </div>

      <AirlinesSlider className="mt-2" />

      {/* Search */}
      <div ref={searchAnchorRef} />
      <FlightSearchForm
        className="max-w-4xl mx-auto"
        onResults={(res: any) => {
          setSearching(true)
          const data = Array.isArray(res?.data) ? res.data : res?.offers || []
          setOffers(data)
          setSearching(false)
        }}
      />

      <FlightResults offers={offers} />

      {searching && <FullscreenOverlay label="Searching flights…" />}
    </div>
  )
}

