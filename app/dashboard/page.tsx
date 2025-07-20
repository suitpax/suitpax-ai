import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import OnboardingModal from "@/components/dashboard/onboarding-modal"
import { PiAirplaneTakeoff, PiBuildings, PiWallet } from "react-icons/pi"

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    // This case should ideally not happen due to the trigger, but it's a good safeguard.
    return redirect("/login?message=Profile not found.")
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      {!profile.has_completed_onboarding && <OnboardingModal />}

      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {profile.full_name || "Traveler"}!</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-white/50 backdrop-blur-sm p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Upcoming Trips</h3>
            <PiAirplaneTakeoff className="h-4 w-4 text-gray-500" />
          </div>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-gray-500">View your upcoming travel plans</p>
        </div>
        <div className="rounded-xl border bg-white/50 backdrop-blur-sm p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Pending Expenses</h3>
            <PiWallet className="h-4 w-4 text-gray-500" />
          </div>
          <div className="text-2xl font-bold">$1,234.56</div>
          <p className="text-xs text-gray-500">+5 from last month</p>
        </div>
        <div className="rounded-xl border bg-white/50 backdrop-blur-sm p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Preferred Hotels</h3>
            <PiBuildings className="h-4 w-4 text-gray-500" />
          </div>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-gray-500">Your favorite places to stay</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-white/50 backdrop-blur-sm p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
          <p className="text-sm text-gray-600">Your recent bookings and expenses will appear here.</p>
        </div>
        <div className="col-span-3 rounded-xl border bg-white/50 backdrop-blur-sm p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Travel Policy</h3>
          <p className="text-sm text-gray-600">Your company's travel policy summary will be displayed here.</p>
        </div>
      </div>
    </div>
  )
}
