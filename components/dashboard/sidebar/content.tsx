"use client"

import { SidebarMenu } from "@/components/ui/primitives/sidebar"
import { NavigationSection } from "./sections"
import { Accordion } from "@/components/ui/accordion"
import UserBadgeSidebar from "@/components/dashboard/sidebar/user-badge"
import QuickLinksSidebar from "@/components/dashboard/sidebar/quick-links"
import AlertsCardSidebar from "@/components/dashboard/sidebar/alerts-card"
import RecentActivitySidebar from "@/components/dashboard/sidebar/recent-activity"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function DashboardSidebarContent({ isCollapsed, isMobile, onCloseMobile }: { isCollapsed?: boolean; isMobile?: boolean; onCloseMobile?: () => void }) {
	const supabase = createClient()
	const [alerts, setAlerts] = useState<Array<{ id: number|string; title: string; time: string }>>([])
	const [activities, setActivities] = useState<Array<{ id: number|string; user: string; action: string; time: string; avatar_url?: string }>>([])

	useEffect(() => {
		const load = async () => {
			try {
				const { data: alertsData } = await supabase.from("alerts").select("id, title, created_at").order("created_at", { ascending: false }).limit(5)
				if (alertsData && Array.isArray(alertsData)) {
					setAlerts(alertsData.map((a: any) => ({ id: a.id, title: a.title, time: new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })))
				}
			} catch {}
			try {
				const { data: acts } = await supabase.from("activities").select("id, user_name, action, created_at, avatar_url").order("created_at", { ascending: false }).limit(6)
				if (acts && Array.isArray(acts)) {
					setActivities(acts.map((e: any) => ({ id: e.id, user: e.user_name || "", action: e.action || "", time: new Date(e.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), avatar_url: e.avatar_url || undefined })))
				}
			} catch {}
		}
		load()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return (
		<SidebarMenu className="bg-gray-100">
			<div className="px-3 py-2">
				{!isCollapsed && <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-gray-500">Navigation</div>}
				<NavigationSection isCollapsed={isCollapsed} isMobile={isMobile} onCloseMobile={onCloseMobile} />
			</div>
			{!isCollapsed && (
				<>
					<div className="px-3 space-y-2">
						<Accordion
							className="rounded-2xl border border-gray-200 bg-white/80"
							items={[
								{
									id: "whats-new",
									title: "What's new",
									children: (
										<div className="space-y-2">
											<div className="text-[12px] text-gray-700">Suitpax <span className="font-light">v0.9.0</span></div>
											<div className="text-[12px] text-gray-700">New airlines added</div>
										</div>
									),
								},
							]}
						/>
						<QuickLinksSidebar />
						<AlertsCardSidebar alerts={alerts} />
						<RecentActivitySidebar events={activities} />
					</div>
					<div className="h-px bg-gray-200 mx-3 my-2" />
					<div className="px-3 pb-3 space-y-2"></div>
				</>
			)}
		</SidebarMenu>
	)
}