import type { Metadata } from "next"
import Plans from "@/components/marketing/plans"
import ComparePlans from "@/components/marketing/compare-plans"
import Script from "next/script"

// Dynamic titles and subtitles (moved from Plans)
const titleVariations = [
	"Business travel plans for every team size.",
	"AI-powered travel management for modern businesses.",
	"Flexible plans for your business travel needs.",
	"Scale your travel operations effortlessly.",
	"Travel management that grows with your business.",
	"Simple pricing for powerful travel tools.",
	"Choose the right plan for your business.",
	"Transparent pricing, exceptional value.",
	"Plans designed for modern business travel.",
	"Pricing that scales with your success.",
]

const subtitles = [
	"Choose the plan that fits your business travel requirements and team size",
	"Transparent pricing with no hidden fees, designed for business travel",
	"Powerful AI travel agents with plans that scale as your team grows",
	"Enterprise-grade travel management at startup-friendly prices",
]

export const metadata: Metadata = {
  title: "Suitpax",
  description:
    "Choose the right plan for your business travel needs. From startups to enterprises, we have flexible pricing options that fit your team size and travel requirements.",
  openGraph: {
    title: "Suitpax",
    description:
      "Choose the right plan for your business travel needs. From startups to enterprises, we have flexible pricing options that fit your team size and travel requirements.",
    url: "https://suitpax.com/pricing",
    siteName: "Suitpax",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Suitpax - Pricing & Plans",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://suitpax.com/pricing",
  },
}

export default function PricingPage() {
	const selectedTitle = titleVariations[Math.floor(Math.random() * titleVariations.length)]
	const selectedSubtitle = subtitles[Math.floor(Math.random() * subtitles.length)]

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Suitpax",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: "https://suitpax.com",
    description:
      "AI-powered business travel platform: conversational booking, policy compliance, expenses, and analytics.",
    offers: [
      { "@type": "Offer", price: 0, priceCurrency: "EUR", name: "Free" },
      { "@type": "Offer", price: 49, priceCurrency: "EUR", name: "Basic", priceSpecification: { "@type": "UnitPriceSpecification", price: 49, priceCurrency: "EUR", unitText: "MONTH" } },
      { "@type": "Offer", price: 89, priceCurrency: "EUR", name: "Pro", priceSpecification: { "@type": "UnitPriceSpecification", price: 89, priceCurrency: "EUR", unitText: "MONTH" } },
    ],
    brand: { "@type": "Brand", name: "Suitpax" },
  }

  return (
    <>
      <Script id="pricing-software-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      
      <main className="flex min-h-screen flex-col pt-14 md:pt-16">
        {/* Badge + dynamic titles (moved here) */}
        <section className="relative overflow-hidden bg-white">
          <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                <span className="text-xs font-medium text-gray-700">Suitpax Pricing</span>
                <span className="text-[10px] text-gray-500">Updated Q2 2025</span>
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tighter text-black sm:text-6xl">{selectedTitle}</h1>
              <p className="mt-3 text-base sm:text-lg font-medium text-gray-600">{selectedSubtitle}</p>
            </div>
          </div>
        </section>

        {/* Pricing Plans Section */}
        <section aria-labelledby="pricing-plans-heading" className="relative bg-white">
          <h2 id="pricing-plans-heading" className="sr-only">
            Suitpax Pricing Plans
          </h2>
          <Plans hideHeader />
          {/* Token footnote */}
          <div className="max-w-5xl mx-auto px-6 pb-8">
            <p className="mt-3 text-[11px] text-gray-600">
              * Tokens represent AI processing capacity across chat, planning, and enrichment tasks. Typical usage: 1 search ≈ 300–600 tokens; itinerary planning ≈ 1.5–3k tokens; voice actions vary. Unused tokens do not roll over. We alert you before limits and never block critical actions.
            </p>
          </div>
        </section>

        {/* Compare Plans Section */}
        <section aria-labelledby="compare-plans-heading" className="bg-gray-50">
          <h2 id="compare-plans-heading" className="sr-only">
            Compare Suitpax Plans
          </h2>
          <ComparePlans />
        </section>
      </main>
    </>
  )
}
