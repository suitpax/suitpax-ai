"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const mockStatus = {
  planName: "free",
  aiTokensLimit: 10000,
  aiTokensUsed: 2500,
  teamMembersLimit: 5,
  travelSearchesLimit: 10,
  travelSearchesUsed: 3,
  features: {
    hasAiExpenseManagement: false,
    hasCustomPolicies: false,
    hasPrioritySupport: false,
    hasBankIntegration: false,
    hasCrmIntegration: false,
  },
  usage: {
    aiTokensPercentage: 25,
    travelSearchesPercentage: 30,
  },
}

export default function BillingPage() {
  const status = mockStatus
  const loading = false
  const error = null

  const handleUpgrade = (plan: string) => {
    if (plan === "basic" || plan === "pro") {
      window.location.href = "mailto:hello@suitpax.com?subject=Upgrade to " + plan + " plan"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Billing</h1>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <p className="text-red-600">Error loading billing information: {error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Billing</h1>
          <p className="text-gray-600 font-light">
            <em className="font-serif italic">Manage your subscription and view usage statistics</em>
          </p>
        </motion.div>

        {/* Current Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-medium tracking-tighter">Current Plan</CardTitle>
                  <CardDescription>Your subscription details and usage</CardDescription>
                </div>
                <Badge variant={status?.planName === "free" ? "secondary" : "default"} className="capitalize">
                  {status?.planName || "Free"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AI Tokens Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">AI Tokens</span>
                  <span className="text-gray-600">
                    {status?.aiTokensUsed?.toLocaleString() || 0} /{" "}
                    {status?.aiTokensLimit === -1 ? "Unlimited" : status?.aiTokensLimit?.toLocaleString() || 0}
                  </span>
                </div>
                <Progress value={status?.usage?.aiTokensPercentage || 0} className="h-2" />
                <p className="text-xs text-gray-500">{status?.usage?.aiTokensPercentage || 0}% used this month</p>
              </div>

              {/* Travel Searches Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Travel Searches</span>
                  <span className="text-gray-600">
                    {status?.travelSearchesUsed || 0} /{" "}
                    {status?.travelSearchesLimit === -1 ? "Unlimited" : status?.travelSearchesLimit || 0}
                  </span>
                </div>
                <Progress value={status?.usage?.travelSearchesPercentage || 0} className="h-2" />
                <p className="text-xs text-gray-500">{status?.usage?.travelSearchesPercentage || 0}% used this month</p>
              </div>

              {/* Team Members */}
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Team Members</span>
                <span className="text-gray-600">
                  1 / {status?.teamMembersLimit === -1 ? "Unlimited" : status?.teamMembersLimit || 1}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-medium tracking-tighter">Plan Features</CardTitle>
              <CardDescription>What's included in your current plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${status?.features?.hasAiExpenseManagement ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <span className="text-sm">AI Expense Management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${status?.features?.hasCustomPolicies ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <span className="text-sm">Custom Policies</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${status?.features?.hasPrioritySupport ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <span className="text-sm">Priority Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${status?.features?.hasBankIntegration ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <span className="text-sm">Bank Integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${status?.features?.hasCrmIntegration ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <span className="text-sm">CRM Integration</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-medium tracking-tighter">Manage Subscription</CardTitle>
              <CardDescription>Upgrade your plan or manage billing</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              {status?.planName === "free" ? (
                <>
                  <Button onClick={() => handleUpgrade("basic")} className="flex-1">
                    Upgrade to Basic
                  </Button>
                  <Button onClick={() => handleUpgrade("pro")} variant="outline" className="flex-1">
                    Upgrade to Pro
                  </Button>
                </>
              ) : (
                <Button onClick={() => (window.location.href = "mailto:hello@suitpax.com")} className="flex-1">
                  Contact Support
                </Button>
              )}
              <Button variant="outline" onClick={() => (window.location.href = "/pricing")} className="flex-1">
                View All Plans
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
