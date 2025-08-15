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
import FooterBanner from "@/components/dashboard/footer-banner"
import { SUITPAX_VERSION } from "@/lib/version"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"

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
          error,
        } = await supabase.auth.getUser()

        if (error) {
          console.error("Auth error:", error)
          router.push("/auth/login")
          return
        }

        if (!user) {
          router.push("/auth/login")
          return
        }

        setUser(user)

        try {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("subscription_plan, subscription_status, plan")
            .eq("id", user.id)
            .single()

          if (userError) {
            console.warn("User data fetch error:", userError)
            // Continue with defaults if user record doesn't exist yet
            setUserPlan("free")
            setSubscriptionStatus("inactive")
          } else if (userData) {
            setUserPlan(userData.subscription_plan || userData.plan || "free")
            setSubscriptionStatus(userData.subscription_status || "inactive")
          }
        } catch (userFetchError) {
          console.warn("Error fetching user data:", userFetchError)
          // Set defaults and continue
          setUserPlan("free")
          setSubscriptionStatus("inactive")
        }
      } catch (error) {
        console.error("Error in getUser:", error)
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push("/auth/login")
      } else if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user)
        setLoading(false)
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
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-4 sm:p-6 max-w-7xl mx-auto"
        >
          <DashboardSkeleton />
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const isActuallyCollapsed = !isMobile && sidebarCollapsed && !sidebarHovered

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white overflow-hidden">
      {isMobile && mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

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
          userPlan={userPlan}
          subscriptionStatus={subscriptionStatus}
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <div className="lg:hidden">
          <div className="flex items-center justify-between h-14 px-4 bg-white/90 backdrop-blur-sm border-b border-gray-200/80">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900/20 transition-all duration-200 active:scale-95"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="flex-1 max-w-xs mx-3">
              <AISearchInput size="sm" />
            </div>
            <div className="w-2"></div>
          </div>
        </div>

        <div className="hidden lg:block">
          <Header
            user={user as User}
            userPlan={userPlan}
            subscriptionStatus={subscriptionStatus}
            onToggleSidebar={toggleSidebar}
            isMobile={isMobile}
            sidebarCollapsed={sidebarCollapsed}
          />
        </div>

        <main className="flex-1 overflow-y-auto overscroll-y-contain">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="h-full min-h-0"
          >
            <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-6 lg:py-6">{children}</div>
          </motion.div>
        </main>

        <div className="hidden sm:block">
          <FooterBanner version={SUITPAX_VERSION} userName={user?.email?.split("@")[0]} />
        </div>
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
