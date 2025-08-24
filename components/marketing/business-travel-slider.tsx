"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { SiElevenlabs, SiAnthropic, SiHubspot, SiNike } from "react-icons/si"
import {
  PiAirplaneTakeoffBold,
  PiTrainBold,
  PiCarBold,
  PiBuildingsBold,
  PiDevicesBold,
  PiWifiHighBold,
  PiUsersBold,
  PiCheckCircleBold,
  PiGlobeBold,
  PiCreditCardBold,
  PiLightningBold,
  PiShieldCheckBold,
  PiClockCountdownBold,
  PiMapPinBold,
  PiChatCircleTextBold,
} from "react-icons/pi"

const slides = [
  {
    id: 1,
    title: "Flights and NDC",
    badge: "Air",
    description:
      "Access real-time inventory from over 500 airlines worldwide through our NDC-powered direct connections for your team.",
    image: "/images/airplane-landing-sunset.jpeg",
    icon: PiAirplaneTakeoffBold,
    features: [
      { text: "NDC direct connections", icon: PiGlobeBold },
      { text: "Real-time availability", icon: PiClockCountdownBold },
      { text: "Dynamic pricing", icon: PiLightningBold },
      { text: "Seamless booking experience", icon: PiCheckCircleBold },
    ],
  },
  {
    id: 2,
    title: "Trains and global rail",
    badge: "Rail",
    description:
      "Connect your team with rail networks across continents with integrated booking and ticketing solutions.",
    image: "/images/high-speed-train-desert-new.png",
    icon: PiTrainBold,
    features: [
      { text: "150+ rail operators", icon: PiGlobeBold },
      { text: "Cross-border journeys", icon: PiMapPinBold },
      { text: "E-ticket delivery", icon: PiCheckCircleBold },
      { text: "Real-time schedule updates", icon: PiClockCountdownBold },
    ],
  },
  {
    id: 3,
    title: "EV Transfers",
    badge: "Ride",
    description:
      "Premium transfer service with electric vehicles for corporate teams and environmentally conscious business travelers.",
    image: "/images/tesla-interior-new.jpeg",
    icon: PiCarBold,
    features: [
      { text: "100% electric fleet", icon: PiLightningBold },
      { text: "Airport-hotel transfers", icon: PiMapPinBold },
      { text: "Corporate accounts", icon: PiCreditCardBold },
      { text: "Professional chauffeurs", icon: PiUsersBold },
    ],
  },
  {
    id: 4,
    title: "Team Stays",
    badge: "Stays",
    description:
      "Access to premium global hotels and properties with negotiated corporate rates and amenities for teams.",
    image: "/images/hilton-san-francisco.png",
    icon: PiBuildingsBold,
    features: [
      { text: "Global hotel network", icon: PiGlobeBold },
      { text: "Corporate negotiated rates", icon: PiCreditCardBold },
      { text: "Loyalty program integration", icon: PiCheckCircleBold },
      { text: "Premium amenities", icon: PiShieldCheckBold },
    ],
  },
  {
    id: 5,
    title: "Digital-first travelers",
    badge: "Tech",
    description:
      "Empowering the next generation of business travelers with seamless digital experiences and personalized solutions.",
    image: "/images/urban-life-in-motion-new.png",
    icon: PiDevicesBold,
    features: [
      { text: "Digital-first experience", icon: PiDevicesBold },
      { text: "Contactless journey", icon: PiShieldCheckBold },
      { text: "Real-time notifications", icon: PiClockCountdownBold },
      { text: "Smart device integration", icon: PiWifiHighBold },
    ],
  },
  {
    id: 6,
    title: "Connected journey",
    badge: "Flow",
    description:
      "Seamlessly connected travel experiences from planning to arrival for the always-on professional and distributed teams.",
    image: "/images/traveler-in-motion-new.png",
    icon: PiWifiHighBold,
    features: [
      { text: "End-to-end connectivity", icon: PiWifiHighBold },
      { text: "Cross-device synchronization", icon: PiDevicesBold },
      { text: "Smart itinerary management", icon: PiMapPinBold },
      { text: "Offline access to documents", icon: PiCheckCircleBold },
    ],
  },
  {
    id: 7,
    title: "Team collaboration",
    badge: "Team",
    description:
      "Coordinate travel for diverse teams with collaborative tools and centralized management for growing startups.",
    image: "/images/fashionable-youth.png",
    icon: PiUsersBold,
    features: [
      { text: "Group booking tools", icon: PiUsersBold },
      { text: "Team itinerary sharing", icon: PiChatCircleTextBold },
      { text: "Policy compliance", icon: PiShieldCheckBold },
      { text: "Centralized expense tracking", icon: PiCreditCardBold },
    ],
  },
]

