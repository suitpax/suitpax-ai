import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PiPlus, PiAirplaneTilt, PiRobot, PiChartLineUp, PiGear } from "react-icons/pi"
import OnboardingModal from "@/components/dashboard/onboarding-modal"
import { SalesChart } from "@/components/dashboard/charts/sales-chart"
import { RecentSales } from "@/components/dashboard/recent-sales"

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Example: Fetch some data to determine if we show the empty state or the charts.
  // In a real app, you'd fetch bookings, expenses, etc.
  // For now, we'll simulate having data.
  const { data: bookings } = await supabase.from("bookings").select("id").limit(1)
  const hasData = bookings && bookings.length > 0

  const userName = profile?.full_name || user.email?.split("@")[0] || "User"

  return (
    <>
      <OnboardingModal />
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-medium text-gray-900">Welcome back, {userName}</h1>
          <p className="text-gray-600">Here's what's happening with your business travel today.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-gray-200 hover:shadow-sm transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Book Flight</CardTitle>
              <PiAirplaneTilt className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full border-gray-200 text-gray-700 bg-transparent">
                <PiPlus className="mr-2 h-3 w-3" />
                New Booking
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-sm transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">AI Assistant</CardTitle>
              <PiRobot className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full border-gray-200 text-gray-700 bg-transparent">
                <PiPlus className="mr-2 h-3 w-3" />
                Ask AI
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-sm transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Reports</CardTitle>
              <PiChartLineUp className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full border-gray-200 text-gray-700 bg-transparent">
                View Reports
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-sm transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Settings</CardTitle>
              <PiGear className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full border-gray-200 text-gray-700 bg-transparent">
                Configure
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Conditional Content: Data or Empty State */}
        {hasData ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <SalesChart />
            <RecentSales />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-200 rounded-lg mt-6">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <PiAirplaneTilt className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to start your journey?</h3>
            <p className="text-gray-600 mb-6 max-w-md">
              You haven't made any bookings yet. Let's get you set up with your first business trip.
            </p>
            <div className="flex gap-3">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                <PiPlus className="mr-2 h-4 w-4" />
                Book Your First Trip
              </Button>
              <Button variant="outline" className="border-gray-200 text-gray-700 bg-transparent">
                Explore Features
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
