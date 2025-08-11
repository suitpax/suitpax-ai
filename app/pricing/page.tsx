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
        {/* Hero Section con introducción a pricing */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          
          <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                Simple, transparent{" "}
                <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                  pricing
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Choose the perfect plan for your business travel needs. No hidden fees, 
                no surprises—just powerful AI-driven travel management that scales with you.
              </p>
              

            </div>
          </div>
        </section>

        {/* Pricing Plans Section */}
        <section aria-labelledby="pricing-plans-heading" className="relative bg-white dark:bg-gray-900">
          <h2 id="pricing-plans-heading" className="sr-only">
            Suitpax Pricing Plans
          </h2>
          <Plans />
        </section>

        {/* Compare Plans Section */}
        <section aria-labelledby="compare-plans-heading" className="bg-gray-50 dark:bg-gray-800">
          <h2 id="compare-plans-heading" className="sr-only">
            Compare Suitpax Plans
          </h2>
          <ComparePlans />
        </section>

        {/* Enterprise CTA */}
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-sky-500">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Need a custom solution?
              </h2>
              <p className="mt-6 text-xl leading-8 text-white/90">
                Our enterprise plans include dedicated support and custom integrations.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="/contact"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
                >
                  Contact Sales
                </a>
                <a
                  href="/demo"
                  className="text-sm font-semibold leading-6 text-white hover:text-white/90 transition-colors"
                >
                  Book a demo <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}