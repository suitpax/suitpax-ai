import type { Metadata } from "next"
import Plans from "@/components/marketing/plans"
import ComparePlans from "@/components/marketing/compare-plans"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Pricing & Plans | Suitpax - AI-powered Business Travel Management",
  description:
    "Choose the right plan for your business travel needs. From startups to enterprises, we have flexible pricing options that fit your team size and travel requirements.",
  keywords:
    "business travel pricing, corporate travel plans, Suitpax pricing, AI travel management cost, travel management subscription, business travel platform",
  openGraph: {
    title: "Pricing & Plans | Suitpax - AI-powered Business Travel Management",
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
  twitter: {
    card: "summary_large_image",
    title: "Pricing & Plans | Suitpax - AI-powered Business Travel Management",
    description:
      "Choose the right plan for your business travel needs. From startups to enterprises, we have flexible pricing options that fit your team size and travel requirements.",
    images: ["/twitter-image.png"],
  },
  alternates: {
    canonical: "https://suitpax.com/pricing",
  },
}

export default function PricingPage() {
  return (
    <>
      <Script
        id="pricing-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Pricing & Plans | Suitpax",
            description:
              "Choose the right plan for your business travel needs. From startups to enterprises, we have flexible pricing options that fit your team size and travel requirements.",
            url: "https://suitpax.com/pricing",
            mainEntity: {
              "@type": "PriceSpecification",
              name: "Suitpax Business Travel Management Plans",
              description: "Flexible pricing plans for businesses of all sizes",
              priceCurrency: "USD",
            },
          }),
        }}
      />
      
      <main className="flex min-h-screen flex-col">
        {/* Hero Section neutro */}
        <section className="relative overflow-hidden bg-white">
          <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Simple, transparent pricing
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Choose the perfect plan for your business travel needs. No hidden fees,
                no surprises—just powerful AI-driven travel management that scales with you.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Plans Section */}
        <section aria-labelledby="pricing-plans-heading" className="relative bg-white">
          <h2 id="pricing-plans-heading" className="sr-only">
            Suitpax Pricing Plans
          </h2>
          <Plans />
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
