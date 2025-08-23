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
      { name: "Monthly AI Tokens", description: "Token capacity per org per month", free: "7.5k", basic: "20k", pro: "35k", scale: "80k", enterprise: "Unlimited" },
      { name: "AI Travel Searches", description: "AI-powered flight searches per month", free: "15", basic: "40", pro: "80", scale: "200", enterprise: "Unlimited" },
      { name: "Token Rollover", description: "Unused tokens roll over to next month", free: false, basic: false, pro: false, scale: false, enterprise: true },
    ],
  },
  {
    name: "Voice Agent & Policies",
    features: [
      { name: "Voice AI Agent", description: "Call to search and book", free: "Limited", basic: "Standard", pro: "Full", scale: "Full + Rebooking", enterprise: "Full + Concierge 24/7" },
      { name: "Auto‑apply Policies", description: "Real-time enforcement", free: "Basic templates", basic: "Templates", pro: "Rules engine", scale: "Conditional + multi-approver", enterprise: "Global compliance" },
    ],
  },
  {
    name: "Expense & OCR",
    features: [
      { name: "Expense Control", description: "Controls and budgets", free: "Basic", basic: "Standard", pro: "Advanced", scale: "Advanced", enterprise: "Program-wide" },
      { name: "Cost Centers", description: "Cost center management", free: "1", basic: "3", pro: "10", scale: "Unlimited", enterprise: "Unlimited" },
      { name: "OCR Receipts", description: "Receipt extraction & coding", free: "Basic", basic: "Standard", pro: "Advanced", scale: "Enterprise", enterprise: "Enterprise" },
    ],
  },
  {
    name: "Travel Content & Integrations",
    features: [
      { name: "+30 NDC airlines", description: "Modern content via NDC", free: true, basic: true, pro: true, scale: true, enterprise: true },
      { name: "Access to 200+ airlines", description: "BA, Air France, Iberia, Lufthansa", free: true, basic: true, pro: true, scale: true, enterprise: true },
      { name: "Integrations", description: "Gmail, Google Calendar, Slack, ERP/HRIS", free: "Basic", basic: "Standard", pro: "Starter ERP/HRIS", scale: "SSO/SCIM + Webhooks", enterprise: "Custom + DWH" },
    ],
  },
  {
    name: "Support",
    features: [
      { name: "Support", description: "Availability & SLA", free: "Email", basic: "Priority email", pro: "24/5", scale: "24/5 + Success", enterprise: "24/7 VIP + SLA" },
    ],
  },
]

// Helper function to render feature value
const renderFeatureValue = (value: boolean | string) => {
  if (value === true) return <Check className="h-5 w-5 text-emerald-700" />
  if (value === false) return <X className="h-5 w-5 text-gray-400" />
  return <span className="text-sm font-medium text-gray-700">{value}</span>
}

export function ComparePlans() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("AI Tokens & Usage")
  const [isAnnual, setIsAnnual] = useState(true)

  const toggleCategory = (category: string) => setExpandedCategory(expandedCategory === category ? null : category)

  return (
    <TooltipProvider>
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div className="text-center mb-12 md:mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-black leading-tight mb-4">Compare all features</h2>
            <p className="text-base text-gray-500 mb-8">Detailed comparison across Free, Starter, Pro, Scale and Enterprise</p>
            <div className="flex justify-center">
              <div className="flex items-center bg-gray-100 p-1 rounded-full border border-gray-200">
                <button onClick={() => setIsAnnual(false)} className={`px-6 py-2 text-sm font-medium rounded-full transition-all ${!isAnnual ? "bg-white shadow-sm text-black" : "text-gray-600 hover:text-black"}`}>Monthly</button>
                <button onClick={() => setIsAnnual(true)} className={`px-6 py-2 text-sm font-medium rounded-full transition-all ${isAnnual ? "bg-white shadow-sm text-black" : "text-gray-600 hover:text-black"}`}>
                  Annual <span className="ml-2 inline-flex items-center rounded-full bg-black px-2 py-0.5 text-xs font-medium text-white">Save 20%</span>
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div className="min-w-[1100px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-white">
                    <th className="py-6 px-6 text-left w-1/5"></th>
                    <th className="py-6 px-6 text-center w-1/5"><div className="flex flex-col items-center"><span className="text-lg font-medium text-black mb-1">Free</span><span className="text-sm text-gray-500 mb-2">€0</span></div></th>
                    <th className="py-6 px-6 text-center w-1/5 bg-gray-50 relative"><div className="relative flex flex-col items-center"><span className="text-lg font-medium text-black mb-1">Starter</span><span className="text-sm text-gray-500 mb-2">{isAnnual ? "€39/mo" : "€49/mo"}</span><span className="inline-flex items-center rounded-full bg-white border border-black px-4 py-1 text-xs font-medium text-black">Most Popular</span></div></th>
                    <th className="py-6 px-6 text-center w-1/5"><div className="flex flex-col items-center"><span className="text-lg font-medium text-black mb-1">Pro</span><span className="text-sm text-gray-500 mb-2">{isAnnual ? "€79/mo" : "€99/mo"}</span></div></th>
                    <th className="py-6 px-6 text-center w-1/5"><div className="flex flex-col items-center"><span className="text-lg font-medium text-black mb-1">Scale</span><span className="text-sm text-gray-500 mb-2">{isAnnual ? "€239/mo" : "€299/mo"}</span></div></th>
                    <th className="py-6 px-6 text-center w-1/5"><div className="flex flex-col items-center"><span className="text-lg font-medium text-black mb-1">Enterprise</span><span className="text-sm text-gray-500 mb-2">Custom pricing</span></div></th>
                  </tr>
                </thead>
                <tbody>
                  {featureCategories.map((category) => (
                    <React.Fragment key={category.name}>
                      <tr className={`border-b border-gray-200 cursor-pointer hover:bg-gray-100/80 transition-colors ${expandedCategory === category.name ? "bg-gray-100" : ""}`} onClick={() => toggleCategory(category.name)}>
                        <td colSpan={7} className="py-4 px-6">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-base text-black">{category.name}</span>
                            <svg className={`w-5 h-5 transition-transform text-gray-400 ${expandedCategory === category.name ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                          </div>
                        </td>
                      </tr>
                      {expandedCategory === category.name && category.features.map((feature, index) => (
                        <motion.tr key={`${category.name}-${index}`} className={`border-b border-gray-200 ${index % 2 === 1 ? "bg-gray-50" : ""}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                          <td className="py-4 px-6"><div className="flex items-center"><span className="text-sm font-medium text-black">{feature.name}</span><Tooltip><TooltipTrigger><HelpCircle className="h-4 w-4 text-gray-500 ml-2 cursor-help hover:text-gray-700 transition-colors" /></TooltipTrigger><TooltipContent className="bg-white text-black border border-gray-200 max-w-xs">{feature.description}</TooltipContent></Tooltip></div></td>
                          <td className="py-4 px-6 text-center">{renderFeatureValue(feature.free)}</td>
                          <td className="py-4 px-6 text-center bg-gray-800/20">{renderFeatureValue(feature.basic)}</td>
                          <td className="py-4 px-6 text-center">{renderFeatureValue(feature.pro)}</td>
                          <td className="py-4 px-6 text-center">{renderFeatureValue((feature as any).scale)}</td>
                          <td className="py-4 px-6 text-center">{renderFeatureValue(feature.enterprise)}</td>
                        </motion.tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>
    </TooltipProvider>
  )
}

export default ComparePlans
