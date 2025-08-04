"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Plane,
  Hotel,
  CreditCard,
  Users,
  Settings,
  BarChart3,
  Calendar,
  MapPin,
  MessageSquare,
  Mic,
  Mail,
  VideoIcon,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  User,
  Building,
  Crown,
  Camera,
  Upload
} from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User as SupabaseUser } from "@supabase/supabase-js"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Flights", href: "/dashboard/flights", icon: Plane },
  { name: "Hotels", href: "/dashboard/hotels", icon: Hotel },
  { name: "Expenses", href: "/dashboard/expenses", icon: CreditCard },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Locations", href: "/dashboard/locations", icon: MapPin },
  { name: "Mail", href: "/dashboard/mail", icon: Mail },
  { name: "Meetings", href: "/dashboard/meetings", icon: VideoIcon },
]

const aiNavigation = [
  { name: "AI Chat", href: "/dashboard/ai-chat", icon: MessageSquare, beta: true },
  { name: "Voice AI", href: "/dashboard/voice-ai", icon: Mic, new: true },
]

const settingsNavigation = [
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Company", href: "/dashboard/company", icon: Building },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

interface UserProfile {
  id: string
  avatar_url?: string
  full_name?: string
  company?: string
  plan?: string
  subscription_status?: string
  email?: string
}

interface SidebarProps {
  onUserUpdate?: (user: SupabaseUser) => void
  isCollapsed: boolean
  isMobile: boolean
  onCloseMobile: () => void
}

export function Sidebar({ onUserUpdate, isCollapsed, isMobile, onCloseMobile }: SidebarProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        onUserUpdate?.(user)
        
        // Obtener perfil del usuario
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
        
        if (profileData) {
          setProfile(profileData)
        } else {
          // Crear perfil si no existe
          setProfile({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
            plan: 'free',
            subscription_status: 'active'
          })
        }
      }
    }
    getUser()

    // Escuchar cambios en el perfil
    const channel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user?.id}`
        },
        (payload) => {
          if (payload.new) {
            setProfile(payload.new as UserProfile)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, onUserUpdate, user?.id])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/auth/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setIsUploadingAvatar(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Actualizar perfil con nueva URL de avatar
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      setProfile(prev => prev ? { ...prev, avatar_url: data.publicUrl } : null)
    } catch (error) {
      console.error('Error uploading avatar:', error)
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const getUserDisplayName = () => {
    return profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"
  }

  const getUserInitials = () => {
    const name = getUserDisplayName()
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getPlanBadge = () => {
    switch (profile?.plan?.toLowerCase()) {
      case 'pro':
        return (
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 text-xs">
            <Crown className="h-3 w-3 mr-1" />
            Pro
          </Badge>
        )
      case 'enterprise':
        return (
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-xs">
            Enterprise
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 text-xs">
            Free
          </Badge>
        )
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-white border-r border-gray-200 h-full shadow-sm",
        isMobile ? "w-64" : isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
        {(!isCollapsed || isMobile) && (
          <Link href="/dashboard" className="flex items-center" onClick={isMobile ? onCloseMobile : undefined}>
            <Image 
              src="/logo/suitpax-bl-logo.webp" 
              alt="Suitpax" 
              width={100} 
              height={28} 
              className="h-7 w-auto" 
            />
          </Link>
        )}
        
        {isCollapsed && !isMobile && (
          <Link href="/dashboard" className="flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <Image 
                src="/logo/suitpax-symbol-2.png" 
                alt="S" 
                width={20} 
                height={20} 
                className="w-5 h-5" 
              />
            </div>
          </Link>
        )}
        
        {isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCloseMobile}
            className="h-8 w-8 rounded-lg hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-gray-100"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* User Profile Section */}
      {(!isCollapsed || isMobile) && profile && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={profile.avatar_url} alt={getUserDisplayName()} />
                <AvatarFallback className="bg-gray-900 text-white text-sm font-medium">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <label 
                htmlFor="avatar-upload" 
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {isUploadingAvatar ? (
                  <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="h-3 w-3 text-gray-600" />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={isUploadingAvatar}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {getUserDisplayName()}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-xs text-gray-500 truncate">
                  {profile.company || user?.email}
                </p>
                {getPlanBadge()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed User Profile */}
      {isCollapsed && !isMobile && profile && (
        <div className="p-2 border-b border-gray-200 flex justify-center">
          <div className="relative">
            <Avatar className="w-8 h-8">
              <AvatarImage src={profile.avatar_url} alt={getUserDisplayName()} />
              <AvatarFallback className="bg-gray-900 text-white text-xs font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={isMobile ? onCloseMobile : undefined}
                className={cn(
                  "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-gray-900 text-white shadow-sm" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                  (isCollapsed && !isMobile) && "justify-center px-2"
                )}
                title={(isCollapsed && !isMobile) ? item.name : ""}
              >
                <item.icon 
                  className={cn(
                    "flex-shrink-0 h-5 w-5", 
                    (isCollapsed && !isMobile) ? "mx-auto" : "mr-3"
                  )} 
                />
                {(!isCollapsed || isMobile) && <span>{item.name}</span>}
              </Link>
            )
          })}
        </div>

        {/* AI Section */}
        <div className="pt-4">
          {(!isCollapsed || isMobile) && (
            <p className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              AI Assistant
            </p>
          )}
          <div className="space-y-1">
            {aiNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={isMobile ? onCloseMobile : undefined}
                  className={cn(
                    "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-gray-900 text-white shadow-sm" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                    (isCollapsed && !isMobile) && "justify-center px-2"
                  )}
                  title={(isCollapsed && !isMobile) ? item.name : ""}
                >
                  <item.icon 
                    className={cn(
                      "flex-shrink-0 h-5 w-5", 
                      (isCollapsed && !isMobile) ? "mx-auto" : "mr-3"
                    )} 
                  />
                  {(!isCollapsed || isMobile) && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {item.beta && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs ml-2">
                          Beta
                        </Badge>
                      )}
                      {item.new && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs ml-2">
                          New
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Settings Section */}
      <div className="border-t border-gray-200 p-3 flex-shrink-0">
        {(!isCollapsed || isMobile) && (
          <p className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            Settings
          </p>
        )}
        <nav className="space-y-1 mb-3">
          {settingsNavigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={isMobile ? onCloseMobile : undefined}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-gray-100 text-gray-900" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  (isCollapsed && !isMobile) && "justify-center px-2"
                )}
                title={(isCollapsed && !isMobile) ? item.name : ""}
              >
                <item.icon 
                  className={cn(
                    "flex-shrink-0 h-4 w-4", 
                    (isCollapsed && !isMobile) ? "mx-auto" : "mr-3"
                  )} 
                />
                {(!isCollapsed || isMobile) && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Sign Out Button */}
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className={cn(
            "w-full justify-start px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all duration-200",
            (isCollapsed && !isMobile) && "justify-center px-2"
          )}
          title={(isCollapsed && !isMobile) ? "Sign Out" : ""}
        >
          <LogOut 
            className={cn(
              "h-4 w-4", 
              (isCollapsed && !isMobile) ? "mx-auto" : "mr-3"
            )} 
          />
          {(!isCollapsed || isMobile) && <span>Sign Out</span>}
        </Button>
      </div>
    </div>
  )