"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import Badge from "@/components/ui/badge"
import CityAnimateText from "@/components/ui/city-animate-text"
import { useEffect, useState } from "@/components/ui/animations"
import { FadeContainer, FadeSpan } from "@/components/ui/animations"
import CounterBadge from "@/components/ui/counter-badge"
import MiniChat from "@/components/ui/mini-chat"
import VantaHaloBackground from "@/components/ui/vanta-halo-background"

// Modificar las variaciones de título para hacerlas más inclusivas

// Reemplazar algunos de los titleVariations con estas nuevas versiones:
const titleVariations = [
  "AI traveltech platform for modern businesses. Made for humans",
  "Business travel, reimagined for today's world.",
  "The intelligent travel platform for teams of all sizes.",
  "Streamlined business travel for the digital age.",
  "AI-powered travel management for modern workers.",
  "Enterprise travel platform with AI at its core.",
  "Next-generation travel tools for growing businesses.",
  "Intelligent travel solutions for startups and scale-ups.",
  "Business travel infrastructure for companies at any stage.",
  "Your company's travel, perfectly managed.",
  "Business travel that enhances your workflow.",
  "Designed by humans. Powered by AI agents.",
  "AI-driven travel for modern business.",
  // Nuevos títulos enfocados en MCP (Model Context Protocol)
  "MCP: AI agents that understand your business travel needs.",
  "Business travel platform with MCP-powered intelligence.",
  "MCP + AI agents: The perfect travel management duo.",
  "Suitpax MCP: Smarter business travel decisions.",
  "AI travel agents with MCP: Context-aware recommendations.",
  "MCP business travel: Where AI meets human expertise.",
  // Nuevos títulos con "all in one"
  "All in one business travel platform for startups and growing companies.",
  "The all in one solution for your company's travel needs.",
  "Suitpax: All in one travel management for teams of all sizes.",
  "All in one travel platform with AI at its core.",
  "Your all in one business travel command center.",
  "All in one travel infrastructure for modern businesses.",
  "The all in one travel solution that grows with your company.",
  "All in one travel management with human-centered design.",
  // Nuevo título añadido
  "The complete business travel ecosystem: Flights, Hotels, Cars, and Expense Management.",
  "Human vision. AI execution. Reinventing business travel and expense management.",
  "Human-led. AI-empowered. Transforming how companies travel and manage expenses.",
  "Where human intuition meets AI agents to redefine corporate travel and financial control.",
  // Nuevos títulos sobre AI-first y business travel
  "AI-first business travel platform for the modern enterprise.",
  "Redefining business travel with AI-first principles and human expertise.",
  "AI-first approach to solving business travel complexity.",
  "Business travel reimagined: AI-first, human-centered, future-ready.",
  "The AI-first platform transforming corporate travel management.",
  "Business travel elevated through AI-first technology.",
  "AI-first travel management for data-driven businesses.",
  "Where AI-first meets business travel excellence.",
  "Business travel simplified through AI-first automation.",
  "The AI-first revolution in corporate travel has arrived.",
  "Business travel intelligence: AI-first insights for better decisions.",
  "AI-first travel platform built for business efficiency.",
  "Transforming business travel with AI-first innovation.",
  "The future of business travel is AI-first and human-guided.",
  "AI-first business travel: Smarter journeys, better outcomes.",
  // Nuevos títulos con workforce, AI-travel, business, platform
  "Empowering your workforce with intelligent travel solutions.",
  "AI-travel platform designed for the modern workforce.",
  "Transforming business travel for distributed workforce teams.",
  "The workforce-friendly AI-travel management solution.",
  "Business platform that streamlines travel for global teams.",
  "AI-travel intelligence for your entire business workforce.",
  "The business travel platform that works as hard as you do.",
  "Workforce mobility powered by AI-travel innovation.",
  "Business-first approach to AI-travel management.",
  "The platform connecting your workforce to seamless travel.",
  "AI-travel orchestration for business teams everywhere.",
  "Workforce travel simplified on a single business platform.",
  "The business travel platform with workforce intelligence.",
  "AI-travel solutions tailored to your business needs.",
  "Unifying your workforce through intelligent business travel.",
  "The platform that revolutionizes how your business travels.",
  "AI-travel management that grows with your business.",
  "Workforce-centric business travel platform.",
  "The business platform for AI-powered travel experiences.",
  "Connecting your global workforce through intelligent travel.",
  "AI-travel coordination for distributed business teams.",
  "The platform that understands your business travel patterns.",
  "Workforce travel management reimagined for modern business.",
  "AI-travel intelligence built for business efficiency.",
  "The business platform that makes workforce travel effortless.",
  // Nuevos títulos sobre TMS (Travel Management System)
  "TMS reimagined: AI-powered travel management like never before.",
  "The TMS revolution: Where artificial intelligence meets travel expertise.",
  "Next-generation TMS with AI agents that think like your travel team.",
  "TMS evolved: AI-first travel management for the modern enterprise.",
  "Beyond traditional TMS: AI-driven travel intelligence for smart businesses.",
  "The future of TMS is here: AI agents managing your entire travel ecosystem.",
  "TMS redefined: Intelligent automation meets human-centered travel design.",
]

