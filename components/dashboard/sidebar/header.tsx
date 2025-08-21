"use client"

import { SidebarHeader, useSidebar } from "@/components/ui/primitives/sidebar"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function DashboardSidebarHeader({ onToggle, isCollapsed, isMobile }: { onToggle?: () => void; isCollapsed?: boolean; isMobile?: boolean }) {
  const { toggleSidebar } = useSidebar()
  return (
    <SidebarHeader className="flex items-center justify-between bg-white/70">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center">
          <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={20} height={10} className="h-3 w-auto" />
        </div>
        {!isCollapsed && <span className="text-sm font-medium text-gray-700">Suitpax</span>}
      </div>
      <Button variant="ghost" size="sm" className="h-8 w-8 rounded-xl" onClick={onToggle || toggleSidebar}>
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </SidebarHeader>
  )
}

