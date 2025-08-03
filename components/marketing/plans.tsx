"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import CounterBadge from "@/components/ui/counter-badge"
import FAQ, { defaultFAQItems } from "../marketing/faq"

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

// Chat placeholders para cada plan - Textos diferentes para cada plan
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

// Community images
const communityImages = {
  free: ["/community/jordan-burgess.webp", "/community/bec-ferguson.webp"],
  basic: ["/community/kelsey-lowe.webp", "/community/brianna-ware.webp", "/community/harriet-rojas.jpg"],
  pro: [
    "/community/ammar-foley.webp",
    "/community/owen-harding.webp",
    "/community/nicolas-trevino.webp",
    "/community/isobel-fuller.webp",
  ],
  enterprise: [
    "/community/ammar-foley.webp",
    "/community/owen-harding.webp",
    "/community/jordan-burgess.webp",
    "/community/adil-floyd.webp",
    "/community/nicolas-trevino.webp",
    "/community/ashton-blackwell.webp",
    "/community/scott-clayton.webp",
  ],
}

// Pricing plans - Añadido nuevo plan "Starter" de 49€
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
    badge: "Most Popular",
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

// Mini Chat Component para cada plan - Ahora con diferentes agentes y textos
const MiniChat = ({ planId }: { planId: string }) => {
  const [typedText, setTypedText] = useState("")
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const placeholders = chatPlaceholders[planId as keyof typeof chatPlaceholders] || chatPlaceholders.free

  // Asignar un agente diferente a cada plan
  const getAgentImage = () => {
    switch (planId) {
      case "free":
        return "/agents/agent-sophia.jpeg"
      case "basic":
        return "/agents/agent-emma.jpeg"
      case "pro":
        return "/agents/agent-marcus.jpeg"
      case "enterprise":
        return "/agents/agent-alex.jpeg"
      default:
        return "/agents/agent-sophia.jpeg"
    }
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout

    // Typing effect
    if (!isDeleting && typedText.length < placeholders[currentPlaceholder].length) {
      timeout = setTimeout(
        () => {
          setTypedText(placeholders[currentPlaceholder].substring(0, typedText.length + 1))
        },
        50 + Math.random() * 50,
      )
    }
    // Pause when typing is complete
    else if (!isDeleting && typedText === placeholders[currentPlaceholder]) {
      timeout = setTimeout(() => {
        setIsDeleting(true)
      }, 2000)
    }
    // Deleting effect
    else if (isDeleting && typedText.length > 0) {
      timeout = setTimeout(() => {
        setTypedText(placeholders[currentPlaceholder].substring(0, typedText.length - 1))
      }, 30)
    }
    // Move to next example
    else if (isDeleting && typedText === "") {
      setIsDeleting(false)
      setCurrentPlaceholder((currentPlaceholder + 1) % placeholders.length)
    }

    return () => clearTimeout(timeout)
  }, [typedText, isDeleting, currentPlaceholder, placeholders])

  return (
    <div className="relative flex items-center gap-1 p-2 rounded-lg border border-gray-300 bg-white shadow-sm text-xs mt-3">
      <div className="relative w-6 h-6 overflow-hidden rounded-full border border-gray-300 ml-1">
        <Image
          src={getAgentImage() || "/placeholder.svg"}
          alt="Agent"
          width={24}
          height={24}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="flex-1 py-1 px-1 text-xs text-gray-500 h-6 flex items-center overflow-hidden">
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

// Community Carousel Component
const CommunityCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="mt-3 relative">
      <p className="text-xs text-gray-500 mb-2">Team members using this plan:</p>
      <div className="flex -space-x-2 overflow-hidden" ref={carouselRef}>
        {images.map((image, index) => (
          <motion.div
            key={index}
            className={`relative w-7 h-7 rounded-full border border-white overflow-hidden ${
              index === currentIndex ? "z-10" : ""
            }`}
            animate={{ scale: index === currentIndex ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt="Team member"
              width={28}
              height={28}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
        {images.length > 5 && (
          <div className="relative w-7 h-7 rounded-full bg-gray-200 border border-white flex items-center justify-center text-xs font-medium text-gray-600">
            +{images.length - 5}
          </div>
        )}
      </div>
    </div>
  )
}

// Testimonial Component
const MissionValues = () => {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm mt-16 mb-20">
      <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-black mb-6 text-center">
        Our Mission and Values
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h4 className="text-lg font-medium mb-3">Constant Innovation</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            We are committed to redefining business travel management with cutting-edge technology and user-centered
            solutions.
          </p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h4 className="text-lg font-medium mb-3">Efficiency and Simplicity</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            We believe technology should simplify, not complicate. Our solutions eliminate friction at every stage of
            the travel process.
          </p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h4 className="text-lg font-medium mb-3">Sustainability</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            We are committed to responsible travel practices that minimize environmental impact while maximizing value
            for our customers.
          </p>
        </div>
      </div>
    </div>
  )
}

export const Plans = () => {
  const [randomTitle, setRandomTitle] = useState("")
  const [randomSubtitle, setRandomSubtitle] = useState("")
  const [isAnnual, setIsAnnual] = useState(true) // Cambiado a true por defecto

  useEffect(() => {
    // Seleccionar un título aleatorio al montar el componente
    const titleIndex = Math.floor(Math.random() * titleVariations.length)
    setRandomTitle(titleVariations[titleIndex])

    // Seleccionar un subtítulo aleatorio
    const subtitleIndex = Math.floor(Math.random() * subtitles.length)
    setRandomSubtitle(subtitles[subtitleIndex])
  }, [])

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4 sm:mb-6 bg-gray-50 px-3 py-2 rounded-full">
            <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-[9px] sm:text-xs font-medium text-gray-700">
              Suitpax Pricing
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-[9px] sm:text-xs font-medium text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
              Updated Q2 2025
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-black leading-tight max-w-4xl mb-4">
            {randomTitle}
          </h2>
          <p className="text-sm md:text-base font-medium text-gray-600 max-w-2xl mb-8">{randomSubtitle}</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center rounded-lg bg-transparent border border-gray-200 px-3 py-1 text-xs text-gray-600">
              <span className="font-medium">Flexible Solutions</span>
            </div>
            <div className="inline-flex items-center rounded-lg bg-transparent border border-gray-200 px-3 py-1 text-xs text-gray-600">
              <span className="font-medium">Artificial Intelligence</span>
            </div>
            <div className="inline-flex items-center rounded-lg bg-transparent border border-gray-200 px-3 py-1 text-xs text-gray-600">
              <span className="font-medium">Scalability</span>
            </div>
          </div>
        </motion.div>

        <div className="flex justify-center mb-12">
          <div className="flex items-center bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-all ${
                !isAnnual ? "bg-white shadow-sm text-black" : "text-gray-600"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-all ${
                isAnnual ? "bg-white shadow-sm text-black" : "text-gray-600"
              }`}
            >
              Annual
              <span className="ml-2 inline-flex items-center rounded-full bg-black px-2 py-0.5 text-xs font-medium text-white">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Grid mejorado para móviles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`relative overflow-hidden bg-gradient-to-br ${plan.bgGradient} border rounded-2xl p-6 flex flex-col min-h-[500px] ${
                plan.popular ? "border-2 border-black shadow-xl scale-105" : "border-gray-200 shadow-sm"
              }`}
              whileHover={{
                y: -4,
                boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)",
                transition: { duration: 0.2 },
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Header */}
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h3 className="text-xl md:text-2xl font-medium tracking-tight text-black">{plan.name}</h3>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{plan.description}</p>
                </div>
                {plan.badge && (
                  <span className={`inline-flex items-center rounded-xl px-3 py-1 text-xs font-medium ${
                    plan.popular 
                      ? "bg-black text-white" 
                      : "bg-transparent border border-gray-300 text-gray-700"
                  }`}>
                    {plan.badge}
                  </span>
                )}
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl md:text-4xl font-medium tracking-tight text-black">
                    {isAnnual ? plan.annualPrice : plan.price}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    /{isAnnual ? plan.annualPeriod : plan.period}
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg
                      className="w-4 h-4 text-emerald-600 mt-0.5 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Mini Chat UI */}
              <MiniChat planId={plan.id} />

              {/* Community Carousel */}
              {plan.communityImages && <CommunityCarousel images={plan.communityImages} />}

              {/* CTA Button */}
              <div className="mt-6">
                <Link
                  href={
                    plan.id === "enterprise" || plan.id === "pro"
                      ? "mailto:hello@suitpax.com"
                      : "/auth/signup"
                  }
                  className={`w-full py-3 px-4 rounded-xl text-center text-sm font-medium transition-colors block ${
                    plan.popular
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-transparent border-2 border-black text-black hover:bg-gray-50"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </motion.div>
   