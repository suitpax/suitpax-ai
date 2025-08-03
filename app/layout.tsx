import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { headers } from "next/headers"
import Navigation from "@/components/marketing/navigation"
import Footer from "@/components/marketing/footer"
import IntercomProvider from "@/components/intercom/intercom-provider"
import AppErrorBoundary from "@/components/error-boundary"
import { Toaster } from "react-hot-toast"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

// 🔧 Componente que controla la visibilidad de Navigation y Footer
function LayoutContent({ children }: { children: React.ReactNode }) {
  const headersList = headers()
  const pathname = headersList.get("x-pathname") || ""

  const excludeNavAndFooter = ["/dashboard", "/auth"].some((path) =>
    pathname.startsWith(path)
  )

  if (excludeNavAndFooter) {
    return <>{children}</>
  }

  return (
    <>
      <Navigation />
      <main className="overflow-hidden w-full">{children}</main>
      <Footer />
    </>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <AppErrorBoundary>
          <LayoutContent>{children}</LayoutContent>
          <IntercomProvider />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
                fontSize: "14px",
                borderRadius: "8px",
              },
              success: {
                style: {
                  background: "#10b981",
                },
              },
              error: {
                style: {
                  background: "#ef4444",
                },
              },
            }}
          />
        </AppErrorBoundary>
      </body>
    </html>
  )
}