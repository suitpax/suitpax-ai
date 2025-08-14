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
  PiPencil,
  PiCamera,
  PiBuilding,
  PiBriefcase,
  PiPhone,
  PiMapTrifold,
  PiRadar,
} from "react-icons/pi"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { AISidebarManager } from "@/lib/ai-sidebar-manager"
import AiSearchInput from "@/components/ui/ai-search-input"

const defaultNavigation = [
  { id: "dashboard", name: "Dashboard", href: "/dashboard", icon: PiSquaresFour },
  { id: "flights", name: "Flights", href: "/dashboard/flights", icon: PiAirplane },
  { id: "hotels", name: "Hotels", href: "/dashboard/hotels", icon: PiBuildings },
  { id: "suitpax-bank", name: "Suitpax Bank", href: "/dashboard/suitpax-bank", icon: PiBank },
  { id: "air-data", name: "Air Data", href: "/dashboard/air-data", icon: PiAirplane },
  { id: "finance", name: "Finance", href: "/dashboard/finance", icon: PiCreditCard },
  { id: "analytics", name: "Analytics", href: "/dashboard/analytics", icon: PiChartBar },

  { id: "mail", name: "Mail", href: "/dashboard/mail", icon: PiEnvelope },
  { id: "meetings", name: "Meetings", href: "/dashboard/meetings", icon: PiVideoCamera },
  { id: "locations", name: "Locations", href: "/dashboard/locations", icon: PiMapPin },
  { id: "team", name: "Team", href: "/dashboard/team", icon: PiUsers },
  { id: "expenses", name: "Expenses", href: "/dashboard/expenses", icon: PiReceipt },
  { id: "tasks", name: "Tasks", href: "/dashboard/tasks", icon: PiCheckSquare },
  { id: "policies", name: "Policies", href: "/dashboard/policies", icon: PiShield },
]

