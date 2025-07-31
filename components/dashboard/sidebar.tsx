"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  HomeIcon,
  PaperAirplaneIcon,
  CreditCardIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  SparklesIcon,
  CalendarIcon,
  UsersIcon,
  MapPinIcon,
  ArrowRightOnRectangleIcon,
  VideoCameraIcon,
  EnvelopeIcon,
  ChevronUpIcon,
  UserCircleIcon,
  BuildingOfficeIcon,
  CogIcon,
} from "@heroicons/react/24/outline"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Flights", href: "/dashboard/flights", icon: PaperAirplaneIcon },
  { name: "Expenses", href: "/dashboard/expenses", icon: CreditCardIcon },
  { name: "Analytics", href: "/dashboard/analytics", icon: ChartBarIcon },
  { name: "Calendar", href: "/dashboard/calendar", icon: CalendarIcon },
  { name: "Team", href: "/dashboard/team", icon: UsersIcon },
  { name: "Locations", href: "/dashboard/locations", icon: MapPinIcon },
  {
    name: "Business Intelligence",
    href: "#",
    icon: ChartBarIcon,
    children: [
      { name: "Meetings", href: "/dashboard/meetings", icon: VideoCameraIcon },
      { name: "Mail", href: "/dashboard/mail", icon: EnvelopeIcon },
    ],
  },
  { name: "Suitpax AI", href: "/dashboard/ai-chat", icon: SparklesIcon },
  { name: "Settings", href: "/dashboard/settings", icon: Cog6ToothIcon },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  // Auto-expand Business Intelligence if on meetings or mail page
  useEffect(() => {
    if (pathname.includes("/meetings") || pathname.includes("/mail")) {
      setExpandedSection("Business Intelligence")
    }
  }, [pathname])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const toggleSection = (sectionName: string) => {
    setExpandedSection(expandedSection === sectionName ? null : sectionName)
  }

  return (
    <>
      <div className="flex flex-col h-full bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={120} height={30} className="h-6 w-auto" />
            <div className="inline-flex items-center rounded-xl bg-gray-200 px-2 py-0.5 text-[9px] font-medium text-gray-700">
              <SparklesIcon className="mr-1 h-2.5 w-2.5" />
              <em className="font-serif italic">Beta</em>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            if (item.children) {
              const isExpanded = expandedSection === item.name
              const hasActiveChild = item.children.some((child) => pathname === child.href)

              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleSection(item.name)}
                    className={`w-full group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      hasActiveChild
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon
                        className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          hasActiveChild ? "text-gray-600" : "text-gray-400 group-hover:text-gray-500"
                        }`}
                      />
                      {item.name}
                    </div>
                    <ChevronUpIcon
                      className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-6 mt-1 space-y-1">
                          {item.children.map((child) => {
                            const isActive = pathname === child.href
                            return (
                              <Link key={child.name} href={child.href}>
                                <motion.div
                                  whileHover={{ x: 2 }}
                                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                    isActive
                                      ? "bg-black text-white shadow-sm"
                                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                  }`}
                                >
                                  <child.icon
                                    className={`mr-3 h-4 w-4 flex-shrink-0 ${
                                      isActive ? "text-white" : "text-gray-400 group-hover:text-gray-500"
                                    }`}
                                  />
                                  {child.name}
                                </motion.div>
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            }

            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ x: 2 }}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive ? "bg-black text-white shadow-sm" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? "text-white" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  {item.name}
                  {item.name === "Suitpax AI" && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <button
            onClick={() => setShowUserModal(true)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">{user?.email?.charAt(0).toUpperCase() || "U"}</span>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <ChevronUpIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>
      </div>

      {/* User Modal */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-gray-600">{user?.email?.charAt(0).toUpperCase() || "U"}</span>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2 pt-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                setShowUserModal(false)
                router.push("/dashboard/profile")
              }}
            >
              <UserCircleIcon className="mr-3 h-5 w-5" />
              Profile Settings
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                setShowUserModal(false)
                router.push("/dashboard/settings")
              }}
            >
              <CogIcon className="mr-3 h-5 w-5" />
              Account Settings
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                setShowUserModal(false)
                router.push("/pricing")
              }}
            >
              <BuildingOfficeIcon className="mr-3 h-5 w-5" />
              Upgrade Plan
            </Button>

            <div className="border-t pt-2 mt-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
