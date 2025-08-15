"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Save, Loader2, Camera, Settings, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserData } from "@/hooks/use-user-data"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"

export default function ProfilePage() {
  const { user, profile, preferences, loading, updateProfile, updatePreferences, displayName } = useUserData()
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  // Local state for form data
  const [profileData, setProfileData] = useState({
    full_name: "",
    first_name: "",
    last_name: "",
    company_name: "",
    job_title: "",
    phone: "",
    avatar_url: "",
  })

  const [preferencesData, setPreferencesData] = useState({
    currency: "USD",
    timezone: "",
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    preferred_airlines: [] as string[],
    preferred_airports: [] as string[],
    class_preference: "",
    seat_preference: "",
    meal_preference: "",
  })

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || "",
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        company_name: profile.company_name || "",
        job_title: profile.job_title || "",
        phone: profile.phone || "",
        avatar_url: profile.avatar_url || "",
      })
    }
  }, [profile])

  useEffect(() => {
    if (preferences) {
      setPreferencesData({
        currency: preferences.currency || "USD",
        timezone: preferences.timezone || "",
        email_notifications: preferences.email_notifications ?? true,
        push_notifications: preferences.push_notifications ?? true,
        sms_notifications: preferences.sms_notifications ?? false,
        preferred_airlines: preferences.preferred_airlines || [],
        preferred_airports: preferences.preferred_airports || [],
        class_preference: preferences.class_preference || "",
        seat_preference: preferences.seat_preference || "",
        meal_preference: preferences.meal_preference || "",
      })
    }
  }, [preferences])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const result = await updateProfile(profileData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Profile updated successfully")
      }
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleSavePreferences = async () => {
    setSaving(true)
    try {
      const result = await updatePreferences(preferencesData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Preferences updated successfully")
      }
    } catch (error) {
      toast.error("Failed to update preferences")
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setUploadingAvatar(true)
    try {
      const supabase = createClient()
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

      if (uploadError) {
        toast.error("Failed to upload avatar")
        return
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath)

      setProfileData((prev) => ({ ...prev, avatar_url: publicUrl }))

      const result = await updateProfile({ avatar_url: publicUrl })
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Avatar updated successfully")
      }
    } catch (error) {
      toast.error("Failed to upload avatar")
    } finally {
      setUploadingAvatar(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/30 via-white to-gray-50/20">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Profile</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back, {displayName}. Manage your account information and preferences.
          </p>
        </motion.div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium tracking-tight">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={profileData.avatar_url || "/placeholder.svg"} alt={displayName} />
                      <AvatarFallback className="text-lg">
                        {displayName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={uploadingAvatar}
                      />
                    </label>
                    {uploadingAvatar && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{displayName}</h3>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Click the camera icon to update your photo</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user?.email || ""} disabled className="bg-gray-50 text-gray-500" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={profileData.first_name}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, first_name: e.target.value }))}
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={profileData.last_name}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, last_name: e.target.value }))}
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company</Label>
                    <Input
                      id="company_name"
                      value={profileData.company_name}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, company_name: e.target.value }))}
                      placeholder="Enter your company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="job_title">Job Title</Label>
                    <Input
                      id="job_title"
                      value={profileData.job_title}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, job_title: e.target.value }))}
                      placeholder="Enter your job title"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={saving} className="bg-black hover:bg-gray-800">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium tracking-tight">Travel Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={preferencesData.currency}
                      onValueChange={(value) => setPreferencesData((prev) => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={preferencesData.timezone}
                      onValueChange={(value) => setPreferencesData((prev) => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="class_preference">Class Preference</Label>
                    <Select
                      value={preferencesData.class_preference}
                      onValueChange={(value) => setPreferencesData((prev) => ({ ...prev, class_preference: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Economy</SelectItem>
                        <SelectItem value="premium_economy">Premium Economy</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="first">First Class</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seat_preference">Seat Preference</Label>
                    <Select
                      value={preferencesData.seat_preference}
                      onValueChange={(value) => setPreferencesData((prev) => ({ ...prev, seat_preference: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select seat preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="window">Window</SelectItem>
                        <SelectItem value="aisle">Aisle</SelectItem>
                        <SelectItem value="middle">Middle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="meal_preference">Meal Preference</Label>
                    <Select
                      value={preferencesData.meal_preference}
                      onValueChange={(value) => setPreferencesData((prev) => ({ ...prev, meal_preference: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select meal preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="kosher">Kosher</SelectItem>
                        <SelectItem value="halal">Halal</SelectItem>
                        <SelectItem value="gluten_free">Gluten Free</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSavePreferences} disabled={saving} className="bg-black hover:bg-gray-800">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium tracking-tight">Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email_notifications">Email Notifications</Label>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                    <Switch
                      id="email_notifications"
                      checked={preferencesData.email_notifications}
                      onCheckedChange={(checked) =>
                        setPreferencesData((prev) => ({ ...prev, email_notifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push_notifications">Push Notifications</Label>
                      <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
                    </div>
                    <Switch
                      id="push_notifications"
                      checked={preferencesData.push_notifications}
                      onCheckedChange={(checked) =>
                        setPreferencesData((prev) => ({ ...prev, push_notifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms_notifications">SMS Notifications</Label>
                      <p className="text-sm text-gray-600">Receive text messages for important updates</p>
                    </div>
                    <Switch
                      id="sms_notifications"
                      checked={preferencesData.sms_notifications}
                      onCheckedChange={(checked) =>
                        setPreferencesData((prev) => ({ ...prev, sms_notifications: checked }))
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSavePreferences} disabled={saving} className="bg-black hover:bg-gray-800">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Notifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
