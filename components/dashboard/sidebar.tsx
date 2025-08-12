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
} from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
  { name: "Suitpax AI", href: "/dashboard/ai-chat", icon: MessageSquare, badge: "AI" },
  { name: "Voice AI", href: "/dashboard/voice-ai", icon: Mic, badge: "NEW" },
]

const settingsNavigation = [
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Company", href: "/dashboard/company", icon: Building },
  { name: "Billing", href: "/dashboard/billing", icon: Receipt },
  { name: "Google Drive", href: "/dashboard/google-drive", icon: Building },
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
}

export function Sidebar({ onUserUpdate, isCollapsed, isMobile, onCloseMobile, onToggleCollapse }: SidebarProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
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
            <div className="flex items-center space-x-3 px-3 py-2 mb-2">
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
                    Member
                  </Badge>
                </div>
              </div>
            </div>

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
