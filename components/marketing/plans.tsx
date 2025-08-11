"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import CounterBadge from "@/components/ui/counter-badge"

// Títulos alternativos
const titleVariations = [
  "Business travel plans for every team size.",
  "AI-powered travel management for modern businesses.",
  "Flexible plans for your business travel needs.",
  "Scale your travel operations effortlessly.",
  "Travel management that grows with your business.",
  "Simple pricing for powerful travel tools.",
  "Choose the right plan for your business.",
  "Transparent pricing, exceptional value.",
  "Plans designed for modern business travel.",
  "Pricing that scales with your success.",
]

// Subtítulos
const subtitles = [
  "Choose the plan that fits your business travel requirements and team size",
  "Transparent pricing with no hidden fees, designed for business travel",
  "Powerful AI travel agents with plans that scale as your team grows",
  "Enterprise-grade travel management at startup-friendly prices",
]

// Chat placeholders
const chatPlaceholders = {
  free: [
    "Help me find a budget hotel in Chicago...",
    "What's the cheapest flight to New York next week?...",
    "Can I book a basic business trip to Dallas?...",
  ],
  basic: [
    "Find me a flight with lounge access to London...",
    "Book a business hotel with meeting rooms in Berlin...",
    "Schedule a team lunch near our client's office in Madrid...",
  ],
  pro: [
    "Arrange travel for our marketing team to Tokyo...",
    "Set up our company travel policy for approval...",
    "Find the best business hotels with executive suites in Singapore...",
  ],
  enterprise: [
    "Coordinate global travel for our executive team...",
    "Analyze our Q2 travel spend and suggest optimizations...",
    "Set up custom approval workflows for our regional offices...",
  ],
}

// Planes
const pricingPlans = [
  {
    id: "free",
    name: "Free",
    description: "For small business teams getting started with AI travel management",
    price: "€0",
    annualPrice: "€0",
    period: "forever",
    annualPeriod: "forever",
    features: [
      "5,000 AI tokens/month",
      "10 AI travel searches per month",
      "Up to 5 team members",
      "Basic AI travel planning",
      "Email support",
      "Basic expense tracking",
      "Simple itinerary management",
      "Basic travel policy templates",
    ],
    cta: "Get Started",
    badge: "Free",
    popular: false,
    agentImage: "/agents/agent-sophia.jpeg",
    communityImages: ["/community/jordan-burgess.webp", "/community/bec-ferguson.webp"],
    bgGradient: "from-gray-50 to-gray-100",
  },
  {
    id: "basic",
    name: "Basic",
    description: "For growing teams ready to optimize their travel experience",
    price: "€49",
    annualPrice: "€39",
    period: "per month",
    annualPeriod: "per month, billed annually",
    features: [
      "15,000 AI tokens/month",
      "30 AI travel searches per month",
      "Up to 15 team members",
      "Standard AI travel planning",
      "Priority email support",
      "Advanced expense tracking",
      "Enhanced itinerary management",
      "Standard travel policy templates",
      "Basic CRM integration",
    ],
    cta: "Start 14-day trial",
    badge: "Starter",
    popular: true,
    agentImage: "/agents/agent-emma.jpeg",
    communityImages: ["/community/kelsey-lowe.webp", "/community/brianna-ware.webp", "/community/harriet-rojas.jpg"],
    bgGradient: "from-gray-50 to-gray-100",
  },
  {
    id: "pro",
    name: "Pro",
    description: "For businesses ready to fully optimize their travel operations",
    price: "€89",
    annualPrice: "€71",
    period: "per month",
    annualPeriod: "per month, billed annually",
    features: [
      "25,000 AI tokens/month",
      "50 AI travel searches per month",
      "Up to 25 team members",
      "AI-powered expense management",
      "Advanced itinerary planning",
      "Custom travel policies",
      "24/5 priority support",
      "Team travel coordination",
      "Basic bank API integration",
      "Advanced CRM intelligence",
    ],
    cta: "Contact us",
    badge: "Advanced",
    popular: false,
    agentImage: "/agents/agent-marcus.jpeg",
    communityImages: [
      "/community/ammar-foley.webp",
      "/community/owen-harding.webp",
      "/community/nicolas-trevino.webp",
      "/community/isobel-fuller.webp",
    ],
    bgGradient: "from-gray-50 to-gray-100",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Enterprise-grade travel management for global companies",
    price: "Custom Pricing",
    annualPrice: "Custom Pricing",
    period: "tailored for enterprise",
    annualPeriod: "tailored for enterprise",
    features: [
      "Unlimited AI tokens",
      "Unlimited AI travel searches",
      "Unlimited team members",
      "Full AI travel intelligence suite",
      "Enterprise CRM integration",
      "Global travel compliance",
      "24/7 VIP support",
      "Custom AI workflows",
      "Executive travel program",
      "Full bank API integration",
      "Multi-currency management",
    ],
    cta: "Contact us",
    badge: "Enterprise",
    popular: false,
    agentImage: "/agents/agent-alex.jpeg",
    communityImages: [
      "/community/ammar-foley.webp",
      "/community/owen-harding.webp",
      "/community/jordan-burgess.webp",
      "/community/adil-floyd.webp",
      "/community/nicolas-trevino.webp",
      "/community/ashton-blackwell.webp",
      "/community/scott-clayton.webp",
    ],
    bgGradient: "from-gray-50 to-gray-100",
  },
]

