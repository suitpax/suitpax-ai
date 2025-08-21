"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  Bell,
  User,
  ChevronDown,
  Settings,
  LogOut,
  Crown,
  Plus,
  MessageSquare,
  Calculator,
  BarChart3,
  HelpCircle,
  Sparkles,
} from "lucide-react"
import { PiDotsNineBold } from "react-icons/pi"
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
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
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
  const routes: Record<string, { title: string; description?: string }> = {
    "/dashboard": { title: "Dashboard", description: "Overview and quick actions" },
    "/dashboard/flights": { title: "Flights", description: "Search and book business flights" },
    "/dashboard/hotels": { title: "Stays", description: "Search and manage hotel stays" },
    "/dashboard/expenses": { title: "Expenses", description: "Track and manage travel expenses" },
    "/dashboard/analytics": { title: "Analytics", description: "Travel insights and reports" },
    "/dashboard/cost-center": { title: "Cost Centers", description: "Budgets and spending by department" },
    "/dashboard/calendar": { title: "Calendar", description: "Schedule and manage trips" },
    "/dashboard/locations": { title: "Locations", description: "Saved places and destinations" },
    "/dashboard/team": { title: "Team", description: "Manage team members" },
    "/dashboard/mail": { title: "Mail", description: "Travel communications" },
    "/dashboard/meetings": { title: "Meetings", description: "Schedule and join meetings" },
    "/dashboard/ai-chat": { title: "Suitpax AI", description: "AI-powered travel assistant" },
    "/dashboard/voice-ai": { title: "Voice AI", description: "Voice-powered assistance" },
    "/dashboard/settings": { title: "Settings", description: "Account and preferences" },
    "/dashboard/profile": { title: "Profile", description: "Personal information" },
  }

  return routes[pathname] || { title: "Dashboard", description: "Overview and quick actions" }
}

const quickActions = [
  { name: "Book Flight", href: "/dashboard/flights", shortcut: "⌘F" },
  { name: "Add Expense", href: "/dashboard/expenses", shortcut: "⌘E" },
  { name: "Suitpax AI", href: "/dashboard/ai-chat", shortcut: "⌘A" },
  { name: "Calendar", href: "/dashboard/calendar", shortcut: "⌘C" },
  { name: "Analytics", href: "/dashboard/analytics", shortcut: "⌘R" },
]

export default function Header({
  user,
  userPlan,
  subscriptionStatus,
  onToggleSidebar,
  isMobile,
  sidebarCollapsed,
}: HeaderProps) {
  const pathname = usePathname()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [commandOpen, setCommandOpen] = useState(false)
  const supabase = createClient()

  const pageInfo = getPageTitle(pathname)

  useEffect(() => {
    const getUserProfile = async () => {
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

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
            <Sparkles className="h-3 w-3 mr-1" />
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

  return (
    <>
      <header className="bg-white/70 backdrop-blur-sm border-b border-white/20 px-4 lg:px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle + Brand */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSidebar}
                className="p-2 rounded-xl hover:bg-gray-100/80 transition-colors"
                aria-label={isMobile ? "Open menu" : "Toggle sidebar"}
              >
                <PiDotsNineBold className="h-5 w-5" />
              </Button>
            </div>

            {/* Page Info */}
            <div className="hidden sm:block">
              <h1 className="text-xl font-medium text-gray-900 tracking-tight">{pageInfo.title}</h1>
              {pageInfo.description && <p className="text-sm text-gray-500 mt-0.5">{pageInfo.description}</p>}
            </div>
          </div>

          {/* Center Section - AI Search */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <div className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search or ask AI anything..."
                  className="w-full px-4 py-2.5 pl-10 pr-4 text-sm bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all placeholder:text-gray-400"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Sparkles className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Plan Badge */}
            <div className="hidden md:block">{getPlanBadge()}</div>

            {/* Quick Actions */}
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex items-center space-x-2 rounded-xl border-gray-200/50 hover:bg-gray-50/80 bg-white/50 backdrop-blur-sm"
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm">New</span>
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-2.5 rounded-xl hover:bg-gray-100/80 transition-colors"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white/95 backdrop-blur-sm border-gray-200/50">
                <DropdownMenuLabel className="flex items-center justify-between">
                  Notifications
                  <Badge variant="secondary" className="text-xs">
                    0
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-2 text-xs text-gray-500">No notifications</div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100/80 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-500 ring-2 ring-blue-200/50">
                    {userProfile?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={userProfile.avatar_url || "/placeholder.svg"}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.email?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                  </div>
                  {!isMobile && (
                    <div className="hidden lg:flex items-center space-x-2">
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {userProfile?.full_name || user.email?.split("@")[0] || "User"}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{userPlan} Plan</p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64 bg-white/95 backdrop-blur-sm border-gray-200/50">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900">
                    {userProfile?.full_name || user.email?.split("@")[0] || "User"}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    {getPlanBadge()}
                    <Badge variant="outline" className="text-xs">
                      {subscriptionStatus}
                    </Badge>
                  </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help & Support
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                {userPlan === "free" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-purple-600 focus:text-purple-700 focus:bg-purple-50">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Pro
                      <CommandShortcut>⇧</CommandShortcut>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search */}
        {isMobile && (
          <div className="mt-4 sm:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Search or ask AI..."
                className="w-full px-4 py-2.5 pl-10 pr-4 text-sm bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all placeholder:text-gray-400"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Sparkles className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Command Dialog */}
      <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
        <DialogContent className="p-0 max-w-[600px]">
          <CommandDialog>
            <CommandInput placeholder="Search flights, expenses, or ask AI..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Quick Actions">
                {quickActions.map((action) => (
                  <CommandItem key={action.name} asChild>
                    <Link href={action.href} onClick={() => setCommandOpen(false)}>
                      {action.name}
                      <CommandShortcut>{action.shortcut}</CommandShortcut>
                    </Link>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="AI Assistance">
                <CommandItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Ask Suitpax AI
                </CommandItem>
                <CommandItem>
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate travel costs
                </CommandItem>
                <CommandItem>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Generate expense report
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </DialogContent>
      </Dialog>
    </>
  )
}