"use client"

import { useEffect, useState } from "react"
import AirlinesSlider from "@/components/ui/airlines-slider"
import TripsBooking from "@/components/flights/trips-booking"
import { PromptInput, PromptInputTextarea } from "@/components/prompt-kit/prompt-input"

export default function AIAirlinesHero() {
  const [query, setQuery] = useState("")
  const placeholders = [
    "Ask: MAD → LHR next Friday morning, return Sunday",
    "Find: BCN → CDG under €150 with cabin bags",
    "Search: LIS → AMS direct, depart 7-9am",
    "Book: LHR → JFK business, flexible dates",
    "Search flights with Suitpax AI in seconds",
    "Ask Suitpax AI to plan your next business trip",
  ]
  const [phIndex, setPhIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setPhIndex((i) => (i + 1) % placeholders.length), 3000)
    return () => clearInterval(id)
  }, [])
  const handleSubmit = () => {
    // no-op on public hero; could navigate to flights with prefilled params
  }
  return (
    <section className="w-full py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-gray-900 font-serif">Fly smarter with Suitpax AI</h2>
          <p className="mt-2 text-gray-600 text-base md:text-lg font-normal">Conversational flight booking powered by our AI agents, across leading global airlines.</p>
        </div>
        <div className="flex justify-center mb-4">
          <TripsBooking />
        </div>
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl">
            <PromptInput value={query} onValueChange={setQuery} onSubmit={handleSubmit}>
              <PromptInputTextarea placeholder={placeholders[phIndex]} />
            </PromptInput>
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden">
          <AirlinesSlider />
        </div>
      </div>
    </section>
  )
}