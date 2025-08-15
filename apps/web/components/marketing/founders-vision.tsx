"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import CounterBadge from "@/components/ui/counter-badge"

// Variaciones de títulos para los productos
const productTitles = [
  "Our product ecosystem for modern business travel",
  "AI-powered solutions for every travel need",
  "The complete business travel management suite",
  "Transforming corporate travel with intelligent products",
]

// Descripciones de productos
const productDescriptions = [
  "Each product in our ecosystem is designed to solve specific business travel challenges",
  "Seamlessly integrated tools that work together to transform your travel experience",
  "Built with AI at the core, our products learn and adapt to your organization's needs",
]

// Productos principales
const mainProducts = [
  {
    id: "travel-os",
    name: "Travel OS",
    description: "The operating system for modern business travel management",
    features: [
      "Centralized travel dashboard",
      "AI-powered booking engine",
      "Real-time travel alerts",
      "Policy compliance automation",
      "Expense integration",
      "Travel analytics platform",
    ],
    image: "/agents/agent-2.png",
    badge: "Core Platform",
    popular: true,
    bgGradient: "from-gray-50 to-gray-100",
    chatPlaceholder: "Book a business trip to London next week...",
  },
  {
    id: "ai-agents",
    name: "AI Agents",
    description: "Specialized AI assistants for every travel scenario",
    features: [
      "24/7 travel assistance",
      "Multi-language support",
      "Personalized recommendations",
      "Proactive problem solving",
      "Context-aware interactions",
      "Voice and text interfaces",
    ],
    image: "/agents/agent-1.png",
    badge: "Intelligence",
    popular: false,
    bgGradient: "from-gray-50 to-gray-100",
    chatPlaceholder: "Find me a hotel near my meeting location...",
  },
  {
    id: "expense-suite",
    name: "Expense Suite",
    description: "Automated expense management and reconciliation",
    features: [
      "Receipt scanning",
      "Automatic categorization",
      "Policy compliance checks",
      "Approval workflows",
      "Accounting integrations",
      "Spend analytics",
    ],
    image: "/agents/kahn-avatar.png",
    badge: "Finance",
    popular: false,
    bgGradient: "from-gray-50 to-gray-100",
    chatPlaceholder: "Categorize my expenses from last week...",
  },
  {
    id: "policy-engine",
    name: "Policy Engine",
    description: "Intelligent travel policy creation and enforcement",
    features: [
      "Custom policy builder",
      "Dynamic rule application",
      "Exception handling",
      "Approval workflows",
      "Compliance reporting",
      "Policy optimization",
    ],
    image: "/agents/agent-13.png",
    badge: "Governance",
    popular: false,
    bgGradient: "from-gray-50 to-gray-100",
    chatPlaceholder: "Create a travel policy for our sales team...",
  },
]

// Productos adicionales
const additionalProducts = [
  {
    id: "analytics",
    name: "Analytics Platform",
    description: "Comprehensive travel data insights and reporting",
    image: "/agents/agent-5.png",
    badge: "Intelligence",
    features: ["Spend visualization", "Travel pattern analysis", "Sustainability metrics"],
  },
  {
    id: "mobile",
    name: "Mobile Companion",
    description: "On-the-go travel management for business travelers",
    image: "/agents/agent-9.png",
    badge: "Experience",
    features: ["Itinerary management", "Real-time notifications", "Offline access"],
  },
  {
    id: "integrations",
    name: "Enterprise Connect",
    description: "Seamless integration with your existing business systems",
    image: "/agents/agent-4.png",
    badge: "Infrastructure",
    features: ["HR system sync", "ERP integration", "SSO authentication"],
  },
]

// Mini Chat Component
const MiniChat = ({ placeholder }: { placeholder: string }) => {
  const [typedText, setTypedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    // Typing effect
    if (!isDeleting && typedText.length < placeholder.length) {
      timeout = setTimeout(
        () => {
          setTypedText(placeholder.substring(0, typedText.length + 1))
        },
        50 + Math.random() * 50,
      )
    }
    // Pause when typing is complete
    else if (!isDeleting && typedText === placeholder) {
      timeout = setTimeout(() => {
        setIsDeleting(true)
      }, 2000)
    }
    // Deleting effect
    else if (isDeleting && typedText.length > 0) {
      timeout = setTimeout(() => {
        setTypedText(placeholder.substring(0, typedText.length - 1))
      }, 30)
    }
    // Reset
    else if (isDeleting && typedText === "") {
      setIsDeleting(false)
    }

    return () => clearTimeout(timeout)
  }, [typedText, isDeleting, placeholder])

  return (
    <div className="relative flex items-center gap-1 p-1 rounded-lg border border-gray-300 bg-white shadow-sm text-[9px] sm:text-[10px] mt-2">
      <div className="relative w-5 h-5 overflow-hidden rounded-full border border-gray-300 ml-1">
        <div className="w-full h-full bg-gray-200"></div>
      </div>
      <div className="flex-1 py-1 px-1 text-[9px] text-gray-500 h-5 flex items-center overflow-hidden">
        <span className="inline-block truncate">
          {typedText}
          {!isDeleting && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.7 }}
              className="inline-block w-0.5 h-3 bg-gray-400 ml-0.5"
            />
          )}
        </span>
      </div>
    </div>
  )
}

