"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import Header from "@/components/dashboard/header"
import { Toaster } from "react-hot-toast"
import { motion } from "framer-motion"
import { Menu } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import AISearchInput from "@/components/ui/ai-search-input"

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium tracking-tight">Loading your workspace...</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const isActuallyCollapsed = !isMobile && sidebarCollapsed && !sidebarHovered

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
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
        <Sidebar
          onUserUpdate={handleUserUpdate}
          isCollapsed={isActuallyCollapsed && !isMobile}
          isMobile={isMobile}
          onCloseMobile={closeMobileMenu}
          onToggleCollapse={toggleSidebar}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile Header with Menu Button */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between h-16 px-4 bg-white/70 backdrop-blur-sm border-b border-white/20">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100/80 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500/20 transition-colors"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-1 max-w-xs mx-4">
              <AISearchInput size="sm" />
            </div>
            <div className="w-4"></div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <Header
            user={user}
            userPlan={userPlan}
            subscriptionStatus={subscriptionStatus}
            onToggleSidebar={toggleSidebar}
            isMobile={isMobile}
            sidebarCollapsed={sidebarCollapsed}
          />
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
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
    </div>
  )
}
