"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Mail, Phone, Building, Globe, Save, Loader2, Camera } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import { showToast, showError } from "@/lib/toast"
import Image from "next/image"

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
  const [avatarUrl, setAvatarUrl] = useState<string>("")
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => { fetchProfile() }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile")
      const data = await response.json()
      if (response.ok) {
        setUser(data.user)
        setProfile(data.profile || {})
        setAvatarUrl(data.profile?.avatar_url || data.user?.user_metadata?.avatar_url || "")
      } else {
        showError("Failed to load profile")
      }
    } catch (error) {
      showError("Error loading profile")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, avatar_url: avatarUrl }),
      })
      if (response.ok) {
        showToast("Profile updated successfully")
      } else {
        showError("Failed to update profile")
      }
    } catch (error) {
      showError("Error updating profile")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: any) => { setProfile((prev) => ({ ...prev, [field]: value })) }
  const handlePreferenceChange = (field: string, value: any) => { setProfile((prev) => ({ ...prev, preferences: { ...prev.preferences, [field]: value } })) }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.id) return
    setUploadingAvatar(true)
    try {
      const ext = file.name.split(".").pop()
      const path = `avatars/${user.id}.${ext}`
      const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true })
      if (error) { showError("Avatar upload failed"); return }
      const { data } = supabase.storage.from("avatars").getPublicUrl(path)
      setAvatarUrl(data.publicUrl)
      showToast("Photo uploaded successfully")
      // Notify the rest of the app (sidebar, etc.)
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('profile:updated', { detail: { avatar_url: data.publicUrl } }))
      // Persist on auth metadata for global availability
      await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } })
    } catch {
      showError("Avatar upload failed")
    } finally {
      setUploadingAvatar(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-8">
      {/* Header aligned to settings style */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Profile</h1>
        <p className="text-gray-600 font-light">Manage your account and preferences</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="glass-card p-6 lg:p-8">
        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <div className="relative">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="Profile" width={80} height={80} className="w-20 h-20 rounded-full object-cover border-2 border-gray-200" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center">
                <span className="text-white text-2xl font-medium">{user?.email?.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
              {uploadingAvatar ? <Loader2 className="h-4 w-4 animate-spin text-gray-600" /> : <Camera className="h-4 w-4 text-gray-600" />}
            </label>
            <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Profile Photo</h3>
            <p className="text-sm text-gray-600 font-light">Upload a photo to personalize your account</p>
          </div>
        </div>

        {/* Personal Information */}
        <h3 className="text-xl font-medium tracking-tighter mt-8 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" value={profile.full_name || ""} onChange={(e) => handleInputChange("full_name", e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200" placeholder="Enter your full name" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="email" value={user?.email || ""} disabled className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="tel" value={profile.phone || ""} onChange={(e) => handleInputChange("phone", e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200" placeholder="Enter your phone number" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Company</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" value={profile.company || ""} onChange={(e) => handleInputChange("company", e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200" placeholder="Enter your company name" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-3">Timezone</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select value={profile.timezone || ""} onChange={(e) => handleInputChange("timezone", e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200">
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex justify-end pt-4">
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
