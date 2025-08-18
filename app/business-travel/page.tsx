import type { Metadata } from "next"
import AIAirlinesHero from "@/components/flights/ai-airlines-hero"
import BusinessOpsSuite from "@/components/marketing/business-ops-suite"
import CorporateTravelStack from "@/components/marketing/corporate-travel-stack"

export const metadata: Metadata = {
  title: "Business Travel | Suitpax",
  description: "AI-powered business travel: smarter booking, policy compliance, and seamless management.",
}

export default function BusinessTravelPage() {
  return (
    <main className="w-full">
      <AIAirlinesHero />
      <BusinessOpsSuite />
      <CorporateTravelStack />
    </main>
  )
}

