"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { CheckCircle, ArrowRight, Settings, User, Plane } from "lucide-react"

type Props = {
  userId: string
  open: boolean
  onOpenChange: (v: boolean) => void
  onComplete?: () => void
}

export default function OnboardingModal({ userId, open, onOpenChange, onComplete }: Props) {
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({ first_name: "", last_name: "", company_name: "", job_title: "" })
  const [prefs, setPrefs] = useState({ seat_preference: "aisle" as "aisle" | "window" | "middle" | "no_preference", class_preference: "economy" as "economy" | "premium_economy" | "business" | "first" })

  useEffect(() => {
    if (!open) return
    const load = async () => {
      try {
        const { data: p } = await supabase.from("profiles").select("first_name,last_name,company_name,job_title").eq("id", userId).single()
        if (p) setProfile({ first_name: p.first_name || "", last_name: p.last_name || "", company_name: p.company_name || "", job_title: p.job_title || "" })
      } catch {}
    }
    load()
  }, [open, supabase, userId])

  const saveProfile = async () => {
    setSaving(true)
    try {
      const { error } = await supabase.from("profiles").update({ ...profile, updated_at: new Date().toISOString() }).eq("id", userId)
      if (error) throw error
      setStep(1)
    } finally { setSaving(false) }
  }

  const savePrefs = async () => {
    setSaving(true)
    try {
      const { error } = await supabase.from("user_preferences").upsert({ user_id: userId, seat_preference: prefs.seat_preference, class_preference: prefs.class_preference, updated_at: new Date().toISOString() }, { onConflict: "user_id" })
      if (error) throw error
      setStep(2)
    } finally { setSaving(false) }
  }

  const finish = async () => {
    setSaving(true)
    try {
      const { error } = await supabase.from("profiles").update({ onboarding_completed: true, updated_at: new Date().toISOString() }).eq("id", userId)
      if (error) throw error
      try { localStorage.setItem("suitpax_onboarding_completed", "true"); localStorage.removeItem("suitpax_onboarding_skipped") } catch {}
      onComplete?.(); onOpenChange(false)
    } finally { setSaving(false) }
  }

  const render = () => {
    if (step === 0) return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>First name</Label>
            <Input value={profile.first_name} onChange={(e) => setProfile({ ...profile, first_name: e.target.value })} placeholder="Jane" />
          </div>
          <div>
            <Label>Last name</Label>
            <Input value={profile.last_name} onChange={(e) => setProfile({ ...profile, last_name: e.target.value })} placeholder="Doe" />
          </div>
          <div>
            <Label>Company</Label>
            <Input value={profile.company_name} onChange={(e) => setProfile({ ...profile, company_name: e.target.value })} placeholder="Acme Inc." />
          </div>
          <div>
            <Label>Job title</Label>
            <Input value={profile.job_title} onChange={(e) => setProfile({ ...profile, job_title: e.target.value })} placeholder="Ops Manager" />
          </div>
        </div>
        <div className="flex justify-end"><Button className="rounded-xl bg-black text-white hover:bg-gray-800" onClick={saveProfile} disabled={saving}>Continue <ArrowRight className="h-4 w-4 ml-2" /></Button></div>
      </div>
    )
    if (step === 1) return (
      <div className="space-y-4">
        <div>
          <Label>Seat preference</Label>
          <div className="grid grid-cols-4 gap-2 mt-1 text-xs">
            {(["aisle","window","middle","no_preference"] as const).map(opt => (
              <Button key={opt} variant={prefs.seat_preference === opt ? "default" : "outline"} className="rounded-xl" onClick={() => setPrefs({ ...prefs, seat_preference: opt })}>{opt.replace("_"," ")}</Button>
            ))}
          </div>
        </div>
        <div>
          <Label>Cabin</Label>
          <div className="grid grid-cols-4 gap-2 mt-1 text-xs">
            {(["economy","premium_economy","business","first"] as const).map(opt => (
              <Button key={opt} variant={prefs.class_preference === opt ? "default" : "outline"} className="rounded-xl" onClick={() => setPrefs({ ...prefs, class_preference: opt })}>{opt.replace("_"," ")}</Button>
            ))}
          </div>
        </div>
        <div className="flex justify-end"><Button className="rounded-xl bg-black text-white hover:bg-gray-800" onClick={savePrefs} disabled={saving}>Continue <ArrowRight className="h-4 w-4 ml-2" /></Button></div>
      </div>
    )
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"><CheckCircle className="h-7 w-7 text-green-600" /></div>
        <div className="text-sm text-gray-700">You're all set! You can change these settings anytime.</div>
        <div className="mt-4"><Button className="rounded-xl bg-black text-white hover:bg-gray-800" onClick={finish} disabled={saving}>Finish</Button></div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-lg bg-transparent border-0 shadow-none">
        <Card className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-950 to-gray-900 text-white overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <Image src="/logo/suitpax-symbol-2.png" alt="Suitpax" width={18} height={18} />
              </div>
              <div>
                <div className="text-sm font-medium tracking-tight">Quick setup</div>
                <div className="text-[11px] text-gray-400">Personalize your experience</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs mb-3">
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${step===0? 'bg-white text-black' : 'bg-white/10 text-gray-300'}`}><User className="h-3 w-3"/> Profile</div>
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${step===1? 'bg-white text-black' : 'bg-white/10 text-gray-300'}`}><Settings className="h-3 w-3"/> Preferences</div>
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${step===2? 'bg-white text-black' : 'bg-white/10 text-gray-300'}`}><Plane className="h-3 w-3"/> Done</div>
            </div>
            {render()}
            <div className="mt-4 text-right">
              <button className="text-[11px] text-gray-300 hover:text-white underline" onClick={() => { try { localStorage.setItem('suitpax_onboarding_skipped','true') } catch {}; onOpenChange(false) }}>Skip for now</button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

