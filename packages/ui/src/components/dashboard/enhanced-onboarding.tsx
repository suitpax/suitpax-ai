"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  ArrowRight,
  Plane,
  Settings,
  Building2,
  User,
  Bell,
  Shield,
  Sparkles,
  Zap,
  Target,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { toast } from "react-hot-toast"
import Image from "next/image"

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
  action?: string
  category: "profile" | "preferences" | "settings" | "complete"
}

interface OnboardingProps {
  onComplete?: () => void
  user: any
  isNewUser?: boolean
}

export function EnhancedOnboarding({ onComplete, user, isNewUser = false }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    company: user?.company || "",
    job_title: user?.job_title || "",
    phone: user?.phone || "",
    timezone: user?.timezone || "",
  })

  const [preferences, setPreferences] = useState({
    seat_preference: "aisle",
    meal_preference: "standard",
    notification_email: true,
    notification_sms: false,
    notification_push: true,
  })

  const supabase = createClient()

  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: "welcome",
      title: "Welcome to Suitpax",
      description: "Let's get you set up with superpowers",
      icon: <Sparkles className="h-5 w-5" />,
      completed: false,
      action: "Get Started",
      category: "profile",
    },
    {
      id: "profile",
      title: "Complete your profile",
      description: "Tell us about yourself and your company",
      icon: <User className="h-5 w-5" />,
      completed: false,
      action: "Save Profile",
      category: "profile",
    },
    {
      id: "preferences",
      title: "Travel preferences",
      description: "Set your default travel settings",
      icon: <Settings className="h-5 w-5" />,
      completed: false,
      action: "Save Preferences",
      category: "preferences",
    },
    {
      id: "notifications",
      title: "Notification settings",
      description: "Choose how you want to stay informed",
      icon: <Bell className="h-5 w-5" />,
      completed: false,
      action: "Configure Notifications",
      category: "settings",
    },
    {
      id: "superpowers",
      title: "Unlock your superpowers",
      description: "You're ready to revolutionize your travel",
      icon: <Zap className="h-5 w-5" />,
      completed: false,
      action: "Activate Superpowers",
      category: "complete",
    },
  ])

  const completedSteps = steps.filter((step) => step.completed).length
  const progress = (completedSteps / steps.length) * 100

  const markStepCompleted = (stepId: string) => {
    setSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, completed: true } : step)))
  }

  const handleWelcome = () => {
    markStepCompleted("welcome")
    setCurrentStep(1)
  }

  const handleProfileSubmit = async () => {
    if (!profileData.first_name.trim()) {
      toast.error("Please enter your first name")
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from("users")
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          company: profileData.company,
          job_title: profileData.job_title,
          phone: profileData.phone,
          timezone: profileData.timezone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      markStepCompleted("profile")
      setCurrentStep(2)
      toast.success("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Error updating profile")
    } finally {
      setLoading(false)
    }
  }

  const handlePreferencesSubmit = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("users")
        .update({
          seat_preference: preferences.seat_preference,
          meal_preference: preferences.meal_preference,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      markStepCompleted("preferences")
      setCurrentStep(3)
      toast.success("Travel preferences saved!")
    } catch (error) {
      console.error("Error saving preferences:", error)
      toast.error("Error saving preferences")
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationsSubmit = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("users")
        .update({
          notification_settings: {
            email: preferences.notification_email,
            sms: preferences.notification_sms,
            push: preferences.notification_push,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      markStepCompleted("notifications")
      setCurrentStep(4)
      toast.success("Notification settings saved!")
    } catch (error) {
      console.error("Error saving notifications:", error)
      toast.error("Error saving notifications")
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("users")
        .update({
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      markStepCompleted("superpowers")
      toast.success("🚀 Superpowers activated! Welcome to Suitpax!")
      setTimeout(() => {
        onComplete?.()
      }, 1500)
    } catch (error) {
      console.error("Error completing onboarding:", error)
      toast.error("Error activating superpowers")
    } finally {
      setLoading(false)
    }
  }

  const handleStepAction = async (step: OnboardingStep) => {
    switch (step.id) {
      case "welcome":
        handleWelcome()
        break
      case "profile":
        await handleProfileSubmit()
        break
      case "preferences":
        await handlePreferencesSubmit()
        break
      case "notifications":
        await handleNotificationsSubmit()
        break
      case "superpowers":
        await handleComplete()
        break
    }
  }

  if (completedSteps === steps.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Zap className="h-10 w-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-medium tracking-tighter mb-3">🚀 Superpowers Activated!</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {isNewUser
            ? "Welcome to the future of business travel. Your AI-powered journey begins now."
            : "Your profile has been enhanced with superpowers. Ready to transform your travel experience."}
        </p>
        <Button onClick={onComplete} className="bg-black text-white hover:bg-gray-800 px-8 py-3">
          {isNewUser ? "🌟 Start Your Journey" : "Continue to Dashboard"}
        </Button>
      </motion.div>
    )
  }

  const renderStepContent = () => {
    const step = steps[currentStep]

    switch (step.id) {
      case "welcome":
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Image src="/logo/suitpax-symbol-2.png" alt="Suitpax" width={32} height={32} className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-medium tracking-tighter mb-3">Ready to unlock your travel superpowers?</h3>
            <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
              We'll help you set up your profile, preferences, and notifications in just a few steps. This will enable
              our AI agents to provide you with personalized travel assistance.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-xs font-medium">Profile</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Settings className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-xs font-medium">Preferences</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-xs font-medium">Superpowers</p>
              </div>
            </div>
          </div>
        )

      case "profile":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={profileData.first_name}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, first_name: e.target.value }))}
                  placeholder="Enter your first name"
                  required
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={profileData.last_name}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, last_name: e.target.value }))}
                  placeholder="Enter your last name"
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={profileData.company}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, company: e.target.value }))}
                  placeholder="Your company name"
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="job_title">Job Title</Label>
                <Input
                  id="job_title"
                  value={profileData.job_title}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, job_title: e.target.value }))}
                  placeholder="Your job title"
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Your phone number"
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  value={profileData.timezone}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, timezone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
        )

      case "preferences":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="seat_preference">Seat Preference</Label>
                <select
                  id="seat_preference"
                  value={preferences.seat_preference}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, seat_preference: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent mt-1"
                >
                  <option value="aisle">Aisle</option>
                  <option value="window">Window</option>
                  <option value="middle">Middle</option>
                </select>
              </div>
              <div>
                <Label htmlFor="meal_preference">Meal Preference</Label>
                <select
                  id="meal_preference"
                  value={preferences.meal_preference}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, meal_preference: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent mt-1"
                >
                  <option value="standard">Standard</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="kosher">Kosher</option>
                  <option value="halal">Halal</option>
                  <option value="gluten-free">Gluten Free</option>
                </select>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-sm mb-3">Travel Style Preview</h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white rounded-lg p-3">
                  <Plane className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">Flight</p>
                  <p className="text-xs text-gray-600 capitalize">{preferences.seat_preference}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <Building2 className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">Meal</p>
                  <p className="text-xs text-gray-600 capitalize">{preferences.meal_preference}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <Target className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">AI Match</p>
                  <p className="text-xs text-gray-600">Optimized</p>
                </div>
              </div>
            </div>
          </div>
        )

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Email Notifications</h4>
                    <p className="text-xs text-gray-600">Travel updates and confirmations</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.notification_email}
                    onChange={(e) => setPreferences((prev) => ({ ...prev, notification_email: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Zap className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Push Notifications</h4>
                    <p className="text-xs text-gray-600">Real-time travel alerts</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.notification_push}
                    onChange={(e) => setPreferences((prev) => ({ ...prev, notification_push: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">SMS Notifications</h4>
                    <p className="text-xs text-gray-600">Emergency and urgent updates</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.notification_sms}
                    onChange={(e) => setPreferences((prev) => ({ ...prev, notification_sms: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )

      case "superpowers":
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="h-10 w-10 text-emerald-600" />
            </div>
            <h3 className="text-xl font-medium tracking-tighter mb-3">Ready to activate your superpowers?</h3>
            <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
              Your profile is complete! Our AI agents are now ready to provide you with personalized, intelligent travel
              assistance that adapts to your preferences.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 text-center">
                <Sparkles className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-medium">AI Powered</p>
                <p className="text-xs text-gray-600">Smart recommendations</p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 text-center">
                <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs font-medium">Personalized</p>
                <p className="text-xs text-gray-600">Tailored to you</p>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-4">
            <p className="text-gray-600">{step.description}</p>
          </div>
        )
    }
  }

  return (
    <Card className="border border-gray-200 shadow-sm max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-medium tracking-tighter">
              {isNewUser ? "🚀 Unlock Your Superpowers" : "Complete Your Setup"}
            </CardTitle>
            <CardDescription>
              {isNewUser
                ? "Welcome to Suitpax! Let's personalize your AI-powered travel experience."
                : "Finish setting up your profile to get the most out of Suitpax."}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {completedSteps} of {steps.length}
            </div>
            <div className="text-xs text-gray-500">steps completed</div>
          </div>
        </div>
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="border rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600">
                {steps[currentStep].icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{steps[currentStep].title}</h3>
                <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
              </div>
            </div>

            {renderStepContent()}

            <div className="flex justify-end mt-6">
              <Button
                onClick={() => handleStepAction(steps[currentStep])}
                disabled={loading}
                className="bg-black text-white hover:bg-gray-800 px-6"
              >
                {loading ? "Processing..." : steps[currentStep].action}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Overview */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Setup Progress</h4>
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                step.completed
                  ? "bg-green-50 border-green-200"
                  : index === currentStep
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step.completed
                      ? "bg-green-100 text-green-600"
                      : index === currentStep
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {step.completed ? <CheckCircle className="h-4 w-4" /> : step.icon}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{step.title}</h4>
                  <p className="text-xs text-gray-600">{step.description}</p>
                </div>
              </div>
              {step.completed && <div className="text-green-600 font-medium text-xs">✓ Completed</div>}
              {index === currentStep && !step.completed && (
                <div className="text-blue-600 font-medium text-xs">Current</div>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
