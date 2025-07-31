"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Plane,
  CreditCard,
  BarChart3,
  Calendar,
  MapPin,
  Users,
  Mail,
  VideoIcon,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  Zap,
  Sparkles,
  X,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  onUserUpdate: (user: User) => void
  isCollapsed?: boolean
  isMobile?: boolean
  onCloseMobile?: () => void
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    current: false,
  },
  {
    name: "Flights",
    href: "/dashboard/flights",
    icon: Plane,
    current: false,
  },
  {
    name: "Expenses",
    href: "/dashboard/expenses",
    icon: CreditCard,
    current: false,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    current: false,
  },
  {
    name: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
    current: false,
  },
  {
    name: "Locations",
    href: "/dashboard/locations",
    icon: MapPin,
    current: false,
  },
  {
    name: "Team",
    href: "/dashboard/team",
    icon: Users,
    current: false,
  },
  {
    name: "Mail",
    href: "/dashboard/mail",
    icon: Mail,
    current: false,
  },
  {
    name: "Meetings",
    href: "/dashboard/meetings",
    icon: VideoIcon,
    current: false,
  },
]

const aiNavigation = [
  {
    name: "Suitpax AI",
    href: "/dashboard/ai-chat",
    icon: MessageSquare,
    current: false,
    badge: "AI",
    premium: false,
  },
  {
    name: "Voice AI",
    href: "/dashboard/voice-ai",
    icon: Sparkles,
    current: false,
    badge: "Pro",
    premium: true,
  },
]

const secondaryNavigation = [
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    name: "Help",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
]

export function Sidebar({ 
  onUserUpdate, 
  isCollapsed = false, 
  isMobile = false, 
  onCloseMobile 
}: SidebarProps) {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUser(user)
        
        // Get user profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profile) {
          setUserProfile(profile)
        }
      }
    }

    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const handleNavigation = () => {
    if (isMobile && onCloseMobile) {
      onCloseMobile()
    }
  }

  // Update current state based on pathname
  const updatedNavigation = navigation.map(item => ({
    ...item,
    current: pathname === item.href,
  }))

  const updatedAiNavigation = aiNavigation.map(item => ({
    ...item,
    current: pathname === item.href,
  }))

  return (
    <div className="bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className={`p-4 border-b border-gray-200 flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between'}`}>
        {(!isCollapsed || isMobile) && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center p-1">
              <Image
                src="/logo/suitpax-bl-logo.webp"
                alt="Suitpax"
                width={24}
                height={24}
                className="object-contain filter brightness-0 invert"
              />
            </div>
            <span className="text-lg font-semibold text-gray-900">Suitpax</span>
          </div>
        )}
        
        {isCollapsed && !isMobile && (
          <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center p-1">
            <Image
              src="/logo/suitpax-bl-logo.webp"
              alt="Suitpax"
              width={20}
              height={20}
              className="object-contain filter brightness-0 invert"
            />
          </div>
        )}

        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCloseMobile}
            className="p-1"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-8">
        {/* Main Navigation */}
        <div className="space-y-1">
          {(!isCollapsed || isMobile) && (
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Main
            </h3>
          )}
          
          {updatedNavigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleNavigation}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                  ${item.current
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }
                  ${isCollapsed && !isMobile ? 'justify-center' : 'justify-start'}
                `}
              >
                <Icon className={`h-5 w-5 ${(!isCollapsed || isMobile) ? 'mr-3' : ''}`} />
                {(!isCollapsed || isMobile) && (
                  <span className="truncate">{item.name}</span>
                )}
              </Link>
            )
          })}
        </div>

        {/* AI Navigation */}
        <div className="space-y-1">
          {(!isCollapsed || isMobile) && (
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
              <Zap className="h-3 w-3 mr-2" />
              AI Powered
            </h3>
          )}
          
          {updatedAiNavigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleNavigation}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group
                  ${item.current
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
                  }
                  ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between'}
                `}
              >
                <div className="flex items-center">
                  <Icon className={`h-5 w-5 ${(!isCollapsed || isMobile) ? 'mr-3' : ''}`} />
                  {(!isCollapsed || isMobile) && (
                    <span className="truncate">{item.name}</span>
                  )}
                </div>
                
                {(!isCollapsed || isMobile) && (
                  <Badge 
                    variant={item.current ? "secondary" : "outline"}
                    className={`text-xs ${
                      item.current 
                        ? 'bg-white/20 text-white border-white/30' 
                        : item.premium 
                          ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200'
                          : 'bg-blue-100 text-blue-700 border-blue-200'
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}
        </div>

        {/* Secondary Navigation */}
        <div className="space-y-1">
          {(!isCollapsed || isMobile) && (
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Support
            </h3>
          )}
          
          {secondaryNavigation.map((item) => {
            const Icon = item.icon
            const current = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleNavigation}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                  ${current
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }
                  ${isCollapsed && !isMobile ? 'justify-center' : 'justify-start'}
                `}
              >
                <Icon className={`h-5 w-5 ${(!isCollapsed || isMobile) ? 'mr-3' : ''}`} />
                {(!isCollapsed || isMobile) && (
                  <span className="truncate">{item.name}</span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        {user && (
          <div className={`${isCollapsed && !isMobile ? 'flex justify-center' : 'space-y-3'}`}>
            {(!isCollapsed || isMobile) ? (
              <>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {userProfile?.full_name || user.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              </>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center cursor-pointer">
                <span className="text-white text-sm font-medium">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}