"use client"

import { SidebarFooter } from "@/components/ui/primitives/sidebar"
import Image from "next/image"

export default function FooterSidebar({ userPlan, subscriptionStatus }: { userPlan: string; subscriptionStatus: string }) {
  return (
    <SidebarFooter>
      <div className="space-y-2 px-2">
        <div className="flex items-center gap-2 text-[11px] text-gray-700">
          <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={60} height={16} className="h-3.5 w-auto" />
          <span className="ml-auto">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-gray-600">
          <a href="/terms" className="hover:text-gray-900">Terms</a>
          <a href="/privacy" className="hover:text-gray-900">Privacy</a>
          <span className="text-gray-500">All rights reserved</span>
        </div>
      </div>
    </SidebarFooter>
  )
}

