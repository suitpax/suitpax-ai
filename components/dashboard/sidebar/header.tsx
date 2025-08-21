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

	useEffect(() => {
		const run = async () => {
			try {
				const supabase = createClient()
				const { data: { user } } = await supabase.auth.getUser()
				if (user) {
					let name = user.user_metadata?.full_name || ""
					if (!name) {
						const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()
						name = profile?.full_name || user.email?.split("@")[0] || "User"
					}
					setDisplayName(name)
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
					<div className="flex flex-col leading-tight min-w-0">
						<span className="text-[11px] text-gray-500">Suitpax</span>
						<span className="text-sm font-medium text-gray-800 truncate">{displayName || "User"}</span>
					</div>
				)}
			</div>
			<Button variant="ghost" size="sm" className="h-8 w-8 rounded-xl" onClick={onToggle || toggleSidebar}>
				{isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
			</Button>
		</SidebarHeader>
	)
}