// Badge update messages with time-based logic
const getBadgeMessage = () => {
  const now = new Date()
  const hour = now.getHours()

  // Show "AI Agents are sleeping" after 9 PM (21:00)
  if (hour >= 21 || hour < 6) {
    return "Our AI Agents are sleeping..."
  }

  // Random selection for other times with more variety
  const messages = [
    "Update: MCP Integration Live",
    "New: AI Context Protocol",
    "Update: Enhanced AI Agents",
    "New: Model Context Protocol",
    "Launching October 2025.",
    "Our AI Agents are at the gym...",
    "Building the AI context...",
    "The next-gen of traveltech.",
    "Update: Smarter AI Responses",
    "New: Context-Aware Agents",
  ]

  return messages[Math.floor(Math.random() * messages.length)]
}

// Cities for the animated text
const cities = [
  "San Francisco",
  "New York",
  "London",
  "Barcelona",
  "Tokyo",
  "Berlin",
  "Singapore",
  "Sydney",
  "Paris",
  "Dubai",
  "Toronto",
  "Hong Kong",
  "Amsterdam",
  "Madrid",
  "Seoul",
  "Mumbai",
  "Mexico City",
  "São Paulo",
  "Bangkok",
  "Istanbul",
  "Vienna",
  "Copenhagen",
  "Stockholm",
  "Zurich",
  "Prague",
  "Buenos Aires",
  "Rio de Janeiro",
  "Cape Town",
  "Melbourne",
  "Vancouver",
  "Montreal",
  "Lisbon",
  "Athens",
  "Dublin",
  "Oslo",
  "Helsinki",
  "Milan",
  "Munich",
  "Brussels",
  "Frankfurt",
  "Geneva",
  "Zurich",
  "Manchester",
  "Birmingham",
  "Lyon",
  "Marseille",
  "Hamburg",
  "Cologne",
  "Rotterdam",
  "Turin",
  "Bologna",
  "Florence",
  "Valencia",
  "Seville",
  "Porto",
  "Warsaw",
  "Krakow",
  "Budapest",
  "Vienna",
  "Prague",
  "Bratislava",
  "Ljubljana",
  "Zagreb",
  "Belgrade",
  "Bucharest",
  "Sofia",
  "Thessaloniki",
  "Tallinn",
  "Riga",
  "Vilnius",
  "Luxembourg",
  "Monaco",
  "Basel",
  "Antwerp",
  "Ghent",
  "Düsseldorf",
  "Stuttgart",
  "Nuremberg",
  "Hannover",
  "Leipzig",
  "Dresden",
  "Gothenburg",
  "Malmö",
  "Tampere",
  "Manchester",
  "Odense",
  "Bergen",
  "Stavanger",
  "Reykjavik",
]

// Reemplazar algunos de los subtitles con estas nuevas versiones:
const subtitles = [
  "The next-gen of traveltech with AI superpowers. AI travel agents, expense management, and global travel services—all in one. Built for startups and growing businesses.",
  "A comprehensive platform that simplifies business travel through intelligent automation. Perfect for teams of all sizes.",
  "Connecting business travelers with essential tools from booking to expense management. Designed for modern companies at any stage.",
  "AI capabilities with industry expertise to address travel challenges for startups and scale-ups.",
  "Making business travel coordination simple for today's distributed teams, from bootstrapped to venture-backed.",
  "The infrastructure powering next generation business travel, with AI at its core for companies of all sizes.",
  "Streamline your corporate travel with AI-powered booking, expense tracking, and policy compliance—all in one platform.",
  "Manage flights, hotels, cars, and expenses with intelligent AI agents that understand your business needs.",
  "Revolutionize your company's travel management with context-aware AI and seamless expense integration.",
  "Global business travel simplified: AI agents handle bookings while you focus on what matters most.",
  // Nuevos subtítulos enfocados en workforce
  "Empower your distributed workforce with AI-driven travel tools that adapt to changing business needs and travel patterns.",
  "Unify your global workforce travel experience with a platform that understands each team member's preferences and requirements.",
  "Support your remote workforce with intelligent travel solutions that make business trips efficient, productive, and stress-free.",
  "Give your workforce the travel tools they deserve: intuitive booking, expense automation, and 24/7 AI support.",
  // Nuevos subtítulos enfocados en AI-travel
  "AI-travel intelligence that learns from your company's patterns to deliver personalized recommendations and cost savings.",
  "Experience the future of business travel with AI-travel agents that handle everything from booking to expense reconciliation.",
  "Our AI-travel platform combines machine learning with human expertise to create the ultimate business travel experience.",
  "AI-travel coordination that anticipates needs, solves problems, and optimizes every aspect of your business trips.",
  // Nuevos subtítulos enfocados en business
  "Business travel reimagined for the digital age: faster bookings, smarter recommendations, and seamless expense management.",
  "Transform how your business handles travel with intelligent automation, policy compliance, and real-time reporting.",
  "The business travel solution that scales with your company, from your first business trip to your thousandth.",
  "Designed specifically for business needs: policy enforcement, duty of care, expense integration, and travel optimization.",
  // Nuevos subtítulos enfocados en platform
  "A unified platform connecting all aspects of business travel: booking, expense management, reporting, and team coordination.",
  "One platform to manage it all: flights, hotels, ground transportation, expenses, and travel policies in a single interface.",
  "The only travel platform your business will ever need, with AI at its core and humans at the helm.",
  "Our platform brings together fragmented travel services into one cohesive, intelligent system built for modern businesses.",
  "Connecting business travelers to Europe's most vibrant commercial hubs with AI-powered booking and expense management.",
  "Streamline your European business travel with intelligent tools designed for the modern corporate traveler.",
  "Navigate Europe's business landscape with ease using our AI-powered travel management platform.",
  "From London to Milan, our platform optimizes every aspect of your European business travel experience.",
  "Simplify cross-border European travel with intelligent booking, expense tracking, and policy compliance.",
  "Designed for the European business traveler: seamless bookings, local insights, and expense automation.",
  "Transforming corporate travel across Europe with AI agents that understand local business contexts.",
  "Your European business travel companion: intelligent bookings, expense management, and travel insights.",
  "Optimize your company's European travel budget with AI-powered recommendations and policy enforcement.",
  "The ultimate European business travel platform: connecting you to key commercial centers with ease.",
]

