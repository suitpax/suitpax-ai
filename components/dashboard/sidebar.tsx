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
  Video,
  Sparkles,
  Crown,
  Zap,
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  PlusCircle,
  HelpCircle,
  Headphones,
  Bot,
  FileText,
  Shield,
  Briefcase
} from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { User as SupabaseUser } from "@supabase/supabase-js"

const navigation = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: LayoutDashboard,
    badge: null,
    description: "Overview and insights"
  },
  { 
    name: "Flights", 
    href: "/dashboard/flights", 
    icon: Plane,
    badge: null,
    description: "Search and book flights"
  },
  { 
    name: "Hotels", 
    href: "/dashboard/hotels", 
    icon: Hotel,
    badge: "Soon",
    description: "Find accommodations"
  },
  { 
    name: "Expenses", 
    href: "/dashboard/expenses", 
    icon: CreditCard,
    badge: null,
    description: "Track spending"
  },
  { 
    name: "Team", 
    href: "/dashboard/team", 
    icon: Users,
    badge: null,
    description: "Manage team members"
  },
  { 
    name: "Analytics", 
    href: "/dashboard/analytics", 
    icon: BarChart3,
    badge: null,
    description: "Reports and insights"
  },
  { 
    name: "Calendar", 
    href: "/dashboard/calendar", 
    icon: Calendar,
    badge: null,
    description: "Schedule trips"
  },
  { 
    name: "Locations", 
    href: "/dashboard/locations", 
    icon: MapPin,
    badge: null,
    description: "Saved destinations"
  },
]

const aiNavigation = [
  { 
    name: "AI Chat", 
    href: "/dashboard/ai-chat", 
    icon: MessageSquare,
    badge: "New",
    description: "Chat with Suitpax AI"
  },
  { 
    name: "Voice AI", 
    href: "/dashboard/voice-ai", 
    icon: Mic,
    badge: "Beta",
    description: "Voice assistance"
  },
  { 
    name: "Mail", 
    href: "/dashboard/mail", 
    icon: Mail,
    badge: null,
    description: "Travel communications"
  },
  { 
    name: "Meetings", 
    href: "/dashboard/meetings", 
    icon: Video,
    badge: null,
    description: "Video conferences"
  },
]

const settingsNavigation = [
  { 
    name: "Profile", 
    href: "/dashboard/profile", 
    icon: User,
    description: "Personal settings"
  },
  { 
    name: "Company", 
    href: "/dashboard/company", 
    icon: Building,
    description: "Organization settings"
  },
  { 
    name: "Settings", 
    href: "/dashboard/settings", 
    icon: Settings,
    description: "Preferences"
  },
]

interface SidebarProps {
  onUserUpdate?: (user: SupabaseUser) => void
  isCollapsed: boolean
  isMobile: boolean
  onCloseMobile: () => void
  userPlan?: string
}

