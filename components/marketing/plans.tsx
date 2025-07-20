"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const plans = [
  {
    name: "Free",
    price: "€0",
    period: "forever",
    description: "Perfect for trying out our platform",
    features: ["5 AI agent interactions per month", "Basic travel search", "Email support", "Access to community"],
    limitations: ["No booking capabilities", "Limited AI features", "No expense management", "No team collaboration"],
    cta: "Get Started",
    href: "/signup",
    popular: false,
    color: "gray",
  },
  {
    name: "Startup",
    price: "€39",
    originalPrice: "€49",
    period: "per month",
    yearlyPrice: "€31",
    yearlyOriginal: "€39",
    description: "Ideal for growing startups and small teams",
    features: [
      "100 AI agent interactions per month",
      "Full booking capabilities",
      "Basic expense management",
      "Team collaboration (up to 5 members)",
      "Priority email support",
      "Travel policy templates",
      "Basic reporting",
    ],
    limitations: ["Limited integrations", "Basic reporting only", "No custom workflows"],
    cta: "Start Free Trial",
    href: "/signup?plan=startup",
    popular: true,
    color: "emerald",
    badge: "Most Popular",
  },
  {
    name: "Pro",
    price: "€79",
    originalPrice: "€99",
    period: "per month",
    yearlyPrice: "€63",
    yearlyOriginal: "€79",
    description: "For established businesses with advanced needs",
    features: [
      "Unlimited AI agent interactions",
      "Advanced booking with preferences",
      "Complete expense management",
      "Unlimited team members",
      "24/7 priority support",
      "Custom travel policies",
      "Advanced reporting & analytics",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
    ],
    limitations: [],
    cta: "Start Free Trial",
    href: "/signup?plan=pro",
    popular: false,
    color: "blue",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "Tailored solutions for large organizations",
    features: [
      "Everything in Pro",
      "Custom AI agent training",
      "White-label solutions",
      "On-premise deployment options",
      "Custom SLA agreements",
      "Dedicated infrastructure",
      "Advanced security features",
      "Custom reporting",
      "Integration support",
      "Training & onboarding",
    ],
    limitations: [],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
    color: "purple",
  },
]

export default function Plans() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-black mb-4">Choose Your Plan</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include our core AI travel agents.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className="text-sm font-medium text-gray-900">Monthly</span>
            <div className="relative">
              <input
                type="checkbox"
                id="billing-toggle"
                className="sr-only"
                onChange={(e) => {
                  const cards = document.querySelectorAll("[data-plan-card]")
                  cards.forEach((card) => {
                    const monthlyPrice = card.querySelector("[data-monthly-price]")
                    const yearlyPrice = card.querySelector("[data-yearly-price]")
                    const monthlyPeriod = card.querySelector("[data-monthly-period]")
                    const yearlyPeriod = card.querySelector("[data-yearly-period]")

                    if (e.target.checked) {
                      monthlyPrice?.classList.add("hidden")
                      yearlyPrice?.classList.remove("hidden")
                      monthlyPeriod?.classList.add("hidden")
                      yearlyPeriod?.classList.remove("hidden")
                    } else {
                      monthlyPrice?.classList.remove("hidden")
                      yearlyPrice?.classList.add("hidden")
                      monthlyPeriod?.classList.remove("hidden")
                      yearlyPeriod?.classList.add("hidden")
                    }
                  })
                }}
              />
              <label htmlFor="billing-toggle" className="flex items-center cursor-pointer">
                <div className="relative">
                  <div className="block bg-gray-200 w-14 h-8 rounded-full"></div>
                  <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform"></div>
                </div>
              </label>
            </div>
            <span className="text-sm font-medium text-gray-900">
              Yearly <span className="text-emerald-600 font-semibold">(Save 20%)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              data-plan-card
            >
              <Card
                className={`relative h-full ${
                  plan.popular ? "border-emerald-500 shadow-lg scale-105" : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-emerald-500 text-white px-4 py-1">{plan.badge}</Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-xl font-semibold text-gray-900">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <div data-monthly-price>
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      {plan.period !== "contact us" && plan.period !== "forever" && (
                        <span className="text-gray-500 ml-1" data-monthly-period>
                          /{plan.period.split(" ")[1]}
                        </span>
                      )}
                      {plan.period === "forever" && <span className="text-gray-500 ml-1">{plan.period}</span>}
                      {plan.period === "contact us" && <span className="text-gray-500 ml-1">{plan.period}</span>}
                    </div>

                    {plan.yearlyPrice && (
                      <div data-yearly-price className="hidden">
                        <span className="text-4xl font-bold text-gray-900">{plan.yearlyPrice}</span>
                        <span className="text-gray-500 ml-1" data-yearly-period>
                          /month
                        </span>
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="line-through">{plan.yearlyOriginal}/month</span>
                          <span className="text-emerald-600 ml-2 font-semibold">Save 20%</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <CardDescription className="text-gray-600 mt-2">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}

                    {plan.limitations.map((limitation, limitationIndex) => (
                      <div key={limitationIndex} className="flex items-start gap-3">
                        <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
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
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">All plans include a 14-day free trial. No credit card required.</p>
          <p className="text-sm text-gray-500">
            Need a custom solution?{" "}
            <Link href="/contact" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Contact our sales team
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
