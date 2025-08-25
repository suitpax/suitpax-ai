"use client"

import { SidebarMenu } from "@/components/ui/primitives/sidebar"
import { NavigationSection } from "./sections"
import AccountUsageCard from "@/components/dashboard/sidebar/account-usage-card"
import { Accordion } from "@/components/ui/accordion"
import UserBadgeSidebar from "@/components/dashboard/sidebar/user-badge"
import QuickLinksSidebar from "@/components/dashboard/sidebar/quick-links"
import AlertsCardSidebar from "@/components/dashboard/sidebar/alerts-card"
import RecentActivitySidebar from "@/components/dashboard/sidebar/recent-activity"
import Link from "next/link"

export default function DashboardSidebarContent({ isCollapsed, isMobile, onCloseMobile }: { isCollapsed?: boolean; isMobile?: boolean; onCloseMobile?: () => void }) {
	return (
		<SidebarMenu className="bg-gray-100">
			<div className="px-3 py-2">
				{!isCollapsed && <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-gray-500">Navigation</div>}
				<NavigationSection isCollapsed={isCollapsed} isMobile={isMobile} onCloseMobile={onCloseMobile} />
			</div>
			{!isCollapsed && (
				<>
					<div className="px-3 space-y-2">
						<AccountUsageCard mode="admin" />
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
								{
									id: "configuration",
									title: "Configuration",
									children: (
										<div className="grid gap-1">
											<Link href="/dashboard/policies" className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 text-[13px] text-gray-900">Smart Policies</Link>
											<Link href="/dashboard/organization" className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 text-[13px] text-gray-900">Organization</Link>
											<Link href="/dashboard/pax" className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 text-[13px] text-gray-900">Pax</Link>
										</div>
									),
								},
							]}
						/>
						<QuickLinksSidebar />
						<AlertsCardSidebar />
						<RecentActivitySidebar />
					</div>
					<div className="h-px bg-gray-200 mx-3 my-2" />
					<div className="px-3 pb-3 space-y-2"></div>
				</>
			)}
		</SidebarMenu>
	)
}