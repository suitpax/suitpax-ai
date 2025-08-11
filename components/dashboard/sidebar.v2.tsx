"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Plane, Hotel, CreditCard, BarChart3, Calendar, Users, MapPin, MessageSquare, Mic, Settings, User, Building, LogOut } from "lucide-react"
import Image from "next/image"

const nav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Flights", href: "/dashboard/flights", icon: Plane },
  { name: "Hotels", href: "/dashboard/hotels", icon: Hotel },
  { name: "Finance", href: "/dashboard/finance", icon: CreditCard },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Meetings", href: "/dashboard/meetings", icon: Calendar },
  { name: "Locations", href: "/dashboard/locations", icon: MapPin },
  { name: "Team", href: "/dashboard/team", icon: Users },
]

const ai = [
  { name: "Suitpax AI", href: "/dashboard/ai-chat", icon: MessageSquare },
  { name: "Voice AI", href: "/dashboard/voice-ai", icon: Mic },
]

export default function SidebarV2({ isCollapsed, isMobile, onCloseMobile, onToggleCollapse }: { isCollapsed: boolean; isMobile: boolean; onCloseMobile: () => void; onToggleCollapse?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState<string>("")

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email || ""))
  }, [supabase])

  return (
    <aside className={cn("h-full bg-white border-r border-gray-200", isMobile ? "w-72" : isCollapsed ? "w-20" : "w-72")}> 
      <div className="p-4 flex items-center justify-between">
        <Link href="/dashboard" onClick={isMobile ? onCloseMobile : undefined} className="flex items-center gap-2">
          <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={28} height={28} className="rounded-xl border" />
          {!isCollapsed && <span className="font-medium tracking-tight">Suitpax</span>}
        </Link>
        {!isMobile && (
          <button onClick={onToggleCollapse} className="text-xs text-gray-600">{isCollapsed ? ">" : "<"}</button>
        )}
      </div>

      <div className="px-3 space-y-1">
        {nav.map((n) => {
          const active = pathname === n.href || (pathname.startsWith(n.href) && n.href !== "/dashboard")
          return (
            <Link key={n.name} href={n.href} onClick={isMobile ? onCloseMobile : undefined} className={cn("flex items-center gap-3 px-3 py-2 rounded-xl text-sm", active ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-800")}> 
              <n.icon className="h-4 w-4" />
              {!isCollapsed && <span>{n.name}</span>}
            </Link>
          )
        })}
      </div>

      {!isCollapsed && (
        <div className="px-3 mt-4">
          <div className="text-[10px] uppercase text-gray-500 mb-2">AI</div>
          <div className="space-y-1">
            {ai.map((n) => (
              <Link key={n.name} href={n.href} onClick={isMobile ? onCloseMobile : undefined} className={cn("flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-gray-100 text-gray-800", pathname === n.href && "bg-gray-900 text-white")}> 
                <n.icon className="h-4 w-4" />
                <span>{n.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
        <div className="text-xs text-gray-600 mb-2 truncate">{email}</div>
        <div className="grid grid-cols-3 gap-2">
          <Link href="/dashboard/profile" className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-800 text-center">Profile</Link>
          <Link href="/dashboard/settings" className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-800 text-center">Settings</Link>
          <button className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-800" onClick={async () => { await supabase.auth.signOut(); router.push('/auth/login') }}>
            Logout
          </button>
        </div>
      </div>
    </aside>
  )
}