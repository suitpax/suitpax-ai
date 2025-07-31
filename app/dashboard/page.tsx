import { Suspense } from "react"
import EnhancedStatsOverview from "@/components/dashboard/enhanced-stats-overview"
import EnhancedQuickActions from "@/components/dashboard/enhanced-quick-actions"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-20 mb-4" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-none">
              Dashboard
            </h1>
            <p className="text-lg font-light text-gray-600 mt-2">Welcome back to your business travel command center</p>
          </div>

          <Badge className="inline-flex items-center rounded-xl bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
            Premium Plan
          </Badge>
        </div>

        {/* Stats Overview */}
        <Suspense fallback={<DashboardSkeleton />}>
          <EnhancedStatsOverview />
        </Suspense>

        {/* Quick Actions */}
        <Suspense fallback={<DashboardSkeleton />}>
          <EnhancedQuickActions />
        </Suspense>

        {/* Recent Activity */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-medium tracking-tighter text-black">Recent Activity</h2>
            <p className="text-sm text-gray-600 mt-1">Your latest travel updates and notifications</p>
          </div>

          <Card className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Badge className="inline-flex items-center rounded-xl bg-emerald-950 px-2.5 py-0.5 text-[10px] font-medium text-white">
                  Coming Soon
                </Badge>
              </div>
              <h3 className="font-medium text-black mb-2">Activity Feed</h3>
              <p className="text-sm text-gray-600">Track your travel history, bookings, and team updates here</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