export const Hero = () => {
  const [randomTitle, setRandomTitle] = useState("")
  const [badgeMessage, setBadgeMessage] = useState("")
  const [randomSubtitle, setRandomSubtitle] = useState("")

  useEffect(() => {
    // Select a random title on component mount
    const titleIndex = Math.floor(Math.random() * titleVariations.length)
    setRandomTitle(titleVariations[titleIndex])

    // Select a random subtitle
    const subtitleIndex = Math.floor(Math.random() * subtitles.length)
    setRandomSubtitle(subtitles[subtitleIndex])

    // Set badge message based on time or random selection
    setBadgeMessage(getBadgeMessage())
  }, [])

  return (
    <VantaHaloBackground className="w-full min-h-[100vh] md:min-h-[90vh] lg:min-h-[100vh]">
      <section
        aria-label="hero"
        className="relative w-full overflow-hidden py-20 md:py-32 lg:py-40 pt-24 flex items-center justify-center min-h-[100vh] md:min-h-[90vh] lg:min-h-[100vh]"
      >
        <FadeContainer className="relative flex flex-col items-center justify-center container px-4 md:px-6 mx-auto">
          <Badge
            text={badgeMessage}
            href={badgeMessage === "Pre-register." ? "https://app.suitpax.com/sign-up" : "#"}
            className="bg-white text-black hover:bg-gray-100 transition-colors"
          />

          <CounterBadge className="mt-4" variant="light" />

          <div className="mt-10 text-center max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none max-w-4xl">
              <em className="font-serif italic"><FadeSpan>{randomTitle}</FadeSpan></em>
            </h1>

            {/* Animated AI Assistant Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-gray-200 relative"
            >
              <CityAnimateText cities={cities} />
            </motion.div>

            <p className="mt-4 text-xs sm:text-sm font-medium text-gray-500 max-w-2xl mx-auto">
              <FadeSpan>{randomSubtitle}</FadeSpan>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <Button
                asChild
                className="rounded-xl bg-black text-white hover:bg-black/90 px-8 py-3 md:px-10 md:py-4 w-full sm:w-auto min-w-[180px] md:min-w-[220px] font-medium shadow-lg text-base md:text-lg"
              >
                <Link href="/manifesto">Read the manifesto</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-xl bg-white/80 backdrop-blur-md border-gray-300 text-black hover:bg-white/90 px-8 py-3 md:px-10 md:py-4 w-full sm:w-auto min-w-[180px] md:min-w-[220px] font-medium shadow-lg text-base md:text-lg"
              >
                <Link href="https://cal.com/team/founders/partnership">Invest in Suitpax- Let's talk</Link>
              </Button>
            </div>
          </div>

          {/* Caption text */}
          <div className="mt-6 text-center">
            <p className="text-black/90 text-xs font-medium tracking-wider uppercase">
              CONNECTED TO 400+ GLOBAL AIRLINES & PREMIUM HOTELS WORLDWIDE
            </p>
          </div>

          {/* Mini Chat Component */}
          <motion.div
            className="mt-4 max-w-md mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
          >
            <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 overflow-hidden">
              <MiniChat />
            </div>
          </motion.div>
        </FadeContainer>
      </section>
    </VantaHaloBackground>
  )
}

export default Hero
