"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"

// Pricing plans
const pricingPlans = [
  {
    id: "free",
    name: "Starter",
    description: "Perfect for small teams taking their first steps in business travel management",
    price: "€0",
    annualPrice: "€0",
    period: "forever",
    annualPeriod: "forever",
    features: [
      "5,000 AI tokens/month",
      "10 AI travel searches per month",
      "Up to 5 team members",
      "Basic AI travel planning",
      "Email support",
      "Basic expense tracking",
      "Simple itinerary management",
    ],
    cta: "Get started for free",
    badge: "Free",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing businesses ready to optimize their travel operations",
    price: "€89",
    annualPrice: "€79",
    period: "per month",
    annualPeriod: "per month, billed annually",
    features: [
      "25,000 AI tokens/month",
      "50 AI travel searches per month",
      "Up to 20 team members",
      "AI-powered expense management",
      "Advanced itinerary planning",
      "Custom travel policies",
      "24/5 priority support",
      "Team travel coordination",
      "Basic bank API integration",
    ],
    cta: "Get started",
    badge: "Most Popular",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Enterprise-grade travel management for global companies",
    price: "Custom Pricing",
    annualPrice: "Custom Pricing",
    period: "tailored for enterprise",
    annualPeriod: "tailored for enterprise",
    features: [
      "Unlimited AI tokens",
      "Unlimited AI travel searches",
      "Unlimited team members",
      "Full AI travel intelligence suite",
      "Enterprise CRM integration",
      "Global travel compliance",
      "24/7 VIP support",
      "Custom AI workflows",
      "Executive travel program",
      "Full bank API integration",
    ],
    cta: "Contact us",
    badge: "Enterprise",
    popular: false,
  },
]

export const Plans = () => {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section className="py-16 sm:py-20 bg-black text-white">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <motion.div
          className="flex flex-col items-center justify-center text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center gap-2 mb-4 sm:mb-6 bg-gray-800/50 px-3 py-2 rounded-full">
            <span className="inline-flex items-center rounded-full bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-200">
              Trusted by 1000+ SaaS Leaders
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-white leading-none max-w-4xl mb-4">
            Plans That Scale With You
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-400 max-w-2xl mb-6 sm:mb-8">
            Choose the plan that fits your needs and budget
          </p>

          <div className="flex justify-center mb-8">
            <div className="flex items-center bg-gray-800/50 p-1 rounded-full">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                  !isAnnual ? "bg-gray-700 text-white" : "text-gray-400"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                  isAnnual ? "bg-gray-700 text-white" : "text-gray-400"
                }`}
              >
                Annual
                <span className="ml-1 inline-flex items-center rounded-full bg-gray-600 px-2 py-0.5 text-[9px] font-medium text-gray-200">
                  Save 10%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className={`relative overflow-hidden bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col h-full ${
                  plan.popular ? "ring-1 ring-gray-400" : ""
                }`}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.2 },
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {plan.badge && (
                  <span className="inline-flex items-center rounded-md bg-gray-800 px-2 py-1 text-xs font-medium text-gray-300 mb-4">
                    {plan.badge}
                  </span>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-medium tracking-tighter text-white">{plan.name}</h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2 h-10">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-medium tracking-tighter text-white">
                      {isAnnual ? plan.annualPrice : plan.price}
                    </span>
                    <span className="text-sm text-gray-400 ml-1">/{isAnnual ? plan.annualPeriod : plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6 flex-grow">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="mt-auto">
                  <Link
                    href={plan.id === "enterprise" ? "mailto:hello@suitpax.com" : "/signup"}
                    className={`w-full py-2 px-4 rounded-lg text-center text-sm font-medium transition-all ${
                      plan.popular
                        ? "bg-white text-black hover:bg-gray-200"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-16 text-center max-w-2xl mx-auto bg-gray-900 p-6 rounded-xl border border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-xl font-medium tracking-tighter text-white mb-2">Need a custom solution?</h3>
            <p className="text-sm text-gray-400 mb-5">
              Our enterprise plans are tailored to your specific business travel needs. Contact our sales team to learn
              more about how we can customize a solution for your organization.
            </p>
            <Link
              href="mailto:hello@suitpax.com"
              className="inline-flex items-center text-sm font-medium bg-white text-black px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Contact our sales team
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Plans
