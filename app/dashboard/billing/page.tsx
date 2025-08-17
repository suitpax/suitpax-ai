"use client"
import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import DuffelElementsPlaceholder from "@/components/flights/DuffelElements"
import { CreditCard, DollarSign, TrendingUp, Users, Zap, Shield, Building, ArrowUpRight } from "lucide-react"
import { createClient as createSupabaseClient } from "@/lib/supabase/client"

export default function BillingPage() {
  const supabase = createSupabaseClient()

  const [profile, setProfile] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.id) {
          const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single()
          setProfile(prof)
        }
        const res = await fetch("/api/flights/history", { cache: "no-store" })
        const json = await res.json()
        setOrders(Array.isArray(json?.orders) ? json.orders : [])
        setPayments(Array.isArray(json?.payments) ? json.payments : [])
      } catch (e) {
        // silent fail
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const monthlySpend = useMemo(() => {
    if (!payments?.length) return 0
    const now = new Date()
    const m = now.getMonth()
    const y = now.getFullYear()
    return payments
      .filter((p) => {
        const d = new Date(p.created_at)
        return d.getMonth() === m && d.getFullYear() === y
      })
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  }, [payments])

  const travelSearchesUsed = useMemo(() => {
    const now = new Date(); const m = now.getMonth(); const y = now.getFullYear()
    return orders.filter(o => { const d = new Date(o.created_at); return d.getMonth() === m && d.getFullYear() === y }).length
  }, [orders])

  const aiTokensUsed = profile?.ai_tokens_used || 0
  const aiTokensLimit = profile?.ai_tokens_limit || 0

  const status = {
    planName: (profile?.subscription_plan || "free").toString().replace(/\b\w/g, (c: string) => c.toUpperCase()),
    monthlySpend,
    aiTokensLimit,
    aiTokensUsed,
    teamMembersLimit: 1,
    teamMembersUsed: 1,
    travelSearchesLimit: -1,
    travelSearchesUsed,
    usage: {
      aiTokensPercentage: aiTokensLimit > 0 ? Math.min(100, Math.round((aiTokensUsed / aiTokensLimit) * 100)) : 0,
      travelSearchesPercentage: 0,
    },
    nextBillingDate: "—",
    paymentMethod: "••••",
    subscriptionStatus: profile?.subscription_status || "inactive",
  }

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
              <Badge variant="outline" className={`rounded-lg px-3 py-1 ${status.subscriptionStatus === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${status.subscriptionStatus === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                {status.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
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
                    <p className="text-2xl font-semibold text-gray-900">${monthlySpend.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">{orders.length}</span>
                  <span className="text-gray-500 ml-1">orders</span>
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
                    <p className="text-2xl font-semibold text-gray-900">{aiTokensUsed.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={status.usage.aiTokensPercentage} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {status.usage.aiTokensPercentage}% of {aiTokensLimit.toLocaleString()} limit
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg text-gray-700 border-gray-300 hover:bg-gray-100 bg-transparent"
                      >
                        Update
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add payment method</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 text-sm text-gray-700">
                        <DuffelElementsPlaceholder />
                        <p className="text-gray-600">
                          We use Duffel Elements to securely collect card details (PCI compliant). Once the card token is created
                          client-side, our backend can attach 3DS and charge via Duffel v2 endpoints.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
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
                      <div className={`w-2 h-2 rounded-full ${true ? "bg-green-500" : "bg-gray-300"}`}></div>
                      <span className="text-sm font-medium text-gray-900">AI Expense Management</span>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs bg-green-50 text-green-700 border-green-200 rounded-lg"
                    >
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${true ? "bg-green-500" : "bg-gray-300"}`}></div>
                      <span className="text-sm font-medium text-gray-900">Custom Travel Policies</span>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs bg-green-50 text-green-700 border-green-200 rounded-lg"
                    >
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${true ? "bg-green-500" : "bg-gray-300"}`}></div>
                      <span className="text-sm font-medium text-gray-900">Priority Support</span>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs bg-green-50 text-green-700 border-green-200 rounded-lg"
                    >
                      24/7
                    </Badge>
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

        {/* Flight history */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.75 }}>
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold tracking-tight text-gray-900">Flight orders & payments</CardTitle>
              <CardDescription className="text-gray-600">Recent activity from your bookings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">Recent Orders</div>
                <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 overflow-hidden">
                  {(orders || []).slice(0, 5).map((o) => (
                    <div key={o.id} className="grid grid-cols-3 gap-3 px-4 py-3 text-sm bg-white">
                      <div className="truncate">{o.duffel_order_id}</div>
                      <div className="text-gray-600">{o.status || '—'}</div>
                      <div className="text-right font-medium">{o.total_amount ? `${o.total_amount} ${o.total_currency || ''}` : '—'}</div>
                    </div>
                  ))}
                  {(!orders || orders.length === 0) && (
                    <div className="px-4 py-3 text-sm text-gray-600 bg-white">No orders yet</div>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">Recent Payments</div>
                <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 overflow-hidden">
                  {(payments || []).slice(0, 5).map((p) => (
                    <div key={p.id} className="grid grid-cols-3 gap-3 px-4 py-3 text-sm bg-white">
                      <div className="truncate">{p.duffel_payment_id}</div>
                      <div className="text-gray-600">{p.status || '—'}</div>
                      <div className="text-right font-medium">{p.amount ? `${p.amount} ${p.currency || ''}` : '—'}</div>
                    </div>
                  ))}
                  {(!payments || payments.length === 0) && (
                    <div className="px-4 py-3 text-sm text-gray-600 bg-white">No payments yet</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
