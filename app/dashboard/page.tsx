"use client"

import { DraggableDashboard } from "@/components/dashboard/draggable-dashboard"
import { BankConnectionCard } from "@/components/dashboard/bank-connection-card"
import { TopDestinationsCard } from "@/components/dashboard/top-destinations-card"
import { RadarChart } from "@/components/charts/radar-chart"
import { ExpenseTrendsChart } from "@/components/charts/expense-trends-chart"
import { BusinessMetricsChart } from "@/components/charts/business-metrics-chart"
import { TravelEfficiencyChart } from "@/components/charts/travel-efficiency-chart"
import { MonthlySpendingChart } from "@/components/charts/monthly-spending-chart"
import { motion } from "framer-motion"
import { Calendar, TrendingUp, Building2, Clock, DollarSign, Plane, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useUserData } from "@/hooks/use-user-data"
import { IncomeTrackerCard } from "@/components/dashboard/income-tracker-card"
import { RecentProjectsCard } from "@/components/dashboard/recent-projects-card"
import { ProposalProgressCard } from "@/components/dashboard/proposal-progress-card"
import { ConnectPeopleCard } from "@/components/dashboard/connect-people-card"
import { UnlockPremiumCard } from "@/components/dashboard/unlock-premium-card"
import { InsightsSummaryCard } from "@/components/dashboard/insights-summary-card"
import { KpiMiniCards } from "@/components/dashboard/kpi-mini-cards"
import { RevenueForecastCard } from "@/components/dashboard/revenue-forecast-card"
import { ActivityFeedCard } from "@/components/dashboard/activity-feed-card"
import { AiSuggestionsCard } from "@/components/dashboard/ai-suggestions-card"
import { SystemHealthCard } from "@/components/dashboard/system-health-card"
import { GoalTrackerCard } from "@/components/dashboard/goal-tracker-card"
import { DailyTasksMiniCard } from "@/components/dashboard/daily-tasks-mini-card"
import { useState } from "react"
import { PromptInput, PromptInputActions, PromptInputTextarea, PromptInputAction } from "@/components/prompt-kit/prompt-input"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"