const aiNavigation = [
  { name: "Suitpax AI", href: "/dashboard/suitpax-ai", icon: PiChatCircle, badge: "AI" },
  { name: "Voice AI", href: "/dashboard/voice-ai", icon: PiMicrophone, badge: "NEW" }
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
  const [navigation, setNavigation] = useState(defaultNavigation)
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
  const [aiSidebarManager, setAiSidebarManager] = useState<AISidebarManager | null>(null)

  const setIsCollapsed = onToggleCollapse

  useEffect(() => {
    const savedOrder = localStorage.getItem("sidebar-navigation-order")
    if (savedOrder) {
      try {
        const orderIds = JSON.parse(savedOrder)
        const reorderedNav = orderIds
          .map((id: string) => defaultNavigation.find((item) => item.id === id))
          .filter(Boolean)

        const existingIds = new Set(orderIds)
        const newItems = defaultNavigation.filter((item) => !existingIds.has(item.id))

        setNavigation([...reorderedNav, ...newItems])
      } catch (error) {
        console.error("Error loading navigation order:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (user?.id) {
      const manager = new AISidebarManager(user.id)
      setAiSidebarManager(manager)

      const loadNavigationOrder = async () => {
        const storedOrder = await manager.getStoredNavigationOrder()
        if (storedOrder) {
          const reorderedNav = storedOrder
            .map((id: string) => defaultNavigation.find((item) => item.id === id))
            .filter(Boolean)

          const existingIds = new Set(storedOrder)
          const newItems = defaultNavigation.filter((item) => !existingIds.has(item.id))

          setNavigation(reorderedNav.concat(newItems))
        } else {
          const optimizedNav = await manager.optimizeNavigationForUser(defaultNavigation)
          setNavigation(optimizedNav)
        }
      }

      loadNavigationOrder()
    }
  }, [user])

  const saveNavigationOrder = async (newNavigation: typeof navigation) => {
    const orderIds = newNavigation.map((item) => item.id)
    localStorage.setItem("sidebar-navigation-order", JSON.stringify(orderIds))

    if (aiSidebarManager) {
      await aiSidebarManager.reorderNavigation(orderIds, "User manual reorder via drag & drop")
    }
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

    const draggedIndex = navigation.findIndex((item) => item.id === draggedItem)
    const targetIndex = navigation.findIndex((item) => item.id === targetId)

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

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-4 border-b border-gray-200 flex-shrink-0 bg-white">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/suitpax-bl-logo.webp"
              alt="Suitpax"
              width={120}
              height={32}
              className={cn("object-contain", isCollapsed && !isMobile ? "h-6 w-6 mx-auto" : "h-6 w-auto")}
              priority
            />
          </Link>
          <div className="hidden lg:flex items-center gap-2 mr-2">
            <span className="text-[10px] text-gray-500">{user ? (user.email?.split("@")[0] || "User") : ""}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed?.(!isCollapsed)}
            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-xl"
          >
            {isCollapsed ? <PiCaretRight className="h-4 w-4" /> : <PiCaretLeft className="h-4 w-4" />}
          </Button>
        </div>
        {!isCollapsed && (
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-700">
              Suitpax AI {process.env.NEXT_PUBLIC_APP_VERSION || "v0.1.0"}
            </span>
          </div>
        )}
      </div>

      {(!isCollapsed || isMobile) && (
        <div className="px-4 pt-3 pb-4 border-b border-gray-200">
          <AiSearchInput />
        </div>
      )}

      <nav className="flex-1 px-4 py-3 space-y-1 overflow-y-auto">
        <div className="space-y-0.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            const isDragging = draggedItem === item.id

            return (
              <div
                key={item.id}
                draggable={!isCollapsed && !isMobile}
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, item.id)}
                onDragEnd={handleDragEnd}
                className={cn("group relative", isDragging && "opacity-50")}
              >
                <Link
                  href={item.href}
                  onClick={isMobile ? onCloseMobile : undefined}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 relative",
                    isActive
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                    isCollapsed && !isMobile && "justify-center px-2",
                  )}
                  title={isCollapsed && !isMobile ? item.name : ""}
                >

                  <item.icon
                    className={cn(
                      "flex-shrink-0 h-5 w-5",
                      isCollapsed && !isMobile ? "mx-auto" : !isCollapsed && !isMobile ? "" : "mr-3",
                    )}
                    aria-hidden="true"
                  />
                  {(!isCollapsed || isMobile) && <span className="ml-1">{item.name}</span>}
                </Link>
              </div>
            )
          })}
        </div>

        {(!isCollapsed || isMobile) && (
          <div className="pt-3">
            <div className="space-y-0.5">
              {aiNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={isMobile ? onCloseMobile : undefined}
                    className={cn(
                      "group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-gray-200 text-gray-900 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className="flex-shrink-0 h-5 w-5 mr-3" aria-hidden="true" />
                      <span>{item.name}</span>
                    </div>
                    <Badge className="bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 rounded-lg">{item.badge}</Badge>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {isCollapsed && !isMobile && (
          <div className="pt-3 space-y-0.5">
            {aiNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-center px-2 py-2 text-sm font-medium rounded-xl transition-all duration-200 relative",
                    isActive
                      ? "bg-gray-200 text-gray-900 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                  )}
                  title={item.name}
                >
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      <div className="border-t border-gray-200 p-4 flex-shrink-0 space-y-3">
        {(!isCollapsed || isMobile) && (
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">AI Token Usage</span>
              <Badge className="bg-gray-200 text-gray-700 text-[10px] px-1.5 py-0.5 rounded-lg">
                {getPlanDisplayName()}
              </Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
              <div
                className="bg-gray-900 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((usageStats.tokensUsed / usageStats.maxTokens) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-600">
              <span className="text-[10px]">{usageStats.tokensUsed.toLocaleString()}</span>
              <span className="text-[10px]">{usageStats.maxTokens.toLocaleString()}</span>
            </div>
          </div>
        )}

        {(!isCollapsed || isMobile) && (
          <div className="space-y-2">
            <Link href="/dashboard/billing" onClick={isMobile ? onCloseMobile : undefined}>
              <Button
                variant="outline"
                className="w-full justify-start text-xs h-8 rounded-xl border-gray-300 bg-white hover:bg-gray-50"
              >
                <PiCrown className="h-3 w-3 mr-2" />
                Plans & Billing
              </Button>
            </Link>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-xs h-8 rounded-xl border-gray-300 bg-white hover:bg-gray-50"
                >
                  <PiGear className="h-3 w-3 mr-2" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-medium tracking-tighter">Settings</DialogTitle>
                  <DialogDescription className="font-light">Quick access to your account settings</DialogDescription>
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
                  <Link href="/dashboard/company" onClick={isMobile ? onCloseMobile : undefined}>
                    <Button variant="ghost" className="w-full justify-start rounded-xl">
                      <PiOfficeChair className="h-4 w-4 mr-3" />
                      Company Settings
                    </Button>
                  </Link>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {(!isCollapsed || isMobile) && (
          <div className="border-t border-gray-200 pt-3">
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center justify-between px-3 py-2.5 mb-2 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-8 w-8 rounded-md ring-2 ring-gray-200">
                      <AvatarImage src={userProfile?.avatar_url || "/placeholder.svg"} alt={getDisplayName()} className="rounded-md" />
                      <AvatarFallback className="rounded-md text-xs">{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{getDisplayName()}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-600 truncate">
                          {userProfile?.company_name ? userProfile.company_name : getUserEmail()}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0.5 rounded-lg bg-gray-200 text-gray-700 border-gray-200"
                        >
                          {subscriptionStatus === "active" ? "Active" : "Member"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl font-medium tracking-tighter">User Profile</DialogTitle>
                  <DialogDescription className="font-light">
                    Manage your personal information and account details
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16 ring-4 ring-gray-200 rounded-xl">
                        <AvatarImage
                          src={userProfile?.avatar_url || "/placeholder.svg"}
                          alt={getDisplayName()}
                          className="rounded-xl"
                        />
                        <AvatarFallback className="bg-gray-900 text-white text-lg font-medium rounded-xl">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <label
                        htmlFor="avatar-upload"
                        className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
                      >
                        <PiCamera className="h-3 w-3" />
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{getDisplayName()}</h3>
                      <p className="text-sm text-gray-600">{getUserEmail()}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-gray-200 text-gray-700 text-xs rounded-lg">{getPlanDisplayName()}</Badge>
                        <span className="text-xs text-gray-500">Member for {getMembershipDuration()}</span>
                      </div>
                    </div>
                  </div>

                  {!editingProfile ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                            <PiUser className="h-3 w-3" />
                            Full Name
                          </Label>
                          <p className="text-sm text-gray-900">{userProfile?.full_name || "Not set"}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                            <PiPhone className="h-3 w-3" />
                            Phone
                          </Label>
                          <p className="text-sm text-gray-900">{userProfile?.phone || "Not set"}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                            <PiBuilding className="h-3 w-3" />
                            Company
                          </Label>
                          <p className="text-sm text-gray-900">{userProfile?.company_name || "Not set"}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                            <PiBriefcase className="h-3 w-3" />
                            Job Title
                          </Label>
                          <p className="text-sm text-gray-900">{userProfile?.job_title || "Not set"}</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                          <PiMapTrifold className="h-3 w-3" />
                          Account Status
                        </Label>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-900 capitalize">{subscriptionStatus}</span>
                          <Badge className="bg-green-50 text-green-700 border-green-200 text-xs rounded-lg">
                            Verified
                          </Badge>
                        </div>
                      </div>

                      <Button
                        onClick={() => setEditingProfile(true)}
                        variant="outline"
                        className="w-full rounded-xl border-gray-300 hover:bg-gray-50"
                      >
                        <PiPencil className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first_name" className="text-xs font-medium text-gray-600">
                            First Name
                          </Label>
                          <Input
                            id="first_name"
                            value={profileForm.first_name}
                            onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                            className="rounded-xl border-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name" className="text-xs font-medium text-gray-600">
                            Last Name
                          </Label>
                          <Input
                            id="last_name"
                            value={profileForm.last_name}
                            onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                            className="rounded-xl border-gray-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="full_name" className="text-xs font-medium text-gray-600">
                          Full Name
                        </Label>
                        <Input
                          id="full_name"
                          value={profileForm.full_name}
                          onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                          className="rounded-xl border-gray-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-xs font-medium text-gray-600">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="rounded-xl border-gray-300"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company_name" className="text-xs font-medium text-gray-600">
                            Company
                          </Label>
                          <Input
                            id="company_name"
                            value={profileForm.company_name}
                            onChange={(e) => setProfileForm({ ...profileForm, company_name: e.target.value })}
                            className="rounded-xl border-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="job_title" className="text-xs font-medium text-gray-600">
                            Job Title
                          </Label>
                          <Input
                            id="job_title"
                            value={profileForm.job_title}
                            onChange={(e) => setProfileForm({ ...profileForm, job_title: e.target.value })}
                            className="rounded-xl border-gray-300"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleProfileUpdate}
                          className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-xl"
                        >
                          Save Changes
                        </Button>
                        <Button
                          onClick={() => setEditingProfile(false)}
                          variant="outline"
                          className="flex-1 rounded-xl border-gray-300 hover:bg-gray-50"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full justify-start px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl"
            >
              <PiSignOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        )}

        {isCollapsed && !isMobile && (
          <div className="border-t border-gray-200 pt-3 space-y-2">
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="icon"
              className="w-full h-8 rounded-xl hover:bg-gray-50"
              title="Sign Out"
            >
              <PiSignOut className="h-4 w-4" />
              <span className="sr-only">Sign Out</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
