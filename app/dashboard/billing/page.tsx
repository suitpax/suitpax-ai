"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CreditCard, DollarSign, TrendingUp, Users, Zap, Shield, Building, ArrowUpRight } from "lucide-react"

const mockStatus = {
  planName: "Professional",
  monthlySpend: 12450,
  aiTokensLimit: 50000,
  aiTokensUsed: 12500,
  teamMembersLimit: 25,
  teamMembersUsed: 8,
  travelSearchesLimit: -1,
  travelSearchesUsed: 47,
  features: {
    hasAiExpenseManagement: true,
    hasCustomPolicies: true,
    hasPrioritySupport: true,
    hasBankIntegration: true,
    hasCrmIntegration: false,
  },
  usage: {
    aiTokensPercentage: 25,
    travelSearchesPercentage: 30,
  },
  nextBillingDate: "2024-02-15",
  paymentMethod: "**** 4242",
}

export default function BillingPage() {
  const status = mockStatus

  const handleUpgrade = (plan: string) => {
    window.location.href = `mailto:hello@suitpax.com?subject=Upgrade to ${plan} plan`
  }

  const handleManageBilling = () => {
    window.location.href = "mailto:hello@suitpax.com?subject=Billing Management Request"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2 text-gray-900">
                Billing & Usage
              </h1>
              <p className="text-gray-600 font-light">
                <em className="font-serif italic">Manage your corporate travel subscription and monitor usage</em>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 rounded-lg px-3 py-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Active
              </Badge>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Monthly Spend</p>
                    <p className="text-2xl font-semibold text-gray-900">${status.monthlySpend.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">+12%</span>
                  <span className="text-gray-500 ml-1">vs last month</span>
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
                    <p className="text-sm font-medium text-gray-600 mb-1">AI Tokens Used</p>
                    <p className="text-2xl font-semibold text-gray-900">{status.aiTokensUsed.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={status.usage.aiTokensPercentage} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {status.usage.aiTokensPercentage}% of {status.aiTokensLimit.toLocaleString()} limit
                  </p>
                </div>
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
                    <p className="text-sm font-medium text-gray-600 mb-1">Team Members</p>
                    <p className="text-2xl font-semibold text-gray-900">{status.teamMembersUsed}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">of {status.teamMembersLimit} available seats</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Travel Searches</p>
                    <p className="text-2xl font-semibold text-gray-900">{status.travelSearchesUsed}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Building className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">Unlimited searches this month</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold tracking-tight text-gray-900">Current Plan</CardTitle>
                    <CardDescription className="text-gray-600">
                      Your subscription details and billing information
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 rounded-lg px-3 py-1">
                    {status.planName}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Payment Method</p>
                      <p className="text-xs text-gray-600">Visa ending in {status.paymentMethod}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg text-gray-700 border-gray-300 hover:bg-gray-100 bg-transparent"
                  >
                    Update
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Next billing date</span>
                    <span className="font-medium text-gray-900">{status.nextBillingDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Billing cycle</span>
                    <span className="font-medium text-gray-900">Monthly</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold tracking-tight text-gray-900">
                  Enterprise Features
                </CardTitle>
                <CardDescription className="text-gray-600">Advanced capabilities included in your plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${status.features.hasAiExpenseManagement ? "bg-green-500" : "bg-gray-300"}`}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">AI Expense Management</span>
                    </div>
                    {status.features.hasAiExpenseManagement && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-50 text-green-700 border-green-200 rounded-lg"
                      >
                        Active
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${status.features.hasCustomPolicies ? "bg-green-500" : "bg-gray-300"}`}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">Custom Travel Policies</span>
                    </div>
                    {status.features.hasCustomPolicies && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-50 text-green-700 border-green-200 rounded-lg"
                      >
                        Active
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${status.features.hasPrioritySupport ? "bg-green-500" : "bg-gray-300"}`}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">Priority Support</span>
                    </div>
                    {status.features.hasPrioritySupport && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-50 text-green-700 border-green-200 rounded-lg"
                      >
                        24/7
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${status.features.hasBankIntegration ? "bg-green-500" : "bg-gray-300"}`}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">Bank Integration</span>
                    </div>
                    {status.features.hasBankIntegration && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-50 text-green-700 border-green-200 rounded-lg"
                      >
                        Connected
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${status.features.hasCrmIntegration ? "bg-green-500" : "bg-gray-300"}`}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">CRM Integration</span>
                    </div>
                    {!status.features.hasCrmIntegration && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs rounded-lg text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                      >
                        Upgrade
                        <ArrowUpRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold tracking-tight text-gray-900">Manage Subscription</CardTitle>
              <CardDescription className="text-gray-600">
                Upgrade your plan, manage billing, or contact support
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => handleUpgrade("enterprise")}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl"
              >
                <Shield className="h-4 w-4 mr-2" />
                Upgrade to Enterprise
              </Button>
              <Button
                onClick={handleManageBilling}
                variant="outline"
                className="flex-1 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Manage Billing
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/pricing")}
                className="flex-1 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                View All Plans
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
