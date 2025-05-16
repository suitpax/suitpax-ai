"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Link from "next/link"
import {
  SiPersonio,
  SiIntercom,
  SiAsana,
  SiClickup,
  SiHubspot,
  SiQuickbooks,
  SiNotion,
  SiJira,
  SiGmail,
  SiExpensify,
  SiAircall,
  SiCaldotcom,
  SiElevenlabs,
  SiGithub,
  SiGooglecalendar,
  SiHuggingface,
  SiSlack,
  SiBrex,
  SiZapier,
  SiOpenai,
} from "react-icons/si"

// Definir los iconos de integración
const integrationIcons = [
  { icon: SiPersonio, name: "Personio" },
  { icon: SiIntercom, name: "Intercom" },
  { icon: SiAsana, name: "Asana" },
  { icon: SiClickup, name: "ClickUp" },
  { icon: SiHubspot, name: "HubSpot" },
  { icon: SiQuickbooks, name: "QuickBooks" },
  { icon: SiNotion, name: "Notion" },
  { icon: SiJira, name: "Jira" },
  { icon: SiGmail, name: "Gmail" },
  { icon: SiExpensify, name: "Expensify" },
  { icon: SiAircall, name: "Aircall" },
  { icon: SiCaldotcom, name: "Cal.com" },
  { icon: SiElevenlabs, name: "ElevenLabs" },
  { icon: SiGithub, name: "GitHub" },
  { icon: SiGooglecalendar, name: "Google Calendar" },
  { icon: SiHuggingface, name: "Hugging Face" },
  { icon: SiSlack, name: "Slack" },
  { icon: SiBrex, name: "Brex" },
  { icon: SiZapier, name: "Zapier" },
  { icon: SiOpenai, name: "OpenAI" },
]

export const IntegrationsShowcase = () => {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
              Seamless Integrations
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse mr-1"></span>
              100+ Connectors
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-tight">
            Supercharge your workflow with seamless integrations
          </h2>
          <p className="mt-4 text-xs font-medium text-gray-500 max-w-2xl mb-8">
            Integrate with your favorite tools and services to streamline your workflow and enhance productivity.
          </p>
        </div>

        {/* Grid de iconos de integración */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 gap-4 mb-12">
            {integrationIcons.map((item, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                onHoverStart={() => setHoveredIcon(item.name)}
                onHoverEnd={() => setHoveredIcon(null)}
              >
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gray-100 rounded-xl"></div>
                  <item.icon
                    className={`relative z-10 w-5 h-5 text-gray-600 transition-transform duration-200 ${
                      hoveredIcon === item.name ? "scale-110" : "scale-100"
                    }`}
                  />
                </div>
                {hoveredIcon === item.name && (
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[9px] text-gray-500 mt-1 absolute -bottom-5"
                  >
                    {item.name}
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Características */}
        <div className="max-w-3xl mx-auto">
          <ul className="space-y-4 text-left">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-black mt-2"></span>
              <div>
                <p className="text-black font-medium">100+ connectors and custom integrations API</p>
                <p className="text-sm text-gray-500">
                  Connect with all your favorite tools and services through our extensive integration library.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-black mt-2"></span>
              <div>
                <p className="text-black font-medium">Mirror all permissions from one admin space</p>
                <p className="text-sm text-gray-500">
                  Manage access and permissions centrally for all your connected services.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-black mt-2"></span>
              <div>
                <p className="text-black font-medium">No data leakage outside your company</p>
                <p className="text-sm text-gray-500">
                  Enterprise-grade security ensures your data remains protected at all times.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-black mt-2"></span>
              <div>
                <p className="text-black font-medium">Set up once for every employee</p>
                <p className="text-sm text-gray-500">
                  Streamline onboarding with one-time setup that applies across your organization.
                </p>
              </div>
            </li>
          </ul>

          <div className="mt-10 flex justify-center">
            <Link
              href="#"
              className="inline-flex items-center rounded-xl bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 border border-gray-300/50 hover:bg-gray-300/50 transition-colors"
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default IntegrationsShowcase
