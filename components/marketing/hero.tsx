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
import { ArcadeEmbed } from "@/components/ui/arcade-embed"
import React from "react"

const Hero = () => {
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
    // Nuevos títulos enfocados en TMS (Travel Management System) con AI
    "The TMS revolution: AI-powered travel management like never before.",
    "Reimagining TMS with artificial intelligence and human expertise.",
    "Next-generation TMS: Where AI meets intelligent travel management.",
    "The future of TMS is here: AI-driven, human-centered, business-focused.",
    "Revolutionary TMS platform powered by advanced AI technology.",
    "TMS redefined: Intelligent automation meets seamless travel coordination.",
    "The smartest TMS ever built: AI agents managing your business travel.",
    "Beyond traditional TMS: AI-first travel management for modern enterprises.",
    "TMS evolved: Artificial intelligence transforming corporate travel.",
    "The ultimate TMS experience: AI-powered efficiency meets human insight.",
    "TMS innovation unleashed: AI agents revolutionizing business travel.",
    "Intelligent TMS platform: Where artificial intelligence drives travel decisions.",
    "The new standard in TMS: AI-enhanced travel management solutions.",
    "TMS breakthrough: Combining AI intelligence with travel expertise.",
    "Advanced TMS technology: AI agents optimizing every business trip.",
    "The TMS of tomorrow: AI-powered, data-driven, results-focused.",
    "Revolutionary travel management: TMS enhanced by artificial intelligence.",
    "Smart TMS solutions: AI technology transforming business travel workflows.",
    "The intelligent TMS: Where AI meets enterprise travel management.",
    "TMS reimagined: Artificial intelligence powering seamless business travel.",
    "Next-level TMS: AI-driven insights for smarter travel decisions.",
    "The AI-powered TMS that changes everything about business travel.",
    "Intelligent travel management: TMS enhanced by cutting-edge AI.",
    "The TMS revolution starts here: AI agents managing corporate travel.",
    "Advanced TMS platform: Where artificial intelligence meets travel excellence.",
  ]

  const cities = ["London", "Paris", "New York", "Tokyo", "Dubai"]

  const subtitles = [
    "The ultimate travel stack for modern companies",
    "AI-powered travel management for modern workers.",
    "Next-generation travel tools for growing businesses.",
    "Your company's travel, perfectly managed.",
    "Business travel that enhances your workflow.",
    "Designed by humans. Powered by AI agents.",
    "AI-driven travel for modern business.",
    "Smarter business travel decisions.",
    "The all in one solution for your company's travel needs.",
    "Human vision. AI execution.",
    "Human-led. AI-empowered.",
    "Where human intuition meets AI agents.",
    "AI-first business travel platform for the modern enterprise.",
    "AI-first approach to solving business travel complexity.",
    "Business travel reimagined: AI-first, human-centered, future-ready.",
    "AI-first travel management for data-driven businesses.",
    "Business travel simplified through AI-first automation.",
    "Business travel intelligence: AI-first insights for better decisions.",
    "AI-first travel platform built for business efficiency.",
    "The future of business travel is AI-first and human-guided.",
    "AI-first business travel: Smarter journeys, better outcomes.",
    "Empowering your workforce with intelligent travel solutions.",
    "AI-travel platform designed for the modern workforce.",
    "Transforming business travel for distributed workforce teams.",
    "Business platform that streamlines travel for global teams.",
    "AI-travel intelligence for your entire business workforce.",
    "Workforce mobility powered by AI-travel innovation.",
    "Business-first approach to AI-travel management.",
    "The platform connecting your workforce to seamless travel.",
    "AI-travel orchestration for business teams everywhere.",
    "Workforce travel simplified on a single business platform.",
    "AI-travel solutions tailored to your business needs.",
    "Unifying your workforce through intelligent business travel.",
    "AI-travel management that grows with your business.",
    "Workforce-centric business travel platform.",
    "Connecting your global workforce through intelligent travel.",
    "AI-travel coordination for distributed business teams.",
    "Workforce travel management reimagined for modern business.",
    "AI-travel intelligence built for business efficiency.",
    "The TMS revolution: AI-powered travel management like never before.",
    "Reimagining TMS with artificial intelligence and human expertise.",
    "Next-generation TMS: Where AI meets intelligent travel management.",
    "The future of TMS is here: AI-driven, human-centered, business-focused.",
    "Revolutionary TMS platform powered by advanced AI technology.",
    "TMS redefined: Intelligent automation meets seamless travel coordination.",
    "The smartest TMS ever built: AI agents managing your business travel.",
    "Beyond traditional TMS: AI-first travel management for modern enterprises.",
    "TMS evolved: Artificial intelligence transforming corporate travel.",
  ]

  const [titleIndex, setTitleIndex] = React.useState(0)
  const [subtitleIndex, setSubtitleIndex] = React.useState(0)

  const [badgeMessage, setBadgeMessage] = useState("")

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTitleIndex((prevIndex) => (prevIndex + 1) % titleVariations.length)
      setSubtitleIndex((prevIndex) => (prevIndex + 1) % subtitles.length)
    }, 5000) // Change title every 5 seconds

    return () => clearInterval(intervalId) // Cleanup on unmount
  }, [titleVariations.length, subtitles.length])

  useEffect(() => {
    const updateBadgeMessage = () => {
      const now = new Date()
      const hour = now.getHours()

      if (hour >= 5 && hour < 12) {
        setBadgeMessage("Good morning!")
      } else if (hour >= 12 && hour < 18) {
        setBadgeMessage("Good afternoon!")
      } else {
        setBadgeMessage("Good evening!")
      }
    }

    updateBadgeMessage() // Set initial message
    const intervalId = setInterval(updateBadgeMessage, 60000) // Update every minute

    return () => clearInterval(intervalId)
  }, [])

  const randomTitle = titleVariations[titleIndex]
  const randomSubtitle = subtitles[subtitleIndex]

  return (
    <section className="relative h-[100vh] w-full overflow-hidden">
      <VantaHaloBackground />

      <div className="container relative z-10 flex max-w-5xl flex-col items-center justify-center gap-4 pb-8 pt-6 md:pb-10 md:pt-14 lg:pb-20 lg:pt-24">
        <Badge className="opacity-90">{badgeMessage}</Badge>
        <CounterBadge />
        <motion.h1
          className="font-heading text-balance scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl"
          variants={FadeContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <FadeSpan>{randomTitle}</FadeSpan>
        </motion.h1>
        <CityAnimateText cities={cities} />
        <p className="max-w-[700px] text-balance text-center text-lg text-muted-foreground">{randomSubtitle}</p>
        <div className="flex w-full items-center justify-center space-x-4">
          <Link href="/manifesto" target="_blank">
            <Button size="lg">Read our manifesto</Button>
          </Link>
          <Link href="https://cal.com/suitpax/30min" target="_blank">
            <Button size="lg" variant="outline">
              Talk to founders
            </Button>
          </Link>
        </div>
        <ArcadeEmbed />
        <p className="mx-auto max-w-2xl text-center text-sm text-muted-foreground">
          We are on a mission to revolutionize business travel with AI. Our platform is designed to make travel
          management seamless, efficient, and enjoyable for companies of all sizes.
        </p>
        <motion.div
          className="absolute bottom-0 right-0 mr-4 mb-4 rounded-full bg-white p-2 shadow-md transition-all hover:scale-110"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MiniChat />
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
