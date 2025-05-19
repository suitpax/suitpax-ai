"use client"

import React, { useState } from "react"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { motion } from "framer-motion"

// Pricing plans importados desde el componente Plans
const pricingPlans = [
  {
    id: "free",
    name: "Free",
    description: "For small business teams getting started with AI travel management",
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
      "Basic travel policy templates",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing businesses ready to optimize their travel operations",
    price: "€89",
    annualPrice: "€71",
    period: "per month",
    annualPeriod: "per month, billed annually",
    features: [
      "25,000 AI tokens/month",
      "50 AI travel searches per month",
      "Up to 25 team members",
      "AI-powered expense management",
      "Advanced itinerary planning",
      "Custom travel policies",
      "24/5 priority support",
      "Team travel coordination",
      "Basic bank API integration",
      "Advanced TRM intelligence",
    ],
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
      "Multi-currency management",
    ],
  },
]

// Función para renderizar características
const renderFeatureValue = (value: string | boolean) => {
  if (value === true) {
    return <span className="text-green-500">✔</span>
  } else if (value === false) {
    return <span className="text-red-500">✘</span>
  } else {
    return <span>{value}</span>
  }
}

// Categorías de características basadas en los planes
const featureCategories = [
  {
    name: "AI Tokens & Usage",
    features: [
      {
        name: "Monthly AI Tokens",
        description: "Number of AI tokens available for use each month",
        values: (plan: any) => plan.features.find((f: string) => f.includes("tokens/month")),
      },
      {
        name: "AI Travel Searches",
        description: "Number of AI-powered travel searches per month",
        values: (plan: any) => plan.features.find((f: string) => f.includes("travel searches")),
      },
    ],
  },
  {
    name: "Team Features",
    features: [
      {
        name: "Team Members",
        description: "Number of team members allowed on the plan",
        values: (plan: any) => plan.features.find((f: string) => f.includes("team members")),
      },
      {
        name: "Team Travel Coordination",
        description: "Coordinate travel for multiple team members",
        values: (plan: any) => plan.features.find((f: string) => f.includes("team coordination")),
      },
    ],
  },
  {
    name: "Support & Integrations",
    features: [
      {
        name: "Customer Support",
        description: "Access to customer support",
        values: (plan: any) => plan.features.find((f: string) => f.includes("support")),
      },
      {
        name: "Bank API Integration",
        description: "Connect bank accounts for seamless expense management",
        values: (plan: any) => plan.features.find((f: string) => f.includes("bank API integration")),
      },
    ],
  },
]

export default function ComparePlans() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <TooltipProvider>
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tighter text-black">
              Compare all features
            </h2>
            <p className="mt-3 text-sm text-gray-500">
              Detailed comparison of all features across our plans
            </p>
            <div className="flex justify-center mt-6">
              <div className="flex items-center bg-gray-100 p-1 rounded-full">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-4 py-1.5 text-xs font-medium rounded-full ${
                    !isAnnual ? "bg-white shadow text-black" : "text-gray-600"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-4 py-1.5 text-xs font-medium rounded-full ${
                    isAnnual ? "bg-white shadow text-black" : "text-gray-600"
                  }`}
                >
                  Annual
                  <span className="ml-1 inline-flex items-center rounded-full bg-green-500 px-2 py-0.5 text-[9px] font-medium text-white">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="py-4 px-4 text-left">Features</th>
                  {pricingPlans.map((plan) => (
                    <th key={plan.id} className="py-4 px-4 text-center">
                      <div>
                        <span className="text-sm font-medium">{plan.name}</span>
                        <span className="text-xs text-gray-500 block">
                          {isAnnual ? plan.annualPrice : plan.price}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureCategories.map((category) => (
                  <React.Fragment key={category.name}>
                    <tr className="bg-gray-100">
                      <td colSpan={pricingPlans.length + 1} className="py-3 px-4 font-medium">
                        {category.name}
                      </td>
                    </tr>
                    {category.features.map((feature) => (
                      <tr key={feature.name} className="border-b">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span>{feature.name}</span>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="ml-2 text-gray-400 cursor-help">?</span>
                              </TooltipTrigger>
                              <TooltipContent>{feature.description}</TooltipContent>
                            </Tooltip>
                          </div>
                        </td>
                        {pricingPlans.map((plan) => (
                          <td key={plan.id} className="py-3 px-4 text-center">
                            {renderFeatureValue(feature.values(plan))}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </TooltipProvider>
  )
}