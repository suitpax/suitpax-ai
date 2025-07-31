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
  BellIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  PlusIcon,
  CheckIcon,
} from "@heroicons/react/24/outline"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

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

interface SidebarProps {
  onUserUpdate?: (user: any) => void
}

export function Sidebar({ onUserUpdate }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const [loading, setLoading] = useState(true)
  const [userPlan, setUserPlan] = useState("free")
  const [notifications, setNotifications] = useState(3)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setUser(user)
          onUserUpdate?.(user)

          // Get user profile
          const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

          if (profileData) {
            setProfile(profileData)
            setUserPlan(profileData.plan || "free")
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }
    getUser()
  }, [supabase, onUserUpdate])

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

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    // Here you would implement actual theme switching logic
  }

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "premium":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPlanName = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return "Enterprise"
      case "premium":
        return "Premium"
      default:
        return "Free"
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-white border-r border-gray-200">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex-1 px-4 py-6 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col h-full bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={120} height={30} className="h-6 w-auto" />
            <Badge variant="secondary" className="text-[9px] px-1.5 py-0.5">
              <SparklesIcon className="mr-1 h-2.5 w-2.5" />
              <em className="font-serif italic">Beta</em>
            </Badge>
          </Link>

          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <BellIcon className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
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
                      <span className="font-medium tracking-tight">{item.name}</span>
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
                                  <span className="font-medium tracking-tight">{child.name}</span>
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
                  <span className="font-medium tracking-tight">{item.name}</span>
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
            <div className="relative">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">{user?.email?.charAt(0).toUpperCase() || "U"}</span>
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-gray-900 truncate tracking-tight">
                {profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                <Badge className={`text-[10px] px-1.5 py-0 ${getPlanBadgeColor(userPlan)}`}>
                  {getPlanName(userPlan)}
                </Badge>
              </div>
            </div>
            <ChevronUpIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </button>
        </div>
      </div>

      {/* Enhanced User Modal */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center space-x-4">
              <div className="relative">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url || "/placeholder.svg"}
                    alt="Profile"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-white">
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-lg font-medium text-gray-900 tracking-tight">
                  {profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={`text-xs ${getPlanBadgeColor(userPlan)}`}>{getPlanName(userPlan)}</Badge>
                  {profile?.company_name && (
                    <Badge variant="outline" className="text-xs">
                      {profile.company_name}
                    </Badge>
                  )}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-1">
            {/* Account Section */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">Account</p>

              <Button
                variant="ghost"
                className="w-full justify-start h-auto py-3"
                onClick={() => {
                  setShowUserModal(false)
                  router.push("/dashboard/profile")
                }}
              >
                <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400" />
                <div className="text-left">
                  <p className="font-medium tracking-tight">Profile Settings</p>
                  <p className="text-xs text-gray-500">Manage your personal information</p>
                </div>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-auto py-3"
                onClick={() => {
                  setShowUserModal(false)
                  router.push("/dashboard/settings")
                }}
              >
                <CogIcon className="mr-3 h-5 w-5 text-gray-400" />
                <div className="text-left">
                  <p className="font-medium tracking-tight">Account Settings</p>
                  <p className="text-xs text-gray-500">Security, notifications, and preferences</p>
                </div>
              </Button>
            </div>

            <Separator className="my-2" />

            {/* Workspace Section */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">Workspace</p>

              <Button
                variant="ghost"
                className="w-full justify-start h-auto py-3"
                onClick={() => {
                  setShowUserModal(false)
                  router.push("/dashboard/team")
                }}
              >
                <UsersIcon className="mr-3 h-5 w-5 text-gray-400" />
                <div className="text-left">
                  <p className="font-medium tracking-tight">Team Management</p>
                  <p className="text-xs text-gray-500">Invite and manage team members</p>
                </div>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-auto py-3"
                onClick={() => {
                  setShowUserModal(false)
                  // Handle workspace switching
                }}
              >
                <BuildingOfficeIcon className="mr-3 h-5 w-5 text-gray-400" />
                <div className="flex-1 text-left">
                  <p className="font-medium tracking-tight">Switch Workspace</p>
                  <p className="text-xs text-gray-500">Change to another organization</p>
                </div>
                <PlusIcon className="h-4 w-4 text-gray-400" />
              </Button>
            </div>

            <Separator className="my-2" />

            {/* Theme Section */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">Appearance</p>

              <div className="px-3 py-2">
                <div className="flex items-center space-x-2">
                  {[
                    { value: "light", icon: SunIcon, label: "Light" },
                    { value: "dark", icon: MoonIcon, label: "Dark" },
                    { value: "system", icon: ComputerDesktopIcon, label: "System" },
                  ].map((themeOption) => (
                    <button
                      key={themeOption.value}
                      onClick={() => handleThemeChange(themeOption.value as any)}
                      className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                        theme === themeOption.value
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <themeOption.icon className="h-3 w-3" />
                      <span>{themeOption.label}</span>
                      {theme === themeOption.value && <CheckIcon className="h-3 w-3" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Separator className="my-2" />

            {/* Upgrade Section */}
            {userPlan === "free" && (
              <>
                <div className="space-y-1">
                  <Button
                    className="w-full justify-start h-auto py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
                    onClick={() => {
                      setShowUserModal(false)
                      router.push("/pricing")
                    }}
                  >
                    <SparklesIcon className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium tracking-tight">Upgrade to Premium</p>
                      <p className="text-xs opacity-90">Unlock advanced features and analytics</p>
                    </div>
                  </Button>
                </div>
                <Separator className="my-2" />
              </>
            )}

            {/* Sign Out */}
            <div className="pt-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                <span className="font-medium tracking-tight">Sign Out</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