// MiniChat
const MiniChat = ({ planId }: { planId: string }) => {
  const [typedText, setTypedText] = useState("")
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const placeholders = chatPlaceholders[planId as keyof typeof chatPlaceholders] || chatPlaceholders.free

  const getAgentImage = () => {
    const plan = pricingPlans.find(p => p.id === planId)
    return plan?.agentImage || "/placeholder.svg"
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (!isDeleting && typedText.length < placeholders[currentPlaceholder].length) {
      timeout = setTimeout(() => setTypedText(placeholders[currentPlaceholder].substring(0, typedText.length + 1)), 50)
    } else if (!isDeleting && typedText === placeholders[currentPlaceholder]) {
      timeout = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && typedText.length > 0) {
      timeout = setTimeout(() => setTypedText(typedText.slice(0, -1)), 30)
    } else if (isDeleting && typedText === "") {
      setIsDeleting(false)
      setCurrentPlaceholder((currentPlaceholder + 1) % placeholders.length)
    }
    return () => clearTimeout(timeout)
  }, [typedText, isDeleting, currentPlaceholder, placeholders])

  return (
    <div className="relative flex items-center gap-1 p-1 rounded-lg border border-gray-300 bg-white shadow-sm text-[9px] sm:text-[10px] mt-3">
      <div className="relative w-5 h-5 sm:w-6 sm:h-6 overflow-hidden rounded-full border border-gray-300 ml-1">
        <Image src={getAgentImage()} alt="Agent" width={24} height={24} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 py-1 px-1 text-gray-500 h-5 sm:h-6 flex items-center overflow-hidden">
        <span className="truncate">
          {typedText}
          {!isDeleting && (
            <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.7 }} className="inline-block w-0.5 h-3 bg-gray-400 ml-0.5" />
          )}
        </span>
      </div>
    </div>
  )
}

// Community Carousel
const CommunityCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => setCurrentIndex((prev) => (prev + 1) % images.length), 3000)
    return () => clearInterval(interval)
  }, [images.length])
  return (
    <div className="mt-3">
      <p className="text-[9px] sm:text-[10px] text-gray-500 mb-1">Team members using this plan:</p>
      <div className="flex -space-x-2 overflow-hidden">
        {images.map((image, index) => (
          <motion.div key={index} className={`relative w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white overflow-hidden ${index === currentIndex ? "z-10" : ""}`} animate={{ scale: index === currentIndex ? 1.1 : 1 }} transition={{ duration: 0.3 }}>
            <Image src={image} alt="Team member" width={28} height={28} className="w-full h-full object-cover" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Plans Component
export const Plans = () => {
  const [randomTitle, setRandomTitle] = useState("")
  const [randomSubtitle, setRandomSubtitle] = useState("")
  const [isAnnual, setIsAnnual] = useState(true)

  useEffect(() => {
    setRandomTitle(titleVariations[Math.floor(Math.random() * titleVariations.length)])
    setRandomSubtitle(subtitles[Math.floor(Math.random() * subtitles.length)])
  }, [])

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 md:px-6">

        {/* Encabezado */}
        <motion.div className="flex flex-col items-center text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex gap-3 mb-4 bg-gray-50 px-3 py-2 rounded-full">
            <span className="bg-gray-200 px-2.5 py-0.5 text-[9px] sm:text-xs font-medium text-gray-700 rounded-full">Suitpax Pricing</span>
            <span className="bg-gray-200 px-2.5 py-0.5 text-[9px] sm:text-xs font-medium text-gray-700 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-black border border-gray-400 mr-1 inline-block"></span>
              Updated Q4 2025
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tighter text-black">{randomTitle}</h2>
          <p className="mt-4 text-xs sm:text-sm font-medium text-gray-500 max-w-2xl">{randomSubtitle}</p>
        </motion.div>

        {/* Toggle mensual/anual */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center bg-gray-100 p-1 rounded-full">
            <button onClick={() => setIsAnnual(false)} className={`px-4 py-1.5 text-xs font-medium rounded-full ${!isAnnual ? "bg-white shadow-sm text-black" : "text-gray-600"}`}>Monthly</button>
            <button onClick={() => setIsAnnual(true)} className={`px-4 py-1.5 text-xs font-medium rounded-full ${isAnnual ? "bg-white shadow-sm text-black" : "text-gray-600"}`}>Annual <span className="ml-1 bg-black px-2 py-0.5 text-[9px] rounded-full text-white">Save 20%</span></button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <motion.div key={plan.id} className={`overflow-hidden bg-gradient-to-br ${plan.bgGradient} border border-black rounded-xl p-3 flex flex-col ${plan.popular ? "border-2 shadow-lg" : "shadow-sm"}`} whileHover={{ y: -4 }}>
              <div className="mb-2 flex justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-medium">{plan.name}</h3>
                  <p className="text-[9px] sm:text-[10px] text-gray-600">{plan.description}</p>
                </div>
                {plan.badge && <span className="border border-black px-2 py-0.5 text-[8px] sm:text-[9px]">{plan.badge}</span>}
              </div>
              <div className="mb-2 flex items-baseline">
                <span className="text-2xl font-medium">{isAnnual ? plan.annualPrice : plan.price}</span>
                <span className="text-[9px] text-gray-500 ml-1">/{isAnnual ? plan.annualPeriod : plan.period}</span>
              </div>
              <ul className="space-y-1 mb-3 flex-grow">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="w-3 h-3 text-emerald-950 mt-0.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[9px] text-gray-700">{f}</span>
                  </li>
                ))}
              </ul>
              <MiniChat planId={plan.id} />
              {plan.communityImages && <CommunityCarousel images={plan.communityImages} />}
              <div className="mt-3 flex justify-center">
                <Link
                  href="https://app.suitpax.com/sign-up"
                  className={`inline-block py-1 px-3 rounded-xl text-center text-[8px] sm:text-[9px] font-medium transition-colors ${
                    plan.popular ? "bg-black text-white hover:bg-gray-800" : "bg-transparent border border-black text-black hover:bg-gray-100"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <CounterBadge />
        </div>
      </div>
    </section>
  )
}