"use client"

import Image from "next/image"
import { useState } from "react"
import { PromptInput, PromptInputAction, PromptInputActions, PromptInputTextarea } from "@/components/prompt-kit/prompt-input"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"

const flights = [
  {
    route: "Madrid (MAD) → Paris (CDG)",
    airline: "Air France",
    logo: "/logos/air-france.png",
    image: "/images/urban-life-in-motion.jpeg",
    time: "2h 05m",
    price: "€180",
  },
  {
    route: "Berlin (BER) → London (LHR)",
    airline: "British Airways",
    logo: "/logos/british-airways.png",
    image: "/images/urban-life-in-motion-new.png",
    time: "1h 55m",
    price: "€220",
  },
  {
    route: "Milan (MXP) → Amsterdam (AMS)",
    airline: "KLM",
    logo: "/logos/klm.png",
    image: "/images/woman-in-motion-with-train.jpeg",
    time: "2h 10m",
    price: "€190",
  },
]

export default function AIFlightSection() {
  const [input, setInput] = useState("")

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
            <span className="text-[10px] font-medium text-gray-700">Suitpax AI</span>
            <span className="text-[10px] text-gray-500">Flights</span>
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl font-medium tracking-tighter text-gray-900">Minimal flight booking</h2>
          <p className="mt-2 text-sm text-gray-600 font-medium">Ask Suitpax AI to find and book the best European routes for your team.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <PromptInput value={input} onValueChange={setInput} onSubmit={() => {}}>
            <PromptInputTextarea placeholder="Find a direct flight from Madrid to Paris next Tuesday…" />
            <PromptInputActions className="justify-end pt-2">
              <PromptInputAction tooltip="Send">
                <Button size="icon" className="h-9 w-9 rounded-full bg-black text-white hover:bg-gray-800" onClick={() => {}}>
                  <ArrowUp className="size-5" />
                </Button>
              </PromptInputAction>
            </PromptInputActions>
          </PromptInput>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 max-w-6xl mx-auto">
          {flights.map((f, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 bg-white/60 backdrop-blur-md overflow-hidden shadow-sm">
              <div className="relative h-32">
                <Image src={f.image} alt={f.route} fill className="object-cover" />
                <div className="absolute inset-0 bg-white/40" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-gray-900">{f.route}</div>
                  <div className="inline-flex items-center gap-2">
                    <span className="text-xs text-gray-700">{f.airline}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{f.time}</span>
                  <span className="font-medium text-gray-900">{f.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}