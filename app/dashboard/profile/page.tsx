"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { User, Mail, Phone, Building, Globe, Save, Loader2, Camera, X } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import toast from "react-hot-toast"
import Image from "next/image"

interface UserProfile {
  full_name?: string
  company?: string
  phone?: string
  timezone?: string
  avatar_url?: string
  job_title?: string
  department?: string
  employee_id?: string
  manager?: string
  start_date?: string
  emergency_contact?: string
  emergency_phone?: string
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
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [user, setUser] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClientComponentClient()

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

  const handleNotificationChange = (field: string, value: boolean) => {
    setProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        notification_settings: {
          ...prev.preferences?.notification_settings,
          [field]: value,
        },
      },
    }))
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    setUploadingAvatar(true)

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath)

      handleInputChange("avatar_url", publicUrl)
      toast.success("Avatar uploaded successfully")
    } catch (error) {
      console.error("Error uploading avatar:", error)
      toast.error("Failed to upload avatar")
    } finally {
      setUploadingAvatar(false)
    }
  }

  const removeAvatar = () => {
    handleInputChange("avatar_url", "")
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

      {/* Avatar Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
      >
        <h3 className="text-lg font-medium tracking-tighter text-gray-900 mb-6">
          <em className="font-serif italic">Profile Photo</em>
        </h3>

        <div className="flex items-center space-x-6">
          <div className="relative">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url || "/placeholder.svg"}
                alt="Profile"
                width={100}
                height={100}
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}

            {uploadingAvatar && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
              >
                <Camera className="h-4 w-4 mr-2" />
                {uploadingAvatar ? "Uploading..." : "Change Photo"}
              </button>

              {profile.avatar_url && (
                <button
                  onClick={removeAvatar}
                  className="inline-flex items-center px-4 py-2 border border-red-300 rounded-xl text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </button>
              )}
            </div>

            <p className="mt-2 text-xs text-gray-500">JPG, GIF or PNG. Max size of 5MB. Recommended size: 400x400px.</p>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
        </div>
      </motion.div>

      {/* Personal Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
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

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
            <input
              type="text"
              value={profile.job_title || ""}
              onChange={(e) => handleInputChange("job_title", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
              placeholder="Enter your job title"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <input
              type="text"
              value={profile.department || ""}
              onChange={(e) => handleInputChange("department", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
              placeholder="Enter your department"
            />
          </div>

          {/* Employee ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
            <input
              type="text"
              value={profile.employee_id || ""}
              onChange={(e) => handleInputChange("employee_id", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
              placeholder="Enter your employee ID"
            />
          </div>

          {/* Manager */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
            <input
              type="text"
              value={profile.manager || ""}
              onChange={(e) => handleInputChange("manager", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
              placeholder="Enter your manager's name"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={profile.start_date || ""}
              onChange={(e) => handleInputChange("start_date", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
            />
          </div>

          {/* Timezone */}
          <div>
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

      {/* Emergency Contact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
      >
        <h3 className="text-lg font-medium tracking-tighter text-gray-900 mb-6">
          <em className="font-serif italic">Emergency Contact</em>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
            <input
              type="text"
              value={profile.emergency_contact || ""}
              onChange={(e) => handleInputChange("emergency_contact", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
              placeholder="Enter emergency contact name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone</label>
            <input
              type="tel"
              value={profile.emergency_phone || ""}
              onChange={(e) => handleInputChange("emergency_phone", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
              placeholder="Enter emergency contact phone"
            />
          </div>
        </div>
      </motion.div>

      {/* Travel Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
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

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
      >
        <h3 className="text-lg font-medium tracking-tighter text-gray-900 mb-6">
          <em className="font-serif italic">Notification Preferences</em>
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Email Notifications</label>
              <p className="text-xs text-gray-500">Receive travel updates and confirmations via email</p>
            </div>
            <input
              type="checkbox"
              checked={profile.preferences?.notification_settings?.email || false}
              onChange={(e) => handleNotificationChange("email", e.target.checked)}
              className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
              <p className="text-xs text-gray-500">Receive urgent travel alerts via SMS</p>
            </div>
            <input
              type="checkbox"
              checked={profile.preferences?.notification_settings?.sms || false}
              onChange={(e) => handleNotificationChange("sms", e.target.checked)}
              className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Push Notifications</label>
              <p className="text-xs text-gray-500">Receive real-time updates on your device</p>
            </div>
            <input
              type="checkbox"
              checked={profile.preferences?.notification_settings?.push || false}
              onChange={(e) => handleNotificationChange("push", e.target.checked)}
              className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
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
