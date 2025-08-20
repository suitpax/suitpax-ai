"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Plane,
  Hotel,
  CreditCard,
  Users,
  Settings,
  BarChart3,
  Calendar,
  MapPin,
  MessageSquare,
  Mic,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Building,
  Mail,
  CalendarIcon as Meeting,
  Receipt,
  Crown,
  Send,
  CheckSquare,
  Shield,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { User as SupabaseUser } from "@supabase/supabase-js"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Trips", href: "/dashboard/trips", icon: Plane },
  { name: "Flights", href: "/dashboard/flights", icon: Plane },
  { name: "Events", href: "/dashboard/events", icon: Calendar },
  { name: "Approvals", href: "/dashboard/approvals", icon: CheckSquare },
  { name: "Requests", href: "/dashboard/requests", icon: Send },
  { name: "Finance Hub", href: "/dashboard/finance-hub", icon: CreditCard },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Integrations", href: "/dashboard/integrations", icon: Settings },
  { name: "Admin", href: "/dashboard/settings", icon: User },
]

const aiNavigation = [
  { name: "AI Center", href: "/dashboard/ai-center", icon: MessageSquare, badge: "AI" },
  // { name: "Suitpax Code", href: "/dashboard/code", icon: MessageSquare, badge: "Dev" },
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
  const [usageStats, setUsageStats] = useState({
    flightSearches: 12,
    maxFlightSearches: userPlan === "premium" ? 1000 : 50,
    tokensUsed: 2450,
    maxTokens: userPlan === "premium" ? 100000 : 10000,
  })
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const setIsCollapsed = onToggleCollapse

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
      if (response.ok) {
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

  const flightSearchPercentage = (usageStats.flightSearches / usageStats.maxFlightSearches) * 100
  const tokensPercentage = (usageStats.tokensUsed / usageStats.maxTokens) * 100

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
            <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white text-lg font-bold">bl</span>
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">{getDisplayName().split(" ")[0]}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-400/80 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Suitpax AI</div>
              </div>
            )}
          </div>
          {/* Collapse button: visible only on mobile */}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed?.(!isCollapsed)}
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-xl"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>

      {(!isCollapsed || isMobile) && (
        <div className="px-3 pt-3 border-b border-gray-200">
          <form onSubmit={handleAiSubmit} className="relative">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl p-2.5 shadow-sm focus-within:ring-1 focus-within:ring-gray-300">
              <Input
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Search flights with AI — try: MAD → LHR next Friday"
                className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-sm"
                disabled={isAiLoading}
              />
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                disabled={!aiQuery.trim() || isAiLoading}
                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-xl"
              >
                {isAiLoading ? (
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-gray-400 border-t-transparent" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={isMobile ? onCloseMobile : undefined}
                className={cn(
                  "group flex items-center px-3 py-2.5 text-sm font-medium rounded-2xl transition-all duration-200 relative",
                  isActive ? "bg-gray-900 text-white shadow-md" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                  isCollapsed && !isMobile && "justify-center px-2",
                )}
                title={isCollapsed && !isMobile ? item.name : ""}
              >
                <item.icon
                  className={cn("flex-shrink-0 h-5 w-5", isCollapsed && !isMobile ? "mx-auto" : "mr-3")}
                  aria-hidden="true"
                />
                {(!isCollapsed || isMobile) && <span>{item.name}</span>}
              </Link>
            )
          })}
        </div>

        {/* AI Section */}
        {(!isCollapsed || isMobile) && (
          <div className="pt-4">
            <div className="space-y-1">
              {aiNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={isMobile ? onCloseMobile : undefined}
                    className={cn(
                      "group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-2xl transition-all duration-200",
                      isActive
                        ? "bg-gray-200 text-gray-900 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className="flex-shrink-0 h-5 w-5 mr-3" aria-hidden="true" />
                      <span>{item.name}</span>
                    </div>
                    <Badge className="bg-gray-200 text-gray-700 text-[10px] px-2 py-0 rounded-lg">{item.badge}</Badge>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Collapsed AI icons */}
        {isCollapsed && !isMobile && (
          <div className="pt-4 space-y-1">
            {aiNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-center px-2 py-2.5 text-sm font-medium rounded-2xl transition-all duration-200 relative",
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
      <div className="border-t border-gray-200 p-3 flex-shrink-0 space-y-4">
        {(!isCollapsed || isMobile) && (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-2xl p-3 space-y-3 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">Usage This Month</span>
                <Badge
                  variant="outline"
                  className="text-[10px] px-2 py-0.5 rounded-lg bg-white text-gray-700 border-gray-300"
                >
                  {userPlan.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Flight Searches</span>
                  <span className="font-medium text-gray-900">
                    {usageStats.flightSearches}/{usageStats.maxFlightSearches}
                  </span>
                </div>
                <Progress value={flightSearchPercentage} className="h-1.5" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">AI Tokens</span>
                  <span className="font-medium text-gray-900">
                    {usageStats.tokensUsed.toLocaleString()}/{usageStats.maxTokens.toLocaleString()}
                  </span>
                </div>
                <Progress value={tokensPercentage} className="h-1.5" />
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions - Only show when not collapsed */}
        {(!isCollapsed || isMobile) && (
          <div className="space-y-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-xs h-8 rounded-2xl border-gray-300 bg-white hover:bg-gray-50"
                >
                  <Crown className="h-3 w-3 mr-2" />
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
                  <div className="bg-gray-50 rounded-2xl p-4">
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
                    <Button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl">
                      Upgrade Plan
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-2xl bg-transparent">
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
                  className="w-full justify-start text-xs h-8 rounded-2xl border-gray-300 bg-white hover:bg-gray-50"
                >
                  <Settings className="h-3 w-3 mr-2" />
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
                    <Button variant="ghost" className="w-full justify-start rounded-2xl">
                      <User className="h-4 w-4 mr-3" />
                      Profile Settings
                    </Button>
                  </Link>
                  <Link href="/dashboard/settings" onClick={isMobile ? onCloseMobile : undefined}>
                    <Button variant="ghost" className="w-full justify-start rounded-2xl">
                      <Settings className="h-4 w-4 mr-3" />
                      Account Settings
                    </Button>
                  </Link>
                  <Link href="/dashboard/company" onClick={isMobile ? onCloseMobile : undefined}>
                    <Button variant="ghost" className="w-full justify-start rounded-2xl">
                      <Building className="h-4 w-4 mr-3" />
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
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center space-x-3 px-3 py-2 mb-2 bg-gray-50 rounded-2xl border border-gray-200">
              <Avatar className="h-8 w-8 ring-2 ring-gray-200 rounded-lg">
                <AvatarImage
                  src={userProfile?.avatar_url || "/placeholder.svg"}
                  alt={getDisplayName()}
                  className="rounded-lg"
                />
                <AvatarFallback className="bg-gray-900 text-white text-xs font-medium rounded-lg">
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
              className="w-full justify-start px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-2xl"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        )}

        {/* Collapsed state user profile */}
        {isCollapsed && !isMobile && (
          <div className="border-t border-gray-200 pt-3 space-y-2">
            <div className="flex justify-center">
              <Avatar className="h-8 w-8 ring-2 ring-gray-200 rounded-lg">
                <AvatarImage
                  src={userProfile?.avatar_url || "/placeholder.svg"}
                  alt={getDisplayName()}
                  className="rounded-lg"
                />
                <AvatarFallback className="bg-gray-900 text-white text-xs font-medium rounded-lg">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </div>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="icon"
              className="w-full h-8 rounded-2xl hover:bg-gray-50"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sign Out</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
