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
  VideoIcon as Meeting,
  PieChart,
} from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { User as SupabaseUser } from "@supabase/supabase-js"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Flights", href: "/dashboard/flights", icon: Plane },
  { name: "Hotels", href: "/dashboard/hotels", icon: Hotel },
  { name: "Expenses", href: "/dashboard/expenses", icon: CreditCard },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Cost Centers", href: "/dashboard/cost-center", icon: PieChart },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Mail", href: "/dashboard/mail", icon: Mail },
  { name: "Meetings", href: "/dashboard/meetings", icon: Meeting },
  { name: "Locations", href: "/dashboard/locations", icon: MapPin },
  { name: "Team", href: "/dashboard/team", icon: Users },
]

const aiNavigation = [
  { name: "Suitpax AI", href: "/dashboard/ai-chat", icon: MessageSquare, badge: "AI" },
  { name: "Voice AI", href: "/dashboard/voice-ai", icon: Mic, badge: "NEW" },
]

const settingsNavigation = [
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Company", href: "/dashboard/company", icon: Building },
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
      const { data: { user } } = await supabase.auth.getUser()
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
    if (typeof window !== 'undefined') {
      window.addEventListener('profile:updated', handler)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('profile:updated', handler)
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
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getUserEmail = () => {
    if (!user) return ""
    return user.email || ""
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-gray-100 border-r border-gray-200 h-full shadow-xl lg:shadow-none", // stronger gray bg
        isMobile ? "w-64" : isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
        {(!isCollapsed || isMobile) && (
          <Link href="/dashboard" className="flex items-center" onClick={isMobile ? onCloseMobile : undefined}>
            <Image 
              src="/logo/suitpax-bl-logo.webp" 
              alt="Suitpax" 
              width={88} 
              height={20} 
              className="h-5 w-auto" 
            />
          </Link>
        )}
        {/* Removed collapsed symbol logo intentionally */}
        {isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCloseMobile}
            className="h-8 w-8 rounded-lg hover:bg-gray-200"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-gray-200"
            onClick={onToggleCollapse}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            <span className="sr-only">{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
          </Button>
        )}
      </div>

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
                  "group flex items-center px-3 py-2.5 text-xs font-medium rounded-lg transition-all duration-200 relative", // smaller text
                  isActive 
                    ? "bg-gray-900 text-white shadow-sm" 
                    : "text-gray-800 hover:bg-gray-200 hover:text-gray-900",
                  (isCollapsed && !isMobile) && "justify-center px-2"
                )}
                title={(isCollapsed && !isMobile) ? item.name : ""}
              >
                <item.icon 
                  className={cn(
                    "flex-shrink-0 h-5 w-5", 
                    (isCollapsed && !isMobile) ? "mx-auto" : "mr-3"
                  )} 
                  aria-hidden="true" 
                />
                {(!isCollapsed || isMobile) && <span>{item.name}</span>}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
                )}
              </Link>
            )
          })}
        </div>

        {/* AI Section - remove mini chat and show responsive agents row */}
        {(!isCollapsed || isMobile) && (
          <div className="pt-4">
            <div className="px-3 mb-2">
              <h3 className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Suitpax AI
              </h3>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className="flex items-center gap-2 border border-gray-200 rounded-xl px-2 py-1 bg-white min-w-max">
                    <div className="w-5 h-5 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 bg-gray-100" />
                    <span className="text-[10px] text-gray-700 font-medium hidden sm:inline">Agent {i}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              {aiNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={isMobile ? onCloseMobile : undefined}
                    className={cn(
                      "group flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-lg transition-all duration-200",
                      isActive 
                        ? "bg-gray-900 text-white shadow-sm" 
                        : "text-gray-800 hover:bg-gray-200 hover:text-gray-900"
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className="flex-shrink-0 h-5 w-5 mr-3" aria-hidden="true" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 h-5",
                          isActive 
                            ? "bg-white/20 text-white border-white/20" 
                            : "bg-gray-300 text-gray-700"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Collapsed AI icons */}
        {(isCollapsed && !isMobile) && (
          <div className="pt-4 space-y-1">
            {aiNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-center px-2 py-2.5 text-xs font-medium rounded-lg transition-all duration-200 relative",
                    isActive 
                      ? "bg-gray-900 text-white shadow-sm" 
                      : "text-gray-800 hover:bg-gray-200 hover:text-gray-900"
                  )}
                  title={item.name}
                >
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      {/* Settings Section */}
      <div className="border-t border-gray-200 p-3 flex-shrink-0">
        {/* Settings Navigation */}
        <nav className="space-y-1 mb-3">
          {(!isCollapsed || isMobile) ? (
            settingsNavigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={isMobile ? onCloseMobile : undefined}
                  className={cn(
                    "group flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-gray-200 text-gray-900" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <item.icon className="flex-shrink-0 h-4 w-4 mr-3" aria-hidden="true" />
                  <span>{item.name}</span>
                </Link>
              )
            })
          ) : (
            settingsNavigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-center px-2 py-2 text-xs font-medium rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-gray-200 text-gray-900" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  title={item.name}
                >
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                </Link>
              )
            })
          )}
        </nav>

        {/* User Profile & Sign Out */}
        {(!isCollapsed || isMobile) && (
          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center space-x-3 px-3 py-2 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userProfile?.avatar_url} alt={getDisplayName()} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-gray-900 truncate">
                  {getDisplayName()}
                </p>
                <p className="text-[10px] text-gray-600 truncate">
                  {userProfile?.company || getUserEmail()}
                </p>
              </div>
            </div>
            
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full justify-start px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        )}

        {/* Collapsed state user profile */}
        {(isCollapsed && !isMobile) && (
          <div className="border-t border-gray-100 pt-3 space-y-2">
            <div className="flex justify-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userProfile?.avatar_url} alt={getDisplayName()} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </div>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="icon"
              className="w-full h-10 rounded-lg hover:bg-gray-100"
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
