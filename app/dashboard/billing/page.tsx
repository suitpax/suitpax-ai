import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function BillingPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: plans } = await supabase.from("plans").select("*").order("id")

  let userPlanId = 1
  let trialEndsAt: string | null = null

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan_id, trial_ends_at")
      .eq("id", user.id)
      .single()
    userPlanId = profile?.plan_id ?? 1
    trialEndsAt = profile?.trial_ends_at
  }

  const trialEndDate = trialEndsAt ? new Date(trialEndsAt) : null
  const isTrialing = trialEndDate && trialEndDate > new Date()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Plans & Billing</h1>
        {isTrialing && (
          <div className="text-sm font-medium text-gray-700 bg-gray-200 rounded-xl px-3 py-1">
            Your trial ends on {trialEndDate?.toLocaleDateString()}
          </div>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans?.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "flex flex-col bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm",
              userPlanId === plan.id && "border-2 border-emerald-950",
            )}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-medium tracking-tighter">{plan.name}</CardTitle>
              <CardDescription className="text-4xl font-bold tracking-tighter text-black">
                {plan.price_monthly ? `$${plan.price_monthly}` : "Contact Us"}
                {plan.price_monthly && <span className="text-sm font-light text-gray-500">/month</span>}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 gap-4">
              <ul className="flex flex-col gap-2 text-sm text-gray-700 flex-1">
                {plan.features.map((feature: string) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-950" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={cn(
                  userPlanId === plan.id ? "bg-gray-200 text-gray-700" : "bg-black text-white hover:bg-black/80",
                )}
                disabled={userPlanId === plan.id}
              >
                {userPlanId === plan.id ? "Current Plan" : "Upgrade"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
