"use client"

import { SidebarMenu } from "@/components/ui/primitives/sidebar"
import { NavigationSection } from "./sections"
import PlanUsageCard from "@/components/ui/plan-usage-card"
import { Accordion } from "@/components/ui/accordion"

export default function DashboardSidebarContent({ isCollapsed, isMobile, onCloseMobile }: { isCollapsed?: boolean; isMobile?: boolean; onCloseMobile?: () => void }) {
	return (
		<SidebarMenu className="bg-gray-100">
			<div className="px-3 py-2">
				{!isCollapsed && <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-gray-500">Navigation</div>}
				<NavigationSection isCollapsed={isCollapsed} isMobile={isMobile} onCloseMobile={onCloseMobile} />
			</div>
			{!isCollapsed && (
				<>
					<div className="px-3">
						<Accordion
							className="rounded-2xl border border-gray-200 bg-white/80"
							items={[
								{
									id: "whats-new",
									title: "What's new",
									children: (
										<ul className="list-disc pl-4 space-y-1">
											<li>Improved Flights filters and results</li>
											<li>New Suitpax AI chat experience</li>
											<li>Sidebar redesign with plan usage</li>
										</ul>
									),
								},
							]}
						/>
					</div>
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