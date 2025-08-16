"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { SiRevolut, SiBrex, SiWise, SiExpensify } from "react-icons/si"
import {
  PiReceiptBold,
  PiCreditCardBold,
  PiCheckCircleBold,
  PiClockCountdownBold,
  PiLightningBold,
  PiShieldCheckBold,
  PiDevicesBold,
  PiUsersBold,
  PiCalendarBold,
  PiCurrencyDollarBold,
  PiTagBold,
  PiCheckSquareBold,
} from "react-icons/pi"

const features = [
  {
    id: "receipts",
    title: "Receipt Management",
    description: "Automatic capture and processing of receipts with AI-powered data recognition.",
    icon: PiReceiptBold,
    partners: [
      { name: "Revolut", icon: SiRevolut },
      { name: "Expensify", icon: SiExpensify },
    ],
    benefits: [
      { text: "Automatic data recognition", icon: PiLightningBold },
      { text: "Smart categorization", icon: PiCheckCircleBold },
      { text: "Tax compliance guaranteed", icon: PiShieldCheckBold },
      { text: "Advanced search", icon: PiDevicesBold },
    ],
    quote: "Effortless expense tracking",
  },
  {
    id: "cards",
    title: "Corporate Cards",
    description: "Physical and virtual cards with custom limits and real-time expense control.",
    icon: PiCreditCardBold,
    partners: [
      { name: "Brex", icon: SiBrex },
      { name: "Wise", icon: SiWise },
    ],
    benefits: [
      { text: "Instant virtual cards", icon: PiLightningBold },
      { text: "Customizable limits", icon: PiUsersBold },
      { text: "Real-time notifications", icon: PiClockCountdownBold },
      { text: "Instant locking", icon: PiShieldCheckBold },
    ],
    quote: "Smart spending for modern business",
  },
]

export default function ExpenseManagement() {
  const [activeFeature, setActiveFeature] = useState(features[0].id)

  const currentFeature = features.find((feature) => feature.id === activeFeature) || features[0]

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="space-y-2">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all border ${
                  activeFeature === feature.id ? "bg-white/10 border-white/20 text-white" : "hover:bg-white/5 border-transparent text-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      activeFeature === feature.id ? "bg-white/20 text-white" : "bg-white/10 text-gray-200"
                    }`}
                  >
                    <feature.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-white">{feature.title}</h3>
                    <p className="text-xs text-gray-400 line-clamp-1">{feature.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="h-full flex flex-col">
            <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden mb-4">
              <div
                className="absolute inset-0 bg-gradient-to-br from-black to-black/60"
              >
                <div className="absolute inset-0 bg-black/20"></div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4/5 bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20">
                    {activeFeature === "receipts" && (
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Image
                              src="/logo/suitpax-bl-logo.webp"
                              alt="Suitpax"
                              width={40}
                              height={10}
                              className="h-3 w-auto invert"
                            />
                            <span className="text-[10px] font-serif italic text-gray-300">fintech</span>
                          </div>
                          <span className="text-[10px] font-medium text-gray-300">SMART RECEIPT</span>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">Business Dinner</span>
                            <div className="flex items-center gap-1">
                              <PiTagBold className="w-3 h-3 text-gray-300" />
                              <span className="text-[10px] text-gray-400">Client Meeting</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <PiCalendarBold className="w-3 h-3 text-gray-300" />
                            <span className="text-[10px] font-medium text-gray-200">Oct 12, 2023</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            <PiCheckSquareBold className="w-3 h-3 text-gray-300" />
                            <span className="text-[10px] font-medium text-gray-300">Automatically processed</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <PiCurrencyDollarBold className="w-3 h-3 text-gray-300" />
                            <span className="text-xs font-medium text-white">$187.50</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-medium text-gray-300">The Capital Grille, New York</span>
                          <span className="text-[10px] font-medium text-gray-300">Tax: $15.25</span>
                        </div>
                      </div>
                    )}

                    {activeFeature === "cards" && (
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Image
                              src="/logo/suitpax-bl-logo.webp"
                              alt="Suitpax"
                              width={40}
                              height={10}
                              className="h-3 w-auto invert"
                            />
                            <span className="text-[10px] font-serif italic text-gray-300">finance</span>
                          </div>
                          <span className="text-[10px] font-medium text-gray-300">VIRTUAL CARD</span>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">Marketing Team</span>
                            <span className="text-[10px] text-gray-300">Virtual Mastercard</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-medium text-white">**** **** **** 4589</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <PiCalendarBold className="w-3 h-3 text-gray-300" />
                            <span className="text-[10px] font-medium text-gray-200">Expires: 10/25</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-medium text-gray-300">Monthly Limit</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium text-white">$5,000</span>
                            <span className="text-[10px] text-gray-300">$3,245 available</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-grow">
              <h3 className="text-xl font-medium tracking-tighter text-white mb-2">{currentFeature.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{currentFeature.description}</p>

              <div className="mb-6">
                <h4 className="text-xs font-medium text-gray-400 mb-3">INTEGRATIONS</h4>
                <div className="grid grid-cols-4 gap-2">
                  {currentFeature.partners.map((partner, idx) => (
                    <motion.div
                      key={partner.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, type: "spring", stiffness: 400, damping: 15 }}
                      className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/10 border border-white/20"
                      title={partner.name}
                    >
                      <partner.icon className="w-5 h-5 text-gray-200" />
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 400, damping: 15 }}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 border border-white/10"
                  >
                    <span className="text-xs font-medium text-gray-400">+8</span>
                  </motion.div>
                </div>
              </div>

              <div className="mb-6">
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <p className="font-serif italic text-lg text-gray-200">"{currentFeature.quote}"</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-medium text-gray-400 mb-2">FEATURES</h4>
                <div className="grid grid-cols-2 gap-2">
                  {currentFeature.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10">
                        <benefit.icon className="h-3 w-3 text-gray-200" />
                      </span>
                      <span className="text-xs font-medium text-gray-200">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-medium text-gray-400 mb-1">COMPLETE AUTOMATION</h4>
            <p className="text-sm text-gray-300">Reduce expense management time by more than 80%</p>
          </div>
          <motion.div className="flex items-center gap-1 text-xs font-medium text-white/90" whileHover={{ scale: 1.05 }}>
            View demo
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 12L10 8L6 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
