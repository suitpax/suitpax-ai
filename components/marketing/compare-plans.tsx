"use client"

import React from "react"
import { Check, X, HelpCircle } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

// Feature categories and their descriptions
const featureCategories = [
  {
    name: "AI Tokens & Usage",
    features: [
      {
        name: "Monthly AI Tokens",
        description: "Number of AI tokens available for use each month",
        beta: "5,000",
        free: "5,000",
        startups: "15,000",
        enterprise: "50,000",
        pioneers: "Unlimited",
      },
      {
        name: "AI Travel Searches",
        description: "Number of AI-powered travel searches per month",
        beta: "10/month",
        free: "10/month",
        startups: "30/month",
        enterprise: "50/month",
        pioneers: "Unlimited",
      },
      {
        name: "Token Rollover",
        description: "Unused tokens roll over to the next month",
        beta: false,
        free: false,
        startups: false,
        enterprise: true,
        pioneers: "N/A",
      },
    ],
  },
  {
    name: "Travel Management",
    features: [
      {
        name: "Itinerary Management",
        description: "Create, edit, and manage travel itineraries",
        beta: "Basic",
        free: "Basic",
        startups: "Advanced",
        enterprise: "Advanced",
        pioneers: "Enterprise",
      },
      {
        name: "Travel Policies",
        description: "Set and enforce travel policies for your team",
        beta: false,
        free: "Basic",
        startups: "Custom",
        enterprise: "Multi-entity",
        pioneers: "Global",
      },
      {
        name: "Expense Tracking",
        description: "Track and manage travel expenses",
        beta: "Basic",
        free: "Basic",
        startups: "Advanced",
        enterprise: "Portfolio-wide",
        pioneers: "Enterprise",
      },
    ],
  },
  {
    name: "AI Travel Agents",
    features: [
      {
        name: "Basic Travel Planning",
        description: "AI-powered travel planning capabilities",
        beta: true,
        free: true,
        startups: true,
        enterprise: true,
        pioneers: true,
      },
      {
        name: "Advanced AI Features",
        description: "Enhanced AI capabilities for complex travel scenarios",
        beta: false,
        free: false,
        startups: "Basic",
        enterprise: "Advanced",
        pioneers: "Enterprise",
      },
      {
        name: "CRM Intelligence",
        description: "AI-powered CRM insights for travel management",
        beta: false,
        free: false,
        startups: "Basic",
        enterprise: "Business-focused",
        pioneers: "Enterprise",
      },
      {
        name: "Custom AI Workflows",
        description: "Create custom AI workflows for your business",
        beta: false,
        free: false,
        startups: false,
        enterprise: "Limited",
        pioneers: "Unlimited",
      },
    ],
  },
  {
    name: "Team Features",
    features: [
      {
        name: "Team Members",
        description: "Number of team members allowed on the plan",
        beta: "3",
        free: "5",
        startups: "20",
        enterprise: "30",
        pioneers: "Unlimited",
      },
      {
        name: "Team Coordination",
        description: "Coordinate travel for multiple team members",
        beta: "Basic",
        free: "Basic",
        startups: "Advanced",
        enterprise: "Business-wide",
        pioneers: "Global",
      },
      {
        name: "Multi-Entity Management",
        description: "Manage travel across multiple business entities",
        beta: false,
        free: false,
        startups: false,
        enterprise: true,
        pioneers: true,
      },
    ],
  },
  {
    name: "Support & Integrations",
    features: [
      {
        name: "Customer Support",
        description: "Access to customer support",
        beta: "Email",
        free: "Email",
        startups: "24/5 Priority",
        enterprise: "24/5 Priority",
        pioneers: "24/7 VIP",
      },
      {
        name: "Bank API Integration",
        description: "Connect bank accounts for seamless expense management",
        beta: false,
        free: false,
        startups: "Basic",
        enterprise: "Advanced",
        pioneers: "Full",
      },
      {
        name: "CRM Integration",
        description: "Connect with CRM systems for better customer insights",
        beta: false,
        free: false,
        startups: "Basic",
        enterprise: "Business-focused",
        pioneers: "Enterprise",
      },
      {
        name: "Data Export & Reporting",
        description: "Export travel data and generate custom reports",
        beta: false,
        free: "Basic CSV",
        startups: "Advanced",
        enterprise: "Custom Reports",
        pioneers: "Enterprise Analytics",
      },
    ],
  },
  {
    name: "Security & Compliance",
    features: [
      {
        name: "Data Encryption",
        description: "End-to-end encryption for all your travel data",
        beta: true,
        free: true,
        startups: true,
        enterprise: true,
        pioneers: true,
      },
      {
        name: "SSO Integration",
        description: "Single Sign-On integration with your identity provider",
        beta: false,
        free: false,
        startups: false,
        enterprise: true,
        pioneers: true,
      },
      {
        name: "Compliance Reporting",
        description: "Reports to ensure compliance with travel policies",
        beta: false,
        free: false,
        startups: "Basic",
        enterprise: "Advanced",
        pioneers: "Enterprise",
      },
      {
        name: "Audit Logs",
        description: "Detailed logs of all actions taken in the platform",
        beta: false,
        free: false,
        startups: "30 days",
        enterprise: "90 days",
        pioneers: "Unlimited",
      },
    ],
  },
]

