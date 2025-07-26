"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Navigation from "@/components/marketing/navigation"
import Footer from "@/components/marketing/footer"

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Hide navigation and footer for dashboard, login, and signup pages
  const isDashboard = pathname?.startsWith("/dashboard")
  const isAuth = pathname === "/login" || pathname === "/signup"
  const shouldHideNavAndFooter = isDashboard || isAuth

  if (shouldHideNavAndFooter) {
    return <>{children}</>
  }

  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  )
}
