import type { Metadata } from "next"
import ContactForm from "@/components/marketing/contact-form"
import Navigation from "@/components/marketing/navigation"
import Footer from "@/components/marketing/footer"

export const metadata: Metadata = {
  title: "Contacto | Suitpax - Revoluciona tus viajes de negocio",
  description:
    "Ponte en contacto con Suitpax para descubrir cómo podemos transformar la gestión de viajes de tu empresa con IA avanzada.",
  keywords: "contacto suitpax, viajes de negocio, gestión de viajes corporativos, IA, travel management",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20">
        <ContactForm />
      </div>
      <Footer />
    </main>
  )
}
