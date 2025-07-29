"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, Search, Menu, LogOut, User, Settings } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/auth-helpers-nextjs"
import toast from "react-hot-toast"

interface HeaderProps {
  user: SupabaseUser
}

export default function Header({ user }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success("Signed out successfully")
      router.push("/")
    } catch (error) {
      toast.error("Error signing out")
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        {/* Mobile menu button */}
        <button className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
          <Menu className="h-6 w-6" />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-lg mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg">
            <Bell className="h-5 w-5" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
            >
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {user.user_metadata?.full_name?.[0] || user.email?.[0] || "U"}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user.user_metadata?.full_name || "User"}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
              >
                <a
                  href="/dashboard/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User className="mr-3 h-4 w-4" />
                  Profile
                </a>
                <a
                  href="/dashboard/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  Settings
                </a>
                <hr className="my-1" />
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sign out
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
