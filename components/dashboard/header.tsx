"use client"

import { useState, useEffect } from "react"
import { MagnifyingGlassIcon, BellIcon, CommandLineIcon } from "@heroicons/react/24/outline"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  user: User
  userPlan?: string
  subscriptionStatus?: string
}

interface SearchResult {
  id: string
  title: string
  type: "flight" | "expense" | "team" | "page"
  href: string
  description?: string
}

const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    title: "Flight to New York",
    type: "flight",
    href: "/dashboard/flights",
    description: "JFK - LAX, Dec 15",
  },
  {
    id: "2",
    title: "Hotel Expense",
    type: "expense",
    href: "/dashboard/expenses",
    description: "$450.00 - Hilton NYC",
  },
  { id: "3", title: "John Smith", type: "team", href: "/dashboard/team", description: "Product Manager" },
  {
    id: "4",
    title: "Analytics Dashboard",
    type: "page",
    href: "/dashboard/analytics",
    description: "View travel insights",
  },
]

export default function Header({ user, userPlan = "free", subscriptionStatus = "inactive" }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications] = useState([
    {
      id: "1",
      title: "Flight booking confirmed",
      message: "Your flight to NYC has been confirmed",
      time: "2 min ago",
      unread: true,
    },
    {
      id: "2",
      title: "Expense approved",
      message: "Hotel expense of $450 has been approved",
      time: "1 hour ago",
      unread: true,
    },
    { id: "3", title: "Team invitation", message: "Sarah joined your workspace", time: "3 hours ago", unread: false },
  ])
  const [profile, setProfile] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const getProfile = async () => {
      if (user) {
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (profileData) {
          setProfile(profileData)
        }
      }
    }
    getProfile()
  }, [user, supabase])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = mockSearchResults.filter(
        (result) =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSearchResults(filtered)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const isPremium = userPlan === "premium" || userPlan === "enterprise"
  const isActive = subscriptionStatus === "active"
  const unreadCount = notifications.filter((n) => n.unread).length

  const getPageTitle = () => {
    const pathSegments = pathname.split("/").filter(Boolean)
    const lastSegment = pathSegments[pathSegments.length - 1]

    switch (lastSegment) {
      case "dashboard":
        return "Dashboard"
      case "flights":
        return "Flights"
      case "expenses":
        return "Expenses"
      case "analytics":
        return "Analytics"
      case "calendar":
        return "Calendar"
      case "team":
        return "Team"
      case "locations":
        return "Locations"
      case "meetings":
        return "Meetings"
      case "mail":
        return "Mail"
      case "ai-chat":
        return "Suitpax AI"
      case "settings":
        return "Settings"
      case "profile":
        return "Profile"
      default:
        return "Dashboard"
    }
  }

  const handleSearchSelect = (result: SearchResult) => {
    router.push(result.href)
    setShowSearch(false)
    setSearchQuery("")
  }

  const getSearchIcon = (type: string) => {
    switch (type) {
      case "flight":
        return "✈️"
      case "expense":
        return "💳"
      case "team":
        return "👤"
      case "page":
        return "📄"
      default:
        return "🔍"
    }
  }

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          {/* Left side - Page title and breadcrumb */}
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-medium tracking-tighter text-gray-900">
                <em className="font-serif italic">{getPageTitle()}</em>
              </h1>
              <p className="text-sm text-gray-500 font-light">
                Welcome back, {profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0]}
              </p>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <button
                onClick={() => setShowSearch(true)}
                className="w-full flex items-center px-4 py-2.5 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <MagnifyingGlassIcon className="h-4 w-4 mr-3" />
                <span>Search flights, expenses, team members...</span>
                <div className="ml-auto flex items-center space-x-1">
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-200 rounded">
                    ⌘
                  </kbd>
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-200 rounded">
                    K
                  </kbd>
                </div>
              </button>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Upgrade CTA for free users */}
            {!isPremium && (
              <Link href="/pricing">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white border-0"
                >
                  Upgrade to Pro
                </Button>
              </Link>
            )}

            {/* Plan Badge */}
            <Badge
              variant="secondary"
              className={`${
                isPremium && isActive
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : "bg-gray-100 text-gray-800 border-gray-200"
              }`}
            >
              {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}
              {isPremium && isActive && <span className="ml-1 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>}
            </Badge>

            {/* Notifications */}
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <BellIcon className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* AI Assistant Quick Access */}
            <Link href="/dashboard/ai-chat">
              <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50 bg-transparent">
                <CommandLineIcon className="h-4 w-4 mr-2" />
                Ask AI
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Enhanced Search Modal */}
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="sr-only">Search</DialogTitle>
          </DialogHeader>

          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search flights, expenses, team members, or pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg border-0 focus:ring-0 focus:outline-none"
              autoFocus
            />
          </div>

          {searchResults.length > 0 && (
            <div className="mt-4 max-h-96 overflow-y-auto">
              <div className="space-y-1">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSearchSelect(result)}
                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="text-lg">{getSearchIcon(result.type)}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 tracking-tight">{result.title}</p>
                      {result.description && <p className="text-sm text-gray-500">{result.description}</p>}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {result.type}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchQuery && searchResults.length === 0 && (
            <div className="mt-8 text-center py-6">
              <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
              <p className="mt-1 text-sm text-gray-500">Try searching for flights, expenses, or team members.</p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span>
                  Press <kbd className="px-1 py-0.5 bg-gray-100 rounded">↵</kbd> to select
                </span>
                <span>
                  Press <kbd className="px-1 py-0.5 bg-gray-100 rounded">esc</kbd> to close
                </span>
              </div>
              <span>Powered by Suitpax AI</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Modal */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  {unreadCount} new
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border transition-colors ${
                  notification.unread ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm tracking-tight">{notification.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                  </div>
                  {notification.unread && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full bg-transparent" size="sm">
              View All Notifications
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
