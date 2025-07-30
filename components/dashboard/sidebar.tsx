"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  Home,
  Plane,
  MessageSquare,
  CreditCard,
  Users,
  Settings,
  BarChart3,
  Calendar,
  MapPin,
  Mic,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Flights", href: "/dashboard/flights", icon: Plane },
  { name: "AI Chat", href: "/dashboard/ai-chat", icon: MessageSquare },
  { name: "Voice AI", href: "/dashboard/voice-ai", icon: Mic },
  { name: "Expenses", href: "/dashboard/expenses", icon: CreditCard },
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Locations", href: "/dashboard/locations", icon: MapPin },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
          collapsed ? "w-16" : "w-64",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center">
              <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={120} height={32} className="h-8 w-auto" />
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors relative",
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <item.icon className={cn("flex-shrink-0 h-5 w-5", collapsed ? "mx-auto" : "mr-3")} aria-hidden="true" />
                {!collapsed && <span>{item.name}</span>}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-gray-100 rounded-lg -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 p-4">
          <div className={cn("flex items-center", collapsed ? "justify-center" : "space-x-3")}>
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">U</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">User</p>
                <p className="text-xs text-gray-500 truncate">user@example.com</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile backdrop */}
      <div className="lg:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75" aria-hidden="true" />
    </>
  )
}
