"use client"

import { useState } from "react"
import { motion } from "framer-motion"

// Tipo para los elementos FAQ
export type FAQItem = {
  question: string
  answer: string
}

// Props para el componente FAQ
export interface FAQProps {
  title?: string
  items: FAQItem[]
  className?: string
}

export function FAQ({ title = "Frequently Asked Questions", items, className = "" }: FAQProps) {
  const [openItem, setOpenItem] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index)
  }

  return (
    <div className={`mt-16 mb-20 ${className}`}>
      <h3 className="text-xl sm:text-2xl font-medium tracking-tighter text-black mb-6 text-center">{title}</h3>
      <div className="max-w-3xl mx-auto space-y-3">
        {items.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium">{item.question}</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${openItem === index ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {openItem === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-4 pb-4"
              >
                <p className="text-sm text-gray-600">{item.answer}</p>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Preguntas y respuestas predefinidas para el componente
export const defaultFAQItems: FAQItem[] = [
  {
    question: "How do AI travel agents work?",
    answer:
      "Our AI travel agents use natural language processing to understand your travel needs and preferences. They search across multiple providers to find the best options, handle bookings, and can even rebook if there are disruptions. You can interact with them through chat, voice, or email, and they learn from your preferences over time to provide increasingly personalized recommendations.",
  },
  {
    question: "Can I customize travel policies for my team?",
    answer:
      "Yes, all paid plans allow you to set custom travel policies. You can define spending limits, preferred airlines and hotels, approval workflows, and more to ensure compliance across your organization. You can also create different policy tiers for different employee levels or departments, and our AI will automatically enforce these policies during the booking process.",
  },
  {
    question: "How does the token system work?",
    answer:
      "AI tokens are used each time you interact with our AI travel agents. Different requests use different amounts of tokens based on complexity. For example, a simple flight search might use 50 tokens, while planning a multi-city trip with specific requirements might use 200-300 tokens. Each plan includes a monthly token allocation, and you can purchase additional tokens if needed. Unused tokens do not roll over to the next month.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer:
      "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades will take effect at the end of your current billing cycle. When upgrading, you'll be prorated for the remainder of your billing period. Your data, settings, and preferences will be preserved when changing plans.",
  },
  {
    question: "What integrations does Suitpax support?",
    answer:
      "Suitpax integrates with popular business tools including expense management systems (Expensify, SAP Concur), calendar applications (Google Calendar, Microsoft Outlook), CRM platforms (Salesforce, HubSpot), and communication tools (Slack, Microsoft Teams). We also offer API access for custom integrations on our Enterprise plans. Our development team regularly adds new integrations based on customer feedback.",
  },
  {
    question: "How does Suitpax handle travel disruptions?",
    answer:
      "Our AI travel agents monitor your trips 24/7 and proactively alert you to any disruptions such as flight delays, cancellations, or weather events. Depending on your plan, they can automatically suggest and book alternatives, rearrange ground transportation, and update your calendar. You'll receive real-time notifications through your preferred channel (email, SMS, or app), and our human support team is available for complex situations.",
  },
  {
    question: "Is my data secure with Suitpax?",
    answer:
      "Yes, we take data security very seriously. Suitpax is SOC 2 Type II compliant and uses enterprise-grade encryption for all data at rest and in transit. We implement strict access controls, regular security audits, and follow industry best practices for data protection. We never sell your data to third parties and only use it to improve your travel experience. Our privacy policy provides complete transparency about how we handle your information.",
  },
  {
    question: "What kind of reporting and analytics are available?",
    answer:
      "Suitpax offers comprehensive travel analytics and reporting features that vary by plan. All plans include basic spending reports and travel activity summaries. Higher-tier plans provide advanced analytics such as travel pattern analysis, policy compliance metrics, carbon footprint tracking, cost-saving opportunities, and customizable dashboards. Reports can be scheduled, exported in multiple formats, and shared with stakeholders.",
  },
  {
    question: "How does Suitpax help with expense management?",
    answer:
      "Our platform streamlines expense management by automatically capturing and categorizing travel expenses. Receipts are digitized and matched to the correct trips, and expenses can be automatically submitted to your company's expense system. For corporate card transactions, we provide real-time tracking and reconciliation. Our AI can also identify potential savings and policy violations before they occur, helping to control costs proactively.",
  },
  {
    question: "What support options are available?",
    answer:
      "Support options vary by plan. Our Free plan includes email support with a 48-hour response time. The Early plan offers 24/5 priority support via email and chat. The Scale-up plan adds phone support during business hours. The Unicorn plan provides 24/7 VIP support with dedicated account managers and priority issue resolution. All customers have access to our comprehensive knowledge base, video tutorials, and community forums.",
  },
]

export default FAQ
