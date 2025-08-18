"use client"

import AirlinesSlider from "@/components/flights/results/airlines-slider"
import PromptInput from "@/components/prompt-kit/enhanced-prompt-input"

export default function AIAirlinesHero() {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 font-serif">Fly smarter with Suitpax AI</h2>
          <p className="mt-2 text-gray-600 text-base md:text-lg font-normal">Conversational flight booking powered by our AI agents, across leading global airlines.</p>
        </div>
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl">
            <PromptInput placeholder="Ask: Find a return flight Madrid → Paris for next weekend, morning outbound" />
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden">
          <AirlinesSlider />
        </div>
      </div>
    </section>
  )
}

