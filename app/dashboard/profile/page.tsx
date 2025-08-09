"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Mail, Phone, Building, Globe, Save, Loader2 } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import toast from "react-hot-toast"

interface UserProfile {
  full_name?: string
  company?: string
  phone?: string
  timezone?: string
  preferences?: {
    seat_preference?: string
    meal_preference?: string
    notification_settings?: {
      email?: boolean
      sms?: boolean
      push?: boolean
    }
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile")
      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setProfile(data.profile || {})
      } else {
        toast.error("Failed to load profile")
      }
    } catch (error) {
      toast.error("Error loading profile")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        toast.success("Profile updated successfully")
      } else {
        toast.error("Failed to update profile")
      }
    } catch (error) {
      toast.error("Error updating profile")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePreferenceChange = (field: string, value: any) => {
    setProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-2xl font-medium tracking-tighter text-gray-900">
          <em className="font-serif italic">Profile Settings</em>
        </h1>
        <p className="mt-1 text-sm text-gray-600">Manage your account information and preferences.</p>
      </motion.div>

      {/* Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
      >
        <h3 className="text-lg font-medium tracking-tighter text-gray-900 mb-6">
          <em className="font-serif italic">Personal Information</em>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={profile.full_name || ""}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="tel"
                value={profile.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={profile.company || ""}
                onChange={(e) => handleInputChange("company", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                placeholder="Enter your company name"
              />
            </div>
          </div>

          {/* Timezone */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={profile.timezone || ""}
                onChange={(e) => handleInputChange("timezone", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
              >
                <option value="">Select timezone</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Travel Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
      >
        <h3 className="text-lg font-medium tracking-tighter text-gray-900 mb-6">
          <em className="font-serif italic">Travel Preferences</em>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Seat Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Seat Preference</label>
            <select
              value={profile.preferences?.seat_preference || ""}
              onChange={(e) => handlePreferenceChange("seat_preference", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
            >
              <option value="">No preference</option>
              <option value="window">Window</option>
              <option value="aisle">Aisle</option>
              <option value="middle">Middle</option>
            </select>
          </div>

          {/* Meal Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meal Preference</label>
            <select
              value={profile.preferences?.meal_preference || ""}
              onChange={(e) => handlePreferenceChange("meal_preference", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
            >
              <option value="">Standard</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="kosher">Kosher</option>
              <option value="halal">Halal</option>
              <option value="gluten-free">Gluten Free</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex justify-end"
      >
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </motion.div>
    </div>
  )
}
