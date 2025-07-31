"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { 
  Menu, 
  Search, 
  Bell, 
  User,
  ChevronDown,
  Settings,
  LogOut,
  Zap,
  Crown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface HeaderProps {
  user: SupabaseUser
  userPlan: string
  subscriptionStatus: string
  onToggleSidebar: () => void
  isMobile: boolean
  sidebarCollapsed: boolean
}

const getPageTitle = (pathname: string) => {
  const routes: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/dashboard/flights': 'Flights',
    '/dashboard/expenses': 'Expenses',
    '/dashboard/analytics': 'Analytics',
    '/dashboard/calendar': 'Calendar',
    '/dashboard/locations': 'Locations',
    '/dashboard/team': 'Team',
    '/dashboard/mail': 'Mail',
    '/dashboard/meetings': 'Meetings',
    '/dashboard/ai-chat': 'Suitpax AI',
    '/dashboard/voice-ai': 'Voice AI',
    '/dashboard/settings': 'Settings',
    '/dashboard/profile': 'Profile',
  }
  
  return routes[pathname] || 'Dashboard'
}

export default function Header({ 
  user, 
  userPlan, 
  subscriptionStatus, 
  onToggleSidebar,
  isMobile,
  sidebarCollapsed 
}: HeaderProps) {
  const pathname = usePathname()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [notifications, setNotifications] = useState(3)
  const supabase = createClient()

  useEffect(() => {
    const getUserProfile = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profile) {
        setUserProfile(profile)
      }
    }

    getUserProfile()
  }, [user.id, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const getPlanBadge = () => {
    switch (userPlan.toLowerCase()) {
      case 'pro':
        return (
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
            <Crown className="h-3 w-3 mr-1" />
            Pro
          </Badge>
        )
      case 'enterprise':
        return (
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
            <Zap className="h-3 w-3 mr-1" />
            Enterprise
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
            Free
          </Badge>
        )
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Sidebar Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={isMobile ? "Open menu" : "Toggle sidebar"}
        >
          {isMobile ? (
            <Menu className="h-5 w-5" />
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={sidebarCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7M13 5l7 7-7 7"} 
              />
            </svg>
          )}
        </Button>

        {/* Page Title */}
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            {getPageTitle(pathname)}
          </h1>
          {pathname === '/dashboard' && (
            <p className="text-sm text-gray-500">
              Welcome back, {userProfile?.full_name || user.email?.split('@')[0] || 'User'}
            </p>
          )}
        </div>
      </div>

      {/* Center Section - Search (Hidden on mobile) */}
      <div className="hidden md:flex flex-1 max-w-lg mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search flights, expenses, or ask AI..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* Plan Badge */}
        {getPlanBadge()}

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          {notifications > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {notifications}
            </Badge>
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              {!isMobile && (
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {userProfile?.full_name || user.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {userPlan} Plan
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-gray-900">
                {userProfile?.full_name || user.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild>
              <a href="/dashboard/profile" className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                Profile
              </a>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <a href="/dashboard/settings" className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </a>
            </DropdownMenuItem>

            {userPlan === 'free' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-purple-600 focus:text-purple-700 focus:bg-purple-50">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Pro