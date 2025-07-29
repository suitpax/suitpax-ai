import dynamic from "next/dynamic"
import Hero from "@/components/marketing/hero"
import PartnersShowcase from "@/components/partners-showcase"
import AITravelAgents from "@/components/marketing/ai-travel-agents"
import BusinessTravelRevolution from "@/components/marketing/business-travel-revolution"
import FlightBookingShowcase from "@/components/marketing/flight-booking-showcase"
import IntegrationsShowcase from "@/components/marketing/integrations-showcase"
import AgenticDisruption from "@/components/marketing/agentic-disruption"
import AIVoiceAssistant from "@/components/marketing/ai-voice-assistant"
import AIMeetingsAttachment from "@/components/marketing/ai-meetings-attachment"
import ContactForm from "@/components/marketing/contact-form"
import FoundersOpenLetter from "@/components/marketing/founders-open-letter"
import Footer from "@/components/marketing/footer"
import Navigation from "@/components/marketing/navigation"
import type { Metadata } from "next"

// Dynamic imports for performance
const SplashScreen = dynamic(() => import("@/components/splash-screen"), {
  ssr: false,
})

const PasswordProtection = dynamic(() => import("@/components/password-protection"), {
  ssr: false,
})

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

export default function HomePage() {
  return (
    <>
      <SplashScreen />
      <PasswordProtection>
        <div className="min-h-screen bg-white">
          <Navigation />
          <main>
            <Hero />
            <PartnersShowcase />
            <AITravelAgents />
            <BusinessTravelRevolution />
            <FlightBookingShowcase />
            <IntegrationsShowcase />
            <AgenticDisruption />
            <AIVoiceAssistant />
            <AIMeetingsAttachment />
            <ContactForm />
            <FoundersOpenLetter />
          </main>
          <Footer />
        </div>
      </PasswordProtection>
    </>
  )
}