export function Sidebar({ 
  onUserUpdate, 
  isCollapsed, 
  isMobile, 
  onCloseMobile,
  userPlan = "free"
}: SidebarProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    monthlyUsage: 65,
    totalTrips: 12,
    savings: 2340
  })
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
    return userProfile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
  }

  const getUserEmail = () => {
    if (!user) return ""
    return user.email || ""
  }

  const getPlanInfo = () => {
    switch (userPlan.toLowerCase()) {
      case 'pro':
        return {
          name: 'Pro',
          icon: Crown,
          color: 'from-purple-600 to-blue-600',
          textColor: 'text-white'
        }
      case 'enterprise':
        return {
          name: 'Enterprise',
          icon: Sparkles,
          color: 'from-orange-500 to-red-500',
          textColor: 'text-white'
        }
      default:
        return {
          name: 'Free',
          icon: User,
          color: 'from-gray-100 to-gray-200',
          textColor: 'text-gray-600'
        }
    }
  }

  const planInfo = getPlanInfo()

  const NavigationItem = ({ item, isAI = false }: { item: any, isAI?: boolean }) => {
    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
    
    const content = (
      <Link
        href={item.href}
        onClick={isMobile ? onCloseMobile : undefined}
        className={cn(
          "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 relative",
          isActive 
            ? "bg-gray-900 text-white shadow-sm" 
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
          (isCollapsed && !isMobile) && "justify-center px-2"
        )}
      >
        <item.icon 
          className={cn(
            "flex-shrink-0 h-5 w-5", 
            (isCollapsed && !isMobile) ? "mx-auto" : "mr-3"
          )} 
          aria-hidden="true" 
        />
        
        {(!isCollapsed || isMobile) && (
          <div className="flex items-center justify-between w-full">
            <span>{item.name}</span>
            {item.badge && (
              <Badge 
                variant={item.badge === "New" ? "default" : "secondary"} 
                className={cn(
                  "text-xs px-1.5 py-0.5",
                  item.badge === "New" && "bg-emerald-500 text-white",
                  item.badge === "Beta" && "bg-orange-500 text-white",
                  item.badge === "Soon" && "bg-gray-400 text-white"
                )}
              >
                {item.badge}
              </Badge>
            )}
          </div>
        )}
        
        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
        )}
      </Link>
    )

    if (isCollapsed && !isMobile) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {content}
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-2">
              <span>{item.name}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return content
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-white border-r border-gray-200 h-full shadow-xl lg:shadow-none relative",
        isMobile ? "w-72" : isCollapsed ? "w-16" : "w-72"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
        {(!isCollapsed || isMobile) && (
          <div className="flex items-center space-x-3">
            <div className="bg-gray-900 rounded-xl p-2">
              <Image 
                src="/logo/suitpax-bl-logo.webp" 
                alt="Suitpax" 
                width={80} 
                height={20} 
                className="h-4 w-auto brightness-0 invert" 
              />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Suitpax</h2>
              <p className="text-xs text-gray-500">Travel Platform</p>
            </div>
          </div>
        )}
        
        {isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCloseMobile}
            className="h-8 w-8 rounded-xl hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        ) : (
          isCollapsed && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-gray-900 rounded-xl p-2">
                    <Image 
                      src="/logo/suitpax-bl-logo.webp" 
                      alt="Suitpax" 
                      width={20}
                      height={20} 
                      className="h-4 w-auto brightness-0 invert" 
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Suitpax Travel Platform
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        )}
      </div>

      {/* User Profile Section */}
      {(!isCollapsed || isMobile) && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {getUserDisplayName().charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {getUserEmail()}
              </p>
            </div>
          </div>
          
          {/* Plan Badge */}
          <div className={cn(
            "inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r",
            planInfo.color,
            planInfo.textColor
          )}>
            <planInfo.icon className="h-3 w-3 mr-1.5" />
            {planInfo.name} Plan
          </div>

          {/* Quick Stats */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <div className="font-semibold text-gray-900">{stats.totalTrips}</div>
              <div className="text-gray-500">Trips</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <div className="font-semibold text-green-600">${stats.savings}</div>
              <div className="text-gray-500">Saved</div>
            </div>
          </div>

          {/* Usage Progress (for Free plan) */}
          {userPlan === 'free' && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600">Monthly Usage</span>
                <span className="font-medium">{stats.monthlyUsage}%</span>
              </div>
              <Progress value={stats.monthlyUsage} className="h-1.5" />
              <p className="text-xs text-gray-500 mt-1">
                Upgrade to Pro for unlimited access
              </p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-1">
          {(!isCollapsed || isMobile) && (
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Main
            </h3>
          )}
          {navigation.map((item) => (
            <NavigationItem key={item.name} item={item} />
          ))}
        </div>

        <Separator className="my-4" />

        {/* AI Features */}
        <div className="space-y-1">
          {(!isCollapsed || isMobile) && (
            <div className="flex items-center px-3 mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex-1">
                AI Features
              </h3>
              <Sparkles className="h-3 w-3 text-purple-500" />
            </div>
          )}
          {aiNavigation.map((item) => (
            <NavigationItem key={item.name} item={item} isAI={true} />
          ))}
        </div>

        {/* Quick Actions */}
        {(!isCollapsed || isMobile) && (
          <div className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Quick Actions
            </h3>
            <div className="space-y-1">
              <Link
                href="/dashboard/flights"
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={isMobile ? onCloseMobile : undefined}
              >
                <PlusCircle className="h-4 w-4 mr-3 text-blue-500" />
                Book Flight
              </Link>
              <Link
                href="/dashboard/expenses"
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={isMobile ? onCloseMobile : undefined}
              >
                <CreditCard className="h-4 w-4 mr-3 text-green-500" />
                Add Expense
              </Link>
              <Link
                href="/dashboard/ai-chat"
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={isMobile ? onCloseMobile : undefined}
              >
                <Bot className="h-4 w-4 mr-3 text-purple-500" />
                Ask AI
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 p-3 flex-shrink-0">
        {/* Settings Navigation */}
        {(!isCollapsed || isMobile) && (
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
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className="flex-shrink-0 h-4 w-4 mr-3" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        )}

        {/* Upgrade Banner (Free Plan) */}
        {userPlan === 'free' && (!isCollapsed || isMobile) && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-3 mb-3 text-white">
            <div className="flex items-center mb-2">
              <Crown className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Upgrade to Pro</span>
            </div>
            <p className="text-xs opacity-90 mb-3">
              Unlock unlimited AI features and advanced analytics
            </p>
            <Button 
              size="sm" 
              className="w-full bg-white/20 hover:bg-white/30 text-white border-0"
            >
              Upgrade Now
            </Button>
          </div>
        )}

        {/* Help & Support */}
        {(!isCollapsed || isMobile) && (
          <Button
            variant="ghost"
            className="w-full justify-start px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg mb-2"
          >
            <HelpCircle className="h-4 w-4 mr-3" />
            Help & Support
          </Button>
        )}

        {/* Sign Out */}
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className={cn(
            "w-full justify-start px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg",
            (isCollapsed && !isMobile) && "justify-center px-2"
          )}
          title={(isCollapsed && !isMobile) ? "Sign Out" : ""}
        >
          <LogOut className={cn("h-4 w-4", (!isCollapsed || isMobile) && "mr-3")} />
          {(!isCollapsed || isMobile) && "Sign Out"}
        </Button>
      </div>
    </div>
  )
}