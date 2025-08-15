"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, ArrowRight, Plane, Settings, Building2, User } from "lucide-react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { toast } from "react-hot-toast"

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
  action?: string
}

interface OnboardingProps {
  onComplete?: () => void
  user: any
  isNewUser?: boolean
}

export function Onboarding({ onComplete, user, isNewUser = false }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    company: user?.company || "",
    job_title: user?.job_title || "",
    phone: user?.phone || "",
  })

  const supabase = createClient()

  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: "profile",
      title: "Complete your profile",
      description: "Add your personal and company details",
      icon: <User className="h-5 w-5" />,
      completed: false,
      action: "Save Profile",
    },
    {
      id: "preferences",
      title: "Set travel preferences",
      description: "Configure your default travel settings",
      icon: <Settings className="h-5 w-5" />,
      completed: false,
      action: "Save Preferences",
    },
    {
      id: "complete",
      title: "You're all set!",
      description: "Start using Suitpax for your business travel",
      icon: <Plane className="h-5 w-5" />,
      completed: false,
      action: "Get Started",
    },
  ])

  const completedSteps = steps.filter((step) => step.completed).length
  const progress = (completedSteps / steps.length) * 100

  const markStepCompleted = (stepId: string) => {
    setSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, completed: true } : step)))
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
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      markStepCompleted("profile")
      setCurrentStep(1)
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
          seat_preference: "aisle",
          meal_preference: "standard",
          notification_settings: {
            email: true,
            sms: false,
            push: true,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      markStepCompleted("preferences")
      setCurrentStep(2)
      toast.success("Preferences saved!")
    } catch (error) {
      console.error("Error saving preferences:", error)
      toast.error("Error saving preferences")
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

      markStepCompleted("complete")
      toast.success("Welcome to Suitpax!")
      setTimeout(() => {
        onComplete?.()
      }, 1000)
    } catch (error) {
      console.error("Error completing onboarding:", error)
      toast.error("Error completing setup")
    } finally {
      setLoading(false)
    }
  }

  const handleStepAction = async (step: OnboardingStep) => {
    switch (step.id) {
      case "profile":
        await handleProfileSubmit()
        break
      case "preferences":
        await handlePreferencesSubmit()
        break
      case "complete":
        await handleComplete()
        break
    }
  }

  if (completedSteps === steps.length) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-medium tracking-tighter mb-2">
          {isNewUser ? "Welcome to Suitpax!" : "Setup Complete!"}
        </h3>
        <p className="text-gray-600 mb-6">
          {isNewUser
            ? "You're all set up and ready to revolutionize your business travel."
            : "Your profile has been updated successfully."}
        </p>
        <Button onClick={onComplete} className="bg-black text-white hover:bg-gray-800">
          {isNewUser ? "Start Exploring" : "Continue to Dashboard"}
        </Button>
      </motion.div>
    )
  }

  const renderStepContent = () => {
    const step = steps[currentStep]

    switch (step.id) {
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
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={profileData.last_name}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, last_name: e.target.value }))}
                  placeholder="Enter your last name"
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={profileData.company}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, company: e.target.value }))}
                  placeholder="Your company name"
                />
              </div>
              <div>
                <Label htmlFor="job_title">Job Title</Label>
                <Input
                  id="job_title"
                  value={profileData.job_title}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, job_title: e.target.value }))}
                  placeholder="Your job title"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Your phone number"
                />
              </div>
            </div>
          </div>
        )

      case "preferences":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              We'll set up some default travel preferences for you. You can customize these later in your settings.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Plane className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-sm">Flight Preferences</h4>
                <p className="text-xs text-gray-600">Aisle seat, Standard meal</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-medium text-sm">Hotel Preferences</h4>
                <p className="text-xs text-gray-600">Business class hotels</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Settings className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-sm">Notifications</h4>
                <p className="text-xs text-gray-600">Email & Push enabled</p>
              </div>
            </div>
          </div>
        )

      case "complete":
        return (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium tracking-tighter mb-2">Ready to go!</h3>
            <p className="text-gray-600 text-sm">Your Suitpax account is now fully configured.</p>
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
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-medium tracking-tighter">
              {isNewUser ? "Let's get you set up" : "Complete your setup"}
            </CardTitle>
            <CardDescription>
              {isNewUser
                ? "Welcome to Suitpax! Let's personalize your experience in just a few steps."
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
        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600">
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
              className="bg-black text-white hover:bg-gray-800"
            >
              {loading ? "Saving..." : steps[currentStep].action}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* All Steps Overview */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Setup Progress</h4>
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                step.completed
                  ? "bg-green-50 border-green-200"
                  : index === currentStep
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full ${
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
              {step.completed && <div className="text-green-600 font-medium text-xs">Completed</div>}
              {index === currentStep && !step.completed && (
                <div className="text-blue-600 font-medium text-xs">Current</div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
