"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { UserIcon, BellIcon, CreditCardIcon, ShieldCheckIcon, GlobeAltIcon } from "@heroicons/react/24/outline"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

const settingsSections = [
  {
    id: "profile",
    name: "Profile",
    icon: UserIcon,
    description: "Manage your personal information",
  },
  {
    id: "notifications",
    name: "Notifications",
    icon: BellIcon,
    description: "Configure your notification preferences",
  },
  {
    id: "billing",
    name: "Billing",
    icon: CreditCardIcon,
    description: "Manage your subscription and payment methods",
  },
  {
    id: "security",
    name: "Security",
    icon: ShieldCheckIcon,
    description: "Password and security settings",
  },
  {
    id: "preferences",
    name: "Preferences",
    icon: GlobeAltIcon,
    description: "Language, timezone, and other preferences",
  },
]

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeSection, setActiveSection] = useState("profile")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [supabase])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">
          Settings
        </h1>
        <p className="text-gray-600 font-light">
          <em className="font-serif italic">Manage your account and preferences</em>
        </p>
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
                  activeSection === section.id
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <section.icon className="h-5 w-5" />
                  <div>
                    <div className="font-medium tracking-tight">{section.name}</div>
                    <div className="text-xs opacity-70 font-light">
                      <em className="font-serif italic">{section.description}</em>
                    </div>
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
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-8">
            {activeSection === "profile" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-medium tracking-tighter">Profile Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.user_metadata?.first_name || ""}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-light"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.user_metadata?.last_name || ""}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-light"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ""}
                    disabled
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-light"
                  />
                  <p className="text-xs text-gray-500 mt-1 font-light">
                    <em className="font-serif italic">Contact support to change your email address</em>
                  </p>
                </div>

                <div className="pt-4">
                  <button className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors tracking-tight">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeSection !== "profile" && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  {settingsSections.find(s => s.id === activeSection)?.icon && (\
                    <settingsSections.find(s => s.id === activeSection)!.icon className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <h3 className="text-lg font-medium tracking-tight text-gray-900 mb-2">
                  {settingsSections.find(s => s.id === activeSection)?.name} Settings
                </h3>
                <p className="text-gray-600 font-light">
                  <em className="font-serif italic">
                    This section is coming soon. We're working on advanced settings for your account.
                  </em>
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
