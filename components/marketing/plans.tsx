"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "€0",
    period: "forever",
    description: "Perfect for trying out our platform",
    features: ["5 AI searches per month", "Basic travel recommendations", "Email support", "Access to community"],
    limitations: ["No expense management", "No team collaboration", "No priority support", "No advanced AI features"],
    cta: "Get Started",
    href: "https://app.suitpax.com/sign-up",
    popular: false,
  },
  {
    name: "Startup",
    price: "€39",
    annualPrice: "€31",
    period: "per month",
    description: "Ideal for growing startups and small teams",
    features: [
      "100 AI searches per month",
      "Advanced travel recommendations",
      "Basic expense management",
      "Team collaboration (up to 5 members)",
      "Priority email support",
      "Travel policy templates",
      "Basic reporting",
    ],
    limitations: ["Limited integrations", "No custom AI training", "No dedicated support"],
    cta: "Start Free Trial",
    href: "https://app.suitpax.com/sign-up?plan=startup",
    popular: true,
  },
  {
    name: "Basic",
    price: "€49",
    annualPrice: "€39",
    period: "per month",
    description: "Great for small to medium businesses",
    features: [
      "500 AI searches per month",
      "Advanced travel recommendations",
      "Full expense management",
      "Team collaboration (up to 10 members)",
      "Priority support",
      "Custom travel policies",
      "Advanced reporting",
      "API access",
    ],
    limitations: ["Limited custom integrations", "No dedicated account manager"],
    cta: "Start Free Trial",
    href: "https://app.suitpax.com/sign-up?plan=basic",
    popular: false,
  },
  {
    name: "Pro",
    price: "€79",
    annualPrice: "€63",
    period: "per month",
    description: "Perfect for scaling businesses",
    features: [
      "Unlimited AI searches",
      "Advanced AI travel agents",
      "Complete expense management suite",
      "Unlimited team members",
      "24/7 priority support",
      "Custom integrations",
      "Advanced analytics & reporting",
      "Custom AI training",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    limitations: [],
    cta: "Start Free Trial",
    href: "https://app.suitpax.com/sign-up?plan=pro",
    popular: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "Tailored solutions for large organizations",
    features: [
      "Everything in Pro",
      "Custom AI model training",
      "White-label solutions",
      "On-premise deployment options",
      "Custom integrations",
      "Dedicated support team",
      "Custom SLA",
      "Advanced security features",
      "Compliance certifications",
    ],
    limitations: [],
    cta: "Contact Sales",
    href: "https://cal.com/team/founders/partnership",
    popular: false,
  },
]

export default function Plans() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-black mb-6">Choose your plan</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include our core AI travel features.
          </p>
          <div className="mt-8 inline-flex items-center bg-white rounded-xl p-1 shadow-sm">
            <button className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg">Monthly</button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500">Annual (20% off)</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl border p-8 ${
                plan.popular ? "border-emerald-500 shadow-lg scale-105" : "border-gray-200 shadow-sm"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white">
                  Most Popular
                </Badge>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.annualPrice && (
                    <div className="text-sm text-gray-500 mt-1">
                      <span className="line-through">{plan.price}</span>{" "}
                      <span className="text-emerald-600 font-medium">{plan.annualPrice}</span> annually
                    </div>
                  )}
                  <span className="text-gray-500 text-sm">/{plan.period}</span>
                </div>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
                {plan.limitations.map((limitation, limitationIndex) => (
                  <div key={limitationIndex} className="flex items-start">
                    <X className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-500">{limitation}</span>
                  </div>
                ))}
              </div>

              <Button
                asChild
                className={`w-full ${
                  plan.popular
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-gray-900 hover:bg-gray-800 text-white"
                }`}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">All plans include a 14-day free trial. No credit card required.</p>
          <p className="text-sm text-gray-500">
            Need something different?{" "}
            <Link
              href="https://cal.com/team/founders/partnership"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Contact our sales team
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
