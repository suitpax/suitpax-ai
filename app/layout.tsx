import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { createClient } from "@/lib/supabase/server"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Suitpax | AI-Powered Business Travel Platform",
    template: "%s | Suitpax",
  },
  description:
    "Suitpax is an AI-powered business travel platform that simplifies booking, expense management, and travel policies for modern companies.",
  keywords: [
    "business travel",
    "AI travel",
    "expense management",
    "corporate travel",
    "travel management",
    "business trips",
    "travel booking",
    "AI agents",
  ],
  authors: [{ name: "Suitpax Team" }],
  creator: "Suitpax",
  publisher: "Suitpax",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://suitpax.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://suitpax.com",
    siteName: "Suitpax",
    title: "Suitpax | AI-Powered Business Travel Platform",
    description:
      "Suitpax is an AI-powered business travel platform that simplifies booking, expense management, and travel policies for modern companies.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Suitpax | AI-Powered Business Travel Platform",
      },
    ],
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  )
}
