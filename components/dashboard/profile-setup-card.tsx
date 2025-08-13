"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { User, Building2, CreditCard, Settings, CheckCircle, ArrowRight, AlertCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useUserData } from "@/hooks/use-user-data"

interface SetupStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href: string
  completed: boolean
  required: boolean
}

export function ProfileSetupCard() {
  const { profile, preferences, loading } = useUserData()

  if (loading) {
    return (
      <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const setupSteps: SetupStep[] = [
    {
      id: "profile",
      title: "Complete Profile",
      description: "Add your name, company, and job title",
      icon: <User className="w-4 h-4" />,
      href: "/dashboard/profile",
      completed: !!(profile?.full_name && profile?.company_name),
      required: true,
    },
    {
      id: "preferences",
      title: "Travel Preferences",
      description: "Set your preferred airlines, class, and airports",
      icon: <Settings className="w-4 h-4" />,
      href: "/dashboard/profile?tab=preferences",
      completed: !!(preferences?.preferred_airlines?.length || preferences?.class_preference),
      required: true,
    },
    {
      id: "company",
      title: "Company Details",
      description: "Add company information and policies",
      icon: <Building2 className="w-4 h-4" />,
      href: "/dashboard/company",
      completed: !!profile?.company_name,
      required: false,
    },
    {
      id: "bank",
      title: "Connect Bank Account",
      description: "Link your business account for expense tracking",
      icon: <CreditCard className="w-4 h-4" />,
      href: "/dashboard/suitpax-bank",
      completed: false, // This would come from bank_connections table
      required: false,
    },
  ]

  const completedSteps = setupSteps.filter((step) => step.completed).length
  const totalSteps = setupSteps.length
  const progress = (completedSteps / totalSteps) * 100
  const requiredSteps = setupSteps.filter((step) => step.required)
  const completedRequiredSteps = requiredSteps.filter((step) => step.completed).length
  const isProfileComplete = completedRequiredSteps === requiredSteps.length

  if (isProfileComplete && profile?.onboarding_completed) {
    return null // Don't show the card if profile is complete
  }

  return (
    <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium tracking-tight text-gray-900">Complete Your Profile</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {isProfileComplete ? "Almost done! Complete optional steps" : "Finish setting up your account"}
            </p>
          </div>
          <Badge
            variant={isProfileComplete ? "default" : "secondary"}
            className={isProfileComplete ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}
          >
            {completedSteps}/{totalSteps} Complete
          </Badge>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {setupSteps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={step.href}>
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-4 hover:bg-gray-50 group"
                disabled={step.completed}
              >
                <div className="flex items-center gap-4 w-full">
                  <div
                    className={`
                    w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                    ${
                      step.completed
                        ? "bg-green-100 text-green-600"
                        : step.required
                          ? "bg-orange-100 text-orange-600"
                          : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                    }
                  `}
                  >
                    {step.completed ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : step.required ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium ${step.completed ? "text-gray-500" : "text-gray-900"}`}>
                        {step.title}
                      </span>
                      {step.required && !step.completed && (
                        <Badge variant="outline" className="text-xs border-orange-200 text-orange-600">
                          Required
                        </Badge>
                      )}
                      {step.completed && (
                        <Badge variant="outline" className="text-xs border-green-200 text-green-600">
                          Complete
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm ${step.completed ? "text-gray-400" : "text-gray-600"}`}>
                      {step.description}
                    </p>
                  </div>
                  {!step.completed && (
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  )}
                </div>
              </Button>
            </Link>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
