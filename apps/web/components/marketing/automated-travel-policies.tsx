"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Check, Shield, Wallet, TrendingUp, Users, Clock, FileText, Settings, Zap, BarChart4 } from "lucide-react"

// Títulos alternativos
const titleVariations = [
  "Automated Travel Policies that transform compliance.",
  "Smart policies for the modern business traveler",
  "AI-powered travel policies that adapt to your needs",
  "The future of corporate travel compliance",
  "Effortless travel policy management",
]

// Subtítulos
const subtitles = [
  "Designed to streamline compliance, optimize spending, and enhance the travel experience",
  "Intelligent policy enforcement that adapts to your company's unique requirements",
  "Balancing cost control with traveler satisfaction through smart automation",
  "Transforming travel policy management with cutting-edge AI technology",
]

// Políticas de viaje automatizadas
const policies = [
  {
    id: 1,
    name: "Expense Limits",
    icon: <Wallet className="w-5 h-5 text-emerald-950" />,
    description: "Dynamic spending limits that adjust based on location, season, and market conditions.",
    features: ["Location-based adjustments", "Seasonal flexibility", "Market-responsive limits"],
  },
  {
    id: 2,
    name: "Approval Flows",
    icon: <Check className="w-5 h-5 text-emerald-950" />,
    description: "Intelligent approval routing that streamlines the process while maintaining oversight.",
    features: ["Smart routing", "Automated approvals", "Exception handling"],
  },
  {
    id: 3,
    name: "Compliance Shield",
    icon: <Shield className="w-5 h-5 text-emerald-950" />,
    description: "Proactive compliance monitoring that prevents policy violations before they occur.",
    features: ["Real-time monitoring", "Preventive alerts", "Compliance reporting"],
  },
  {
    id: 4,
    name: "Cost Optimization",
    icon: <TrendingUp className="w-5 h-5 text-emerald-950" />,
    description: "AI-powered recommendations that maximize savings without compromising quality.",
    features: ["Price prediction", "Alternative suggestions", "Negotiated rates"],
  },
  {
    id: 5,
    name: "Team Management",
    icon: <Users className="w-5 h-5 text-emerald-950" />,
    description: "Customizable team policies that balance individual needs with company requirements.",
    features: ["Role-based policies", "Team budgets", "Department analytics"],
  },
  {
    id: 6,
    name: "Time Savings",
    icon: <Clock className="w-5 h-5 text-emerald-950" />,
    description: "Automated processes that reduce administrative burden and speed up approvals.",
    features: ["Quick approvals", "Automated reporting", "Streamlined workflows"],
  },
  {
    id: 7,
    name: "Policy Templates",
    icon: <FileText className="w-5 h-5 text-emerald-950" />,
    description: "Pre-built policy templates that can be customized to fit your organization's needs.",
    features: ["Industry templates", "Custom policies", "Easy configuration"],
  },
  {
    id: 8,
    name: "Integration Hub",
    icon: <Settings className="w-5 h-5 text-emerald-950" />,
    description: "Seamless connections with your existing travel, expense, and HR systems.",
    features: ["ERP integration", "Expense systems", "HR platforms"],
  },
  {
    id: 9,
    name: "Instant Deployment",
    icon: <Zap className="w-5 h-5 text-emerald-950" />,
    description: "Quick implementation that gets your automated policies up and running in days, not months.",
    features: ["Rapid setup", "No-code configuration", "Immediate results"],
  },
  {
    id: 10,
    name: "Analytics Dashboard",
    icon: <BarChart4 className="w-5 h-5 text-emerald-950" />,
    description: "Comprehensive insights into travel spending, compliance, and optimization opportunities.",
    features: ["Spending analytics", "Compliance metrics", "Savings reports"],
  },
]

// Categorías de políticas
const policyCategories = [
  "Flight Booking Rules",
  "Hotel Selection Criteria",
  "Ground Transportation",
  "Meal Allowances",
  "Expense Approval",
  "Booking Lead Time",
  "Premium Travel",
  "International Travel",
  "Preferred Vendors",
  "Duty of Care",
  "Sustainability",
  "Bleisure Travel",
  "Group Bookings",
  "VIP Exceptions",
  "Emergency Travel",
]

// Beneficios clave
const keyBenefits = [
  {
    title: "30% Cost Reduction",
    description: "Average savings on travel spend through optimized policies and better compliance",
  },
  {
    title: "85% Less Admin Time",
    description: "Reduction in administrative overhead through automation and streamlined processes",
  },
  {
    title: "95% Compliance Rate",
    description: "Typical improvement in policy compliance with automated enforcement and guidance",
  },
  {
    title: "24/7 Policy Enforcement",
    description: "Continuous monitoring and enforcement regardless of booking time or channel",
  },
]

