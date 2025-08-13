"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AnimatedNumber } from "@/components/ui/number-flow"
import { Users, Zap, Shield } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface UserProfile {
  id: string
  subscription_plan: "free" | "premium" | "enterprise"
  subscription_status: "active" | "inactive" | "cancelled" | "trialing"
  ai_tokens_used: number
  ai_tokens_limit: number
}

export default function BillingPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data: profileData, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error) throw error
      setProfile(profileData)
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Profile not found</h1>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  const aiTokensPercentage = Math.min((profile.ai_tokens_used / profile.ai_tokens_limit) * 100, 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2 text-gray-900">
                Usage & Plan
              </h1>
              <p className="text-gray-600 font-light">
                <em className="font-serif italic">Monitor your corporate travel usage and plan details</em>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={`rounded-lg px-3 py-1 ${
                  profile.subscription_status === "active"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-gray-50 text-gray-700 border-gray-200"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    profile.subscription_status === "active" ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
                {profile.subscription_status === "active" ? "Active" : "Inactive"}
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 rounded-lg px-3 py-1 capitalize">
                {profile.subscription_plan}
              </Badge>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">AI Tokens Used</p>
                    <div className="text-2xl font-semibold text-gray-900">
                      <AnimatedNumber value={profile.ai_tokens_used} />
                    </div>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={aiTokensPercentage} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(aiTokensPercentage)}% of {profile.ai_tokens_limit.toLocaleString()} limit
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Current Plan</p>
                    <p className="text-2xl font-semibold text-gray-900 capitalize">{profile.subscription_plan}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  {profile.subscription_plan === "free" ? "Basic features available" : "Premium features enabled"}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Plan Status</p>
                    <p className="text-2xl font-semibold text-gray-900 capitalize">{profile.subscription_status}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  {profile.subscription_status === "active" ? "All features available" : "Limited access"}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold tracking-tight text-gray-900">Plan Features</CardTitle>
              <CardDescription className="text-gray-600">Features available in your current plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.subscription_plan === "free" ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">AI searches per month</span>
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                        5 searches
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Basic expense tracking</span>
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        Included
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Email support</span>
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        Included
                      </Badge>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">AI searches</span>
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        Unlimited
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Advanced expense management</span>
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Bank integration</span>
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Priority support</span>
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        {profile.subscription_plan === "enterprise" ? "24/7" : "Business hours"}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
