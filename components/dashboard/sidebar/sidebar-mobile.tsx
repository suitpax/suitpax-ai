"use client"

import type { DashboardSidebarProps } from "./sidebar"
import DashboardSidebar from "./sidebar"

export default function DashboardSidebarMobile(props: DashboardSidebarProps) {
  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur border-r border-gray-200 md:hidden">
      <DashboardSidebar {...props} />
    </div>
  )
}

