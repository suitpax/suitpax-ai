"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { isAppDomain } from "@/lib/domain-utils"
import Navigation from "@/components/marketing/navigation"
import Footer from "@/components/marketing/footer"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const [showLayout, setShowLayout] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setShowLayout(!isAppDomain())
  }, [])

  if (!isClient) {
    return <>{children}</>
  }

  if (!showLayout) {
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
