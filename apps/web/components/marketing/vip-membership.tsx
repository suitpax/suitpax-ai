"use client"

import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import {
  PiTrendUpBold,
  PiCrownBold,
  PiAirplaneTakeoffBold,
  PiMapPinBold,
  PiClockBold,
  PiCheckCircleBold,
  PiCalendarCheckBold,
} from "react-icons/pi"

// Import modular components
import { TabNavigation } from "../ui-crm/tab-navigation"

const VIPMembership = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentMemberPage, setCurrentMemberPage] = useState(0)
  const [currentLoungePage, setCurrentLoungePage] = useState(0)
  const slideInterval = useRef<NodeJS.Timeout | null>(null)
  const memberInterval = useRef<NodeJS.Timeout | null>(null)
  const loungeInterval = useRef<NodeJS.Timeout | null>(null)

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  // Auto-rotate slides
  useEffect(() => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredLounges.length)
    }, 5000)

    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current)
    }
  }, [])

  // Auto-rotate member examples
  useEffect(() => {
    if (activeTab === "members") {
      memberInterval.current = setInterval(() => {
        setCurrentMemberPage((prev) => (prev + 1) % Math.ceil(teamMembers.length / 2))
      }, 4000)
    }

    return () => {
      if (memberInterval.current) clearInterval(memberInterval.current)
    }
  }, [activeTab])

  // Auto-rotate lounge examples
  useEffect(() => {
    if (activeTab === "lounges") {
      loungeInterval.current = setInterval(() => {
        setCurrentLoungePage((prev) => (prev + 1) % Math.ceil(allLounges.length / 2))
      }, 4000)
    }

    return () => {
      if (loungeInterval.current) clearInterval(loungeInterval.current)
    }
  }, [activeTab])

  // Featured lounges
  const featuredLounges = [
    {
      id: 1,
      name: "Delta One Lounge",
      location: "John F. Kennedy International Airport (JFK)",
      terminal: "Terminal 4",
      rating: 4.9,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JFK-delta-one-lounge-jfk-pr-05-1-1536x1024-NFCyaLzwQ4FwITYJw7s3ifqNd3Ycby.webp",
      status: "Available",
      utilization: 68,
      amenities: ["Premium Dining", "Shower Suites", "Quiet Rooms", "Full-Service Bar"],
      description:
        "Experience unparalleled luxury at Delta's flagship lounge featuring curated dining, premium beverages, and dedicated concierge service.",
      partnerLogo: "https://cdn.brandfetch.io/data/images/idpG7YO0EO/c4b9b8c1-9d9e-4a8c-a0bc-b45bfafa85a7.svg",
      partnerName: "Delta Air Lines",
    },
    {
      id: 2,
      name: "Delta Sky Club Bar",
      location: "John F. Kennedy International Airport (JFK)",
      terminal: "Terminal 4",
      rating: 4.8,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JFK-delta-one-lounge-jfk-pr-03-1-1536x1024-c9MGAR9KsV2cmdfu75S7pLhLRMotJ3.webp",
      status: "High Demand",
      utilization: 82,
      amenities: ["Craft Cocktails", "Premium Wines", "Light Bites", "Barista Service"],
      description:
        "Enjoy handcrafted cocktails and premium beverages in an elegant setting with panoramic airport views and attentive service.",
      partnerLogo: "https://cdn.brandfetch.io/data/images/idpG7YO0EO/c4b9b8c1-9d9e-4a8c-a0bc-b45bfafa85a7.svg",
      partnerName: "Delta Air Lines",
    },
    {
      id: 3,
      name: "Japan Airlines Lounge",
      location: "Los Angeles International Airport (LAX)",
      terminal: "Tom Bradley International Terminal",
      rating: 4.7,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Alaska-Lounge-Seattle-15-oNQmT7hVSAZewTvLqZspP0fLdIpQk4.webp",
      status: "Available",
      utilization: 55,
      amenities: ["Buffet Dining", "Business Center", "Shower Facilities", "Relaxation Areas"],
      description:
        "A tranquil oasis for Japan Airlines premium passengers featuring world-class amenities and authentic Japanese hospitality.",
      partnerLogo: "https://cdn.brandfetch.io/data/images/idVkQIAakg/f1c9d1d0-7c5c-4a5d-a529-2c1a8c500f9a.png",
      partnerName: "Japan Airlines",
    },
    {
      id: 4,
      name: "Centurion Lounge",
      location: "San Francisco International Airport (SFO)",
      terminal: "Terminal 3",
      rating: 4.8,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JFK-delta-one-lounge-jfk-pr-02-1-1536x1024-VV9NajKPWY3KuSiwBQpeOopuyzfCqI.webp",
      status: "Available",
      utilization: 70,
      amenities: ["Chef-Designed Menu", "Premium Bar", "Spa Services", "Family Room"],
      description:
        "American Express's premium lounge offering locally-inspired cuisine, craft beverages, and wellness amenities in an elegant setting.",
      partnerLogo: "https://cdn.brandfetch.io/data/images/idIUOQjTuY/78c14d24-8abb-482c-8b73-6bb7520f9e5a.svg",
      partnerName: "American Express",
    },
  ]

  // All lounges for the lounges tab
  const allLounges = [
    ...featuredLounges,
    {
      id: 5,
      name: "Qatar Airways Al Mourjan",
      location: "Hamad International Airport (DOH)",
      terminal: "Main Terminal",
      rating: 4.9,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Alaska-Lounge-Seattle-34-4KN35BWgEKSrPxHYu5yVfVz7yXpDUg.webp",
      status: "Available",
      utilization: 65,
      amenities: ["Fine Dining", "Private Rooms", "Spa Services", "Business Center"],
      description: "Qatar Airways' flagship lounge offering world-class amenities and exceptional service.",
      partnerLogo: "https://cdn.brandfetch.io/data/images/idVkQIAakg/f1c9d1d0-7c5c-4a5d-a529-2c1a8c500f9a.png",
      partnerName: "Qatar Airways",
    },
    {
      id: 6,
      name: "Emirates First Class Lounge",
      location: "Dubai International Airport (DXB)",
      terminal: "Terminal 3",
      rating: 4.9,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JFK-delta-one-lounge-jfk-pr-02-1-1536x1024-VV9NajKPWY3KuSiwBQpeOopuyzfCqI.webp",
      status: "Premium Access",
      utilization: 60,
      amenities: ["À la carte Dining", "Cigar Lounge", "Spa Treatments", "Direct Boarding"],
      description: "Exclusive sanctuary for Emirates First Class passengers with personalized service.",
      partnerLogo: "https://cdn.brandfetch.io/data/images/idG6s0ZoGv/4a6b8d72-015d-4a61-86cd-b7c1f7b9fa3e.svg",
      partnerName: "Emirates",
    },
    {
      id: 7,
      name: "ANA Suite Lounge",
      location: "Tokyo Haneda Airport (HND)",
      terminal: "International Terminal",
      rating: 4.8,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Alaska-Lounge-Seattle-15-oNQmT7hVSAZewTvLqZspP0fLdIpQk4.webp",
      status: "Available",
      utilization: 55,
      amenities: ["Japanese Cuisine", "Sake Bar", "Shower Suites", "Relaxation Areas"],
      description: "Elegant lounge offering authentic Japanese hospitality and tranquil atmosphere.",
      partnerLogo: "https://cdn.brandfetch.io/data/images/idVkQIAakg/f1c9d1d0-7c5c-4a5d-a529-2c1a8c500f9a.png",
      partnerName: "ANA",
    },
    {
      id: 8,
      name: "Lufthansa First Class Terminal",
      location: "Frankfurt Airport (FRA)",
      terminal: "Dedicated Terminal",
      rating: 4.9,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JFK-delta-one-lounge-jfk-pr-05-1-1536x1024-NFCyaLzwQ4FwITYJw7s3ifqNd3Ycby.webp",
      status: "Exclusive",
      utilization: 45,
      amenities: ["Private Suites", "Gourmet Dining", "Cigar Lounge", "Chauffeur Service"],
      description: "Exclusive terminal for Lufthansa First Class passengers with personalized service.",
      partnerLogo: "https://cdn.brandfetch.io/data/images/idG6s0ZoGv/4a6b8d72-015d-4a61-86cd-b7c1f7b9fa3e.svg",
      partnerName: "Lufthansa",
    },
  ]

  // Analytics data
  const analyticsData = [
    {
      id: 1,
      metric: "Total Visits",
      value: "86",
      change: "+12%",
      positive: true,
      icon: <PiCrownBold className="w-3 h-3" />,
    },
    {
      id: 2,
      metric: "Avg. Duration",
      value: "1.8h",
      change: "+0.2h",
      positive: true,
      icon: <PiClockBold className="w-3 h-3" />,
    },
    {
      id: 3,
      metric: "Success Rate",
      value: "99.1%",
      change: "+0.8%",
      positive: true,
      icon: <PiAirplaneTakeoffBold className="w-3 h-3" />,
    },
    {
      id: 4,
      metric: "Savings",
      value: "$8.2k",
      change: "+15%",
      positive: true,
      icon: <PiTrendUpBold className="w-3 h-3" />,
    },
  ]

  // Team members with access
  const teamMembers = [
    {
      id: 1,
      name: "Alex M.",
      role: "CEO",
      accessLevel: "Premium",
      visits: 12,
      image: "/community/ashton-blackwell.webp",
      deviceStatus: "Active",
      company: "Anthropic",
      companyLogo: "https://cdn.brandfetch.io/data/images/id0qKAFrAY/c0a4fd61-1257-4521-b736-d6df5050070d.png",
      companyName: "Anthropic Inc.",
      lastVisit: "2 hours ago",
      nextTrip: "London, June 15",
      loungesVisited: ["Delta One Lounge (JFK)", "Centurion Lounge (SFO)"],
    },
    {
      id: 2,
      name: "Michael P.",
      role: "CTO",
      accessLevel: "Premium",
      visits: 10,
      image: "/community/jordan-burgess.webp",
      deviceStatus: "Active",
      company: "Anthropic",
      companyLogo: "https://cdn.brandfetch.io/data/images/id0qKAFrAY/c0a4fd61-1257-4521-b736-d6df5050070d.png",
      companyName: "Anthropic Inc.",
      lastVisit: "1 day ago",
      nextTrip: "Berlin, July 3",
      loungesVisited: ["Lufthansa Senator (FRA)", "Delta Sky Club (ATL)"],
    },
    {
      id: 3,
      name: "Sarah J.",
      role: "CPO",
      accessLevel: "Premium",
      visits: 15,
      image: "/community/bec-ferguson.webp",
      deviceStatus: "Active",
      company: "Tesla",
      companyLogo: "https://cdn.brandfetch.io/data/images/idIUOQjTuY/78c14d24-8abb-482c-8b73-6bb7520f9e5a.svg",
      companyName: "Tesla Inc.",
      lastVisit: "5 days ago",
      nextTrip: "Tokyo, August 12",
      loungesVisited: ["ANA Suite Lounge (HND)", "Qantas First (SYD)"],
    },
    {
      id: 4,
      name: "David R.",
      role: "Head of Growth",
      accessLevel: "Standard",
      visits: 6,
      image: "/community/nicolas-trevino.webp",
      deviceStatus: "Active",
      company: "Tesla",
      companyLogo: "https://cdn.brandfetch.io/data/images/idIUOQjTuY/78c14d24-8abb-482c-8b73-6bb7520f9e5a.svg",
      companyName: "Tesla Inc.",
      lastVisit: "1 week ago",
      nextTrip: "Paris, July 22",
      loungesVisited: ["Air France Lounge (CDG)", "British Airways (LHR)"],
    },
    {
      id: 5,
      name: "Emma L.",
      role: "VP Marketing",
      accessLevel: "Premium",
      visits: 8,
      image: "/community/isobel-fuller.webp",
      deviceStatus: "Active",
      company: "Anthropic",
      companyLogo: "https://cdn.brandfetch.io/data/images/id0qKAFrAY/c0a4fd61-1257-4521-b736-d6df5050070d.png",
      companyName: "Anthropic Inc.",
      lastVisit: "3 days ago",
      nextTrip: "Singapore, July 10",
      loungesVisited: ["Singapore Airlines (SIN)", "Cathay Pacific (HKG)"],
    },
    {
      id: 6,
      name: "James W.",
      role: "Sales Director",
      accessLevel: "Standard",
      visits: 5,
      image: "/community/owen-harding.webp",
      deviceStatus: "Inactive",
      company: "Tesla",
      companyLogo: "https://cdn.brandfetch.io/data/images/idIUOQjTuY/78c14d24-8abb-482c-8b73-6bb7520f9e5a.svg",
      companyName: "Tesla Inc.",
      lastVisit: "2 weeks ago",
      nextTrip: "New York, August 5",
      loungesVisited: ["United Club (EWR)", "American Admirals (DFW)"],
    },
  ]

  // Airline partners for showcase
  const airlinePartners = [
    {
      name: "Delta Air Lines",
      logo: "https://cdn.brandfetch.io/data/images/idpG7YO0EO/c4b9b8c1-9d9e-4a8c-a0bc-b45bfafa85a7.svg",
    },
    {
      name: "American Express",
      logo: "https://cdn.brandfetch.io/data/images/idIUOQjTuY/78c14d24-8abb-482c-8b73-6bb7520f9e5a.svg",
    },
    {
      name: "Japan Airlines",
      logo: "https://cdn.brandfetch.io/data/images/idVkQIAakg/f1c9d1d0-7c5c-4a5d-a529-2c1a8c500f9a.png",
    },
    {
      name: "Qatar Airways",
      logo: "https://cdn.brandfetch.io/data/images/idVkQIAakg/f1c9d1d0-7c5c-4a5d-a529-2c1a8c500f9a.png",
    },
    {
      name: "Emirates",
      logo: "https://cdn.brandfetch.io/data/images/idG6s0ZoGv/4a6b8d72-015d-4a61-86cd-b7c1f7b9fa3e.svg",
    },
    {
      name: "ANA",
      logo: "https://cdn.brandfetch.io/data/images/idVkQIAakg/f1c9d1d0-7c5c-4a5d-a529-2c1a8c500f9a.png",
    },
    {
      name: "Lufthansa",
      logo: "https://cdn.brandfetch.io/data/images/idG6s0ZoGv/4a6b8d72-015d-4a61-86cd-b7c1f7b9fa3e.svg",
    },
    {
      name: "JetBlue",
      logo: "https://cdn.brandfetch.io/data/images/idpG7YO0EO/c4b9b8c1-9d9e-4a8c-a0bc-b45bfafa85a7.svg",
    },
    {
      name: "Southwest",
      logo: "https://cdn.brandfetch.io/data/images/idIUOQjTuY/78c14d24-8abb-482c-8b73-6bb7520f9e5a.svg",
    },
    {
      name: "United Airlines",
      logo: "https://cdn.brandfetch.io/data/images/idVkQIAakg/f1c9d1d0-7c5c-4a5d-a529-2c1a8c500f9a.png",
    },
    {
      name: "British Airways",
      logo: "https://cdn.brandfetch.io/data/images/idG6s0ZoGv/4a6b8d72-015d-4a61-86cd-b7c1f7b9fa3e.svg",
    },
  ]

  return (
    <section className="relative py-16 overflow-hidden bg-black/60">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-repeat bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center rounded-xl bg-white/10 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-medium text-white border border-white/20">
              <Image src="/logo/suitpax-cloud-logo.webp" alt="Suitpax" width={16} height={16} className="mr-1.5" />
              Technology by Suitpax
            </span>
            <span className="inline-flex items-center rounded-xl bg-white/10 backdrop-blur-sm px-2.5 py-0.5 text-[9px] font-medium text-white/80 border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-1"></span>
              VIP Access Control
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-white leading-none max-w-4xl">
            VIP Lounge Management for Teams
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-medium text-white/80 max-w-2xl mb-6">
            Streamline executive lounge access with digital credentials and real-time analytics
          </p>

          {/* Títulos alternativos */}
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-[10px] font-medium text-white/70 border border-white/10">
              Global Airport Access
            </span>
            <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-[10px] font-medium text-white/70 border border-white/10">
              Executive Travel Suite
            </span>
            <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-[10px] font-medium text-white/70 border border-white/10">
              Premium Lounge Network
            </span>
          </div>
        </div>

        {/* Featured Lounge Slider */}
        <div className="mb-12 relative">
          <div className="overflow-hidden rounded-xl">
            <div className="relative h-64 md:h-96 w-full">
              <AnimatePresence initial={false}>
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={featuredLounges[currentSlide].image || "/placeholder.svg"}
                    alt={featuredLounges[currentSlide].name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                  <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-md bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <Image
                              src={featuredLounges[currentSlide].partnerLogo || "/placeholder.svg"}
                              alt={featuredLounges[currentSlide].partnerName}
                              width={16}
                              height={16}
                              className="w-4 h-4 object-contain"
                            />
                          </div>
                          <h3 className="text-lg md:text-xl font-medium text-white">
                            {featuredLounges[currentSlide].name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          <PiMapPinBold className="w-3 h-3 text-white/60" />
                          <span className="text-xs text-white/80">{featuredLounges[currentSlide].location}</span>
                        </div>
                        <p className="text-sm text-white/70 max-w-2xl mb-2">
                          {featuredLounges[currentSlide].description}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {featuredLounges[currentSlide].amenities.map((amenity, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-white/80"
                            >
                              <PiCheckCircleBold className="w-2.5 h-2.5 mr-1 text-emerald-400" />
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="hidden md:block">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                            featuredLounges[currentSlide].status === "Available"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : featuredLounges[currentSlide].status === "High Demand"
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                          }`}
                        >
                          {featuredLounges[currentSlide].status}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Slider navigation */}
          <div className="flex justify-center mt-4 gap-2">
            {featuredLounges.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === idx ? "bg-white w-4" : "bg-white/30"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Airline Partners Showcase */}
        <div className="mb-12">
          <h3 className="text-xl font-medium text-white text-center mb-6">Our Premium Airline Partners</h3>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            {airlinePartners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center justify-center"
              >
                <Image
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain"
                />
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <div className="inline-flex items-center px-3 py-1.5 bg-black/60 border border-white/20 text-white text-xs font-medium rounded-xl shadow-sm backdrop-blur-sm hover:bg-black/70 transition-colors">
              +120 lounges worldwide
            </div>
          </div>
        </div>

        {/* CRM Demo UI */}
        <div className="w-full mx-auto">
          <div className="bg-black/40 backdrop-blur-md rounded-xl shadow-lg border border-white/10 overflow-hidden">
            {/* CRM Navigation */}
            <TabNavigation
              tabs={["overview", "lounges", "members", "analytics"]}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />

            {/* CRM Content */}
            <div className="p-3 md:p-4">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Welcome message */}
                    <div className="bg-black/30 rounded-xl border border-white/10 p-3">
                      <div className="flex items-start gap-3">
                        <div className="relative h-10 w-10 rounded-md overflow-hidden flex-shrink-0 border border-white/10">
                          <Image src="/agents/agent-5.png" alt="AI Agent" fill className="object-cover" />
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-white">Hey, welcome back Alex!</h3>
                          <p className="text-xs text-white/60 mt-1">
                            You have 3 upcoming trips and 2 lounge access passes expiring soon.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {analyticsData.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: item.id * 0.1 }}
                          className="bg-black/40 backdrop-blur-md rounded-lg border border-white/10 p-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="w-5 h-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
                              {item.icon}
                            </div>
                            <span
                              className={`text-[9px] font-medium ${item.positive ? "text-emerald-400" : "text-red-400"}`}
                            >
                              {item.change}
                            </span>
                          </div>
                          <div className="mt-1">
                            <p className="text-[10px] text-white/60">{item.metric}</p>
                            <h4 className="text-sm font-bold text-white">{item.value}</h4>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* AI Agents Analytics */}
                    <div className="bg-black/30 rounded-xl border border-white/10 p-3">
                      <h3 className="text-xs font-medium text-white mb-2">AI Travel Agents</h3>
                      <div className="flex items-start gap-2 mb-3">
                        <div className="relative h-8 w-8 rounded-md overflow-hidden flex-shrink-0 border border-white/10">
                          <Image src="/agents/agent-10.png" alt="AI Agent" fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] text-white/80">
                            Our AI agents have optimized your lounge access based on your travel patterns and
                            preferences.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                          <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-white/80">
                            <PiAirplaneTakeoffBold className="w-3 h-3" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-white">Smart Recommendations</p>
                            <p className="text-[9px] text-white/60">
                              3 new lounge recommendations for your upcoming trips
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "lounges" && (
                  <motion.div
                    key="lounges"
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white">Available Premium Lounges</h3>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.ceil(allLounges.length / 2) }).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentLoungePage(idx)}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              currentLoungePage === idx ? "bg-white" : "bg-white/30"
                            }`}
                            aria-label={`Go to lounge page ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="relative h-[320px]">
                      <AnimatePresence initial={false} mode="wait">
                        <motion.div
                          key={`lounge-page-${currentLoungePage}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-full">
                            {allLounges.slice(currentLoungePage * 2, currentLoungePage * 2 + 2).map((lounge, index) => (
                              <div
                                key={lounge.id}
                                className="bg-black/30 rounded-xl border border-white/10 overflow-hidden flex flex-col"
                              >
                                <div className="relative h-32">
                                  <Image
                                    src={lounge.image || "/placeholder.svg"}
                                    alt={lounge.name}
                                    fill
                                    className="object-cover"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                  <div className="absolute bottom-0 left-0 p-2">
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-5 h-5 rounded-md bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <Image
                                          src={lounge.partnerLogo || "/placeholder.svg"}
                                          alt={lounge.partnerName}
                                          width={12}
                                          height={12}
                                          className="w-3 h-3 object-contain"
                                        />
                                      </div>
                                      <h3 className="text-sm font-medium text-white">{lounge.name}</h3>
                                    </div>
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <PiMapPinBold className="w-2.5 h-2.5 text-white/60" />
                                      <span className="text-[10px] text-white/80">{lounge.location}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="p-2 flex-1 flex flex-col justify-between">
                                  <div>
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-1">
                                        <PiAirplaneTakeoffBold className="w-2.5 h-2.5 text-white/60" />
                                        <span className="text-[10px] text-white/60">{lounge.terminal}</span>
                                      </div>
                                      <span
                                        className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                                          lounge.status === "Available"
                                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                            : lounge.status === "High Demand"
                                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                              : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                                        }`}
                                      >
                                        {lounge.status}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {lounge.amenities.slice(0, 2).map((amenity, idx) => (
                                        <span
                                          key={idx}
                                          className="inline-flex items-center rounded-full bg-white/5 px-1.5 py-0.5 text-[8px] font-medium text-white/70"
                                        >
                                          <PiCheckCircleBold className="w-2 h-2 mr-0.5 text-emerald-400" />
                                          {amenity}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="mt-2">
                                    <div className="flex justify-between items-center text-[10px]">
                                      <span className="text-white/60">Current Utilization</span>
                                      <span className="text-white font-medium">{lounge.utilization}%</span>
                                    </div>
                                    <div className="w-full h-0.5 bg-white/5 rounded-full mt-1 overflow-hidden">
                                      <div
                                        className="h-full bg-white/60 rounded-full"
                                        style={{ width: `${lounge.utilization}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <div className="bg-black/30 rounded-xl border border-white/10 p-3 mt-4">
                      <h3 className="text-xs font-medium text-white mb-2">AI Lounge Recommendations</h3>
                      <div className="flex items-start gap-2">
                        <div className="relative h-8 w-8 rounded-md overflow-hidden flex-shrink-0 border border-white/10">
                          <Image src="/agents/agent-12.png" alt="AI Agent" fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] text-white/80">
                            Based on your upcoming trip to Tokyo, I recommend booking the ANA Suite Lounge at Haneda
                            Airport. It has excellent reviews and matches your preference for quiet workspaces.
                          </p>
                          <button className="mt-2 text-[9px] bg-white/10 hover:bg-white/15 text-white px-2 py-0.5 rounded-md transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "members" && (
                  <motion.div
                    key="members"
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white">Team Access Management</h3>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.ceil(teamMembers.length / 2) }).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentMemberPage(idx)}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              currentMemberPage === idx ? "bg-white" : "bg-white/30"
                            }`}
                            aria-label={`Go to member page ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="relative h-[280px]">
                      <AnimatePresence initial={false} mode="wait">
                        <motion.div
                          key={`member-page-${currentMemberPage}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-full">
                            {teamMembers
                              .slice(currentMemberPage * 2, currentMemberPage * 2 + 2)
                              .map((member, index) => (
                                <div
                                  key={member.id}
                                  className="bg-black/30 rounded-xl border border-white/10 p-3 flex flex-col"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
                                      <Image
                                        src={member.image || "/placeholder.svg"}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <h4 className="text-sm font-medium text-white">{member.name}</h4>
                                        <span className="flex items-center justify-center w-4 h-4 rounded-md bg-white/10">
                                          <Image
                                            src={member.companyLogo || "/placeholder.svg"}
                                            alt={member.companyName}
                                            width={12}
                                            height={12}
                                            className="w-3 h-3 object-contain"
                                          />
                                        </span>
                                      </div>
                                      <p className="text-[10px] text-white/60">
                                        {member.role} • {member.companyName}
                                      </p>
                                    </div>
                                    <span
                                      className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                                        member.accessLevel === "Premium"
                                          ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                      }`}
                                    >
                                      {member.accessLevel}
                                    </span>
                                  </div>

                                  <div className="mt-3 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1.5">
                                        <PiCrownBold className="w-2.5 h-2.5 text-white/40" />
                                        <span className="text-[10px] text-white/60">{member.visits} visits</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span
                                          className={`inline-flex items-center rounded-full w-1.5 h-1.5 ${
                                            member.deviceStatus === "Active" ? "bg-emerald-500" : "bg-amber-500"
                                          }`}
                                        ></span>
                                        <span className="text-[10px] text-white/60">{member.deviceStatus}</span>
                                      </div>
                                    </div>

                                    <div className="bg-black/20 rounded-lg p-2">
                                      <div className="flex items-center gap-1 mb-1">
                                        <PiClockBold className="w-2.5 h-2.5 text-white/40" />
                                        <span className="text-[10px] font-medium text-white/80">Recent Activity</span>
                                      </div>
                                      <p className="text-[9px] text-white/60">
                                        Last visit: {member.lastVisit} • {member.loungesVisited[0]}
                                      </p>
                                    </div>

                                    <div className="bg-black/20 rounded-lg p-2">
                                      <div className="flex items-center gap-1 mb-1">
                                        <PiCalendarCheckBold className="w-2.5 h-2.5 text-white/40" />
                                        <span className="text-[10px] font-medium text-white/80">Upcoming Travel</span>
                                      </div>
                                      <p className="text-[9px] text-white/60">{member.nextTrip}</p>
                                    </div>
                                  </div>

                                  <div className="mt-auto pt-2 flex justify-end">
                                    <button className="text-[9px] bg-white/10 hover:bg-white/15 text-white px-2 py-0.5 rounded-md transition-colors">
                                      Manage Access
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <div className="bg-black/30 rounded-xl border border-white/10 p-3 mt-4">
                      <h3 className="text-xs font-medium text-white mb-2">Team Access Overview</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-black/20 rounded-lg p-2">
                          <p className="text-[10px] text-white/60">Active Members</p>
                          <p className="text-sm font-medium text-white">5/6</p>
                          <div className="w-full h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-emerald-500/60 rounded-full" style={{ width: "83%" }}></div>
                          </div>
                        </div>
                        <div className="bg-black/20 rounded-lg p-2">
                          <p className="text-[10px] text-white/60">Premium Access</p>
                          <p className="text-sm font-medium text-white">4/6</p>
                          <div className="w-full h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-indigo-500/60 rounded-full" style={{ width: "67%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "analytics" && (
                  <motion.div
                    key="analytics"
                    className="content-analytics"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-black/30 rounded-xl border border-white/10 p-3">
                        <h3 className="text-xs font-medium text-white mb-2">AI-Powered Lounge Access</h3>
                        <div className="flex items-start gap-2 mb-3">
                          <div className="relative h-8 w-8 rounded-md overflow-hidden flex-shrink-0 border border-white/10">
                            <Image src="/agents/agent-10.png" alt="AI Agent" fill className="object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] text-white/80">
                              Our AI agents can automatically book lounge access based on your travel schedule,
                              preferences, and availability.
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                            <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-white/80">
                              <PiAirplaneTakeoffBold className="w-3 h-3" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-white">Flight Monitoring</p>
                              <p className="text-[9px] text-white/60">
                                Automatically adjusts lounge bookings if flights are delayed
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                            <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-white/80">
                              <PiCrownBold className="w-3 h-3" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-white">Priority Access</p>
                              <p className="text-[9px] text-white/60">
                                Secures premium spots during high-demand periods
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-black/30 rounded-xl border border-white/10 p-3">
                        <h3 className="text-xs font-medium text-white mb-2">Team Membership Management</h3>
                        <div className="flex items-start gap-2 mb-3">
                          <div className="relative h-8 w-8 rounded-md overflow-hidden flex-shrink-0 border border-white/10">
                            <Image src="/agents/agent-12.png" alt="AI Agent" fill className="object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] text-white/80">
                              AI agents help manage team memberships, optimize usage, and ensure compliance with company
                              travel policies.
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                            <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-white/80">
                              <PiClockBold className="w-3 h-3" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-white">Usage Optimization</p>
                              <p className="text-[9px] text-white/60">Analyzes patterns to maximize membership value</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                            <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-white/80">
                              <PiTrendUpBold className="w-3 h-3" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-white">Cost Management</p>
                              <p className="text-[9px] text-white/60">
                                Identifies savings opportunities across global locations
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VIPMembership
