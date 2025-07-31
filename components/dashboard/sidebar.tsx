"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  HomeIcon,
  PaperAirplaneIcon,
  CreditCardIcon,
  ChartBarIcon,
  UsersIcon,
  CalendarIcon,
  MapPinIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline"
import type { User } from "@supabase/supabase-js"
import Image from "next/image"

interface SidebarProps {
  user: User
  userPlan?: string
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Flights", href: "/dashboard/flights", icon: PaperAirplaneIcon },
  { name: "Expenses", href: "/dashboard/expenses", icon: CreditCardIcon },
  { name: "Analytics", href: "/dashboard/analytics", icon: ChartBarIcon },
  { name: "Team", href: "/dashboard/team", icon: UsersIcon },
  { name: "Calendar", href: "/dashboard/calendar", icon: CalendarIcon },
  { name: "Locations", href: "/dashboard/locations", icon: MapPinIcon },
  { name: "AI Chat", href: "/dashboard/ai-chat", icon: ChatBubbleLeftRightIcon },
  { name: "Voice AI", href: "/dashboard/voice-ai", icon: MicrophoneIcon, premium: true },
  { name: "Settings", href: "/dashboard/settings", icon: Cog6ToothIcon },
]

export default function Sidebar({ user, userPlan = "free" }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const isPremium = userPlan === "premium" || userPlan === "enterprise"

  return (
    <motion.div
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white border-r border-gray-200 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-2"
              >
                <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={120} height={28} className="h-7 w-auto" />
                <div className="inline-flex items-center rounded-lg bg-gray-200 px-2 py-0.5 text-[9px] font-medium text-gray-700">
                  <SparklesIcon className="mr-1 h-2.5 w-2.5" />
                  <em className="font-serif italic">Beta</em>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {collapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const isLocked = item.premium && !isPremium

          return (
            <Link
              key={item.name}
              href={isLocked ? "#" : item.href}
              className={`
                flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-black text-white shadow-lg"
                    : isLocked
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                }
                ${collapsed ? "justify-center" : ""}
              `}
              onClick={isLocked ? (e) => e.preventDefault() : undefined}
            >
              <item.icon className={`h-5 w-5 ${collapsed ? "" : "mr-3"} flex-shrink-0`} />

              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between w-full"
                  >
                    <span>{item.name}</span>
                    {isLocked && (
                      <div className="inline-flex items-center rounded-md bg-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                        Pro
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className={`flex items-center ${collapsed ? "justify-center" : "space-x-3"}`}>
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">{user.email?.charAt(0).toUpperCase()}</span>
          </div>

          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.user_metadata?.full_name || user.email?.split("@")[0]}
                </p>
                <p className="text-xs text-gray-500 capitalize">{userPlan} plan</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
