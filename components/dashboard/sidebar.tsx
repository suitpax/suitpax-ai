"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  HomeIcon,
  AirplaneIcon,
  ChartBarIcon,
  UsersIcon,
  CalendarIcon,
  MapPinIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  ChevronDownIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import toast from "react-hot-toast"

const navigationItems = [
  { name: "Overview", href: "/dashboard", icon: HomeIcon },
  { name: "Flights", href: "/dashboard/flights", icon: AirplaneIcon },
  { name: "AI Chat", href: "/dashboard/ai-chat", icon: ChatBubbleLeftRightIcon },
  { name: "Voice AI", href: "/dashboard/voice-ai", icon: MicrophoneIcon },
  { name: "Analytics", href: "/dashboard/analytics", icon: ChartBarIcon },
  { name: "Team", href: "/dashboard/team", icon: UsersIcon },
  { name: "Calendar", href: "/dashboard/calendar", icon: CalendarIcon },
  { name: "Locations", href: "/dashboard/locations", icon: MapPinIcon },
  { name: "Settings", href: "/dashboard/settings", icon: Cog6ToothIcon },
]

interface SidebarProps {
  user: User
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const supabase = createClient()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success("Signed out successfully")
      window.location.href = "/"
    } catch (error) {
      toast.error("Error signing out")
    }
  }

  const getUserInitials = (user: User) => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(" ")
        .map((name: string) => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    return user.email?.slice(0, 2).toUpperCase() || "U"
  }

  const getUserDisplayName = (user: User) => {
    return user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={100} height={24} className="h-6 w-auto" />
          <div className="inline-flex items-center rounded-lg bg-gray-200 px-2 py-0.5 text-[9px] font-medium text-gray-700">
            Dashboard
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
                isActive ? "bg-gray-100 text-black" : "text-gray-600 hover:text-black hover:bg-gray-50"
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Menu */}
      <div className="p-4 border-t border-gray-200">
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl transition-colors"
          >
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-medium mr-3">
              {getUserInitials(user)}
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-black truncate">{getUserDisplayName(user)}</div>
              <div className="text-xs text-gray-500 truncate">{user.email}</div>
            </div>
            <ChevronDownIcon className={`h-4 w-4 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg py-2"
              >
                <Link
                  href="/dashboard/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <UserCircleIcon className="mr-3 h-4 w-4" />
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50"
                >
                  <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
