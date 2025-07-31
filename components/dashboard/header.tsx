"use client"

import { useState } from "react"
import { MagnifyingGlassIcon, BellIcon, Bars3Icon } from "@heroicons/react/24/outline"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

interface HeaderProps {
  user: User
  userPlan?: string
  subscriptionStatus?: string
}

export default function Header({ user, userPlan = "free", subscriptionStatus = "inactive" }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const isPremium = userPlan === "premium" || userPlan === "enterprise"
  const isActive = subscriptionStatus === "active"

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile menu button and logo */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setShowMobileMenu(true)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mr-3"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <Image className="h-8 w-auto" src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={120} height={32} />
          </div>

          {/* Search - Hidden on mobile */}
          <div className="hidden sm:block flex-1 max-w-lg">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search flights, expenses, or team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Upgrade CTA for free users */}
            {!isPremium && (
              <Link
                href="/pricing"
                className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors"
              >
                Upgrade to Pro
              </Link>
            )}

            {/* Plan Badge */}
            <div
              className={`hidden sm:inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium ${
                isPremium && isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}
              {isPremium && isActive && <span className="ml-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>}
            </div>

            {/* Notifications */}
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative">
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{user.email?.charAt(0).toUpperCase()}</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user.user_metadata?.full_name || user.email?.split("@")[0]}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user.user_metadata?.full_name || user.email?.split("@")[0]}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>

                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile Settings
                    </Link>

                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Account Settings
                    </Link>

                    {!isPremium && (
                      <Link
                        href="/pricing"
                        className="block px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Upgrade Plan
                      </Link>
                    )}

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile search */}
        <div className="mt-4 sm:hidden">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setShowMobileMenu(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden"
            >
              {/* Mobile Sidebar Content */}
              <div className="flex h-full flex-col">
                <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-200">
                  <Image
                    className="h-8 w-auto"
                    src="/logo/suitpax-bl-logo.webp"
                    alt="Suitpax"
                    width={120}
                    height={32}
                  />
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Mobile navigation items */}
                <nav className="flex-1 px-6 py-6">
                  <div className="space-y-2">
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/flights"
                      className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Flights
                    </Link>
                    <Link
                      href="/dashboard/expenses"
                      className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Expenses
                    </Link>
                    <Link
                      href="/dashboard/ai-chat"
                      className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      AI Chat
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Settings
                    </Link>
                  </div>
                </nav>

                {/* Mobile user info */}
                <div className="border-t border-gray-200 p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{user.email?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.user_metadata?.full_name || user.email?.split("@")[0]}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>

                  {!isPremium && (
                    <Link
                      href="/pricing"
                      className="mt-4 block w-full text-center px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Upgrade to Pro
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
