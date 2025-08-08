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

// Componente que controla la visibilidad de Navigation y Footer
function LayoutContent({ children }: { children: React.ReactNode }) {
  // Obtener el pathname del header
  const headersList = headers()
  const pathname = headersList.get("x-url") || ""
  
  // También intentar con otros headers que Next.js puede enviar
  const referer = headersList.get("referer") || ""
  const host = headersList.get("host") || ""
  
  // Extraer pathname de la URL si está disponible
  let currentPath = pathname
  if (!currentPath && referer) {
    try {
      const url = new URL(referer)
      currentPath = url.pathname
    } catch (e) {
      currentPath = ""
    }
  }

  console.log("Headers debug:", {
    pathname: headersList.get("x-url"),
    referer: headersList.get("referer"),
    host: headersList.get("host"),
    allHeaders: Object.fromEntries(headersList.entries())
  })

  // Rutas donde NO queremos mostrar Navigation y Footer
  const excludeNavAndFooter = [
    "/dashboard",
    "/auth/login", 
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth"
  ].some((path) => currentPath.startsWith(path))

  console.log("Current path:", currentPath, "Exclude nav/footer:", excludeNavAndFooter)

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

export const metadata = {
      generator: 'v0.dev'
    };