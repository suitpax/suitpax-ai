"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for individuals and small teams getting started",
    features: [
      "Up to 5 bookings per month",
      "Basic expense tracking",
      "Email support",
      "Mobile app access",
      "Basic reporting",
    ],
    limitations: ["Limited integrations", "No custom policies", "No priority support"],
    cta: "Get Started",
    href: "/signup",
    popular: false,
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month per user",
    description: "Ideal for growing businesses with advanced needs",
    features: [
      "Unlimited bookings",
      "Advanced expense management",
      "Priority support",
      "Custom travel policies",
      "Advanced reporting & analytics",
      "API access",
      "Team management",
      "Integration with accounting tools",
    ],
    limitations: [],
    cta: "Start Free Trial",
    href: "/signup?plan=professional",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with complex requirements",
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "Custom integrations",
      "Advanced security features",
      "SLA guarantee",
      "On-premise deployment options",
      "Custom training & onboarding",
      "24/7 phone support",
    ],
    limitations: [],
    cta: "Contact Sales",
    href: "https://cal.com/team/founders/partnership",
    popular: false,
  },
]

export const Plans = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-black mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your business needs. All plans include our core features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`relative h-full ${plan.popular ? "ring-2 ring-black" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black text-white">
                    Most Popular
                  </Badge>
                )}

                <CardHeader>
                  <CardTitle className="text-xl font-medium tracking-tighter">{plan.name}</CardTitle>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-gray-500 ml-1">{plan.period}</span>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                      {plan.limitations.map((limitation) => (
                        <li key={limitation} className="flex items-start">
                          <X className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-500">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    asChild
                    className={`w-full rounded-full ${
                      plan.popular
                        ? "bg-black text-white hover:bg-black/90"
                        : "bg-white text-black border border-gray-300 hover:bg-gray-50"
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
          <p className="text-sm text-gray-500 mb-4">All plans include a 14-day free trial. No credit card required.</p>
          <p className="text-sm text-gray-500">
            Need a custom solution?{" "}
            <Link href="https://cal.com/team/founders/partnership" className="text-black hover:underline">
              Contact our sales team
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Plans
