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
import { createClient } from "@/lib/supabase/client"
import { PiRocket, PiCheckCircle } from "react-icons/pi"

export default function OnboardingModal() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const checkOnboarding = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("has_completed_onboarding")
          .eq("id", user.id)
          .single()

        if (!profile?.has_completed_onboarding) {
          setOpen(true)
        }
      }
    }
    checkOnboarding()
  }, [supabase])

  const onboardingSteps = [
    {
      title: "Welcome to Suitpax!",
      description: "Let's get you started with your AI-powered business travel platform.",
      content:
        "Your 7-day free trial has begun. Explore all features and see how Suitpax can revolutionize your workflow.",
    },
    {
      title: "Dashboard Overview",
      description: "Your central hub for all travel management activities.",
      content: "Monitor your travel expenses, track bookings, and get insights into your business travel patterns.",
    },
    {
      title: "AI Agents",
      description: "Meet your intelligent travel assistants.",
      content:
        "Our AI agents can book flights, find hotels, manage expenses, and handle travel policies automatically.",
    },
    {
      title: "Business Travel",
      description: "Streamline your corporate travel processes.",
      content: "Book flights, hotels, and manage itineraries with intelligent recommendations and policy compliance.",
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
        await supabase.from("profiles").update({ has_completed_onboarding: true }).eq("id", user.id)

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm border-gray-200">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <PiRocket className="h-6 w-6 text-emerald-600" />
            <DialogTitle className="text-2xl font-medium tracking-tighter">{currentStepData.title}</DialogTitle>
          </div>
          <DialogDescription className="text-base">{currentStepData.description}</DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <p className="text-gray-600 leading-relaxed">{currentStepData.content}</p>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mt-6">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full transition-colors ${
                  index <= currentStep ? "bg-emerald-600" : "bg-gray-200"
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
          >
            Previous
          </Button>
          <Button onClick={handleNext} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            {isLoading ? (
              "Completing..."
            ) : currentStep === onboardingSteps.length - 1 ? (
              <>
                <PiCheckCircle className="mr-2 h-4 w-4" />
                Get Started
              </>
            ) : (
              "Next"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
