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
  PiCheckSquare,
  PiShield,
  PiDotsSixVertical,
  PiBank,
} from "react-icons/pi"
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
import Image from "next/image"
import { AISidebarManager } from "@/lib/ai-sidebar-manager"
import AiSearchInput from "@/components/ui/ai-search-input"

const defaultNavigation = [
  { id: "dashboard", name: "Dashboard", href: "/dashboard", icon: PiSquaresFour },
  { id: "flights", name: "Flights", href: "/dashboard/flights", icon: PiAirplane },
  { id: "hotels", name: "Hotels", href: "/dashboard/hotels", icon: PiBuildings },
  { id: "suitpax-bank", name: "Suitpax Bank", href: "/dashboard/suitpax-bank", icon: PiBank },
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

  const getPlanDisplayName = () => {
    return userPlan.charAt(0).toUpperCase() + userPlan.slice(1).toLowerCase()
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-4 border-b border-gray-200 flex-shrink-0 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Image
                src="/suitpax-bl-logo.webp"
                alt="Suitpax"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              <div className="absolute -top-1 -right-1 flex items-center gap-0.5">
                <div className="w-1.5 h-1.5 bg-gray-900 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              </div>
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900 tracking-tighter">
                    {getDisplayName().split(" ")[0]}
                  </span>
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-light">Suitpax AI</span>
                  <Badge className="bg-gray-200 text-gray-700 text-[8px] px-1.5 py-0.5 rounded-md font-medium">
                    v0.0.1
                  </Badge>
                </div>
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
        <div className="px-4 pt-3 pb-4 border-b border-gray-200">
          <AiSearchInput />
        </div>
      )}

      <nav className="flex-1 px-4 py-3 space-y-1 overflow-y-auto">
        {/* Main Navigation with Drag & Drop */}
        <div className="space-y-0.5">
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
                    "flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 relative",
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
          <div className="pt-3">
            <div className="space-y-0.5">
              {aiNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={isMobile ? onCloseMobile : undefined}
                    className={cn(
                      "group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200",
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
          <div className="pt-3 space-y-0.5">
            {aiNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-center px-2 py-2 text-sm font-medium rounded-xl transition-all duration-200 relative",
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
      <div className="border-t border-gray-200 p-4 flex-shrink-0 space-y-3">
        {(!isCollapsed || isMobile) && (
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">Token Usage</span>
              <Badge className="bg-gray-200 text-gray-700 text-[10px] px-1.5 py-0.5 rounded-lg">
                {getPlanDisplayName()}
              </Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
              <div
                className="bg-gray-900 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(usageStats.tokensUsed / usageStats.maxTokens) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-600">
              <span>{usageStats.tokensUsed.toLocaleString()}</span>
              <span>{usageStats.maxTokens.toLocaleString()}</span>
            </div>
          </div>
        )}

        {(!isCollapsed || isMobile) && (
          <div className="space-y-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-xs h-8 rounded-xl border-gray-300 bg-white hover:bg-gray-50"
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
                      <Badge className="bg-gray-200 text-gray-700 rounded-lg">{getPlanDisplayName()}</Badge>
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
                  className="w-full justify-start text-xs h-8 rounded-xl border-gray-300 bg-white hover:bg-gray-50"
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

        {(!isCollapsed || isMobile) && (
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center space-x-3 px-3 py-2.5 mb-2 bg-gray-50 rounded-xl border border-gray-200">
              <Avatar className="h-8 w-8 ring-2 ring-gray-200 rounded-md">
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
              className="w-full justify-start px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl"
            >
              <PiSignOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        )}

        {isCollapsed && !isMobile && (
          <div className="border-t border-gray-200 pt-3 space-y-2">
            <div className="flex justify-center">
              <Avatar className="h-8 w-8 ring-2 ring-gray-200 rounded-md">
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
              className="w-full h-8 rounded-xl hover:bg-gray-50"
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