// Información actualizada y verificada de las empresas
const companies = [
  {
    name: "ElevenLabs",
    icon: SiElevenlabs,
    size: "Startup",
    employees: "+100 employees",
    description: "AI voice technology company revolutionizing text-to-speech",
    users: ["/community/ammar-foley.webp", "/community/owen-harding.webp", "/community/jordan-burgess.webp"],
    scenario:
      "Perfect for growing startups like ElevenLabs that need flexible travel solutions for investor meetings and conferences.",
  },
  {
    name: "Anthropic",
    icon: SiAnthropic,
    size: "Growth",
    employees: "+500 employees",
    description: "AI safety and research company developing Claude",
    users: [
      "/community/adil-floyd.webp",
      "/community/nicolas-trevino.webp",
      "/community/ashton-blackwell.webp",
      "/community/scott-clayton.webp",
    ],
    scenario:
      "Ideal for rapidly scaling companies like Anthropic that need adaptable travel management as their team expands globally.",
  },
  {
    name: "HubSpot",
    icon: SiHubspot,
    size: "Enterprise",
    employees: "+5,000 employees",
    description: "Leading CRM platform for scaling businesses",
    users: [
      "/community/bec-ferguson.webp",
      "/community/byron-robertson.webp",
      "/community/isobel-fuller.webp",
      "/community/lana-steiner.jpg",
      "/community/nikolas-gibbons.jpg",
      "/community/kelsey-lowe.webp",
    ],
    scenario:
      "Designed for enterprises like HubSpot with complex travel needs across multiple offices and departments worldwide.",
  },
  {
    name: "Nike",
    icon: SiNike,
    size: "Global",
    employees: "+75,000 employees",
    description: "World's largest supplier of athletic shoes and apparel",
    users: [
      "/community/brianna-ware.webp",
      "/community/harriet-rojas.jpg",
      "/community/sienna-hewitt.jpg",
      "/community/belle-woods.webp",
      "/community/elisa-nishikawa.jpg",
      "/community/olly-schroeder.jpg",
      "/community/loki-bright.jpg",
    ],
    scenario:
      "Tailored for global corporations like Nike with operations in 170+ countries requiring sophisticated travel management.",
  },
]

// Componente personalizado de MiniChat para el slider
const SliderMiniChat = ({ message, agentId }: { message: string; agentId: number }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800/60 backdrop-blur-md border border-gray-700/30 text-[10px] font-medium text-white w-auto shadow-md"
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative w-6 h-6 overflow-hidden rounded-xl border border-gray-700/50">
        <Image
          src={`/agents/agent-${agentId}.png`}
          alt="AI Agent"
          width={24}
          height={24}
          className="w-full h-full object-cover object-center"
        />
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-emerald-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </div>
      <div className="flex-1 py-1 text-[10px] font-medium text-white flex items-center overflow-hidden">
        <span className="line-clamp-1">{message}</span>
      </div>
      <motion.div
        animate={isHovered ? { x: [0, 3, 0] } : {}}
        transition={{ repeat: isHovered ? Number.POSITIVE_INFINITY : 0, duration: 1 }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-200 flex-shrink-0"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </motion.div>
    </motion.div>
  )
}

// Mensajes personalizados para cada empresa
const companyTravelMessages = {
  ElevenLabs: [
    "Approve team expense report for Q2 offsite",
    "Book business class for 5 engineers to SXSW",
    "Update travel policy for remote employees",
    "Schedule quarterly budget review for travel dept",
  ],
  Anthropic: [
    "Process expense reports for London research team",
    "Arrange corporate housing for visiting researchers",
    "Book conference rooms at Tokyo AI Summit",
    "Update per diem rates for international travel",
  ],
  HubSpot: [
    "Reconcile Q3 travel expenses across departments",
    "Approve travel budget for global sales kickoff",
    "Update corporate card policies for executives",
    "Schedule travel arrangements for 200+ attendees",
  ],
  Nike: [
    "Approve expense reports for design team in Milan",
    "Update travel policy for Olympic sponsorship team",
    "Process invoices for chartered flights to Paris",
    "Review Q4 travel forecast for global retail team",
  ],
}