// Helper function to render feature value
const renderFeatureValue = (value: boolean | string) => {
  if (value === true) {
    return <Check className="h-4 w-4 text-emerald-600" />
  } else if (value === false) {
    return <X className="h-4 w-4 text-gray-300" />
  } else {
    return <span className="text-xs font-medium">{value}</span>
  }
}

export function ComparePlans() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("AI Tokens & Usage")
  const [isAnnual, setIsAnnual] = useState(false)

  const toggleCategory = (category: string) => {
    if (expandedCategory === category) {
      setExpandedCategory(null)
    } else {
      setExpandedCategory(category)
    }
  }

  return (
    <TooltipProvider>
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tighter text-black">
              Compare all features
            </h2>
            <p className="mt-3 text-sm text-gray-500">Detailed comparison of all features across our plans</p>
            <div className="flex justify-center mt-6">
              <div className="flex items-center bg-gray-100 p-1 rounded-full">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                    !isAnnual ? "bg-white shadow-sm text-black" : "text-gray-600"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                    isAnnual ? "bg-white shadow-sm text-black" : "text-gray-600"
                  }`}
                >
                  Annual
                  <span className="ml-1 inline-flex items-center rounded-full bg-emerald-950 px-2 py-0.5 text-[9px] font-medium text-white">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="min-w-[800px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="py-4 px-4 text-left w-1/6"></th>
                    <th className="py-4 px-4 text-center w-1/6">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-medium">Beta Access</span>
                        <span className="text-xs text-gray-500">Limited</span>
                        <span className="mt-1 inline-flex items-center rounded-full bg-transparent border border-black px-3 py-0.5 text-[10px] font-medium text-black">
                          Beta
                        </span>
                      </div>
                    </th>
                    <th className="py-4 px-4 text-center w-1/6">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-medium">Free</span>
                        <span className="text-xs text-gray-500">$0</span>
                        <span className="mt-1 inline-flex items-center rounded-full bg-transparent border border-black px-3 py-0.5 text-[10px] font-medium text-black">
                          Basic
                        </span>
                      </div>
                    </th>
                    <th className="py-4 px-4 text-center w-1/6 bg-gray-50">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-medium">Early</span>
                        <span className="text-xs text-gray-500">{isAnnual ? "$39/month" : "$49/month"}</span>
                        <span className="mt-1 inline-flex items-center rounded-full bg-black px-4 py-0.5 text-[10px] font-medium text-white">
                          Most Popular
                        </span>
                      </div>
                    </th>
                    <th className="py-4 px-4 text-center w-1/6 bg-gray-50">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-medium">Startups</span>
                        <span className="text-xs text-gray-500">{isAnnual ? "$99/month" : "$129/month"}</span>
                        <span className="mt-1 inline-flex items-center rounded-full bg-transparent border border-black px-3 py-0.5 text-[10px] font-medium text-black">
                          Growing Business
                        </span>
                      </div>
                    </th>
                    <th className="py-4 px-4 text-center w-1/6">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-medium">Unicorn</span>
                        <span className="text-xs text-gray-500">Custom pricing</span>
                        <span className="mt-1 inline-flex items-center rounded-full bg-transparent border border-black px-3 py-0.5 text-[10px] font-medium text-black">
                          Enterprise
                        </span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {featureCategories.map((category, categoryIndex) => (
                    <React.Fragment key={category.name}>
                      <tr
                        className={`border-b cursor-pointer hover:bg-gray-50 ${
                          expandedCategory === category.name ? "bg-gray-50" : ""
                        }`}
                        onClick={() => toggleCategory(category.name)}
                      >
                        <td colSpan={6} className="py-3 px-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{category.name}</span>
                            <svg
                              className={`w-4 h-4 transition-transform ${expandedCategory === category.name ? "rotate-180" : ""}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          </div>
                        </td>
                      </tr>
                      {expandedCategory === category.name &&
                        category.features.map((feature, index) => (
                          <motion.tr
                            key={`${category.name}-${index}`}
                            className={`border-b ${index % 2 === 1 ? "bg-gray-50" : ""}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <span className="text-xs sm:text-sm font-medium">{feature.name}</span>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <HelpCircle className="h-3 w-3 text-gray-400 ml-1 cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>{feature.description}</TooltipContent>
                                </Tooltip>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">{renderFeatureValue(feature.beta)}</td>
                            <td className="py-3 px-4 text-center">{renderFeatureValue(feature.free)}</td>
                            <td className="py-3 px-4 text-center bg-gray-50">{renderFeatureValue(feature.startups)}</td>
                            <td className="py-3 px-4 text-center bg-gray-50">
                              {renderFeatureValue(feature.enterprise)}
                            </td>
                            <td className="py-3 px-4 text-center">{renderFeatureValue(feature.pioneers)}</td>
                          </motion.tr>
                        ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-sm text-gray-500 mb-2">Need help choosing the right plan for your business?</p>
            {isAnnual && (
              <p className="text-xs text-emerald-950 font-medium mb-3">
                Annual plans include a 20% discount compared to monthly billing
              </p>
            )}
            <a
              href="mailto:hello@suitpax.com"
              className="inline-flex items-center text-sm font-medium bg-black text-white rounded-xl px-5 py-2.5 hover:bg-gray-800 transition-colors"
            >
              Talk to our sales team
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </a>
          </motion.div>
        </div>
      </section>
    </TooltipProvider>
  )
}

export default ComparePlans
