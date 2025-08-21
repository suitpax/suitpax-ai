"use client"

import type { User as SupabaseUser } from "@supabase/supabase-js"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { MessageSquare, Mic, Plane, LayoutDashboard, BarChart3, Settings, CreditCard } from "lucide-react"
import DashboardSidebarHeader from "./header"
import DashboardSidebarContent from "./content"
import DashboardSidebarFooter from "./footer"

export interface DashboardSidebarProps {
  onUserUpdate?: (user: SupabaseUser) => void
  isCollapsed: boolean
  isMobile: boolean
  onCloseMobile: () => void
  onToggleCollapse?: () => void
  userPlan: string
  subscriptionStatus: string
}

export default function DashboardSidebar({ isCollapsed, isMobile, onCloseMobile, onToggleCollapse, userPlan, subscriptionStatus }: DashboardSidebarProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col bg-white/70 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <DashboardSidebarHeader onToggle={onToggleCollapse} isCollapsed={isCollapsed} isMobile={isMobile} />
      <div className="flex-1 overflow-y-auto">
        <DashboardSidebarContent isCollapsed={isCollapsed} isMobile={isMobile} onCloseMobile={onCloseMobile} />
      </div>
      <DashboardSidebarFooter userPlan={userPlan} subscriptionStatus={subscriptionStatus} />
    </div>
  )
}

