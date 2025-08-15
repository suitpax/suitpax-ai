"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  PiSquaresFour,
  PiAirplane,
  PiBuildings,
  PiCreditCard,
  PiUsers,
  PiGear,
  PiChartBar,
  PiMapPin,
  PiChatCircle,
  PiMicrophone,
  PiCaretLeft,
  PiCaretRight,
  PiSignOut,
  PiUser,
  PiOfficeChair,
  PiEnvelope,
  PiVideoCamera,
  PiReceipt,
  PiCrown,
  PiCheckSquare,
  PiShield,
  PiBank,
  PiDiscThin,
} from "react-icons/pi"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import Image from "next/image"
import AiSearchInput from "@/components/ui/ai-search-input"

const coreNavigation = [
  { id: "dashboard", name: "Dashboard", href: "/dashboard", icon: PiSquaresFour },
  { id: "analytics", name: "Analytics", href: "/dashboard/analytics", icon: PiChartBar },
]

const travelNavigation = [
  { id: "flights", name: "Flights", href: "/dashboard/flights", icon: PiAirplane },
  { id: "hotels", name: "Hotels", href: "/dashboard/hotels", icon: PiBuildings },
  { id: "locations", name: "Locations", href: "/dashboard/locations", icon: PiMapPin },
]

const businessNavigation = [
  { id: "suitpax-bank", name: "Suitpax Bank", href: "/dashboard/suitpax-bank", icon: PiBank },
  { id: "finance", name: "Finance", href: "/dashboard/finance", icon: PiCreditCard },
  { id: "expenses", name: "Expenses", href: "/dashboard/expenses", icon: PiReceipt },
  { id: "policies", name: "Policies", href: "/dashboard/policies", icon: PiShield },
]

const workspaceNavigation = [
  { id: "mail", name: "Mail", href: "/dashboard/mail", icon: PiEnvelope },
  { id: "meetings", name: "Meetings", href: "/dashboard/meetings", icon: PiVideoCamera },
  { id: "team", name: "Team", href: "/dashboard/team", icon: PiUsers },
  { id: "tasks", name: "Tasks", href: "/dashboard/tasks", icon: PiCheckSquare },
]

const aiNavigation = [
  { name: "Suitpax AI", href: "/dashboard/suitpax-ai", icon: PiChatCircle, badge: "AI" },
  { name: "Voice AI", href: "/dashboard/voice-ai", icon: PiMicrophone, badge: "NEW" },
  { name: "Radar", href: "/dashboard/radar", icon: PiDiscThin, badge: "BETA" },
]

interface SidebarProps {
  onUserUpdate?: (user: SupabaseUser) => void
  isCollapsed: boolean
  isMobile: boolean
  onCloseMobile: () => void
  onToggleCollapse?: () => void
  userPlan: string
  subscriptionStatus: string
}

interface UserProfile {
  id: string
  full_name?: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  company_name?: string
  job_title?: string
  phone?: string
  subscription_plan: "free" | "premium" | "enterprise"
  subscription_status: "active" | "inactive" | "cancelled" | "trialing"
  ai_tokens_used: number
  ai_tokens_limit: number
  created_at: string
  updated_at: string
}