const DashboardPage = () => {
	const { user, profile, loading } = useUserData()

	const getDisplayName = () => {
		if (profile?.full_name) return profile.full_name
		if (profile?.first_name) return profile.first_name
		if (user?.email) return user.email.split("@")[0]
		return "User"
	}

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2)
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="w-8 h-8 border-3 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
			</div>
		)
	}

	const displayName = getDisplayName()

	const dashboardCards = [
		{
			id: "income-tracker",
			title: "Income Tracker",
			component: <IncomeTrackerCard />,
		},
		{
			id: "kpi-mini",
			title: "KPI Mini Cards",
			component: <KpiMiniCards />,
		},
		{
			id: "insights-summary",
			title: "Quick Insights",
			component: <InsightsSummaryCard />,
		},
		{
			id: "user-profile",
			title: "User Profile",
			component: (
				<div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
					<div className="flex items-start justify-between mb-4">
						<div className="flex items-center space-x-4">
							<div className="relative">
								<div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-gray-600 font-medium text-lg shadow-sm">
									{getInitials(displayName)}
								</div>
								<div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-600 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
									<div className="w-2 h-2 bg-gray-300 rounded-full"></div>
								</div>
							</div>
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-1">
									<h3 className="text-lg font-medium tracking-tight text-gray-900">{displayName}</h3>
									<div className="inline-flex items-center rounded-md bg-gray-200 px-2 py-0.5 text-[9px] font-medium text-gray-700">
										{profile?.subscription_plan || "Free"}
									</div>
								</div>
								<p className="text-xs text-gray-600 mb-2">{profile?.job_title || "Business Travel Manager"}</p>
								<div className="grid grid-cols-2 gap-3 text-[10px]">
									<div className="flex items-center space-x-1.5">
										<Building2 className="h-2.5 w-2.5 text-gray-500" />
										<span className="text-gray-600">{profile?.company_name || "Your Company"}</span>
									</div>
									<div className="flex items-center space-x-1.5">
										<Clock className="h-2.5 w-2.5 text-gray-500" />
										<span className="text-gray-600">Member since {new Date().getFullYear()}</span>
									</div>
									<div className="flex items-center space-x-1.5">
										<Calendar className="h-2.5 w-2.5 text-gray-500" />
										<span className="text-gray-600">No trips yet</span>
									</div>
									<div className="flex items-center space-x-1.5">
										<TrendingUp className="h-2.5 w-2.5 text-gray-500" />
										<span className="text-gray-600">Travel Score: 0/100</span>
									</div>
								</div>
							</div>
						</div>
						<div className="text-right">
							<div className="text-[10px] text-gray-500 mb-1">This Month</div>
							<div className="text-xl font-medium text-gray-900 mb-1">$0</div>
							<div className="text-[10px] text-gray-600 mb-2">Travel Expenses</div>
							<div className="flex items-center justify-end space-x-1">
								<div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
								<span className="text-[10px] text-gray-600 font-medium">Active</span>
							</div>
						</div>
					</div>
					<div className="border-t border-gray-100 pt-3">
						<div className="grid grid-cols-3 gap-3">
							<div className="text-center">
								<div className="text-base font-medium text-gray-900 mb-1">0</div>
								<div className="text-[10px] text-gray-500">Trips Completed</div>
								<div className="w-full bg-gray-100 rounded-full h-1 mt-1.5">
									<div className="bg-gray-600 h-1 rounded-full" style={{ width: "0%" }}></div>
								</div>
							</div>
							<div className="text-center">
								<div className="text-base font-medium text-gray-900 mb-1">$0</div>
								<div className="text-[10px] text-gray-500">Total Saved</div>
								<div className="w-full bg-gray-100 rounded-full h-1 mt-1.5">
									<div className="bg-gray-500 h-1 rounded-full" style={{ width: "0%" }}></div>
								</div>
							</div>
							<div className="text-center">
								<div className="text-base font-medium text-gray-900 mb-1">0%</div>
								<div className="text-[10px] text-gray-500">Policy Compliance</div>
								<div className="w-full bg-gray-100 rounded-full h-1 mt-1.5">
									<div className="bg-gray-400 h-1 rounded-full" style={{ width: "0%" }}></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			),
		},
		{
			id: "kpi-stats",
			title: "KPI Statistics",
			component: <KpiMiniCards />,
		},
		{
			id: "bank-connection",
			title: "Bank Connection",
			component: <BankConnectionCard />,
		},
		{
			id: "top-destinations",
			title: "Top Destinations",
			component: <TopDestinationsCard />,
		},
		{
			id: "performance-radar",
			title: "Performance Radar",
			component: (
				<div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-base font-medium tracking-tight text-gray-900">Travel Performance</h3>
						<div className="flex items-center space-x-2">
							<div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
							<span className="text-[10px] text-gray-600">Current Period</span>
						</div>
					</div>
					<RadarChart />
				</div>
			),
		},
		{
			id: "expense-trends",
			title: "Expense Trends",
			component: <ExpenseTrendsChart />,
		},
		{
			id: "business-metrics",
			title: "Business Metrics",
			component: <BusinessMetricsChart />,
		},
		{
			id: "travel-efficiency",
			title: "Travel Efficiency",
			component: <TravelEfficiencyChart />,
		},
		{
			id: "monthly-spending",
			title: "Monthly Spending",
			component: <MonthlySpendingChart />,
		},
		{
			id: "proposal-progress",
			title: "Proposal Progress",
			component: <ProposalProgressCard />,
		},
		{
			id: "connect-people",
			title: "Connect People",
			component: <ConnectPeopleCard />,
		},
		{
			id: "unlock-premium",
			title: "Unlock Premium",
			component: <UnlockPremiumCard />,
		},
		{
			id: "revenue-forecast",
			title: "Revenue Forecast",
			component: <RevenueForecastCard />,
		},
		{
			id: "activity-feed",
			title: "Recent Activity",
			component: <ActivityFeedCard />,
		},
		{
			id: "ai-suggestions",
			title: "AI Suggestions",
			component: <AiSuggestionsCard />,
		},
		{
			id: "system-health",
			title: "System Health",
			component: <SystemHealthCard />,
		},
		{
			id: "goal-tracker",
			title: "Goal Tracker",
			component: <GoalTrackerCard />,
		},
		{
			id: "daily-tasks-mini",
			title: "Daily Tasks",
			component: <DailyTasksMiniCard />,
		},
		{
			id: "suitpax-ai",
			title: "Suitpax AI",
			component: (
				<Link href="/dashboard/suitpax-ai" className="block group">
					<div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6 rounded-2xl border border-gray-800 shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]">
						<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out"></div>
						<div className="absolute inset-0 opacity-10">
							<div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-gray-600 to-transparent rounded-full blur-2xl"></div>
							<div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-tr from-gray-700 to-transparent rounded-full blur-xl"></div>
						</div>
						<div className="relative z-10 flex items-start space-x-4">
							<div className="flex-shrink-0">
								<div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-600 shadow-inner bg-gray-800">
									<img src="/logo/suitpax-cloud-logo.webp" alt="Suitpax" className="w-full h-full object-contain" />
								</div>
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex items-center justify-between mb-3">
									<h3 className="text-lg font-medium tracking-tight text-gray-100">Suitpax AI</h3>
									<div className="flex items-center space-x-2">
										<div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
										<span className="text-[10px] text-gray-400 font-medium">Ready</span>
									</div>
								</div>
								<p className="text-sm text-gray-400 mb-4 leading-relaxed">
									Your intelligent travel companion powered by advanced AI. Ready to optimize your business trips and
									find the best deals.
								</p>
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<div className="inline-flex items-center rounded-lg bg-gray-800 px-2.5 py-1 text-[10px] font-medium text-gray-300 border border-gray-700">
											AI Powered
										</div>
										<div className="inline-flex items-center rounded-lg bg-gray-800 px-2.5 py-1 text-[10px] font-medium text-gray-300 border border-gray-700">
											24/7 Available
										</div>
									</div>
									<ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-200" />
								</div>
							</div>
						</div>
					</Link>
			),
		},
	]

	const [quickInput, setQuickInput] = useState("")

	return (
		<div className="p-6 max-w-7xl mx-auto">
			<div className="mb-8">
				<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
					<h1 className="text-5xl md:text-6xl font-medium leading-none text-gray-900 mb-2">Dashboard</h1>
					<p className="text-lg font-light tracking-tighter text-gray-600">Welcome back, {displayName.split(" ")[0]}</p>
					<p className="text-sm text-gray-500 font-light mt-1">
						Your comprehensive business travel management overview and insights
					</p>
				</motion.div>
				<div className="mt-6">
					<div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-3 sm:p-4">
						<div className="flex items-center justify-between mb-2">
							<p className="text-[11px] text-gray-600">Suitpax AI — Ask anything. Travel. Business. Code.</p>
						</div>
						<PromptInput value={quickInput} onValueChange={setQuickInput} onSubmit={() => {
							if (!quickInput.trim()) return
							window.location.href = `/dashboard/suitpax-ai?prompt=${encodeURIComponent(quickInput)}`
						}} isLoading={false} className="bg-white border-gray-200 shadow-sm">
							<PromptInputTextarea placeholder="Ask the AI to plan a trip, analyze an expense, or draft an email…" />
							<PromptInputActions>
								<PromptInputAction tooltip="Send">
									<Button type="submit" size="sm" className="bg-black text-white hover:bg-gray-800 rounded-2xl h-7 w-7 p-0">
										<ArrowUp className="size-3.5" />
									</Button>
								</PromptInputAction>
							</PromptInputActions>
						</PromptInput>
					</div>
				</div>
			</div>

			<DraggableDashboard
				cards={dashboardCards}
				onReorder={(newOrder) => {
					console.log("Dashboard reordered:", newOrder)
				}}
			/>
		</div>
	)
}

export default DashboardPage
