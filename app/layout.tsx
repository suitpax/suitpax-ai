import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/marketing/navigation"
import { Footer } from "@/components/marketing/footer"
import IntercomProvider from "@/components/intercom/intercom-provider"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "Suitpax - AI-Powered Business Travel Platform",
    template: "%s | Suitpax",
  },
  description:
    "Transform your business travel with AI agents, automated expense management, and intelligent booking. The future of corporate travel is here.",
  keywords: ["business travel", "AI travel", "expense management", "corporate travel", "travel booking"],
  authors: [{ name: "Suitpax Team" }],
  creator: "Suitpax",
  publisher: "Suitpax",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://suitpax.com",
    title: "Suitpax - AI-Powered Business Travel Platform",
    description:
      "Transform your business travel with AI agents, automated expense management, and intelligent booking.",
    siteName: "Suitpax",
    images: [
      {
        url: "/og-image-new.png",
        width: 1200,
        height: 630,
        alt: "Suitpax - AI-Powered Business Travel Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Suitpax - AI-Powered Business Travel Platform",
    description:
      "Transform your business travel with AI agents, automated expense management, and intelligent booking.",
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
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased bg-black`}>
        <Navigation />
        <main className="relative">{children}</main>
        <Footer />
        <IntercomProvider />
      </body>
    </html>
  )
}
