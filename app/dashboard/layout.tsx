"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/primitives/sidebar"
import DashboardSidebar from "@/components/dashboard/sidebar/sidebar"
import Header from "@/components/dashboard/header"
import { Toaster } from "react-hot-toast"
import { motion } from "framer-motion"
import { Menu } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import NavMobile from "@/components/dashboard/nav-mobile"
import { DashboardLoadingScreen } from "@/components/ui/loaders"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userPlan, setUserPlan] = useState("free")
  const [subscriptionStatus, setSubscriptionStatus] = useState("inactive")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarHovered, setSidebarHovered] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setSidebarCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        setUser(user)

        // Get user profile and subscription info
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (profileData) {
          setUserPlan(profileData.plan || "free")
          setSubscriptionStatus(profileData.subscription_status || "inactive")
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push("/auth/login")
      } else if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser)
  }

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen)
    } else {
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  if (loading) {
    return <DashboardLoadingScreen />
  }

  if (!user) {
    return null
  }

  const isActuallyCollapsed = !isMobile && sidebarCollapsed && !sidebarHovered

  return (
    <SidebarProvider>
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* Mobile backdrop */}
      {isMobile && mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          ${
            isMobile
              ? `fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
                  mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`
              : `relative transition-all duration-300 ${isActuallyCollapsed ? "w-16" : "w-64"}`
          }
        `}
        onMouseEnter={() => {
          if (!isMobile && sidebarCollapsed) setSidebarHovered(true)
        }}
        onMouseLeave={() => {
          if (!isMobile) setSidebarHovered(false)
        }}
      >
        <DashboardSidebar
          onUserUpdate={handleUserUpdate}
          isCollapsed={isActuallyCollapsed && !isMobile}
          isMobile={isMobile}
          onCloseMobile={closeMobileMenu}
          onToggleCollapse={toggleSidebar}
          userPlan={userPlan}
          subscriptionStatus={subscriptionStatus}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header for all breakpoints */}
        <Header
          user={user}
          userPlan={userPlan}
          subscriptionStatus={subscriptionStatus}
          onToggleSidebar={toggleSidebar}
          isMobile={isMobile}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgba(255, 255, 255, 0.95)",
            color: "#374151",
            border: "1px solid rgba(229, 231, 235, 0.5)",
            borderRadius: "16px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            fontSize: "14px",
            fontWeight: 500,
            backdropFilter: "blur(12px)",
          },
          success: {
            style: {
              background: "rgba(236, 253, 245, 0.95)",
              color: "#065f46",
              border: "1px solid rgba(167, 243, 208, 0.5)",
            },
          },
          error: {
            style: {
              background: "rgba(254, 242, 242, 0.95)",
              color: "#7f1d1d",
              border: "1px solid rgba(254, 202, 202, 0.5)",
            },
          },
        }}
      />

      {/* Mobile bottom navigation */}
      <NavMobile />
    </div>
    </SidebarProvider>
  )
}
