"use client"

import { motion } from "framer-motion"
import { PiChartLineUpBold } from "react-icons/pi"
import { SiMarriott, SiBritishairways, SiTesla, SiAmazon, SiNike, SiAnthropic } from "react-icons/si"
import type { DealItem } from "./types"

interface DealsPipelineProps {
  animateDeals: boolean
}

export const DealsPipeline = ({ animateDeals }: DealsPipelineProps) => {
  // Datos de deals internos
  const deals: DealItem[] = [
    {
      company: "Nike",
      icon: <SiNike className="w-full h-full text-white" />,
      deal: "Sports Team Travel",
      stage: "Closing",
      value: "$275K",
      probability: 90,
    },
    {
      company: "Marriott",
      icon: <SiMarriott className="w-full h-full text-white" />,
      deal: "Annual Corporate Rate",
      stage: "Negotiation",
      value: "$450K",
      probability: 80,
    },
    {
      company: "British Airways",
      icon: <SiBritishairways className="w-full h-full text-white" />,
      deal: "Premium Partnership",
      stage: "Proposal",
      value: "$320K",
      probability: 65,
    },
    {
      company: "Tesla",
      icon: <SiTesla className="w-full h-full text-white" />,
      deal: "Executive Travel Program",
      stage: "Meeting",
      value: "$280K",
      probability: 40,
    },
    {
      company: "Amazon",
      icon: <SiAmazon className="w-full h-full text-white" />,
      deal: "Executive Travel Program",
      stage: "Discovery",
      value: "$550K",
      probability: 25,
    },
    {
      company: "Anthropic",
      icon: <SiAnthropic className="w-full h-full text-white" />,
      deal: "AI Travel Solutions",
      stage: "Proposal",
      value: "$420K",
      probability: 75,
    },
  ]

  return (
    <motion.div
      key="deals"
      className="content-deals space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Deals Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-white">Active Deals</h3>
        <div className="flex gap-2">
          <span className="inline-flex items-center rounded-xl bg-white/10 px-3 py-1 text-[10px] font-medium text-white tracking-wide border border-white/20">
            <div className="w-4 h-4 rounded-md bg-black flex items-center justify-center text-white mr-2">
              <PiChartLineUpBold className="h-2.5 w-2.5" />
            </div>
            68% WIN RATE
          </span>
        </div>
      </div>

      {/* Deals in horizontal badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {deals.map((deal, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: animateDeals ? 1 : 0, y: animateDeals ? 0 : 10 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            whileHover={{ y: -3, scale: 1.01 }}
            className="flex-grow bg-transparent border border-white/20 rounded-xl p-2 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-black/60 border border-white/10 flex items-center justify-center p-1.5">
                {deal.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-white">{deal.company}</div>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-xl bg-white/10 text-[9px] font-medium text-white border border-white/20">
                    {deal.stage}
                  </span>
                </div>
                <div className="text-[9px] text-white/60 mt-0.5">{deal.deal}</div>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-xs font-mono font-bold text-white">{deal.value}</div>
                  <div className="text-[9px] font-medium text-white">{deal.probability}%</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
