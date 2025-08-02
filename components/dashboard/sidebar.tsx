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
} from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { User as SupabaseUser } from "@supabase/supabase-js"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Flights", href: "/dashboard/flights", icon: Plane },
  { name: "Hotels", href: "/dashboard/hotels", icon: Hotel },
  { name: "Expenses", href: "/dashboard/expenses", icon: CreditCard },
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Locations", href: "/dashboard/locations", icon: MapPin },
  { name: "AI Chat", href: "/dashboard/ai-chat", icon: MessageSquare },
  { name: "Voice AI", href: "/dashboard/voice-ai", icon: Mic },
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
}

export function Sidebar({ onUserUpdate, isCollapsed, isMobile, onCloseMobile }: SidebarProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        onUserUpdate?.(user)
      }
    }
    getUser()
  }, [supabase, onUserUpdate])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/auth/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const getUserDisplayName = () => {
    if (!user) return "User"
    return user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
  }

  const getUserEmail = () => {
    if (!user) return ""
    return user.email || ""
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-white border-r border-gray-200 h-full shadow-xl lg:shadow-none",
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
              width={120} 
              height={32} 
              className="h-8 w-auto" 
            />
          </Link>
        )}
        
        {isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCloseMobile}
            className="h-8 w-8 rounded-lg hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-gray-100"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            <span className="sr-only">{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={isMobile ? onCloseMobile : undefined}
              className={cn(
                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative",
                isActive 
                  ? "bg-gray-900 text-white shadow-sm" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
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
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Settings Section */}
      <div className="border-t border-gray-200 p-3 flex-shrink-0">
        <nav className="space-y-1 mb-3">
          {settingsNavigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={isMobile ? onCloseMobile : undefined}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-gray-100 text-gray-900" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  (isCollapsed && !isMobile) && "justify-center px-2"
                )}
                title={(isCollapsed && !isMobile) ? item.name : ""}
              >
                <item.icon 
                  className={cn(
                    "flex-shrink-0 h-4 w-4", 
                    (isCollapsed && !isMobile) ? "mx-auto" : "mr-3"
                  )} 
                  aria-hidden="true" 
                />
                {(!isCollapsed || isMobile) && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User Profile & Sign Out */}
        {(!isCollapsed || isMobile) && (
          <div className="border-t border-gray-100 pt-3">
            <div className="px-3 py-2 mb-2">
              <p className="text-xs font-medium text-gray-900 truncate">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {getUserEmail()}
              </p>
            </div>
            
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full justify-start px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        )}

        {/* Collapsed state user profile */}
        {(isCollapsed && !isMobile) && (
          <div className="border-t border-gray-100 pt-3">
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