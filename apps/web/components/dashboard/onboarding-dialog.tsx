"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Sparkles, CreditCard, Shield, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface OnboardingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
}

const steps = [
  {
    title: "Welcome to Suitpax",
    subtitle: "Your AI-powered business travel companion",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center">
          <Image src="/suitpax-bl-logo.webp" alt="Suitpax" width={200} height={60} className="opacity-90" />
        </div>
        <p className="text-gray-600 text-center leading-relaxed">
          Suitpax revolutionizes business travel with AI-driven insights, automated expense management, and intelligent
          booking assistance. Let's get you started on your journey to smarter travel.
        </p>
      </div>
    ),
  },
  {
    title: "What Suitpax Does",
    subtitle: "Comprehensive business travel management",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-medium">AI Travel Assistant</h4>
          </div>
          <p className="text-sm text-gray-600">Smart booking recommendations and travel optimization</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-medium">Expense Management</h4>
          </div>
          <p className="text-sm text-gray-600">Automated expense tracking and categorization</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-medium">Policy Compliance</h4>
          </div>
          <p className="text-sm text-gray-600">Ensure all bookings meet company travel policies</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-medium">Real-time Insights</h4>
          </div>
          <p className="text-sm text-gray-600">Live analytics and spending optimization</p>
        </div>
      </div>
    ),
  },
  {
    title: "Ready to Get Started",
    subtitle: "Complete your profile to unlock all features",
    content: (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl">
          <h4 className="font-medium mb-3">Next Steps:</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm">Complete your profile setup</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm">Connect your bank account (optional)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm">Set your travel preferences</span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <Badge variant="secondary" className="bg-gray-200 text-gray-700">
            Free Plan - Get started with essential features
          </Badge>
        </div>
      </div>
    ),
  },
]

export function OnboardingDialog({ open, onOpenChange, onComplete }: OnboardingDialogProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
      onOpenChange(false)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-medium tracking-tight">{steps[currentStep].title}</DialogTitle>
              <p className="text-gray-600 mt-1">{steps[currentStep].subtitle}</p>
            </div>
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? "bg-black" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="py-6"
          >
            {steps[currentStep].content}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="border-gray-200 bg-transparent"
          >
            Previous
          </Button>
          <Button onClick={handleNext} className="bg-black hover:bg-gray-800 text-white">
            {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
