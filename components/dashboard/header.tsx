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
  Crown,
  Command,
  Plus,
  Calendar,
  MessageSquare,
  Calculator,
  CreditCard,
  BarChart3,
  Globe,
  HelpCircle,
  Sparkles,
  Star,
  TrendingUp,
  Clock,
  DollarSign
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import {
  Command as CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HeaderProps {
  user: SupabaseUser
  userPlan: string
  subscriptionStatus: string
  onToggleSidebar: () => void
  isMobile: boolean
  sidebarCollapsed: boolean
}

interface UserProfile {
  full_name?: string
  avatar_url?: string
  company?: string
  job_title?: string
}

interface TravelStats {
  thisMonth: {
    flights: number
    savings: number
    expenses: number
  }
  pending: {
    bookings: number
    approvals: number
  }
  streak: number
}

const getPageTitle = (pathname: string) => {
  const routes: Record<string, { title: string; description?: string; icon?: any }> = {
    '/dashboard': { title: 'Dashboard', description: 'Your travel command center', icon: BarChart3 },
    '/dashboard/flights': { title: 'Flights', description: 'Search and book business flights', icon: Calendar },
    '/dashboard/expenses': { title: 'Expenses', description: 'Track and manage travel expenses', icon: CreditCard },
    '/dashboard/analytics': { title: 'Analytics', description: 'Travel insights and reports', icon: TrendingUp },
    '/dashboard/calendar': { title: 'Calendar', description: 'Schedule and manage trips', icon: Calendar },
    '/dashboard/locations': { title: 'Locations', description: 'Saved places and destinations', icon: Globe },
    '/dashboard/team': { title: 'Team', description: 'Manage team members', icon: User },
    '/dashboard/mail': { title: 'Mail', description: 'Travel communications', icon: MessageSquare },
    '/dashboard/meetings': { title: 'Meetings', description: 'Schedule and join meetings', icon: Calendar },
    '/dashboard/ai-chat': { title: 'AI Assistant', description: 'Your intelligent travel companion', icon: MessageSquare },
    '/dashboard/voice-ai': { title: 'Voice AI', description: 'Voice-powered assistance', icon: MessageSquare },
    '/dashboard/settings': { title: 'Settings', description: 'Account and preferences', icon: Settings },
    '/dashboard/profile': { title: 'Profile', description: 'Personal information', icon: User },
  }
  
  return routes[pathname] || { title: 'Dashboard', description: 'Your travel command center', icon: BarChart3 }
}

const quickActions = [
  { name: "Book Flight", href: "/dashboard/flights", icon: "✈️", shortcut: "⌘F" },
  { name: "Add Expense", href: "/dashboard/expenses", icon: "💳", shortcut: "⌘E" },
  { name: "AI Chat", href: "/dashboard/ai-chat", icon: "🤖", shortcut: "⌘A" },
  { name: "Calendar", href: "/dashboard/calendar", icon: "📅", shortcut: "⌘C" },
  { name: "Analytics", href: "/dashboard/analytics", icon: "📊", shortcut: "⌘R" },
]

export default function Header({ 
  user, 
  userPlan, 
  subscriptionStatus, 
  onToggleSidebar,
  isMobile,
  sidebarCollapsed 
}: HeaderProps) {
  const pathname = usePathname()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [travelStats, setTravelStats] = useState<TravelStats>({
    thisMonth: { flights: 0, savings: 0, expenses: 0 },
    pending: { bookings: 0, approvals: 0 },
    streak: 0
  })
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: "Flight confirmation received", 
      message: "NYC trip confirmed for next week",
      time: "2 min ago", 
      type: "booking",
      unread: true 
    },
    { 
      id: 2, 
      title: "Expense report approved", 
      message: "$1,250 approved by finance team",
      time: "1 hour ago", 
      type: "expense",
      unread: true 
    },
    { 
      id: 3, 
      title: "Meeting reminder", 
      message: "Q4 budget review in 30 minutes",
      time: "3 hours ago", 
      type: "meeting",
      unread: false 
    },
  ])
  const [commandOpen, setCommandOpen] = useState(false)
  const supabase = createClient()

  const pageInfo = getPageTitle(pathname)
  const unreadCount = notifications.filter(n => n.unread).length

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url, company, job_title")
          .eq("id", user.id)
          .single()

        if (profile) {
          setUserProfile(profile)
        }

        // Mock travel stats - replace with real data
        setTravelStats({
          thisMonth: {
            flights: Math.floor(Math.random() * 5) + 1,
            savings: Math.floor(Math.random() * 1000) + 200,
            expenses: Math.floor(Math.random() * 10) + 3
          },
          pending: {
            bookings: Math.floor(Math.random() * 3),
            approvals: Math.floor(Math.random() * 2)
          },
          streak: Math.floor(Math.random() * 30) + 5
        })
      } catch (error) {
        console.error("Error fetching user profile:", error)
      }
    }

    getUserProfile()
  }, [user.id, supabase])

  // Keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n))
  }

  const getPlanBadge = () => {
    const plan = userPlan?.toLowerCase() || 'free'
    
    switch (plan) {
      case 'pro':
        return (
          <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 text-xs font-medium">
            <Crown className="h-3 w-3 mr-1" />
            Pro
          </Badge>
        )
      case 'enterprise':
        return (
          <Badge className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0 text-xs font-medium">
            <Sparkles className="h-3 w-3 mr-1" />
            Enterprise
          </Badge>
        )
      case 'team':
        return (
          <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 text-xs font-medium">
            <Star className="h-3 w-3 mr-1" />
            Team
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300 text-xs font-medium">
            Free
          </Badge>
        )
    }
  }

  const getDisplayName = () => {
    return userProfile?.full_name || user.email?.split('@')[0] || 'User'
  }

  const getInitials = () => {
    const name = getDisplayName()
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 lg:px-6 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label={isMobile ? "Open menu" : "Toggle sidebar"}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Page Info */}
            <div className="hidden sm:block">
              <div className="flex items-center space-x-3">
                {pageInfo.icon && (
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <pageInfo.icon className="h-4 w-4 text-gray-600" />
                  </div>
                )}
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
                    {pageInfo.title}
                  </h1>
                  {pageInfo.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{pageInfo.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Center Section - Command Bar */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <Button
              variant="outline"
              className="w-full justify-start text-sm text-gray-500 border-gray-200 hover:bg-gray-50 rounded-xl h-9"
              onClick={() => setCommandOpen(true)}
            >
              <Search className="h-4 w-4 mr-2" />
              Search anything or ask AI...
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-600 opacity-100 ml-auto">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Travel Stats - Hidden on mobile */}
            <div className="hidden xl:flex items-center space-x-6 mr-4">
              <div className="flex items-center space-x-1 text-xs">
                <Calendar className="h-3.5 w-3.5 text-blue-600" />
                <span className="font-semibold text-gray-900">{travelStats.thisMonth.flights}</span>
                <span className="text-gray-600">trips</span>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <DollarSign className="h-3.5 w-3.5 text-green-600" />
                <span className="font-semibold text-gray-900">${travelStats.thisMonth.savings}</span>
                <span className="text-gray-600">saved</span>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <TrendingUp className="h-3.5 w-3.5 text-purple-600" />
                <span className="font-semibold text-gray-900">{travelStats.streak}</span>
                <span className="text-gray-600">day streak</span>
              </div>
            </div>

            {/* Plan Badge */}
            {getPlanBadge()}

            {/* Quick Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex items-center space-x-1 rounded-xl border-gray-200 hover:bg-gray-50 h-9"
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-xs">Quick</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {quickActions.map((action) => (
                  <DropdownMenuItem key={action.name} asChild>
                    <Link href={action.href} className="cursor-pointer">
                      <span className="mr-2">{action.icon}</span>
                      {action.name}
                      <CommandShortcut>{action.shortcut}</CommandShortcut>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors h-9 w-9"
                >
                  <Bell className="h-4 w-4 text-gray-600" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-red-500 hover:bg-red-500"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  Notifications
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-auto p-1 hover:bg-gray-100"
                    onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
                  >
                    Mark all read
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "flex items-start space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-l-2 transition-colors",
                        notification.unread ? "border-l-blue-500 bg-blue-50/30" : "border-l-transparent"
                      )}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                        notification.type === 'booking' ? "bg-blue-500" :
                        notification.type === 'expense' ? "bg-green-500" : "bg-purple-500"
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center text-sm text-gray-500 justify-center">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 transition-colors h-9"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={userProfile?.avatar_url} alt={getDisplayName()} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  {!isMobile && (
                    <div className="hidden lg:flex items-center space-x-2">
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {getDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {userProfile?.company || 'Personal Account'}
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-72">
                <div className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userProfile?.avatar_url} alt={getDisplayName()} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {getDisplayName()}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      {userProfile?.job_title && (
                        <p className="text-xs text-gray-400 truncate">{userProfile.job_title}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    {getPlanBadge()}
                    <Badge variant="outline" className="text-xs capitalize">
                      {subscriptionStatus}
                    </Badge>
                  </div>
                  
                  {/* Travel Stats in menu for mobile */}
                  <div className="xl:hidden mt-3 flex items-center justify-between text-xs border-t pt-3">
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">{travelStats.thisMonth.flights}</p>
                      <p className="text-gray-500">Trips</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">${travelStats.thisMonth.savings}</p>
                      <p className="text-gray-500">Saved</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">{travelStats.streak}</p>
                      <p className="text-gray-500">Streak</p>
                    </div>
                  </div>
                </div>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer">
                      <User className="h-4 w-4 mr-3" />
                      Profile & Account
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      <Settings className="h-4 w-4 mr-3" />
                      Settings & Preferences
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <HelpCirc