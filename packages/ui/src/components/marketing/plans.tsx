"use client"

import { useRef } from "react"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"

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
    badge: "",
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
    badge: "",
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
    cta: "Contact sales",
    badge: "",
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
    cta: "Contact sales",
    badge: "",
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
    <div className="relative flex items-center gap-1 p-1 rounded-lg border border-gray-300 bg-white shadow-sm text-[9px] sm:text-[10px] mt-3">
      <div className="relative w-5 h-5 sm:w-6 sm:h-6 overflow-hidden rounded-full border border-gray-300 ml-1">
        <Image
          src={getAgentImage() || "/placeholder.svg"}
          alt="Agent"
          width={24}
          height={24}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="flex-1 py-1 px-1 text-[9px] sm:text-[10px] text-gray-500 h-5 sm:h-6 flex items-center overflow-hidden">
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
      <p className="text-[9px] sm:text-[10px] text-gray-500 mb-1">Team members using this plan:</p>
      <div className="flex -space-x-2 overflow-hidden" ref={carouselRef}>
        {images.map((image, index) => (
          <motion.div
            key={index}
            className={`relative w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white overflow-hidden ${
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
          <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-200 border border-white flex items-center justify-center text-[8px] sm:text-[9px] font-medium text-gray-600">
            +{images.length - 5}
          </div>
        )}
      </div>
    </div>
  )
}

// Testimonial Component (retirado para simplificar coherencia visual)

export const Plans = () => {
  const [randomTitle, setRandomTitle] = useState("")
  const [randomSubtitle, setRandomSubtitle] = useState("")
  const [isAnnual, setIsAnnual] = useState(false)

  useEffect(() => {
    // Seleccionar un título aleatorio al montar el componente
    const titleIndex = Math.floor(Math.random() * titleVariations.length)
    setRandomTitle(titleVariations[titleIndex])

    // Seleccionar un subtítulo aleatorio
    const subtitleIndex = Math.floor(Math.random() * subtitles.length)
    setRandomSubtitle(subtitles[subtitleIndex])
  }, [])

  const handlePlanSelect = async (planId: string) => {
    if (planId === "free") {
      window.location.href = "https://app.suitpax.com/sign-up"
      return
    }

    if (planId === "enterprise" || planId === "pro") {
      window.location.href = "mailto:hello@suitpax.com"
      return
    }

    if (planId === "basic") {
      window.location.href = "https://app.suitpax.com/sign-up"
    }
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none max-w-4xl">
            {randomTitle}
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-medium text-gray-500 max-w-2xl mb-6 sm:mb-8">{randomSubtitle}</p>

          <div className="flex justify-center mb-8">
            <div className="flex items-center bg-gray-100 p-1 rounded-full">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                  !isAnnual ? "bg-white shadow-sm text-black" : "text-gray-600"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                  isAnnual ? "bg-white shadow-sm text-black" : "text-gray-600"
                }`}
              >
                Annual
                <span className="ml-1 inline-flex items-center rounded-full bg-black px-2 py-0.5 text-[9px] font-medium text-white">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Grid modificado para 2x2 en pantallas grandes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`relative overflow-hidden bg-gradient-to-br ${plan.bgGradient} border border-black rounded-xl p-3 sm:p-4 flex flex-col h-full ${
                plan.popular ? "border-2 shadow-lg" : "border shadow-sm"
              }`}
              whileHover={{
                y: -4,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 },
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Diseño más compacto */}
              <div className="mb-2 sm:mb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-medium tracking-tighter text-black">{plan.name}</h3>
                  <p className="text-[9px] sm:text-[10px] text-gray-600 mt-0.5 line-clamp-2">{plan.description}</p>
                </div>
              </div>

              <div className="mb-2 sm:mb-3">
                <div className="flex items-baseline">
                  <span className="text-2xl sm:text-3xl font-medium tracking-tighter text-black">
                    {isAnnual ? plan.annualPrice : plan.price}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-gray-500 ml-1">
                    /{isAnnual ? plan.annualPeriod : plan.period}
                  </span>
                </div>
              </div>

              {/* Features más compactas */}
              <ul className="space-y-1 mb-3 sm:mb-4 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-950 mt-0.5 mr-1.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-[9px] sm:text-[10px] font-medium text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Mini Chat UI con agente específico */}
              <MiniChat planId={plan.id} />

              {/* Community Carousel - solo para planes no beta */}
              {plan.id !== "beta" && plan.communityImages && <CommunityCarousel images={plan.communityImages} />}

              <div className="mt-3">
                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`w-full py-2.5 px-4 rounded-2xl text-center text-xs sm:text-sm font-semibold transition-colors ${
                    plan.popular
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-white text-black border border-black hover:bg_gray-100"
                  } block mx-auto max-w-[220px]`}
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Plans
