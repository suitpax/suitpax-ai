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
  pro: [
    "Find me a flight with lounge access to London...",
    "Book a business hotel with meeting rooms in Berlin...",
    "Schedule a team lunch near our client's office in Madrid...",
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
  pro: [
    "/community/kelsey-lowe.webp", 
    "/community/brianna-ware.webp", 
    "/community/harriet-rojas.jpg",
    "/community/ammar-foley.webp",
    "/community/owen-harding.webp",
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

// Pricing plans - Eliminado plan Basic, Pro ahora tiene precio de €49
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
    badge: "Starter",
    popular: false,
    agentImage: "/agents/agent-sophia.jpeg",
    communityImages: ["/community/jordan-burgess.webp", "/community/bec-ferguson.webp"],
    bgGradient: "from-gray-50 to-gray-100",
  },
  {
    id: "pro",
    name: "Pro",
    description: "For businesses ready to fully optimize their travel operations",
    price: "€74",
    annualPrice: "€59",
    period: "per month",
    annualPeriod: "per month, billed annually",
    features: [
      "25,000 AI tokens/month",
      "20 AI travel searches per month",
      "Up to 15 team members",
      "AI-powered expense management",
      "Advanced itinerary planning",
      "Custom travel policies",
      "24/5 priority support",
      "Team travel coordination",
      "Basic bank API integration",
      "Advanced TRM intelligence",
      "Priority email support",
      "Enhanced expense tracking",
    ],
    cta: "Talk to founders",
    badge: "Popular",
    popular: true,
    agentImage: "/agents/agent-marcus.jpeg",
    communityImages: [
      "/community/kelsey-lowe.webp", 
      "/community/brianna-ware.webp", 
      "/community/harriet-rojas.jpg",
      "/community/ammar-foley.webp",
      "/community/owen-harding.webp",
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

// Testimonial Component
const MissionValues = () => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm mt-12 mb-16">
      <h3 className="text-xl sm:text-2xl font-medium tracking-tighter text-black mb-4 text-center">
        Our Mission and Values
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 shadow-sm">
          <h4 className="text-sm font-medium mb-2">Constant Innovation</h4>
          <p className="text-xs text-gray-600">
            We are committed to redefining business travel management with cutting-edge technology and user-centered
            solutions.
          </p>
        </div>
        <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 shadow-sm">
          <h4 className="text-sm font-medium mb-2">Efficiency and Simplicity</h4>
          <p className="text-xs text-gray-600">
            We believe technology should simplify, not complicate. Our solutions eliminate friction at every stage of
            the travel process.
          </p>
        </div>
        <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 shadow-sm">
          <h4 className="text-sm font-medium mb-2">Sustainability</h4>
          <p className="text-xs text-gray-600">
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
  const [isAnnual, setIsAnnual] = useState(true)

  useEffect(() => {
    // Seleccionar un título aleatorio al montar el componente
    const titleIndex = Math.floor(Math.random() * titleVariations.length)
    setRandomTitle(titleVariations[titleIndex])

    // Seleccionar un subtítulo aleatorio
    const subtitleIndex = Math.floor(Math.random() * subtitles.length)
    setRandomSubtitle(subtitles[subtitleIndex])
  }, [])

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-3 mb-4 sm:mb-6 bg-gray-50 px-3 py-2 rounded-full">
            <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-[9px] sm:text-xs font-medium text-gray-700">
              Suitpax Pricing
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-[9px] sm:text-xs font-medium text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
              Updated Q2 2025
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none max-w-4xl">
            {randomTitle}
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-medium text-gray-500 max-w-2xl mb-6 sm:mb-8">{randomSubtitle}</p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <div className="inline-flex items-center rounded-md bg-transparent border border-gray-200 px-2 py-1 text-[8px] sm:text-[9px] text-gray-600">
              <span className="font-medium">Flexible Solutions</span>
            </div>
            <div className="inline-flex items-center rounded-md bg-transparent border border-gray-200 px-2 py-1 text-[8px] sm:text-[9px] text-gray-600">
              <span className="font-medium">Artificial Intelligence</span>
            </div>
            <div className="inline-flex items-center rounded-md bg-transparent border border-gray-200 px-2 py-1 text-[8px] sm:text-[9px] text-gray-600">
              <span className="font-medium">Scalability</span>
            </div>
          </div>
        </motion.div>

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

        {/* Grid modificado para mostrar 3 planes en fila */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-6xl mx-auto">
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
                {plan.badge && (
                  <span className="inline-flex items-center rounded-xl bg-transparent border border-black px-2 py-0.5 text-[8px] sm:text-[9px] font-medium text-black">
                    {plan.badge}
                  </span>
                )}
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
                <Link
                  href={
                    plan.id === "enterprise"
                      ? "mailto:hello@suitpax.com"
                      : "https://app.suitpax.com/sign-up"
                  }
                  className={`w-full py-1.5 px-3 rounded-xl text-center text-[9px] sm:text-[10px] font-medium transition-colors ${
                    plan.popular
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-transparent border border-black text-black hover:bg-gray-100"
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

        <motion.div
          className="mt-16 sm:mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-xl sm:text-2xl font-medium tracking-tighter text-black mb-6 text-center">
            AI Token Usage {isAnnual ? "(Annual Plans)" : "(Monthly Plans)"}
          </h3>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-full bg-gray-200 h-1 mb-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-950 h-1 w-1/5 rounded-full"></div>
<p className="text-[10px] sm:text-xs font-medium">Free</p>
              <p className="text-[8px] sm:text-[10px] text-gray-500">5K tokens</p>
            </div>
            <div className="text-center">
              <div className="w-full bg-gray-200 h-1 mb-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-950 h-1 w-1/2 rounded-full"></div>
              </div>
              <p className="text-[10px] sm:text-xs font-medium">Pro</p>
              <p className="text-[8px] sm:text-[10px] text-gray-500">25K tokens</p>
            </div>
            <div className="text-center">
              <div className="w-full bg-gray-200 h-1 mb-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-950 h-1 w-full rounded-full"></div>
              </div>
              <p className="text-[10px] sm:text-xs font-medium">Enterprise</p>
              <p className="text-[8px] sm:text-[10px] text-gray-500">Unlimited</p>
            </div>
          </div>
        </motion.div>

        {/* Mission and Values Section */}
        <MissionValues />

        {/* FAQ Section */}
        <FAQ items={defaultFAQItems} />
<motion.div
          className="mt-16 sm:mt-20 text-center max-w-2xl mx-auto bg-gray-50 p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-xl sm:text-2xl font-medium tracking-tighter text-black mb-2">Need a custom solution?</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-5">
            Our enterprise plans are tailored to your specific business travel needs. Contact our sales team to learn
            more about how we can customize a solution for your organization.
          </p>
          <Link
            href="mailto:hello@suitpax.com"
            className="inline-flex items-center text-xs sm:text-sm font-medium bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Contact our sales team
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default Plans
            