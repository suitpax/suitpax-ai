"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Building,
  CreditCard,
  Users,
  Plane,
  Shield,
  Sparkles,
  Globe,
  Target,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

interface OnboardingFlowProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

interface OnboardingData {
  companyName: string
  companySize: string
  industry: string
  role: string
  travelFrequency: string
  primaryGoals: string[]
  budget: string
}

const steps = [
  {
    id: "welcome",
    title: "Welcome to Suitpax",
    subtitle: "Let's set up your business travel management platform",
    icon: Sparkles,
  },
  {
    id: "company",
    title: "Company Information",
    subtitle: "Tell us about your organization",
    icon: Building,
  },
  {
    id: "role",
    title: "Your Role & Needs",
    subtitle: "Help us personalize your experience",
    icon: Users,
  },
  {
    id: "goals",
    title: "Travel Goals",
    subtitle: "What do you want to achieve?",
    icon: Target,
  },
  {
    id: "complete",
    title: "You're All Set!",
    subtitle: "Welcome to the future of business travel",
    icon: Check,
  },
]

const goalOptions = [
  { id: "cost-savings", label: "Reduce Travel Costs", icon: CreditCard },
  { id: "policy-compliance", label: "Ensure Policy Compliance", icon: Shield },
  { id: "booking-efficiency", label: "Streamline Booking Process", icon: Plane },
  { id: "expense-tracking", label: "Better Expense Tracking", icon: Building },
  { id: "team-management", label: "Manage Team Travel", icon: Users },
  { id: "global-expansion", label: "Support Global Operations", icon: Globe },
]

