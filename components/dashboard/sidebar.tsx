"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  PiSquaresFour,
  PiAirplane,
  PiBuildings,
  PiCreditCard,
  PiUsers,
  PiGear,
  PiChartBar,
  PiCalendar,
  PiMapPin,
  PiChatCircle,
  PiMicrophone,
  PiCaretLeft,
  PiCaretRight,
  PiSignOut,
  PiUser,
  PiOfficeChair,
  PiEnvelope,
  PiVideoCamera,
  PiReceipt,
  PiCrown,
  PiPaperPlaneTilt,
  PiCheckSquare,
  PiShield,
  PiDotsSixVertical,
} from "react-icons/pi"
import { Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { TokenUsageChart } from "@/components/charts/token-usage-chart"
import Image from "next/image"
import { AISidebarManager } from "@/lib/ai-sidebar-manager"

const defaultNavigation = [
  { id: "dashboard", name: "Dashboard", href: "/dashboard", icon: PiSquaresFour },
  { id: "flights", name: "Flights", href: "/dashboard/flights", icon: PiAirplane },
  { id: "hotels", name: "Hotels", href: "/dashboard/hotels", icon: PiBuildings },
  { id: "finance", name: "Finance", href: "/dashboard/finance", icon: PiCreditCard },
  { id: "analytics", name: "Analytics", href: "/dashboard/analytics", icon: PiChartBar },
  { id: "calendar", name: "Calendar", href: "/dashboard/calendar", icon: PiCalendar },
  { id: "mail", name: "Mail", href: "/dashboard/mail", icon: PiEnvelope },
  { id: "meetings", name: "Meetings", href: "/dashboard/meetings", icon: PiVideoCamera },
  { id: "locations", name: "Locations", href: "/dashboard/locations", icon: PiMapPin },
  { id: "team", name: "Team", href: "/dashboard/team", icon: PiUsers },
  { id: "expenses", name: "Expenses", href: "/dashboard/expenses", icon: PiReceipt },
  { id: "tasks", name: "Tasks", href: "/dashboard/tasks", icon: PiCheckSquare },
  { id: "policies", name: "Policies", href: "/dashboard/policies", icon: PiShield },
]

const aiNavigation = [
  { name: "Suitpax AI", href: "/dashboard/suitpax-ai", icon: PiChatCircle, badge: "AI" },
  { name: "Voice AI", href: "/dashboard/voice-ai", icon: PiMicrophone, badge: "NEW" },
]

interface SidebarProps {
  onUserUpdate?: (user: SupabaseUser) => void
  isCollapsed: boolean
  isMobile: boolean
  onCloseMobile: () => void
  onToggleCollapse?: () => void
  userPlan: string
  subscriptionStatus: string
}

interface UserProfile {
  full_name?: string
  avatar_url?: string
  company?: string
  job_title?: string
}

export function Sidebar({
  onUserUpdate,
  isCollapsed,
  isMobile,
  onCloseMobile,
  onToggleCollapse,
  userPlan,
  subscriptionStatus,
}: SidebarProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [aiQuery, setAiQuery] = useState("")
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [navigation, setNavigation] = useState(defaultNavigation)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [usageStats, setUsageStats] = useState({
    tokensUsed: 2450,
    maxTokens: userPlan === "premium" ? 100000 : 10000,
  })
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [aiSidebarManager, setAiSidebarManager] = useState<AISidebarManager | null>(null)

  const setIsCollapsed = onToggleCollapse

  useEffect(() => {
    const savedOrder = localStorage.getItem("sidebar-navigation-order")
    if (savedOrder) {
      try {
        const orderIds = JSON.parse(savedOrder)
        const reorderedNav = orderIds
          .map((id: string) => defaultNavigation.find((item) => item.id === id))
          .filter(Boolean)

        // Add any new items that weren't in the saved order
        const existingIds = new Set(orderIds)
        const newItems = defaultNavigation.filter((item) => !existingIds.has(item.id))

        setNavigation([...reorderedNav, ...newItems])
      } catch (error) {
        console.error("Error loading navigation order:", error)
      }
    }
  }, [])

  // Initialize AI sidebar manager when user is available
  useEffect(() => {
    if (user?.id) {
      const manager = new AISidebarManager(user.id)
      setAiSidebarManager(manager)

      // Load stored navigation order or optimize based on usage
      const loadNavigationOrder = async () => {
        const storedOrder = await manager.getStoredNavigationOrder()
        if (storedOrder) {
          const reorderedNav = storedOrder
            .map((id: string) => defaultNavigation.find((item) => item.id === id))
            .filter(Boolean)

          // Add any new items that weren't in the stored order
          const existingIds = new Set(storedOrder)
          const newItems = defaultNavigation.filter((item) => !existingIds.has(item.id))

          setNavigation([...reorderedNav, ...newItems])
        } else {
          // First time user - optimize based on common patterns
          const optimizedNav = await manager.optimizeNavigationForUser(defaultNavigation)
          setNavigation(optimizedNav)
        }
      }

      loadNavigationOrder()
    }
  }, [user])

  // Enhanced save function that also updates AI preferences
  const saveNavigationOrder = async (newNavigation: typeof navigation) => {
    const orderIds = newNavigation.map((item) => item.id)
    localStorage.setItem("sidebar-navigation-order", JSON.stringify(orderIds))

    // Also save to AI system for cross-device sync
    if (aiSidebarManager) {
      await aiSidebarManager.reorderNavigation(orderIds, "User manual reorder via drag & drop")
    }
  }

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()

    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null)
      return
    }

    const draggedIndex = navigation.findIndex((item) => item.id === draggedItem)
    const targetIndex = navigation.findIndex((item) => item.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newNavigation = [...navigation]
    const [draggedItemData] = newNavigation.splice(draggedIndex, 1)
    newNavigation.splice(targetIndex, 0, draggedItemData)

    setNavigation(newNavigation)
    saveNavigationOrder(newNavigation)
    setDraggedItem(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        onUserUpdate?.(user)

        // Get user profile
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, avatar_url, company, job_title")
            .eq("id", user.id)
            .single()

          if (profile) {
            setUserProfile(profile)
          }
        } catch (error) {
          console.error("Error fetching profile:", error)
        }
      }
    }
    getUser()

    // Listen to profile updates to refresh avatar/name
    const handler = (e: Event) => {
      const detail: any = (e as CustomEvent).detail || {}
      setUserProfile((prev) => ({ ...prev, ...detail }))
    }
    if (typeof window !== "undefined") {
      window.addEventListener("profile:updated", handler)
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("profile:updated", handler)
      }
    }
  }, [supabase, onUserUpdate])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/auth/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiQuery.trim() || isAiLoading) return

    setIsAiLoading(true)
    try {
      const response = await fetch("/api/suitpax-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: aiQuery,
          userId: user?.id,
        }),
      })

      const data = await response.json()
      if (data.success) {
        // Navigate to Suitpax AI page with the response
        router.push(`/dashboard/suitpax-ai?query=${encodeURIComponent(aiQuery)}`)
        setAiQuery("")
      }
    } catch (error) {
      console.error("Error sending AI query:", error)
    } finally {
      setIsAiLoading(false)
    }
  }

  const getDisplayName = () => {
    if (!user) return "User"
    return userProfile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
  }

  const getInitials = () => {
    const name = getDisplayName()
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getUserEmail = () => {
    if (!user) return ""
    return user.email || ""
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-md overflow-hidden shadow-sm">
              <Image
                src="/suitpax-bl-logo.webp"
                alt="Suitpax"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">{getDisplayName().split(" ")[0]}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"></div>
                    <div
                      className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Suitpax AI v2.1.0</div>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed?.(!isCollapsed)}
            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-xl"
          >
            {isCollapsed ? <PiCaretRight className="h-4 w-4" /> : <PiCaretLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {(!isCollapsed || isMobile) && (
        <div className="px-4 pt-6 pb-8 border-b border-gray-200">
          <form onSubmit={handleAiSubmit} className="relative">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="Search or ask AI anything..."
              className="w-full px-4 py-2.5 pl-10 pr-12 text-sm bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all placeholder:text-gray-400"
              disabled={isAiLoading}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Sparkles className="h-4 w-4 text-gray-400" />
            </div>
            <Button
              type="submit"
              size="sm"
              variant="ghost"
              disabled={!aiQuery.trim() || isAiLoading}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
            >
              {isAiLoading ? (
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-400 border-t-transparent" />
              ) : (
                <PiPaperPlaneTilt className="h-3 w-3" />
              )}
            </Button>
          </form>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {/* Main Navigation with Drag & Drop */}
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            const isDragging = draggedItem === item.id

            return (
              <div
                key={item.id}
                draggable={!isCollapsed && !isMobile}
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, item.id)}
                onDragEnd={handleDragEnd}
                className={cn("group relative", isDragging && "opacity-50")}
              >
                <Link
                  href={item.href}
                  onClick={isMobile ? onCloseMobile : undefined}
                  className={cn(
                    "flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative",
                    isActive
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                    isCollapsed && !isMobile && "justify-center px-2",
                  )}
                  title={isCollapsed && !isMobile ? item.name : ""}
                >
                  {!isCollapsed && !isMobile && (
                    <PiDotsSixVertical className="h-4 w-4 mr-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing" />
                  )}
                  <item.icon
                    className={cn(
                      "flex-shrink-0 h-5 w-5",
                      isCollapsed && !isMobile ? "mx-auto" : !isCollapsed && !isMobile ? "" : "mr-3",
                    )}
                    aria-hidden="true"
                  />
                  {(!isCollapsed || isMobile) && <span className="ml-1">{item.name}</span>}
                </Link>
              </div>
            )
          })}
        </div>

        {/* AI Section */}
        {(!isCollapsed || isMobile) && (
          <div className="pt-6">
            <div className="space-y-1">
              {aiNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={isMobile ? onCloseMobile : undefined}
                    className={cn(
                      "group flex items-center justify-between px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-gray-200 text-gray-900 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className="flex-shrink-0 h-5 w-5 mr-3" aria-hidden="true" />
                      <span>{item.name}</span>
                    </div>
                    <Badge className="bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 rounded-lg">{item.badge}</Badge>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Collapsed AI icons */}
        {isCollapsed && !isMobile && (
          <div className="pt-6 space-y-1">
            {aiNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-center px-2 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative",
                    isActive
                      ? "bg-gray-200 text-gray-900 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                  )}
                  title={item.name}
                >
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 p-4 flex-shrink-0 space-y-4">
        {(!isCollapsed || isMobile) && (
          <div className="space-y-3">
            <TokenUsageChart used={usageStats.tokensUsed} total={usageStats.maxTokens} plan={userPlan} />
          </div>
        )}

        {/* Quick Actions - Only show when not collapsed */}
        {(!isCollapsed || isMobile) && (
          <div className="space-y-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-xs h-9 rounded-xl border-gray-300 bg-white hover:bg-gray-50"
                >
                  <PiCrown className="h-3 w-3 mr-2" />
                  Plans & Billing
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-medium tracking-tighter">Plans & Billing</DialogTitle>
                  <DialogDescription className="font-light">
                    Manage your subscription and billing information
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Current Plan</span>
                      <Badge className="bg-gray-200 text-gray-700 rounded-lg">{userPlan.toUpperCase()}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 font-light">
                      {userPlan === "premium"
                        ? "Unlimited access to all features"
                        : "Limited access - upgrade for more"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-xl">Upgrade Plan</Button>
                    <Button variant="outline" className="flex-1 rounded-xl bg-transparent">
                      View Billing
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-xs h-9 rounded-xl border-gray-300 bg-white hover:bg-gray-50"
                >
                  <PiGear className="h-3 w-3 mr-2" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-medium tracking-tighter">Settings</DialogTitle>
                  <DialogDescription className="font-light">Quick access to your account settings</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <Link href="/dashboard/profile" onClick={isMobile ? onCloseMobile : undefined}>
                    <Button variant="ghost" className="w-full justify-start rounded-xl">
                      <PiUser className="h-4 w-4 mr-3" />
                      Profile Settings
                    </Button>
                  </Link>
                  <Link href="/dashboard/settings" onClick={isMobile ? onCloseMobile : undefined}>
                    <Button variant="ghost" className="w-full justify-start rounded-xl">
                      <PiGear className="h-4 w-4 mr-3" />
                      Account Settings
                    </Button>
                  </Link>
                  <Link href="/dashboard/company" onClick={isMobile ? onCloseMobile : undefined}>
                    <Button variant="ghost" className="w-full justify-start rounded-xl">
                      <PiOfficeChair className="h-4 w-4 mr-3" />
                      Company Settings
                    </Button>
                  </Link>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* User Profile & Sign Out */}
        {(!isCollapsed || isMobile) && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center space-x-3 px-3 py-3 mb-3 bg-gray-50 rounded-xl border border-gray-200">
              <Avatar className="h-9 w-9 ring-2 ring-gray-200 rounded-md">
                <AvatarImage
                  src={userProfile?.avatar_url || "/placeholder.svg"}
                  alt={getDisplayName()}
                  className="rounded-md"
                />
                <AvatarFallback className="bg-gray-900 text-white text-xs font-medium rounded-md">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{getDisplayName()}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-600 truncate">
                    {userProfile?.company ? userProfile.company : getUserEmail()}
                  </p>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0.5 rounded-lg bg-gray-200 text-gray-700 border-gray-200"
                  >
                    Member
                  </Badge>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full justify-start px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl"
            >
              <PiSignOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        )}

        {/* Collapsed state user profile */}
        {isCollapsed && !isMobile && (
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-center">
              <Avatar className="h-9 w-9 ring-2 ring-gray-200 rounded-md">
                <AvatarImage
                  src={userProfile?.avatar_url || "/placeholder.svg"}
                  alt={getDisplayName()}
                  className="rounded-md"
                />
                <AvatarFallback className="bg-gray-900 text-white text-xs font-medium rounded-md">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </div>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="icon"
              className="w-full h-9 rounded-xl hover:bg-gray-50"
              title="Sign Out"
            >
              <PiSignOut className="h-4 w-4" />
              <span className="sr-only">Sign Out</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
