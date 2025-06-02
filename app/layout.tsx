import type React from "react"
import ClientLayout from "./client-layout"
import type { Metadata } from "next"

// Metadata para SEO
export const metadata: Metadata = {
  title: "Suitpax | The next-gen AI traveltech",
  description:
    "AI-powered business travel platform with MCP-enhanced agents. Revolutionizing corporate travel with AI superpowers, intelligent expense management, and seamless booking experiences.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16" },
      { url: "/favicon-32x32.png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://suitpax.com",
    title: "Suitpax | The next-gen AI traveltech",
    description:
      "The all-in-one business travel platform with AI superpowers. MCP-enhanced AI agents, expense management, flights, hotels, and cars—everything in one place. Transforming corporate travel with intelligent automation and contextual understanding.",
    siteName: "Suitpax",
    images: [
      {
        url: "/og-image-new.png",
        width: 1200,
        height: 630,
        alt: "Suitpax - Designed by humans. Powered by AI Agents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Suitpax | The next-gen AI traveltech",
    description:
      "AI travel agents with MCP superpowers. Transforming business travel with intelligent automation, contextual understanding, and seamless expense management. Built for scale, designed for humans.",
    creator: "@suitpax",
    images: ["/og-image-new.png"],
  },
  keywords:
    "AI travel agents, business travel platform, MCP technology, AI superpowers, corporate travel management, expense automation, intelligent booking, contextual AI, travel intelligence, next-gen traveltech",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "none",
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
  return <ClientLayout>{children}</ClientLayout>
}


import './globals.css'