export function OnboardingFlow({ isOpen, onClose, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({
    companyName: "",
    companySize: "",
    industry: "",
    role: "",
    travelFrequency: "",
    primaryGoals: [],
    budget: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleGoal = (goalId: string) => {
    setData((prev) => ({
      ...prev,
      primaryGoals: prev.primaryGoals.includes(goalId)
        ? prev.primaryGoals.filter((g) => g !== goalId)
        : [...prev.primaryGoals, goalId],
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Save onboarding data to user profile
        await supabase
          .from("profiles")
          .update({
            company_name: data.companyName,
            company_size: data.companySize,
            industry: data.industry,
            role: data.role,
            travel_frequency: data.travelFrequency,
            primary_goals: data.primaryGoals,
            budget_range: data.budget,
            onboarding_completed: true,
            onboarding_completed_at: new Date().toISOString(),
          })
          .eq("id", user.id)

        // Mark onboarding as completed in localStorage as well
        localStorage.setItem("suitpax_onboarding_completed", "true")
      }

      onComplete()
    } catch (error) {
      console.error("Error completing onboarding:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    localStorage.setItem("suitpax_onboarding_skipped", "true")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl mx-4"
      >
        <Card className="bg-gray-900 border-gray-800 shadow-2xl">
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <img src="/logo/suitpax-bl-logo.webp" alt="Suitpax" className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Setup Wizard</h2>
                  <p className="text-sm text-gray-400">
                    Step {currentStep + 1} of {steps.length}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSkip} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        index <= currentStep
                          ? "bg-white text-gray-900"
                          : "bg-gray-800 text-gray-400 border border-gray-700"
                      }`}
                    >
                      {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-8 h-0.5 transition-colors ${index < currentStep ? "bg-white" : "bg-gray-800"}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Step Content */}
                  {currentStep === 0 && (
                    <div className="text-center space-y-6">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto">
                        <Sparkles className="h-8 w-8 text-gray-900" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-white mb-2">{steps[currentStep].title}</h3>
                        <p className="text-gray-400">{steps[currentStep].subtitle}</p>
                      </div>
                      <div className="space-y-4 text-left">
                        <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-xl">
                          <Plane className="h-5 w-5 text-blue-400" />
                          <div>
                            <p className="text-white font-medium">Smart Flight Booking</p>
                            <p className="text-sm text-gray-400">AI-powered search with corporate rates</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-xl">
                          <CreditCard className="h-5 w-5 text-green-400" />
                          <div>
                            <p className="text-white font-medium">Expense Management</p>
                            <p className="text-sm text-gray-400">Automated tracking and reporting</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-xl">
                          <Shield className="h-5 w-5 text-purple-400" />
                          <div>
                            <p className="text-white font-medium">Policy Compliance</p>
                            <p className="text-sm text-gray-400">Ensure adherence to travel policies</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Building className="h-6 w-6 text-gray-900" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-2">{steps[currentStep].title}</h3>
                        <p className="text-gray-400">{steps[currentStep].subtitle}</p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="companyName" className="text-white">
                            Company Name
                          </Label>
                          <Input
                            id="companyName"
                            value={data.companyName}
                            onChange={(e) => updateData("companyName", e.target.value)}
                            placeholder="Enter your company name"
                            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 rounded-xl"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="companySize" className="text-white">
                              Company Size
                            </Label>
                            <Select
                              value={data.companySize}
                              onValueChange={(value) => updateData("companySize", value)}
                            >
                              <SelectTrigger className="bg-gray-800 border-gray-700 text-white rounded-xl">
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700">
                                <SelectItem value="1-10">1-10 employees</SelectItem>
                                <SelectItem value="11-50">11-50 employees</SelectItem>
                                <SelectItem value="51-200">51-200 employees</SelectItem>
                                <SelectItem value="201-1000">201-1000 employees</SelectItem>
                                <SelectItem value="1000+">1000+ employees</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="industry" className="text-white">
                              Industry
                            </Label>
                            <Select value={data.industry} onValueChange={(value) => updateData("industry", value)}>
                              <SelectTrigger className="bg-gray-800 border-gray-700 text-white rounded-xl">
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700">
                                <SelectItem value="technology">Technology</SelectItem>
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="consulting">Consulting</SelectItem>
                                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Users className="h-6 w-6 text-gray-900" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-2">{steps[currentStep].title}</h3>
                        <p className="text-gray-400">{steps[currentStep].subtitle}</p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="role" className="text-white">
                            Your Role
                          </Label>
                          <Select value={data.role} onValueChange={(value) => updateData("role", value)}>
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white rounded-xl">
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="ceo">CEO/Founder</SelectItem>
                              <SelectItem value="travel-manager">Travel Manager</SelectItem>
                              <SelectItem value="finance">Finance/Accounting</SelectItem>
                              <SelectItem value="hr">Human Resources</SelectItem>
                              <SelectItem value="operations">Operations</SelectItem>
                              <SelectItem value="employee">Employee</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="travelFrequency" className="text-white">
                            How often does your team travel?
                          </Label>
                          <Select
                            value={data.travelFrequency}
                            onValueChange={(value) => updateData("travelFrequency", value)}
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white rounded-xl">
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="annually">Annually</SelectItem>
                              <SelectItem value="rarely">Rarely</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="budget" className="text-white">
                            Annual Travel Budget
                          </Label>
                          <Select value={data.budget} onValueChange={(value) => updateData("budget", value)}>
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white rounded-xl">
                              <SelectValue placeholder="Select budget range" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="under-10k">Under $10,000</SelectItem>
                              <SelectItem value="10k-50k">$10,000 - $50,000</SelectItem>
                              <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                              <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                              <SelectItem value="500k+">$500,000+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Target className="h-6 w-6 text-gray-900" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-2">{steps[currentStep].title}</h3>
                        <p className="text-gray-400">{steps[currentStep].subtitle}</p>
                      </div>
                      <div>
                        <Label className="text-white mb-4 block">Select your primary goals (choose multiple)</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {goalOptions.map((goal) => (
                            <button
                              key={goal.id}
                              onClick={() => toggleGoal(goal.id)}
                              className={`p-4 rounded-xl border-2 transition-all text-left ${
                                data.primaryGoals.includes(goal.id)
                                  ? "border-white bg-white/10 text-white"
                                  : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <goal.icon className="h-5 w-5" />
                                <span className="font-medium">{goal.label}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="text-center space-y-6">
                      <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto">
                        <Check className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-white mb-2">{steps[currentStep].title}</h3>
                        <p className="text-gray-400 mb-6">{steps[currentStep].subtitle}</p>
                      </div>
                      <div className="space-y-4 text-left">
                        <div className="p-4 bg-gray-800 rounded-xl">
                          <h4 className="text-white font-medium mb-2">What's Next?</h4>
                          <ul className="space-y-2 text-sm text-gray-400">
                            <li>• Explore your personalized dashboard</li>
                            <li>• Set up your first travel booking</li>
                            <li>• Configure team members and permissions</li>
                            <li>• Connect your expense management tools</li>
                          </ul>
                        </div>
                        <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-blue-400" />
                            <span className="text-blue-400 font-medium">Pro Tip</span>
                          </div>
                          <p className="text-sm text-gray-300">
                            Try our AI assistant for instant help with bookings, policies, and expense questions.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-800">
              <div className="flex items-center gap-2">
                {currentStep > 0 && currentStep < steps.length - 1 && (
                  <Button variant="ghost" onClick={prevStep} className="text-gray-400 hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}
                {currentStep < steps.length - 1 && (
                  <Button variant="ghost" onClick={handleSkip} className="text-gray-400 hover:text-white">
                    Skip for now
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {currentStep < steps.length - 1 ? (
                  <Button
                    onClick={nextStep}
                    className="bg-white text-gray-900 hover:bg-gray-100 rounded-xl"
                    disabled={
                      (currentStep === 1 && !data.companyName) ||
                      (currentStep === 2 && (!data.role || !data.travelFrequency)) ||
                      (currentStep === 3 && data.primaryGoals.length === 0)
                    }
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleComplete}
                    disabled={isLoading}
                    className="bg-green-600 text-white hover:bg-green-700 rounded-xl"
                  >
                    {isLoading ? "Setting up..." : "Complete Setup"}
                    <Check className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
