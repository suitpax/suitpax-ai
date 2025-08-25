"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, CheckCircle, Settings, User, Bell, Plane } from "lucide-react"

type DashboardOnboardingProps = {
  userId: string
  onComplete?: () => void
  onSkip?: () => void
}

export default function DashboardOnboarding({ userId, onComplete, onSkip }: DashboardOnboardingProps) {
  const supabase = createClient()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    company_name: "",
    job_title: "",
    phone: "",
  })
  const [prefs, setPrefs] = useState({
    seat_preference: "aisle" as "aisle" | "window" | "middle" | "no_preference",
    meal_preference: "standard",
    class_preference: "economy" as "economy" | "premium_economy" | "business" | "first",
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  })

  useEffect(() => {
    const load = async () => {
      try {
        const { data: p } = await supabase.from("profiles").select("first_name,last_name,company_name,job_title,phone").eq("id", userId).single()
        if (p) setProfile({
          first_name: p.first_name || "",
          last_name: p.last_name || "",
          company_name: p.company_name || "",
          job_title: p.job_title || "",
          phone: p.phone || "",
        })
        const { data: up } = await supabase.from("user_preferences").select("seat_preference,meal_preference,class_preference,email_notifications,sms_notifications,push_notifications,timezone").eq("user_id", userId).single()
        if (up) setPrefs({
          seat_preference: (up.seat_preference as any) || "aisle",
          meal_preference: up.meal_preference || "standard",
          class_preference: (up.class_preference as any) || "economy",
          email_notifications: !!up.email_notifications,
          sms_notifications: !!up.sms_notifications,
          push_notifications: !!up.push_notifications,
          timezone: up.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        })
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [supabase, userId])

  const steps = useMemo(() => [
    { id: "profile", title: "Complete your profile", description: "Tell us about you and your company", icon: <User className="h-5 w-5" /> },
    { id: "preferences", title: "Travel preferences", description: "Default travel and notifications", icon: <Settings className="h-5 w-5" /> },
    { id: "finish", title: "You're all set!", description: "Save and start using your dashboard", icon: <Plane className="h-5 w-5" /> },
  ], [])

  const progress = ((currentStep) / (steps.length - 1)) * 100

  const saveProfile = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          company_name: profile.company_name,
          job_title: profile.job_title,
          phone: profile.phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
      if (error) throw error
      setCurrentStep(1)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const savePreferences = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("user_preferences")
        .upsert({
          user_id: userId,
          seat_preference: prefs.seat_preference,
          meal_preference: prefs.meal_preference,
          class_preference: prefs.class_preference,
          email_notifications: prefs.email_notifications,
          sms_notifications: prefs.sms_notifications,
          push_notifications: prefs.push_notifications,
          booking_reminders: true,
          expense_reminders: true,
          timezone: prefs.timezone,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" })
      if (error) throw error
      setCurrentStep(2)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const completeOnboarding = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ onboarding_completed: true, updated_at: new Date().toISOString() })
        .eq("id", userId)
      if (error) throw error
      localStorage.setItem("suitpax_onboarding_completed", "true")
      onComplete?.()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = async () => {
    if (currentStep === 0) return saveProfile()
    if (currentStep === 1) return savePreferences()
    if (currentStep === 2) return completeOnboarding()
  }

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1)
  }

  const renderContent = () => {
    if (currentStep === 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">First name</Label>
            <Input id="first_name" value={profile.first_name} onChange={(e) => setProfile({ ...profile, first_name: e.target.value })} placeholder="Jane" />
          </div>
          <div>
            <Label htmlFor="last_name">Last name</Label>
            <Input id="last_name" value={profile.last_name} onChange={(e) => setProfile({ ...profile, last_name: e.target.value })} placeholder="Doe" />
          </div>
          <div>
            <Label htmlFor="company_name">Company</Label>
            <Input id="company_name" value={profile.company_name} onChange={(e) => setProfile({ ...profile, company_name: e.target.value })} placeholder="Acme Inc." />
          </div>
          <div>
            <Label htmlFor="job_title">Job title</Label>
            <Input id="job_title" value={profile.job_title} onChange={(e) => setProfile({ ...profile, job_title: e.target.value })} placeholder="Operations Manager" />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+1 555 000 111" />
          </div>
        </div>
      )
    }
    if (currentStep === 1) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Seat preference</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["aisle","window","middle","no_preference"] as const).map((opt) => (
                <Button key={opt} type="button" variant={prefs.seat_preference === opt ? "default" : "outline"} className="rounded-xl" onClick={() => setPrefs({ ...prefs, seat_preference: opt })}>
                  {opt.replace("_", " ")}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Class</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["economy","premium_economy","business","first"] as const).map((opt) => (
                <Button key={opt} type="button" variant={prefs.class_preference === opt ? "default" : "outline"} className="rounded-xl" onClick={() => setPrefs({ ...prefs, class_preference: opt })}>
                  {opt.replace("_", " ")}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Notifications</Label>
            <div className="grid grid-cols-1 gap-2">
              <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={prefs.email_notifications} onChange={(e) => setPrefs({ ...prefs, email_notifications: e.target.checked })} /> Email</label>
              <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={prefs.sms_notifications} onChange={(e) => setPrefs({ ...prefs, sms_notifications: e.target.checked })} /> SMS</label>
              <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={prefs.push_notifications} onChange={(e) => setPrefs({ ...prefs, push_notifications: e.target.checked })} /> Push</label>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <p className="text-sm text-gray-600">Your dashboard is configured. You can change these settings anytime.</p>
      </div>
    )
  }

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-black to-black rounded-2xl border border-white/20 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-medium tracking-tighter text-gray-100">Set up your dashboard</CardTitle>
            <CardDescription className="text-gray-400">We will personalize your experience in a few quick steps</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-200">{currentStep + 1} of {steps.length}</div>
            <div className="text-xs text-gray-400">steps</div>
          </div>
        </div>
        <div className="mt-4">
          <Progress value={progress} className="h-2 bg-white/10" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 text-white inline-flex items-center justify-center">
            {steps[currentStep].icon}
          </div>
          <div>
            <div className="font-medium text-white">{steps[currentStep].title}</div>
            <div className="text-sm text-gray-300">{steps[currentStep].description}</div>
          </div>
          <div className="ml-auto">
            <Button type="button" variant="ghost" className="text-xs text-gray-300 hover:text-white" onClick={() => { localStorage.setItem("suitpax_onboarding_skipped", "true"); onSkip?.() }}>Skip for now</Button>
          </div>
        </div>

        {renderContent()}

        <div className="flex items-center justify-between pt-2">
          <Button type="button" variant="outline" className="rounded-xl border-white/30 text-white hover:bg-white/10" onClick={handleBack} disabled={currentStep === 0 || loading}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <Button type="button" className="rounded-xl bg-white text-black hover:bg-gray-100" onClick={handleNext} disabled={loading}>
            {currentStep < steps.length - 1 ? <>Continue <ArrowRight className="h-4 w-4 ml-2" /></> : <>Finish <CheckCircle className="h-4 w-4 ml-2" /></>}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

