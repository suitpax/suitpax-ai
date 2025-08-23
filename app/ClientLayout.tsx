"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Navigation from "@/components/marketing/navigation"
import Footer from "@/components/marketing/footer"
import IntercomProvider from "@/components/intercom/intercom-provider"
import AppErrorBoundary from "@/components/error-boundary"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"
import BreadcrumbsJsonLd from "@/components/seo/BreadcrumbsJsonLd"

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
    "/password",
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
      <BreadcrumbsJsonLd />
    </>
  )
}

// Removed html/head/body tags - these should only be in the server component
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppErrorBoundary>
      <Suspense
        fallback={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        }
      >
        <LayoutContent>{children}</LayoutContent>
        <IntercomProvider />
        {/* Toast provider removed; custom inline toasts are used via showToast helper */}
        <Analytics />
        <SpeedInsights />
      </Suspense>
    </AppErrorBoundary>
  )
}
