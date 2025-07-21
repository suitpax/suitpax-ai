import { createClient } from "@/lib/supabase/server"
import OnboardingModal from "@/components/dashboard/onboarding-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function Dashboard() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let hasCompletedOnboarding = true
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("has_completed_onboarding")
      .eq("id", user.id)
      .single()

    hasCompletedOnboarding = profile?.has_completed_onboarding ?? false
  }

  return (
    <>
      {!hasCompletedOnboarding && <OnboardingModal isOpen={!hasCompletedOnboarding} />}
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-4">
        <Card className="w-full max-w-md bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-medium tracking-tighter">Welcome to your Suitpax Dashboard</CardTitle>
            <CardDescription>This is where your business travel management begins.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Explore the sections using the sidebar to manage your trips and AI agents.</p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
