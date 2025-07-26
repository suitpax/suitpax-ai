import Hero from "@/components/marketing/hero"
import PartnersShowcase from "@/components/partners-showcase"
import AITravelAgents from "@/components/marketing/ai-travel-agents"
import BusinessTravelRevolution from "@/components/marketing/business-travel-revolution"
import FoundersOpenLetter from "@/components/marketing/founders-open-letter"
import CloudAIShowcase from "@/components/marketing/cloud-ai-showcase"
import AIMeetingsAttachment from "@/components/marketing/ai-meetings-attachment"
import AgenticDisruption from "@/components/marketing/agentic-disruption"
import AIVoiceAssistant from "@/components/marketing/ai-voice-assistant"
import type { Metadata } from "next"
import MCPFlightsAIAgents from "@/components/marketing/mcp-flights-ai-agents"

export const metadata: Metadata = {
  title: "Suitpax | AI-Powered Business Travel Platform",
  description:
    "Suitpax is an AI-powered business travel platform that simplifies booking, expense management, and travel policies for modern companies.",
  openGraph: {
    title: "Suitpax | AI-Powered Business Travel Platform",
    description:
      "Suitpax is an AI-powered business travel platform that simplifies booking, expense management, and travel policies for modern companies.",
    url: "https://suitpax.com",
    siteName: "Suitpax",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Suitpax | AI-Powered Business Travel Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Suitpax | AI-Powered Business Travel Platform",
    description:
      "Suitpax is an AI-powered business travel platform that simplifies booking, expense management, and travel policies for modern companies.",
    images: ["/twitter-image.png"],
    creator: "@suitpax",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "verification_token",
  },
  alternates: {
    canonical: "https://suitpax.com",
    languages: {
      "en-US": "https://suitpax.com/en-US",
      "es-ES": "https://suitpax.com/es-ES",
    },
  },
}

export default function Home() {
  return (
    <>
      <main id="main-content" className="w-full">
        <Hero />
        <PartnersShowcase />
        <AITravelAgents />
        <BusinessTravelRevolution />
        <MCPFlightsAIAgents />
        <CloudAIShowcase />
        <AgenticDisruption />
        <AIVoiceAssistant />
        <AIMeetingsAttachment />
        <FoundersOpenLetter />
      </main>
    </>
  )
}
