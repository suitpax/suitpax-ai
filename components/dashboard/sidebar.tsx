"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Plane,
  CreditCard,
  MessageSquare,
  Users,
  Settings,
  BarChart3,
  Calendar,
  Receipt,
  Menu,
  X,
  Sparkles,
} from "lucide-react"
import Image from "next/image"

interface SidebarProps {
  user: any
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "AI Travel Assistant", href: "/dashboard/ai-chat", icon: MessageSquare, badge: "AI" },
  { name: "Voice AI Agents", href: "/dashboard/voice-ai", icon: Sparkles, badge: "NEW" },
  { name: "Flight Booking", href: "/dashboard/flights", icon: Plane },
  { name: "Expenses", href: "/dashboard/expenses", icon: Receipt },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardSidebar({ user }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "free":
        return "bg-gray-100 text-gray-800"
      case "basic":
        return "bg-blue-100 text-blue-800"
      case "pro":
        return "bg-purple-100 text-purple-800"
      case "enterprise":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      {/* Mobile sidebar */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl">
          <SidebarContent
            user={user}
            pathname={pathname}
            getPlanBadgeColor={getPlanBadgeColor}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
          <SidebarContent user={user} pathname={pathname} getPlanBadgeColor={getPlanBadgeColor} />
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">Dashboard</div>
      </div>
    </>
  )
}

function SidebarContent({
  user,
  pathname,
  getPlanBadgeColor,
  onClose,
}: {
  user: any
  pathname: string
  getPlanBadgeColor: (plan: string) => string
  onClose?: () => void
}) {
  return (
    <>
      <div className="flex h-16 shrink-0 items-center justify-between">
        <Link href="/dashboard" className="flex items-center">
          <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={120} height={40} />
        </Link>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* User info */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.full_name || "Usuario"}</p>
            <p className="text-xs text-gray-500 truncate">{user?.company_name || "Empresa"}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Badge className={cn("text-xs", getPlanBadgeColor(user?.plan_type || "free"))}>
            {user?.plan_type?.toUpperCase() || "FREE"}
          </Badge>
          {user?.plan_type === "free" && (
            <Link href="/dashboard/billing">
              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                Upgrade
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* AI Tokens Usage */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-900">AI Tokens</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-purple-700">
            <span>Usados: {user?.ai_tokens_used || 0}</span>
            <span>Límite: {user?.ai_tokens_limit || 5000}</span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(((user?.ai_tokens_used || 0) / (user?.ai_tokens_limit || 5000)) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      pathname === item.href
                        ? "bg-gray-50 text-black border-r-2 border-black"
                        : "text-gray-700 hover:text-black hover:bg-gray-50",
                      "group flex gap-x-3 rounded-l-xl py-2 pl-2 pr-3 text-sm leading-6 font-medium transition-colors",
                    )}
                    onClick={onClose}
                  >
                    <item.icon
                      className={cn(
                        pathname === item.href ? "text-black" : "text-gray-400 group-hover:text-black",
                        "h-5 w-5 shrink-0",
                      )}
                    />
                    {item.name}
                    {item.badge && (
                      <Badge className="ml-auto bg-purple-100 text-purple-800 text-xs">{item.badge}</Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </>
  )
}