// Componente principal
export default function FoundersVision() {
  const [randomTitle, setRandomTitle] = useState("")
  const [randomDescription, setRandomDescription] = useState("")

  useEffect(() => {
    // Seleccionar un título aleatorio al montar el componente
    const titleIndex = Math.floor(Math.random() * productTitles.length)
    setRandomTitle(productTitles[titleIndex])

    // Seleccionar una descripción aleatoria
    const descIndex = Math.floor(Math.random() * productDescriptions.length)
    setRandomDescription(productDescriptions[descIndex])
  }, [])

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-3 mb-4 bg-gray-50 px-3 py-2 rounded-full">
            <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              Founder&apos;s Vision
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
              2025 Roadmap
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none max-w-4xl">
            {randomTitle}
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-medium text-gray-500 max-w-2xl mb-6">{randomDescription}</p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <div className="inline-flex items-center rounded-md bg-transparent border border-gray-200 px-2 py-1 text-[8px] text-gray-600">
              <span className="font-medium">AI-First Design</span>
            </div>
            <div className="inline-flex items-center rounded-md bg-transparent border border-gray-200 px-2 py-1 text-[8px] text-gray-600">
              <span className="font-medium">Enterprise-Ready</span>
            </div>
            <div className="inline-flex items-center rounded-md bg-transparent border border-gray-200 px-2 py-1 text-[8px] text-gray-600">
              <span className="font-medium">Seamless Integration</span>
            </div>
          </div>
        </motion.div>

        {/* Productos principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto mb-12">
          {mainProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className={`relative overflow-hidden bg-gradient-to-br ${product.bgGradient} border border-black rounded-xl p-4 flex flex-col ${
                product.popular ? "border-2 shadow-lg" : "border shadow-sm"
              }`}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 },
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium tracking-tighter text-black">{product.name}</h3>
                  <p className="text-[10px] text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                </div>
                {product.badge && (
                  <span className="inline-flex items-center rounded-xl bg-transparent border border-black px-2 py-0.5 text-[9px] font-medium text-black">
                    {product.badge}
                  </span>
                )}
              </div>

              <ul className="space-y-1.5 mb-3 flex-grow">
                {product.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-3.5 h-3.5 text-emerald-950 mt-0.5 mr-1.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-[10px] font-medium text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Mini Chat UI */}
              <MiniChat placeholder={product.chatPlaceholder} />

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="mt-3">
                <Link
                  href="#"
                  className={`w-full py-1.5 px-3 rounded-xl text-center text-[10px] font-medium transition-all ${
                    product.popular
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-transparent border border-black text-black hover:bg-gray-100"
                  }`}
                >
                  Learn more
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Productos adicionales */}
        <div className="mb-12">
          <h3 className="text-xl font-medium tracking-tighter text-black mb-6 text-center">Additional Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {additionalProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.2 },
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-base font-medium">{product.name}</h4>
                  {product.badge && (
                    <span className="inline-flex items-center rounded-xl bg-transparent border border-gray-200 px-2 py-0.5 text-[9px] font-medium text-gray-700">
                      {product.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-600 mb-3">{product.description}</p>
                <ul className="space-y-1">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="w-3 h-3 text-emerald-950 mt-0.5 mr-1.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-[9px] font-medium text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Visión del fundador */}
        <motion.div
          className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
              <Image src="/founders/alberto-new.webp" alt="Alberto Zurano" fill className="object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Alberto Zurano</h3>
              <p className="text-sm text-gray-600">Founder & CEO</p>
              <p className="text-xs text-gray-500 mt-1">
                "Our vision is to create a complete ecosystem of products that work together seamlessly to transform how
                businesses manage travel. By 2025, we aim to be the operating system for business travel worldwide."
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <h4 className="text-xs font-medium mb-1">AI-First Approach</h4>
              <p className="text-[9px] text-gray-600">
                Every product is built with artificial intelligence at its core, not as an afterthought
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <h4 className="text-xs font-medium mb-1">Seamless Integration</h4>
              <p className="text-[9px] text-gray-600">
                All products work together in perfect harmony while also integrating with your existing systems
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <h4 className="text-xs font-medium mb-1">Continuous Evolution</h4>
              <p className="text-[9px] text-gray-600">
                Our products learn and improve with every interaction, getting smarter over time
              </p>
            </div>
          </div>
        </motion.div>

        {/* Roadmap 2025 */}
        <div className="max-w-4xl mx-auto mb-12">
          <h3 className="text-xl font-medium tracking-tighter text-black mb-6 text-center">2025 Product Roadmap</h3>
          <div className="relative">
            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-0.5 bg-gray-200"></div>
            <div className="grid grid-cols-4 relative">
              {[
                { quarter: "Q2 2023", milestone: "Core Platform", status: "Completed" },
                { quarter: "Q4 2023", milestone: "AI Agents", status: "Completed" },
                { quarter: "Q2 2024", milestone: "Expense Suite", status: "In Progress" },
                { quarter: "Q1 2025", milestone: "Full Ecosystem", status: "Planned" },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full z-10 mb-2 ${
                      item.status === "Completed"
                        ? "bg-emerald-950"
                        : item.status === "In Progress"
                          ? "bg-yellow-500"
                          : "bg-gray-300"
                    }`}
                  ></div>
                  <div className="text-center">
                    <p className="text-[9px] font-medium">{item.quarter}</p>
                    <p className="text-[10px] font-bold">{item.milestone}</p>
                    <p
                      className={`text-[8px] ${
                        item.status === "Completed"
                          ? "text-emerald-950"
                          : item.status === "In Progress"
                            ? "text-yellow-500"
                            : "text-gray-400"
                      }`}
                    >
                      {item.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <CounterBadge />
        </div>
      </div>
    </section>
  )
}
