"use client"

import { SidebarMenu } from "@/components/ui/primitives/sidebar"
import { NavigationSection } from "./sections"
import PlanUsageCard from "@/components/ui/plan-usage-card"
import GlobalPromptInput from "@/components/dashboard/global-prompt-input"

export default function DashboardSidebarContent({ isCollapsed, isMobile, onCloseMobile }: { isCollapsed?: boolean; isMobile?: boolean; onCloseMobile?: () => void }) {
	return (
		<SidebarMenu className="bg-gray-100">
			{!isCollapsed && (
				<div className="px-3 pt-3">
					<GlobalPromptInput placeholder="Ask Suitpax AI..." className="bg-white border border-gray-200" />
				</div>
			)}
			<div className="px-3 py-2">
				{!isCollapsed && <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-gray-500">Navigation</div>}
				<NavigationSection isCollapsed={isCollapsed} isMobile={isMobile} onCloseMobile={onCloseMobile} />
			</div>
			{!isCollapsed && (
				<>
					<div className="h-px bg-gray-200 mx-3 my-2" />
					<div className="px-3 pb-3">
						<div className="px-2 py-1 text-[10px] uppercase tracking-wider text-gray-500">Usage</div>
						<PlanUsageCard />
					</div>
				</>
			)}
		</SidebarMenu>
	)
}