import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { MetricCard } from "@/components/ui/metric-card"
import { QuickActionButton } from "@/components/ui/quick-action-button"
import { SuitpaxChat } from "@/components/ai-chat/suitpax-chat"
import { Plane, Briefcase, Users, Bot } from "lucide-react"

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()

  const welcomeMessage = profile?.full_name ? `Welcome back, ${profile.full_name}!` : "Welcome back!"

  return (
    <div className="space-y-8">
      <PageHeader title={welcomeMessage} description="Here's a summary of your business travel activity.">
        <div className="flex items-center gap-2">
          <QuickActionButton icon={Plane} label="Book a Flight" />
          <QuickActionButton icon={Briefcase} label="File an Expense" />
        </div>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={Plane} title="Active Trips" value="3" change="+1 this week" />
        <MetricCard icon={Briefcase} title="Pending Expenses" value="$1,250.75" change="-$200 vs last week" />
        <MetricCard icon={Users} title="Team Members" value="12" change="+2 this month" />
        <MetricCard icon={Bot} title="AI Agent Tasks" value="8" change="Completed" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Recent Activity</h3>
            <p className="text-sm text-gray-600">Activity feed will be displayed here.</p>
            {/* Placeholder for activity feed component */}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="h-full rounded-2xl border border-gray-200 bg-white shadow-sm">
            <SuitpaxChat />
          </div>
        </div>
      </div>
    </div>
  )
}