export function Sidebar({
  onUserUpdate,
  isCollapsed,
  isMobile,
  onCloseMobile,
  onToggleCollapse,
  userPlan,
  subscriptionStatus,
}: SidebarProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [usageStats, setUsageStats] = useState({
    tokensUsed: 0,
    maxTokens: 10000,
  })
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    first_name: "",
    last_name: "",
    company_name: "",
    job_title: "",
    phone: "",
  })
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [aiSidebarManager, setAiSidebarManager] = useState<null>(null)

  const setIsCollapsed = onToggleCollapse

  useEffect(() => {
    const savedOrder = localStorage.getItem("sidebar-navigation-order")
    if (savedOrder) {
      try {
        const orderIds = JSON.parse(savedOrder)
        const reorderedNav = orderIds
          .map(
            (id: string) =>
              coreNavigation.find((item) => item.id === id) ||
              travelNavigation.find((item) => item.id === id) ||
              businessNavigation.find((item) => item.id === id) ||
              workspaceNavigation.find((item) => item.id === id),
          )
          .filter(Boolean)

        const existingIds = new Set(orderIds)
        const newItems = [...coreNavigation, ...travelNavigation, ...businessNavigation, ...workspaceNavigation].filter(
          (item) => !existingIds.has(item.id),
        )

        setNavigation([...reorderedNav, ...newItems])
      } catch (error) {
        console.error("Error loading navigation order:", error)
      }
    }
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-navigation-order")
    if (stored) {
      try {
        const ids = JSON.parse(stored)
        const reordered = ids
          .map(
            (id: string) =>
              coreNavigation.find((n) => n.id === id) ||
              travelNavigation.find((n) => n.id === id) ||
              businessNavigation.find((n) => n.id === id) ||
              workspaceNavigation.find((n) => n.id === id),
          )
          .filter(Boolean)
        const existing = new Set(ids)
        const rest = [...coreNavigation, ...travelNavigation, ...businessNavigation, ...workspaceNavigation].filter(
          (n) => !existing.has(n.id),
        )
        setNavigation(reordered.concat(rest))
      } catch {}
    }
  }, [user])

  const saveNavigationOrder = async (newNavigation: any) => {
    const orderIds = newNavigation.map((item: any) => item.id)
    localStorage.setItem("sidebar-navigation-order", JSON.stringify(orderIds))
  }

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()

    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null)
      return
    }

    const draggedIndex = navigation.findIndex((item: any) => item.id === draggedItem)
    const targetIndex = navigation.findIndex((item: any) => item.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newNavigation = [...navigation]
    const [draggedItemData] = newNavigation.splice(draggedIndex, 1)
    newNavigation.splice(targetIndex, 0, draggedItemData)

    setNavigation(newNavigation)
    saveNavigationOrder(newNavigation)
    setDraggedItem(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        onUserUpdate?.(user)

        try {
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

          if (profile) {
            setUserProfile(profile)
            setUsageStats({
              tokensUsed: profile.ai_tokens_used || 0,
              maxTokens: profile.ai_tokens_limit || 10000,
            })
            setProfileForm({
              full_name: profile.full_name || "",
              first_name: profile.first_name || "",
              last_name: profile.last_name || "",
              company_name: profile.company_name || "",
              job_title: profile.job_title || "",
              phone: profile.phone || "",
            })
          }
        } catch (error) {
          console.error("Error fetching profile:", error)
        }
      }
    }
    getUser()

    const handler = (e: Event) => {
      const detail: any = (e as CustomEvent).detail || {}
      setUserProfile((prev) => ({ ...prev, ...detail }))
    }
    if (typeof window !== "undefined") {
      window.addEventListener("profile:updated", handler)
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("profile:updated", handler)
      }
    }
  }, [supabase, onUserUpdate])

  const handleProfileUpdate = async () => {
    if (!user || !userProfile) return

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profileForm.full_name,
          first_name: profileForm.first_name,
          last_name: profileForm.last_name,
          company_name: profileForm.company_name,
          job_title: profileForm.job_title,
          phone: profileForm.phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      setUserProfile((prev) => ({
        ...prev!,
        ...profileForm,
        updated_at: new Date().toISOString(),
      }))

      setEditingProfile(false)

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("profile:updated", {
            detail: profileForm,
          }),
        )
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (updateError) throw updateError

      setUserProfile((prev) => ({
        ...prev!,
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      }))
    } catch (error) {
      console.error("Error uploading avatar:", error)
      alert("Failed to upload avatar. Please try again.")
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/auth/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const getDisplayName = () => {
    if (!user) return "User"
    return userProfile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
  }

  const getInitials = () => {
    const name = getDisplayName()
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getUserEmail = () => {
    if (!user) return ""
    return user.email || ""
  }

  const getPlanDisplayName = () => {
    return userPlan.charAt(0).toUpperCase() + userPlan.slice(1).toLowerCase()
  }

  const getMembershipDuration = () => {
    if (!userProfile?.created_at) return "New member"
    const createdDate = new Date(userProfile.created_at)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - createdDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 30) return `${diffDays} days`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`
    return `${Math.floor(diffDays / 365)} years`
  }

  const [navigation, setNavigation] = useState([
    ...coreNavigation,
    ...travelNavigation,
    ...businessNavigation,
    ...workspaceNavigation,
  ])

  const renderNavigationSection = (items: any, title?: string) => (
    <div className="space-y-0.5">
      {!isCollapsed && !isMobile && title && (
        <div className="px-3 py-1">
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{title}</span>
        </div>
      )}
      {items.map((item: any) => {
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))

        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={isMobile ? onCloseMobile : undefined}
            className={cn(
              "flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group",
              isActive ? "bg-gray-900 text-white shadow-sm" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
              isCollapsed && !isMobile && "justify-center px-2",
            )}
            title={isCollapsed && !isMobile ? item.name : ""}
          >
            <item.icon
              className={cn(
                "flex-shrink-0 h-5 w-5 transition-transform group-hover:scale-110",
                isCollapsed && !isMobile ? "mx-auto" : "mr-3",
              )}
              aria-hidden="true"
            />
            {(!isCollapsed || isMobile) && <span>{item.name}</span>}
          </Link>
        )
      })}
    </div>
  )

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300 shadow-sm",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-4 border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between mb-3">
          <Link href="/dashboard" className="flex items-center group">
            <Image
              src="/suitpax-bl-logo.webp"
              alt="Suitpax"
              width={120}
              height={32}
              className={cn(
                "object-contain transition-transform group-hover:scale-105",
                isCollapsed && !isMobile ? "h-6 w-6 mx-auto" : "h-6 w-auto",
              )}
              priority
            />
          </Link>
          {!isCollapsed && !isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed?.(!isCollapsed)}
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-xl transition-all hover:scale-110"
            >
              <PiCaretLeft className="h-4 w-4" />
            </Button>
          )}
          {isCollapsed && !isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed?.(!isCollapsed)}
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-xl transition-all hover:scale-110"
            >
              <PiCaretRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {!isCollapsed && !isMobile && (
          <div className="space-y-3">
            {/* User info section */}
            <div className="flex items-center gap-3">
              <div className="relative">
                {userProfile?.avatar_url ? (
                  <Image
                    src={userProfile.avatar_url || "/placeholder.svg"}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-200">
                    <span className="text-sm font-medium text-gray-600">{getInitials()}</span>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{getDisplayName()}</p>
                <p className="text-xs text-gray-500 truncate">{userProfile?.company_name || "Personal Account"}</p>
              </div>
            </div>

            {/* Plan badge and status */}
            <div className="flex items-center justify-between">
              <Badge className="bg-gray-200 text-gray-900 text-xs px-3 py-1 rounded-full font-medium border-0">
                {getPlanDisplayName()}
              </Badge>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] text-gray-500 font-medium">Online</span>
              </div>
            </div>

            {/* Additional info */}
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Member for</span>
                <span className="font-medium">{getMembershipDuration()}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="font-medium capitalize text-green-600">{subscriptionStatus}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {(!isCollapsed || isMobile) && (
        <div className="px-4 pt-4 pb-3 border-b border-gray-100">
          <AiSearchInput />
        </div>
      )}

      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
        {renderNavigationSection(coreNavigation)}
        {renderNavigationSection(travelNavigation, "Travel")}
        {renderNavigationSection(businessNavigation, "Business")}
        {renderNavigationSection(workspaceNavigation, "Workspace")}

        <div className="pt-2 border-t border-gray-100">
          {!isCollapsed && !isMobile && (
            <div className="px-3 py-2 mb-2">
              <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">AI Assistant</span>
            </div>
          )}
          <div className="space-y-0.5">
            {aiNavigation.map((item: any) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={isMobile ? onCloseMobile : undefined}
                  className={cn(
                    "group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                    isCollapsed && !isMobile && "justify-center px-2",
                  )}
                  title={isCollapsed && !isMobile ? item.name : ""}
                >
                  <div className="flex items-center">
                    <item.icon
                      className={cn(
                        "flex-shrink-0 h-5 w-5 transition-transform group-hover:scale-110",
                        isCollapsed && !isMobile ? "mx-auto" : "mr-3",
                      )}
                      aria-hidden="true"
                    />
                    {(!isCollapsed || isMobile) && <span>{item.name}</span>}
                  </div>
                  {(!isCollapsed || isMobile) && (
                    <Badge
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-lg font-medium",
                        item.badge === "AI" && "bg-blue-100 text-blue-700",
                        item.badge === "NEW" && "bg-green-100 text-green-700",
                        item.badge === "BETA" && "bg-orange-100 text-orange-700",
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <div className="border-t border-gray-200 p-4 flex-shrink-0 space-y-4 bg-gradient-to-t from-gray-50 to-white">
        {(!isCollapsed || isMobile) && (
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-700">AI Token Usage</span>
              <Badge className="bg-gray-200 text-gray-900 text-[10px] px-2 py-1 rounded-full font-medium border-0">
                {getPlanDisplayName()}
              </Badge>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min((usageStats.tokensUsed / usageStats.maxTokens) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-gray-600 font-medium">
              <span>{usageStats.tokensUsed.toLocaleString()} used</span>
              <span>{usageStats.maxTokens.toLocaleString()} total</span>
            </div>
          </div>
        )}

        {(!isCollapsed || isMobile) && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full p-3 h-auto rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center gap-3 w-full">
                  {userProfile?.avatar_url ? (
                    <Image
                      src={userProfile.avatar_url || "/placeholder.svg"}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center border border-gray-200">
                      <span className="text-xs font-medium text-gray-600">{getInitials()}</span>
                    </div>
                  )}
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{getDisplayName()}</p>
                    <p className="text-xs text-gray-500 truncate">{getUserEmail()}</p>
                  </div>
                  <PiGear className="h-4 w-4 text-gray-400" />
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-medium tracking-tighter">Account Settings</DialogTitle>
                <DialogDescription className="font-light">Manage your account and preferences</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <Link href="/dashboard/profile" onClick={isMobile ? onCloseMobile : undefined}>
                  <Button variant="ghost" className="w-full justify-start rounded-xl">
                    <PiUser className="h-4 w-4 mr-3" />
                    Profile Settings
                  </Button>
                </Link>
                <Link href="/dashboard/settings" onClick={isMobile ? onCloseMobile : undefined}>
                  <Button variant="ghost" className="w-full justify-start rounded-xl">
                    <PiGear className="h-4 w-4 mr-3" />
                    Account Settings
                  </Button>
                </Link>
                <Link href="/dashboard/billing" onClick={isMobile ? onCloseMobile : undefined}>
                  <Button variant="ghost" className="w-full justify-start rounded-xl">
                    <PiCrown className="h-4 w-4 mr-3" />
                    Plans & Billing
                  </Button>
                </Link>
                <Link href="/dashboard/company" onClick={isMobile ? onCloseMobile : undefined}>
                  <Button variant="ghost" className="w-full justify-start rounded-xl">
                    <PiOfficeChair className="h-4 w-4 mr-3" />
                    Company Settings
                  </Button>
                </Link>
                <div className="border-t pt-2">
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    className="w-full justify-start rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <PiSignOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
