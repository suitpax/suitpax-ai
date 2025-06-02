"use client"

import type React from "react"
import Navigation from "@/components/marketing/navigation"
import Footer from "@/components/marketing/footer"
import PasswordProtection from "@/components/password-protection"
import IntercomProvider from "@/components/intercom/intercom-provider"
import { useState, useEffect } from "react"

// Componente cliente para manejar el estado de autenticación
function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false)

  useEffect(() => {
    // Verificar si ya está desbloqueado en sessionStorage
    const unlocked = sessionStorage.getItem("suitpax-unlocked")
    if (unlocked === "true") {
      setIsUnlocked(true)
    }
  }, [])

  const handleUnlock = () => {
    setIsUnlocked(true)
    sessionStorage.setItem("suitpax-unlocked", "true")
  }

  if (!isUnlocked) {
    return <PasswordProtection onUnlock={handleUnlock} />
  }

  return (
    <>
      <Navigation />
      <main className="overflow-hidden w-full">{children}</main>
      <Footer />
      <IntercomProvider />
    </>
  )
}

export default ClientLayout
