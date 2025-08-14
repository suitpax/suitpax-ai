"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Navigation from "@/components/marketing/navigation"
import Footer from "@/components/marketing/footer"
import IntercomProvider from "@/components/intercom/intercom-provider"
import AppErrorBoundary from "@/components/error-boundary"
import { Toaster } from "react-hot-toast"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Rutas donde NO queremos mostrar Navigation y Footer
  const excludeNavAndFooter = [
    "/dashboard",
    "/auth/login",
    "/auth/signup",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth",
  ].some((path) => pathname.startsWith(path))

  const isAppSubdomain =
    typeof window !== "undefined" &&
    (window.location.hostname === "app.suitpax.com" || window.location.hostname.startsWith("app."))

  if (excludeNavAndFooter || isAppSubdomain) {
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

// Removed html/head/body tags - these should only be in the server component
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppErrorBoundary>
      <LayoutContent>{children}</LayoutContent>
      <IntercomProvider />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#ffffff",
            color: "#374151",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            boxShadow: "0 10px 20px rgba(0,0,0,0.06)",
            fontSize: "14px",
          },
          success: {
            style: {
              background: "#ecfdf5",
              color: "#065f46",
              border: "1px solid #a7f3d0",
            },
          },
          error: {
            style: {
              background: "#fef2f2",
              color: "#7f1d1d",
              border: "1px solid #fecaca",
            },
          },
        }}
      />
      <Analytics />
      <SpeedInsights />
    </AppErrorBoundary>
  )
}