export default function BusinessTravelSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => {
    setDirection(1)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const startAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    autoPlayRef.current = setInterval(() => {
      nextSlide()
    }, 6000)
  }

  useEffect(() => {
    startAutoPlay()
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [])

  const handleMouseEnter = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
  }

  const handleMouseLeave = () => {
    startAutoPlay()
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-12">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <Image
                src="/logo/suitpax-bl-logo.webp"
                alt="Suitpax"
                width={50}
                height={12}
                className="h-2.5 w-auto mr-1"
              />
              Travel
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse mr-1"></span>
              Business Solutions
            </span>
          </div>
          <h2 className="text-2xl md:text-2xl lg:text-2xl font-medium tracking-tighter text-black leading-none mb-4">
            Unified business travel platform
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl">
            Our integrated platform combines all travel services in one seamless interface, providing a complete
            business travel solution for the modern professional.
          </p>
        </div>

        <div
          className="relative max-w-5xl mx-auto mb-12 sm:mb-16"
          ref={sliderRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex justify-center">
            <div className="w-full max-w-md mx-auto">
              <div className="relative h-auto min-h-[520px] overflow-hidden rounded-xl bg-white/50 backdrop-blur-sm p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={currentSlide}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className="absolute inset-0"
                  >
                    <div className="h-full w-full flex flex-col p-2 space-y-3">
                      <div className="relative w-full pt-[60%] mb-4 rounded-xl overflow-hidden">
                        <Image
                          src={slides[currentSlide].image || "/placeholder.svg"}
                          alt={slides[currentSlide].title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                          <span className="text-xs font-medium text-white px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg">
                            {`${currentSlide + 1}/${slides.length}`}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={prevSlide}
                              className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors"
                              aria-label="Previous slide"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10 12L6 8L10 4"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={nextSlide}
                              className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors"
                              aria-label="Next slide"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M6 12L10 8L6 4"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between flex-grow p-2 text-left">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <h3 className="text-xl font-medium tracking-tighter text-black">
                              {slides[currentSlide].title}
                            </h3>
                            <span className="inline-flex items-center justify-center gap-1 rounded-xl bg-gray-100 border border-gray-200 px-3 py-1 text-sm font-medium italic shadow-sm">
                              {typeof slides[currentSlide].badge === "string" ? (
                                <>
                                  <Image
                                    src="/logo/suitpax-bl-logo.webp"
                                    alt="Suitpax"
                                    width={40}
                                    height={10}
                                    className="h-3 w-auto mr-1"
                                  />
                                  <span className="font-serif flex items-center">{slides[currentSlide].badge}</span>
                                </>
                              ) : (
                                slides[currentSlide].badge
                              )}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-600 mb-4">{slides[currentSlide].description}</p>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                            {slides[currentSlide].features.map((feature, i) => (
                              <li key={i} className="text-xs font-medium text-gray-700 flex items-center">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 mr-2 shadow-sm">
                                  <feature.icon className="h-3.5 w-3.5 text-gray-700" />
                                </span>
                                {feature.text}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 sm:mt-16">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl font-medium tracking-tighter text-black mb-2">Adaptable to any organization</h3>
            <p className="text-sm text-gray-600">
              See how Suitpax can be tailored to meet the unique travel needs of different companies
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {companies.map((company, index) => (
              <div
                key={company.name}
                className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow min-h-[220px] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 shadow-sm">
                      <company.icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <h4 className="font-medium text-black">{company.name}</h4>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-xl bg-gray-100 border border-gray-200 px-2.5 py-0.5 text-xs font-medium italic shadow-sm">
                          <Image
                            src="/logo/suitpax-bl-logo.webp"
                            alt="Suitpax"
                            width={40}
                            height={10}
                            className="h-2.5 w-auto"
                          />
                          <span className="font-serif">{company.size}</span>
                        </span>
                        <span className="text-[10px] text-gray-500">{company.employees}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-gray-600 mb-3">{company.scenario}</p>

                  <div className="flex flex-wrap -space-x-2 overflow-hidden mb-3">
                    {company.users.map((user, i) => (
                      <div
                        key={i}
                        className="relative w-7 h-7 rounded-full overflow-hidden border border-white shadow-sm"
                      >
                        <Image src={user || "/placeholder.svg"} alt="Team member" fill className="object-cover" />
                      </div>
                    ))}
                    {index > 1 && (
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 border border-white text-[10px] font-medium text-gray-700 shadow-sm">
                        +{index === 2 ? 12 : 24}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {["Travel", "Expense", "Booking", index > 0 ? "Policy" : "", index > 1 ? "Analytics" : ""]
                      .filter(Boolean)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-xl bg-gray-100 border border-gray-200 px-2.5 py-0.5 text-xs font-medium italic text-gray-600 shadow-sm"
                        >
                          <span className="font-serif">{tag}</span>
                        </span>
                      ))}
                  </div>
                </div>
                <SliderMiniChat
                  message={companyTravelMessages[company.name][index % companyTravelMessages[company.name].length]}
                  agentId={20 + index * 7}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
