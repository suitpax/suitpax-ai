"use client"

import { Menu, Bell } from "lucide-react"
import AISearchInput from "@/components/ui/ai-search-input"
import { Badge } from "@/components/ui/badge"

export default function HeaderV2({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
    <header className="bg-white/80 backdrop-blur border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onToggleSidebar} className="h-8 w-8 rounded-lg hover:bg-gray-100 inline-flex items-center justify-center">
            <Menu className="h-4 w-4" />
          </button>
          <div className="text-sm font-medium tracking-tight">Dashboard</div>
        </div>
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <AISearchInput size="md" />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">Free</Badge>
          <button className="h-8 w-8 rounded-lg hover:bg-gray-100 inline-flex items-center justify-center">
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}