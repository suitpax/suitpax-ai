"use client"

import { SidebarHeader, useSidebar } from "@/components/ui/primitives/sidebar"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function DashboardSidebarHeader({ onToggle, isCollapsed, isMobile }: { onToggle?: () => void; isCollapsed?: boolean; isMobile?: boolean }) {
	const { toggleSidebar } = useSidebar()
	const [displayName, setDisplayName] = useState<string>("")
  const [company, setCompany] = useState<string>("")
  const [role, setRole] = useState<string>("")
  const [avatarUrl, setAvatarUrl] = useState<string>("")

	useEffect(() => {
		const run = async () => {
			try {
				const supabase = createClient()
				const { data: { user } } = await supabase.auth.getUser()
				if (user) {
					let name = user.user_metadata?.full_name || ""
					let companyName = user.user_metadata?.company || ""
					let userRole = user.user_metadata?.role || ""
          let avatar = user.user_metadata?.avatar_url || ""
					if (!name || !companyName || !userRole || !avatar) {
						const { data: profile } = await supabase.from("profiles").select("full_name, company_name, role, avatar_url").eq("id", user.id).single()
						name = name || profile?.full_name || user.email?.split("@")[0] || "User"
            companyName = companyName || profile?.company_name || ""
            userRole = userRole || profile?.role || ""
            avatar = avatar || profile?.avatar_url || ""
					}
					setDisplayName(name); setCompany(companyName); setRole(userRole); setAvatarUrl(avatar)
				}
			} catch {}
		}
		run()
	}, [])

	return (
		<SidebarHeader className="flex items-center justify-between bg-white/70 px-4">
			<div className="flex items-center gap-3 min-w-0">
				<Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={128} height={32} className="h-6 w-auto" />
        {!isCollapsed && (
          <div className="flex items-center gap-3 min-w-0">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="Avatar" width={28} height={28} className="h-7 w-7 rounded-full border border-gray-200" />
            ) : (
              <div className="h-7 w-7 rounded-full border border-gray-200 bg-gray-100" />
            )}
            <div className="leading-tight min-w-0">
              <div className="text-[11px] text-gray-500 truncate">{company || ""}</div>
              <div className="text-sm font-medium text-gray-800 truncate">{displayName || "User"}{role ? ` • ${role}` : ""}</div>
            </div>
          </div>
        )}
			</div>
			<Button variant="ghost" size="sm" className="h-8 w-8 rounded-xl" onClick={onToggle || toggleSidebar}>
				{isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
			</Button>
		</SidebarHeader>
	)
}

