import type React from "react"
import { Inter } from "next/font/google"
import Navigation from "@/components/marketing/navigation"
import Footer from "@/components/marketing/footer"
// Mantenemos el archivo pero comentamos la importación
// import SplashScreen from "@/components/splash-screen"
import type { Metadata } from "next"
import "./globals.css"
import IntercomProvider from "@/components/intercom/intercom-provider"

const inter = Inter({ subsets: ["latin"] })

// Actualizar la descripción en el metadata para enfatizar AI travel agents y superpowers
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
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="application-name" content="Suitpax" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Suitpax | The next-gen AI traveltech" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={inter.className}>
        {/* Quitamos el componente SplashScreen */}
        {/* <SplashScreen /> */}
        <Navigation />
        <main className="overflow-hidden w-full">{children}</main>
        <Footer />
        <IntercomProvider />
      </body>
    </html>
  )
}
