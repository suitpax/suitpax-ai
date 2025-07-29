"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, ArrowRight, Plane, CreditCard, Users, Settings } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
  action?: string
  href?: string
}

interface OnboardingProps {
  onComplete?: () => void
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: "profile",
      title: "Complete your profile",
      description: "Add your travel preferences and company details",
      icon: <Settings className="h-5 w-5" />,
      completed: false,
      action: "Complete Profile",
      href: "/dashboard/profile",
    },
    {
      id: "team",
      title: "Invite your team",
      description: "Add team members to manage travel together",
      icon: <Users className="h-5 w-5" />,
      completed: false,
      action: "Invite Team",
      href: "/dashboard/team",
    },
    {
      id: "payment",
      title: "Add payment method",
      description: "Set up billing for seamless travel booking",
      icon: <CreditCard className="h-5 w-5" />,
      completed: false,
      action: "Add Payment",
      href: "/dashboard/billing",
    },
    {
      id: "first-trip",
      title: "Plan your first trip",
      description: "Try our AI-powered travel planning",
      icon: <Plane className="h-5 w-5" />,
      completed: false,
      action: "Plan Trip",
      href: "/dashboard/flights",
    },
  ])

  const completedSteps = steps.filter((step) => step.completed).length
  const progress = (completedSteps / steps.length) * 100

  const markStepCompleted = (stepId: string) => {
    setSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, completed: true } : step)))
  }

  const handleStepAction = (step: OnboardingStep) => {
    // In a real app, you'd navigate to the step's href
    markStepCompleted(step.id)

    if (completedSteps === steps.length - 1) {
      // All steps completed
      setTimeout(() => {
        onComplete?.()
      }, 1000)
    }
  }

  if (completedSteps === steps.length) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-medium tracking-tighter mb-2">Welcome to Suitpax!</h3>
        <p className="text-gray-600 mb-6">You're all set up and ready to revolutionize your business travel.</p>
        <Button onClick={onComplete} className="bg-black text-white hover:bg-gray-800">
          Start Exploring
        </Button>
      </motion.div>
    )
  }

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-medium tracking-tighter">Welcome to Suitpax</CardTitle>
            <CardDescription>Let's get you set up in just a few steps</CardDescription>
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
      <CardContent className="space-y-4">
        <AnimatePresence mode="wait">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                step.completed ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {step.completed ? <CheckCircle className="h-5 w-5" /> : step.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
              {!step.completed && step.action && (
                <Button
                  onClick={() => handleStepAction(step)}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <span>{step.action}</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              )}
              {step.completed && <div className="text-green-600 font-medium text-sm">Completed</div>}
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
