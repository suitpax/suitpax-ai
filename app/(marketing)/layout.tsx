import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import Navigation from "@/components/marketing/navigation"
import Footer from "@/components/marketing/footer"
import { createClient } from "@/lib/supabase/server"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Suitpax | The Future of Business Travel",
  description:
    "AI-powered platform for seamless business travel management. Automate bookings, expenses, and policies with intelligent agents.",
  openGraph: {
    title: "Suitpax | The Future of Business Travel",
    description:
      "AI-powered platform for seamless business travel management. Automate bookings, expenses, and policies with intelligent agents.",
    url: "https://suitpax.com",
    siteName: "Suitpax",
    images: [
      {
        url: "/og-image-new.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Suitpax | The Future of Business Travel",
    description:
      "AI-powered platform for seamless business travel management. Automate bookings, expenses, and policies with intelligent agents.",
    images: ["/twitter-image.png"],
  },
}

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className={`${inter.className} bg-white text-black`}>
      <Navigation user={user} />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  )
}
