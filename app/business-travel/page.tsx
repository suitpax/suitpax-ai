import type { Metadata } from "next"
import AIAirlinesHero from "@/components/flights/ai-airlines-hero"
import BusinessOpsSuite from "@/components/marketing/business-ops-suite"
import CorporateTravelStack from "@/components/marketing/corporate-travel-stack"
import BusinessTravelRevolution from "@/components/marketing/business-travel-revolution"
import AITravelAgents from "@/components/marketing/ai-travel-agents"
import AIFlightSection from "@/components/marketing/ai-flight-section"

export const metadata: Metadata = {
	title: "Business Travel | Suitpax",
	description: "AI-powered business travel: smarter booking, policy compliance, and seamless management.",
}

export default function BusinessTravelPage() {
	return (
		<main className="w-full">
			{/* Hero with airlines slider and prompt */}
			<AIAirlinesHero />

			{/* Quick explanation section */}
			<section className="w-full py-10 bg-white">
				<div className="max-w-4xl mx-auto px-4 text-center">
					<h2 className="text-2xl md:text-3xl font-medium tracking-tighter text-gray-900">Run business travel with AI</h2>
					<p className="mt-2 text-sm md:text-base text-gray-600 font-medium">
						From search to booking to expense, Suitpax connects policies, approvals and analytics in one coherent flow.
						Stop switching tools — talk to an agent, and the work gets done.
					</p>
				</div>
			</section>

			{/* Agents and capabilities */}
			<AITravelAgents />

			{/* Minimal flight booking examples */}
			<AIFlightSection />

			{/* Ops suite and corporate stack */}
			<BusinessOpsSuite />
			<CorporateTravelStack />

			{/* Manifesto-style showcase tailored to travel */}
			<BusinessTravelRevolution />
		</main>
	)
}

