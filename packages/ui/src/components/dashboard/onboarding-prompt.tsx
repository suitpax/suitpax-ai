"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, User, Building2, Plane, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState } from "react"

interface OnboardingPromptProps {
  userName?: string | null
  onDismiss?: () => void
}

export function OnboardingPrompt({ userName, onDismiss }: OnboardingPromptProps) {
  const [dismissed, setDismissed] = useState(false)
  const name = userName?.split(" ")[0] || "there"

  if (dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-6 relative"
    >
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="text-center">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Image src="/logo/suitpax-symbol-2.png" alt="Suitpax Logo" width={24} height={24} />
        </div>

        <h2 className="text-xl font-medium tracking-tighter text-gray-900 mb-2">
          <em className="font-serif italic">Welcome to Suitpax, {name}!</em>
        </h2>

        <p className="text-gray-600 font-light text-sm max-w-md mx-auto mb-6">
          Complete your profile to unlock personalized AI assistance and seamless business travel management.
        </p>

        <div className="flex justify-center mb-6">
          <Button asChild className="bg-black text-white hover:bg-gray-800">
            <Link href="/dashboard/profile">
              Complete Setup
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-gray-50 rounded-xl">
          <User className="h-4 w-4 text-gray-600 mb-1 mx-auto" />
          <h4 className="text-xs font-medium">Profile</h4>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl">
          <Building2 className="h-4 w-4 text-gray-600 mb-1 mx-auto" />
          <h4 className="text-xs font-medium">Company</h4>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl">
          <Plane className="h-4 w-4 text-gray-600 mb-1 mx-auto" />
          <h4 className="text-xs font-medium">Preferences</h4>
        </div>
      </div>
    </motion.div>
  )
}
