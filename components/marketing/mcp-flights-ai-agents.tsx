"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import {
  PiSparkle,
  PiAirplane,
  PiCalendar,
  PiCreditCard,
  PiUsers,
  PiChartLine,
  PiRobot,
  PiLightning,
  PiShield,
  PiGlobe,
  PiBrain,
} from "react-icons/pi"

const capabilities = [
  {
    icon: PiAirplane,
    title: "Smart Flight Search",
    description: "AI-powered flight recommendations based on your preferences, budget, and travel patterns.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: PiCalendar,
    title: "Dynamic Scheduling",
    description: "Automatically adjusts bookings based on calendar conflicts and meeting priorities.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: PiCreditCard,
    title: "Expense Integration",
    description: "Seamlessly connects with expense management for real-time budget tracking.",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: PiUsers,
    title: "Team Coordination",
    description: "Coordinates group travel with intelligent seat assignments and shared itineraries.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: PiChartLine,
    title: "Predictive Analytics",
    description: "Forecasts travel costs and suggests optimal booking times for maximum savings.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: PiShield,
    title: "Policy Compliance",
    description: "Ensures all bookings comply with company travel policies automatically.",
    color: "from-gray-500 to-slate-500",
  },
]

const stats = [
  { label: "Average Savings", value: "32%", description: "on flight bookings" },
  { label: "Booking Speed", value: "85%", description: "faster than manual" },
  { label: "Policy Compliance", value: "99.7%", description: "accuracy rate" },
  { label: "User Satisfaction", value: "4.9/5", description: "average rating" },
]

const airlines = [
  { name: "Delta", logo: "/logos/delta-logo.png" },
  { name: "American", logo: "/logos/american-logo.png" },
  { name: "United", logo: "/logos/united-logo.png" },
  { name: "Southwest", logo: "/logos/southwest-logo.png" },
  { name: "JetBlue", logo: "/logos/jetblue-logo.png" },
  { name: "Alaska", logo: "/logos/alaska-logo.png" },
  { name: "Spirit", logo: "/logos/spirit-logo.png" },
  { name: "Frontier", logo: "/logos/frontier-logo.png" },
]

const integrationPillars = [
  {
    icon: PiRobot,
    title: "MCP Protocol",
    description: "Built on Model Context Protocol for seamless AI agent communication",
    features: ["Real-time data sync", "Cross-platform compatibility", "Secure API connections"],
  },
  {
    icon: PiLightning,
    title: "Lightning Fast",
    description: "Sub-second response times with intelligent caching and optimization",
    features: ["Edge computing", "Smart prefetching", "Parallel processing"],
  },
  {
    icon: PiBrain,
    title: "Adaptive Learning",
    description: "Continuously learns from user behavior to improve recommendations",
    features: ["Pattern recognition", "Preference modeling", "Predictive insights"],
  },
]

export default function MCPFlightsAIAgents() {
  const [activeCapability, setActiveCapability] = useState(0)

  return (
    <section className="relative pt-12 pb-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center rounded-xl bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 mb-6">
            <PiSparkle className="mr-1.5 h-3 w-3" />
            <em className="font-serif italic">MCP-powered AI Agents</em>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6">
            Intelligent Flight Management
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">
            Our AI agents leverage the Model Context Protocol to deliver unprecedented flight booking intelligence,
            seamlessly integrating with your business workflows for optimal travel experiences.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-gray-700 mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.description}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Capabilities Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onHoverStart={() => setActiveCapability(index)}
              className="group cursor-pointer"
            >
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${capability.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <capability.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-black transition-colors">
                  {capability.title}
                </h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">{capability.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Airlines Integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-medium tracking-tighter text-gray-900 mb-4">
              Integrated with Leading Airlines
            </h3>
            <p className="text-gray-600 font-light">
              Direct API connections with major carriers for real-time pricing and availability
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="grid grid-cols-4 lg:grid-cols-8 gap-6 items-center">
              {airlines.map((airline, index) => (
                <motion.div
                  key={airline.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex items-center justify-center p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">{airline.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Integration Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-medium tracking-tighter text-gray-900 mb-4">Built on Modern Architecture</h3>
            <p className="text-gray-600 font-light">
              Leveraging cutting-edge technology for unparalleled performance and reliability
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {integrationPillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <pillar.icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">{pillar.title}</h4>
                  <p className="text-sm text-gray-600 font-light mb-4">{pillar.description}</p>
                  <ul className="space-y-2">
                    {pillar.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-medium tracking-tighter mb-4">Ready to Transform Your Flight Management?</h3>
            <p className="text-gray-300 font-light mb-6 max-w-2xl mx-auto">
              Experience the future of business travel with our MCP-powered AI agents. Get started today and see the
              difference intelligent automation makes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-xl font-medium hover:bg-gray-100 transition-colors">
                <PiRobot className="mr-2 h-5 w-5" />
                Try AI Agents
              </button>
              <button className="inline-flex items-center px-6 py-3 bg-transparent border border-white/20 text-white rounded-xl font-medium hover:bg-white/10 transition-colors">
                <PiGlobe className="mr-2 h-5 w-5" />
                View Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
