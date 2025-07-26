"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { PiUser, PiCheckCircle, PiArrowRight } from "react-icons/pi"

export default function OnboardingModal() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    role: "",
  })
  const supabase = createClient()

  useEffect(() => {
    const checkOnboarding = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("has_completed_onboarding, full_name")
          .eq("id", user.id)
          .single()

        if (!profile?.has_completed_onboarding) {
          setOpen(true)
          if (profile?.full_name) {
            setFormData((prev) => ({ ...prev, fullName: profile.full_name }))
          }
        }
      }
    }
    checkOnboarding()
  }, [supabase])

  const onboardingSteps = [
    {
      title: "Welcome to Suitpax",
      description: "Let's set up your account to get started.",
      content: "We'll help you configure your business travel platform in just a few steps.",
    },
    {
      title: "Tell us about yourself",
      description: "Help us personalize your experience.",
      content: "basic-info",
    },
    {
      title: "You're all set!",
      description: "Your account is ready to use.",
      content: "Start exploring your AI-powered business travel platform.",
    },
  ]

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from("profiles")
          .update({
            has_completed_onboarding: true,
            full_name: formData.fullName,
          })
          .eq("id", user.id)

        setOpen(false)
        window.location.reload()
      }
    } catch (error) {
      console.error("Error completing onboarding:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const currentStepData = onboardingSteps[currentStep]
  const canProceed = currentStep !== 1 || formData.fullName.trim() !== ""

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[480px] bg-white border-gray-200" hideClose>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <PiUser className="h-5 w-5 text-gray-700" />
            </div>
            <div>
              <DialogTitle className="text-xl font-medium text-gray-900">{currentStepData.title}</DialogTitle>
              <DialogDescription className="text-gray-600 mt-1">{currentStepData.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          {currentStepData.content === "basic-info" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter your full name"
                  className="border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                  Company (Optional)
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                  placeholder="Enter your company name"
                  className="border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                  Role (Optional)
                </Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g., Travel Manager, Executive Assistant"
                  className="border-gray-200"
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-600 leading-relaxed">{currentStepData.content}</p>
          )}

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mt-6">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  index <= currentStep ? "bg-gray-400" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Step {currentStep + 1} of {onboardingSteps.length}
          </p>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="border-gray-200 text-gray-700"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={isLoading || !canProceed}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            {isLoading ? (
              "Setting up..."
            ) : currentStep === onboardingSteps.length - 1 ? (
              <>
                <PiCheckCircle className="mr-2 h-4 w-4" />
                Get Started
              </>
            ) : (
              <>
                Next
                <PiArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
