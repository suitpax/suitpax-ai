"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, User } from "lucide-react"

export default function ProfilePage() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [profile, setProfile] = useState({
    full_name: "",
    company_name: "",
    job_title: "",
    phone: "",
    travel_preferences: "",
    preferred_airline: "",
    preferred_hotel_chain: "",
    dietary_restrictions: "",
  })

  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          const { data } = await supabase.from("users").select("*").eq("id", session.user.id).single()

          if (data) {
            setProfile({
              full_name: data.full_name || "",
              company_name: data.company_name || "",
              job_title: data.job_title || "",
              phone: data.phone || "",
              travel_preferences: data.travel_preferences || "",
              preferred_airline: data.preferred_airline || "",
              preferred_hotel_chain: data.preferred_hotel_chain || "",
              dietary_restrictions: data.dietary_restrictions || "",
            })
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [supabase])

  const handleSave = async () => {
    setSaving(true)
    setMessage("")

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        const { error } = await supabase.from("users").update(profile).eq("id", session.user.id)

        if (error) {
          setMessage("Error saving profile. Please try again.")
        } else {
          setMessage("Profile saved successfully!")
        }
      }
    } catch (error) {
      setMessage("Error saving profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <User className="h-8 w-8 text-gray-600" />
        <div>
          <h1 className="text-3xl font-medium tracking-tighter text-black">Profile Settings</h1>
          <p className="text-gray-600">Manage your personal information and travel preferences</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-medium tracking-tighter">Personal Information</CardTitle>
            <CardDescription>Update your basic profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={profile.company_name}
                onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job_title">Job Title</Label>
              <Input
                id="job_title"
                value={profile.job_title}
                onChange={(e) => setProfile({ ...profile, job_title: e.target.value })}
                placeholder="e.g., Sales Manager"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-medium tracking-tighter">Travel Preferences</CardTitle>
            <CardDescription>Set your travel preferences for better recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preferred_airline">Preferred Airline</Label>
              <Select
                value={profile.preferred_airline}
                onValueChange={(value) => setProfile({ ...profile, preferred_airline: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select airline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="american">American Airlines</SelectItem>
                  <SelectItem value="delta">Delta Air Lines</SelectItem>
                  <SelectItem value="united">United Airlines</SelectItem>
                  <SelectItem value="southwest">Southwest Airlines</SelectItem>
                  <SelectItem value="jetblue">JetBlue Airways</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferred_hotel_chain">Preferred Hotel Chain</Label>
              <Select
                value={profile.preferred_hotel_chain}
                onValueChange={(value) => setProfile({ ...profile, preferred_hotel_chain: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select hotel chain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marriott">Marriott</SelectItem>
                  <SelectItem value="hilton">Hilton</SelectItem>
                  <SelectItem value="hyatt">Hyatt</SelectItem>
                  <SelectItem value="ihg">IHG</SelectItem>
                  <SelectItem value="accor">Accor</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
              <Input
                id="dietary_restrictions"
                value={profile.dietary_restrictions}
                onChange={(e) => setProfile({ ...profile, dietary_restrictions: e.target.value })}
                placeholder="e.g., Vegetarian, Gluten-free"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="travel_preferences">Additional Travel Notes</Label>
              <Textarea
                id="travel_preferences"
                value={profile.travel_preferences}
                onChange={(e) => setProfile({ ...profile, travel_preferences: e.target.value })}
                placeholder="Any specific preferences or requirements..."
                className="rounded-xl min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {message && (
        <Alert className={message.includes("Error") ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          <AlertDescription className={message.includes("Error") ? "text-red-800" : "text-green-800"}>
            {message}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-black text-white hover:bg-gray-800">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
