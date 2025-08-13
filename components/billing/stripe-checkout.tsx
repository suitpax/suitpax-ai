"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Shield, CreditCard } from "lucide-react"
import { motion } from "framer-motion"

interface Plan {
  id: "premium" | "enterprise"
  name: string
  price: number
  description: string
  features: string[]
  popular?: boolean
  icon: React.ReactNode
}

const plans: Plan[] = [
  {
    id: "premium",
    name: "Premium",
    price: 29,
    description: "Perfect for growing teams and advanced expense management",
    icon: <Zap className="h-6 w-6" />,
    features: [
      "Unlimited AI searches",
      "Advanced expense management",
      "Bank integration",
      "Priority support",
      "Up to 10 team members",
      "Custom travel policies",
      "Real-time expense tracking",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    description: "For large organizations with complex travel needs",
    icon: <Shield className="h-6 w-6" />,
    features: [
      "Everything in Premium",
      "Unlimited team members",
      "Advanced analytics & reporting",
      "24/7 phone support",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantees",
      "Advanced security features",
    ],
  },
]

interface StripeCheckoutProps {
  currentPlan?: "free" | "premium" | "enterprise"
  onSuccess?: () => void
}

export function StripeCheckout({ currentPlan = "free", onSuccess }: StripeCheckoutProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (planId: "premium" | "enterprise") => {
    setLoading(planId)
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType: planId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      // Redirect to Stripe Checkout
      window.location.href = data.checkoutUrl
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Failed to start checkout. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-gray-900 mb-4">Choose Your Plan</h2>
        <p className="text-gray-600 font-light max-w-2xl mx-auto">
          Upgrade to unlock advanced features and scale your corporate travel management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card
              className={`relative bg-white/80 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl ${
                plan.popular ? "border-blue-200 ring-2 ring-blue-100" : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1 rounded-full">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-xl text-gray-700">{plan.icon}</div>
                </div>
                <CardTitle className="text-2xl font-semibold tracking-tight text-gray-900">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600 mt-2">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">€{plan.price}</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={loading === plan.id || currentPlan === plan.id}
                  className={`w-full rounded-xl ${
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-900 hover:bg-gray-800 text-white"
                  }`}
                >
                  {loading === plan.id ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : currentPlan === plan.id ? (
                    "Current Plan"
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Upgrade to {plan.name}
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center text-sm text-gray-600">
        <p>All plans include a 14-day free trial. Cancel anytime.</p>
        <p className="mt-1">Secure payments powered by Stripe</p>
      </div>
    </div>
  )
}
