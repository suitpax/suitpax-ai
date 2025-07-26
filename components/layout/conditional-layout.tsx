"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Navigation from "@/components/marketing/navigation"
import Footer from "@/components/marketing/footer"

const ConditionalLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  // Rutas que deben mostrar pantalla completa (sin navigation/footer)
  const isFullScreenRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/auth")

  if (isFullScreenRoute) {
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

export default ConditionalLayout
