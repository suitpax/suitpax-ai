"use client"

import { SidebarFooter } from "@/components/ui/primitives/sidebar"
import { Badge } from "@/components/ui/badge"

export default function DashboardSidebarFooter({ userPlan, subscriptionStatus }: { userPlan: string; subscriptionStatus: string }) {
  return (
    <SidebarFooter>
      <div className="rounded-2xl border border-gray-200 bg-white/80 p-3">
        <div className="text-xs text-gray-600">Plan</div>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-900">{userPlan}</div>
          <Badge className="bg-gray-200 text-gray-700 rounded-lg text-[10px]">{subscriptionStatus}</Badge>
        </div>
      </div>
    </SidebarFooter>
  )
}

