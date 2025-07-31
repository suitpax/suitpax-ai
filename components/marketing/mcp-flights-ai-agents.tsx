"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { PiSparkle, PiAirplane, PiCalendar, PiCreditCard, PiUsers, PiChartBar, PiGlobe } from "react-icons/pi"

const airlines = [
  { name: "Delta", logo: "/placeholder.svg?height=40&width=120" },
  { name: "American", logo: "/placeholder.svg?height=40&width=120" },
  { name: "United", logo: "/placeholder.svg?height=40&width=120" },
  { name: "Southwest", logo: "/placeholder.svg?height=40&width=120" },
  { name: "JetBlue", logo: "/placeholder.svg?height=40&width=120" },
  { name: "Alaska", logo: "/placeholder.svg?height=40&width=120" },
  { name: "Spirit", logo: "/placeholder.svg?height=40&width=120" },
  { name: "Frontier", logo: "/placeholder.svg?height=40&width=120" },
]

const features = [
  {
    icon: PiAirplane,
    title: "Real-time Flight Search",
    description: "AI-powered search across 500+ airlines with instant price comparisons and availability updates.",
  },
  {
    icon: PiCalendar,
    title: "Smart Scheduling",
    description: "Intelligent calendar integration that suggests optimal travel times based on your business needs.",
  },
  {
    icon: PiCreditCard,
    title: "Automated Expense Tracking",
    description: "Seamless integration with expense management systems for real-time cost tracking and reporting.",
  },
  {
    icon: PiUsers,
    title: "Team Coordination",
    description: "Coordinate group travel with shared itineraries, budget controls, and approval workflows.",
  },
  {
    icon: PiChartBar,
    title: "Analytics & Insights",
    description: "Comprehensive travel analytics with cost optimization recommendations and usage patterns.",
  },
  {
    icon: PiGlobe,
    title: "Global Coverage",
    description: "Worldwide flight coverage with local currency support and international travel compliance.",
  },
]

const stats = [
  { label: "Airlines Connected", value: "500+" },
  { label: "Cities Covered", value: "10,000+" },
  { label: "Bookings Processed", value: "2M+" },
  { label: "Cost Savings", value: "35%" },
]

export default function MCPFlightsAIAgents() {
  return (
    <section className="pt-12 pb-6 mb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
              <PiSparkle className="mr-1.5 h-3 w-3" />
              <em className="font-serif italic">MCP-powered Flight Intelligence</em>
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-4">
            AI Flight Agents
          </h2>
          <p className="text-gray-600 font-light max-w-2xl mx-auto">
            <em className="font-serif italic">
              Revolutionary AI agents that understand your travel patterns, preferences, and business requirements to
              deliver personalized flight recommendations and seamless booking experiences.
            </em>
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm text-center"
            >
              <div className="text-2xl md:text-3xl font-medium tracking-tighter leading-none mb-2">{stat.value}</div>
              <div className="text-xs font-medium text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-200 rounded-xl">
                  <feature.icon className="h-5 w-5 text-gray-700" />
                </div>
                <h3 className="font-medium tracking-tighter">{feature.title}</h3>
              </div>
              <p className="text-gray-600 font-light text-sm">
                <em className="font-serif italic">{feature.description}</em>
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Airlines Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-medium tracking-tighter mb-2">Connected Airlines</h3>
            <p className="text-gray-600 font-light text-sm">
              <em className="font-serif italic">Seamlessly integrated with major airlines worldwide</em>
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {airlines.map((airline, index) => (
              <motion.div
                key={airline.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center justify-center p-3 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-all"
              >
                <Image
                  src={airline.logo || "/placeholder.svg"}
                  alt={`${airline.name} logo`}
                  width={80}
                  height={30}
                  className="h-6 w-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-medium tracking-tighter leading-none mb-4">
              Ready to transform your business travel?
            </h3>
            <p className="text-gray-600 font-light mb-6">
              <em className="font-serif italic">
                Join thousands of companies already using our AI-powered flight booking platform
              </em>
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all tracking-tight">
              <PiSparkle className="mr-2 h-4 w-4" />
              Start Free Trial
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
