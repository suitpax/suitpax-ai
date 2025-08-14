import type { Metadata } from "next"
import ContactForm from "@/components/marketing/contact-form"
import Navigation from "@/components/marketing/navigation"

export const metadata: Metadata = {
  title: "Contact Us | Suitpax - Transform Your Business Travel",
  description:
    "Get in touch with Suitpax to discover how we can transform your company's travel management with advanced AI solutions.",
  keywords: "contact suitpax, business travel, corporate travel management, AI, travel management",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20">
        <ContactForm />
      </div>
      {/* Footer removed to avoid repetition */}
    </main>
  )
}

export const dynamic = "force-dynamic"
