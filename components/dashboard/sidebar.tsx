"use client"

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
  X,
  User,
  Building,
  Mail,
  CalendarIcon as Meeting,
  Receipt,
  Crown,
  Zap,
  TrendingUp,
} from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import AISearchInput from "@/components/ui/ai-search-input"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Flights", href: "/dashboard/flights", icon: Plane },
  { name: "Hotels", href: "/dashboard/hotels", icon: Hotel },
  { name: "Finance", href: "/dashboard/finance", icon: CreditCard },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Mail", href: "/dashboard/mail", icon: Mail },
  { name: "Meetings", href: "/dashboard/meetings", icon: Meeting },
  { name: "Locations", href: "/dashboard/locations", icon: MapPin },
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Tasks", href: "/dashboard/tasks", icon: Receipt },
]

const aiNavigation = [
  { name: "Suitpax AI", href: "/dashboard/suitpax-ai", icon: MessageSquare, badge: "AI" },
  { name: "Voice AI", href: "/dashboard/voice-ai", icon: Mic, badge: "NEW" },
]

const settingsNavigation = [
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Company", href: "/dashboard/company", icon: Building },
  { name: "Plans & Billing", href: "/dashboard/billing", icon: Crown },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

interface SidebarProps {
  onUserUpdate?: (user: SupabaseUser) => void
  isCollapsed: boolean
  isMobile: boolean
  onCloseMobile: () => void
  onToggleCollapse?: () => void
}

interface UserProfile {
  full_name?: string
  avatar_url?: string
  company?: string
  job_title?: string
  plan?: string
  subscription_status?: string
}

export function Sidebar({ onUserUpdate, isCollapsed, isMobile, onCloseMobile, onToggleCollapse }: SidebarProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [usageStats, setUsageStats] = useState({
    flightSearches: 15,
    maxFlightSearches: 50,
    tokensUsed: 2500,
    maxTokens: 10000,
  })
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

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
            .select("full_name, avatar_url, company, job_title, plan, subscription_status")
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

  const getPlanBadge = () => {
    const plan = userProfile?.plan || "free"
    switch (plan.toLowerCase()) {
      case "pro":
        return (
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 text-xs">
            <Crown className="h-3 w-3 mr-1" />
            Pro
          </Badge>
        )
      case "enterprise":
        return (
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-xs">
            <Zap className="h-3 w-3 mr-1" />
            Enterprise
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 text-xs">
            Free
          </Badge>
        )
    }
  }

  const flightSearchProgress = (usageStats.flightSearches / usageStats.maxFlightSearches) * 100
  const tokenProgress = (usageStats.tokensUsed / usageStats.maxTokens) * 100

  return (
    <div
      className={cn(
        "flex flex-col bg-white/90 backdrop-blur-sm border-r border-white/20 h-full shadow-2xl shadow-black/10",
        isMobile ? "w-64" : isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-100/50 flex-shrink-0">
        {(!isCollapsed || isMobile) && (
          <Link href="/dashboard" className="flex items-center gap-2" onClick={isMobile ? onCloseMobile : undefined}>
            <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={88} height={20} className="h-5 w-auto" />
          </Link>
        )}
        {isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCloseMobile}
            className="h-8 w-8 rounded-xl hover:bg-gray-100/80"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-xl hover:bg-gray-100/80"
            onClick={onToggleCollapse}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            <span className="sr-only">{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
          </Button>
        )}
      </div>

      {(!isCollapsed || isMobile) && (
        <div className="px-3 pt-3 border-b border-gray-100/50">
          <AISearchInput size="sm" />
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
                  "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 relative",
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900",
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
                      "group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                        : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900",
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className="flex-shrink-0 h-5 w-5 mr-3" aria-hidden="true" />
                      <span>{item.name}</span>
                    </div>
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
                    "group flex items-center justify-center px-2 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 relative",
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                      : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900",
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

      {/* Settings Section */}
      <div className="border-t border-gray-100/50 p-3 flex-shrink-0">
        {/* Usage Stats - Only show when not collapsed */}
        {(!isCollapsed || isMobile) && (
          <div className="mb-4 p-3 bg-gray-50/50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">Usage This Month</span>
              {getPlanBadge()}
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Flight Searches</span>
                  <span className="text-xs font-medium text-gray-700">
                    {usageStats.flightSearches}/{usageStats.maxFlightSearches}
                  </span>
                </div>
                <Progress value={flightSearchProgress} className="h-1.5" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">AI Tokens</span>
                  <span className="text-xs font-medium text-gray-700">
                    {usageStats.tokensUsed.toLocaleString()}/{usageStats.maxTokens.toLocaleString()}
                  </span>
                </div>
                <Progress value={tokenProgress} className="h-1.5" />
              </div>
            </div>
          </div>
        )}

        {/* Settings Navigation */}
        <nav className="space-y-1 mb-3">
          {!isCollapsed || isMobile
            ? settingsNavigation.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={isMobile ? onCloseMobile : undefined}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-gray-100/80 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50/80 hover:text-gray-900",
                    )}
                  >
                    <item.icon className="flex-shrink-0 h-4 w-4 mr-3" aria-hidden="true" />
                    <span>{item.name}</span>
                  </Link>
                )
              })
            : settingsNavigation.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-center px-2 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-gray-100/80 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50/80 hover:text-gray-900",
                    )}
                    title={item.name}
                  >
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )
              })}
        </nav>

        {/* User Profile & Sign Out */}
        {(!isCollapsed || isMobile) && (
          <div className="border-t border-gray-100/50 pt-3">
            {/* User Details Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center space-x-3 px-3 py-2 mb-2 cursor-pointer hover:bg-gray-50/80 rounded-xl transition-colors">
                  <Avatar className="h-10 w-10 ring-2 ring-blue-400/40 rounded-xl">
                    <AvatarImage
                      src={userProfile?.avatar_url || "/placeholder.svg"}
                      alt={getDisplayName()}
                      className="rounded-xl"
                    />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-xl">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{getDisplayName()}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-600 truncate">{userProfile?.company || getUserEmail()}</p>
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5 rounded-lg">
                        {userProfile?.plan || "Free"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="bg-white/95 backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-blue-400/40 rounded-xl">
                      <AvatarImage
                        src={userProfile?.avatar_url || "/placeholder.svg"}
                        alt={getDisplayName()}
                        className="rounded-xl"
                      />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg font-medium rounded-xl">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{getDisplayName()}</h3>
                      <p className="text-sm text-gray-600">{getUserEmail()}</p>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Plane className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Flights Booked</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">12</p>
                      <p className="text-xs text-blue-700">This year</p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">Savings</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">$2,450</p>
                      <p className="text-xs text-green-700">Total saved</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-medium text-gray-900 mb-3">Account Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plan:</span>
                        <span className="font-medium">{userProfile?.plan || "Free"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium">{userProfile?.subscription_status || "Active"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Company:</span>
                        <span className="font-medium">{userProfile?.company || "Personal"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link href="/dashboard/profile">Edit Profile</Link>
                    </Button>
                    <Button variant="outline" asChild className="flex-1 bg-transparent">
                      <Link href="/dashboard/billing">Upgrade Plan</Link>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full justify-start px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 rounded-xl"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        )}

        {/* Collapsed state user profile */}
        {isCollapsed && !isMobile && (
          <div className="border-t border-gray-100/50 pt-3 space-y-2">
            <div className="flex justify-center">
              <Avatar className="h-10 w-10 ring-2 ring-blue-400/40 rounded-xl">
                <AvatarImage
                  src={userProfile?.avatar_url || "/placeholder.svg"}
                  alt={getDisplayName()}
                  className="rounded-xl"
                />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </div>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="icon"
              className="w-full h-10 rounded-xl hover:bg-gray-100/80"
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