export const AutomatedTravelPolicies = () => {
  const [randomTitle, setRandomTitle] = useState("")
  const [randomSubtitle, setRandomSubtitle] = useState("")
  const [activePolicy, setActivePolicy] = useState(3)

  useEffect(() => {
    // Seleccionar un título aleatorio al montar el componente
    const titleIndex = Math.floor(Math.random() * titleVariations.length)
    setRandomTitle(titleVariations[titleIndex])

    // Seleccionar un subtítulo aleatorio
    const subtitleIndex = Math.floor(Math.random() * subtitles.length)
    setRandomSubtitle(subtitles[subtitleIndex])

    // Cycle through policies automatically for demo effect
    const interval = setInterval(() => {
      setActivePolicy((prev) => (prev % policies.length) + 1)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Hero Section with 16:9 Aspect Ratio for Image */}
        <div className="flex flex-col items-center justify-center text-center mb-16 md:mb-24">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
              Introducing Suitpax Policies
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse mr-1"></span>
              Q3 2025
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none max-w-4xl mb-6">
            {randomTitle}
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-medium text-gray-500 max-w-2xl mb-10">{randomSubtitle}</p>

          {/* 16:9 Aspect Ratio Container for Hero Image */}
          <div className="w-full max-w-4xl mx-auto mb-12 relative">
            <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <Image
                src="/business-travel-dashboard.png"
                alt="Travel Policy Dashboard"
                width={1280}
                height={720}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-6">
                <div className="text-white text-left">
                  <h3 className="text-xl font-medium mb-2">Smart Policy Dashboard</h3>
                  <p className="text-sm text-white/80">Real-time insights and policy management in one place</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Benefits Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl w-full mx-auto">
            {keyBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-lg font-medium text-emerald-950 mb-1">{benefit.title}</h3>
                <p className="text-xs text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto mb-16 md:mb-24">
          {/* Policy selection with flow effect */}
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden min-h-[400px]">
            {/* Flow effect background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -inset-1 bg-gray-200/40 blur-xl"></div>
              <motion.div
                className="absolute top-0 left-0 w-full h-60 bg-gray-200/30"
                animate={{
                  y: [0, 100, 0],
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 15,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-0 right-0 w-full h-40 bg-gray-200/20"
                animate={{
                  y: [0, -100, 0],
                  opacity: [0.1, 0.2, 0.1],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 18,
                  ease: "easeInOut",
                  delay: 2,
                }}
              />
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-medium text-left tracking-tighter text-black mb-4 leading-none">
                Smart policies that adapt to your business
              </h3>
              <p className="text-xl font-medium text-gray-700 tracking-tighter mb-4">
                Balancing compliance, cost control, and traveler satisfaction
              </p>

              <p className="text-sm text-gray-600 mb-8 max-w-md">
                Our AI-powered travel policies automatically adjust to your company's needs, market conditions, and
                traveler preferences, ensuring optimal outcomes for every trip.
              </p>

              {/* Policy grid with selection effect */}
              <div className="grid grid-cols-5 gap-2 md:gap-3">
                {policies.map((policy) => (
                  <motion.div
                    key={policy.id}
                    className={`flex flex-col items-center cursor-pointer relative ${
                      activePolicy === policy.id ? "scale-105" : ""
                    }`}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setActivePolicy(policy.id)}
                  >
                    <div className="relative mb-2 group">
                      {/* Highlight effect for active policy */}
                      {activePolicy === policy.id && (
                        <motion.div
                          className="absolute -inset-1 rounded-xl bg-emerald-950/10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.3 }}
                          layoutId="highlight"
                        />
                      )}

                      {/* Flow effect for active policy */}
                      {activePolicy === policy.id && (
                        <motion.div
                          className="absolute -inset-3 rounded-xl bg-gray-200/40 -z-10"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{
                            opacity: [0.4, 0.7, 0.4],
                            scale: [0.9, 1.1, 0.9],
                            rotate: [0, 5, 0, -5, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        />
                      )}

                      <div
                        className={`relative w-12 h-12 overflow-hidden rounded-xl border-2 flex items-center justify-center ${
                          activePolicy === policy.id
                            ? "border-emerald-950/30 shadow-lg bg-white"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        {policy.icon}
                      </div>
                    </div>
                    <h3
                      className={`text-[10px] font-medium mb-0.5 text-center w-full ${activePolicy === policy.id ? "text-emerald-950" : "text-gray-700"}`}
                    >
                      {policy.name}
                    </h3>
                    <p className="text-[8px] text-gray-500 text-center w-full">Policy</p>
                  </motion.div>
                ))}
              </div>

              {/* Active policy details */}
              {policies.map(
                (policy) =>
                  policy.id === activePolicy && (
                    <motion.div
                      key={policy.id}
                      className="mt-8 p-4 border border-gray-200 rounded-xl bg-white/70"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-950/10 flex items-center justify-center flex-shrink-0">
                          {policy.icon}
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-black">{policy.name}</h4>
                          <p className="text-sm text-gray-600 mb-3">{policy.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {policy.features.map((feature, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center rounded-xl border border-black/30 px-2 py-0.5 text-[10px] font-medium text-black"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ),
              )}

              {/* Mini badges para categorías de políticas */}
              <div className="mt-8 flex flex-wrap gap-2 justify-center">
                {policyCategories.map((category, index) => (
                  <motion.span
                    key={index}
                    className="inline-flex items-center rounded-xl border border-black/30 px-2 py-0.5 text-[10px] font-medium text-black cursor-pointer hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category}
                  </motion.span>
                ))}
              </div>

              {/* Destacar algunas categorías con colores especiales */}
              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                <motion.span
                  className="inline-flex items-center rounded-xl border border-emerald-950/30 bg-emerald-950/5 px-2 py-0.5 text-[10px] font-medium text-emerald-950 cursor-pointer hover:bg-emerald-950/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 mr-1"></span>
                  Premium Policy Engine
                </motion.span>
                <motion.span
                  className="inline-flex items-center rounded-xl border border-black/30 px-2 py-0.5 text-[10px] font-medium text-black cursor-pointer hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse mr-1"></span>
                  AI-Powered Recommendations
                </motion.span>
                <motion.span
                  className="inline-flex items-center rounded-xl border border-black/30 px-2 py-0.5 text-[10px] font-medium text-black cursor-pointer hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-black mr-1"></span>
                  Global Coverage
                </motion.span>
              </div>
            </div>
          </div>
        </div>

        {/* Case study section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-2xl md:text-3xl font-medium tracking-tighter text-black mb-4">
              How companies transform travel with automated policies
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="border border-gray-200 rounded-xl p-4 bg-white/70">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Image
                      src="/abstract-tech-logo.png"
                      alt="Tech Company"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Global Tech Company</h4>
                    <p className="text-xs text-gray-500">5,000+ employees</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  "Suitpax's automated travel policies helped us reduce travel spend by 42% while improving employee
                  satisfaction with our travel program."
                </p>
                <div className="flex gap-2">
                  <span className="inline-flex items-center rounded-xl border border-black/30 px-2 py-0.5 text-[10px] font-medium text-black">
                    42% Cost Reduction
                  </span>
                  <span className="inline-flex items-center rounded-xl border border-black/30 px-2 py-0.5 text-[10px] font-medium text-black">
                    98% Compliance
                  </span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 bg-white/70">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Image
                      src="/abstract-finance-growth.png"
                      alt="Finance Company"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Financial Services Firm</h4>
                    <p className="text-xs text-gray-500">2,500+ employees</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  "The policy automation eliminated 90% of our manual approval processes while ensuring strict
                  compliance with our regulatory requirements."
                </p>
                <div className="flex gap-2">
                  <span className="inline-flex items-center rounded-xl border border-black/30 px-2 py-0.5 text-[10px] font-medium text-black">
                    90% Less Admin
                  </span>
                  <span className="inline-flex items-center rounded-xl border border-black/30 px-2 py-0.5 text-[10px] font-medium text-black">
                    100% Regulatory Compliance
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-medium tracking-tighter text-black mb-4">
            Ready to transform your travel policy management?
          </h3>
          <p className="text-sm text-gray-600 mb-6 max-w-xl mx-auto">
            Join the waitlist to be among the first to experience our automated travel policies when we launch in Q3
            2025.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://accounts.suitpax.com/waitlist"
              className="rounded-xl bg-black text-white hover:bg-black/90 px-8 py-3 font-medium shadow-sm text-sm w-full sm:w-auto"
            >
              Join Waitlist
            </a>
            <a
              href="/pricing"
              className="rounded-xl bg-white border border-gray-200 text-black hover:bg-gray-50 px-8 py-3 font-medium shadow-sm text-sm w-full sm:w-auto"
            >
              View Pricing
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AutomatedTravelPolicies
