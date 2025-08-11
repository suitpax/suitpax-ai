import type { Metadata } from "next"
import Plans from "@/components/marketing/plans"
import ComparePlans from "@/components/marketing/compare-plans"
import Script from "next/script"
import AirlinesSlider from "@/components/marketing/AirlinesSlider"

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
        <section aria-labelledby="pricing-plans-heading">
          <h1 id="pricing-plans-heading" className="sr-only">
            Suitpax Pricing Plans
          </h1>

          {/* Slider con filtro para logos negros */}
          <div className="my-8">
            <div className="[&_img]:invert [&_img]:grayscale [&_img]:brightness-0 [&_img]:contrast-[1.7]">
              <AirlinesSlider />
            </div>
          </div>

          <Plans />
        </section>

        <section aria-labelledby="compare-plans-heading">
          <h2 id="compare-plans-heading" className="sr-only">
            Compare Suitpax Plans
          </h2>
          <ComparePlans />
        </section>
      </main>
    </>
  )
}