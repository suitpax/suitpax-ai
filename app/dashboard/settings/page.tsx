"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Bell, CreditCard, Shield, Globe, Camera } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

const settingsSections = [
  {
    id: "profile",
    name: "Profile",
    icon: User,
    description: "Manage your personal information",
  },
  {
    id: "notifications",
    name: "Notifications",
    icon: Bell,
    description: "Configure your notification preferences",
  },
  {
    id: "billing",
    name: "Billing",
    icon: CreditCard,
    description: "Manage your subscription and payment methods",
  },
  {
    id: "security",
    name: "Security",
    icon: Shield,
    description: "Password and security settings",
  },
  {
    id: "preferences",
    name: "Preferences",
    icon: Globe,
    description: "Language, timezone, and other preferences",
  },
]

export default function SettingsPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [activeSection, setActiveSection] = useState("profile")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (profileData) {
          setProfile(profileData)
          setFullName(profileData.full_name || "")
          setUsername(profileData.username || "")
          setCompanyName(profileData.company_name || "")
          setAvatarUrl(profileData.avatar_url || "")
        }
      }
      setLoading(false)
    }
    getUser()
  }, [supabase])

  const handleSaveProfile = async () => {
    if (!user) return
    setSaving(true)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          username: username,
          company_name: companyName,
          avatar_url: avatarUrl,
        })
        .eq("id", user.id)

      if (error) {
        console.error("Error updating profile:", error)
      } else {
        // Update local state
        setProfile((prev: any) => ({
          ...prev,
          full_name: fullName,
          username: username,
          company_name: companyName,
          avatar_url: avatarUrl,
        }))
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true })

      if (uploadError) {
        console.error("Error uploading avatar:", uploadError)
        return
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)
      setAvatarUrl(data.publicUrl)
    } catch (error) {
      console.error("Error:", error)
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
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Settings</h1>
        <p className="text-gray-600 font-light">Manage your account and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-2">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                  activeSection === section.id ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <section.icon className="h-5 w-5" />
                  <div>
                    <div className="font-medium tracking-tight">{section.name}</div>
                    <div className="text-xs opacity-70 font-light">{section.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-3"
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            {activeSection === "profile" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-medium tracking-tighter">Profile Information</h2>

                {/* Avatar Upload */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl || "/placeholder.svg"}
                        alt="Profile"
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center">
                        <span className="text-white text-2xl font-medium">{user?.email?.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <label
                      htmlFor="avatar-upload"
                      className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <Camera className="h-4 w-4 text-gray-600" />
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Profile Photo</h3>
                    <p className="text-sm text-gray-600 font-light">Upload a photo to personalize your account</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-light"
                    />
                  </div>

                  <div>
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700 mb-2">
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a unique username"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-light"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="companyName" className="text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </Label>
                  <Input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-light"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-light"
                  />
                  <p className="text-xs text-gray-500 mt-1 font-light">Contact support to change your email address</p>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors tracking-tight"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            )}

            {activeSection !== "profile" && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  {(() => {
                    const section = settingsSections.find((s) => s.id === activeSection)
                    const IconComponent = section?.icon
                    return IconComponent ? <IconComponent className="h-8 w-8 text-gray-400" /> : null
                  })()}
                </div>
                <h3 className="text-lg font-medium tracking-tight text-gray-900 mb-2">
                  {settingsSections.find((s) => s.id === activeSection)?.name} Settings
                </h3>
                <p className="text-gray-600 font-light">
                  This section is coming soon. We're working on advanced settings for your account.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
