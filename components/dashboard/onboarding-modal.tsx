"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { completeOnboarding } from "@/app/dashboard/actions"
import { Loader2 } from "lucide-react"

interface OnboardingModalProps {
  isOpen: boolean
}

export default function OnboardingModal({ isOpen }: OnboardingModalProps) {
  const [open, setOpen] = useState(isOpen)
  const [isLoading, setIsLoading] = useState(false)

  const handleGetStarted = async () => {
    setIsLoading(true)
    const result = await completeOnboarding()
    if (result.success) {
      setOpen(false)
      window.location.reload()
    } else {
      console.error(result.error)
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white/80 backdrop-blur-sm border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium tracking-tighter">Welcome to Suitpax!</DialogTitle>
          <DialogDescription>
            Let&apos;s get your business travel automated. Here are a few things to get you started.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>
            Your 7-day free trial of the Starter plan has begun. Explore all the features and see how Suitpax can
            revolutionize your workflow.
          </p>
        </div>
        <DialogFooter>
          <Button
            onClick={handleGetStarted}
            disabled={isLoading}
            className="w-full bg-black text-white hover:bg-black/80"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Get Started"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
