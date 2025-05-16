"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import {
  PiTrendUpBold,
  PiAirplaneTakeoffBold,
  PiMapPinBold,
  PiClockBold,
  PiCalendarBold,
  PiUsersBold,
  PiBuildingsBold,
  PiEnvelopeBold,
  PiChartLineUpBold,
  PiCurrencyDollarBold,
} from "react-icons/pi"
import { SiUnitedairlines, SiBritishairways, SiOpenai, SiTesla } from "react-icons/si"

// Import modular components
import { TabNavigation } from "../ui-crm/tab-navigation"

// Tipos de datos para las diferentes secciones
type EmailTemplate = {
  id: number
  subject: string
  preview: string
  type: "travel" | "meeting" | "investment" | "report"
  icon: React.ReactNode
}

type FlightInfo = {
  id: number
  from: string
  fromCity: string
  to: string
  toCity: string
  date: string
  airline: string
  airlineIcon: React.ReactNode
  status: string
  flightNumber: string
  duration: string
  connected?: boolean
}

type MeetingInfo = {
  id: number
  title: string
  date: string
  time: string
  attendees: number
  location: string
  type: "in-person" | "virtual"
  company?: string
  companyLogo?: string
}

type InvestmentOpportunity = {
  id: number
  company: string
  logo: React.ReactNode
  stage: string
  sector: string
  location: string
  amount: string
  progress: number
}

// Datos de ejemplo
const emailTemplates: EmailTemplate[] = [
  {
    id: 1,
    subject: "Your upcoming flight to San Francisco",
    preview: "Your flight details for tomorrow's trip to the investor meeting...",
    type: "travel",
    icon: <PiAirplaneTakeoffBold className="w-3 h-3" />,
  },
  {
    id: 2,
    subject: "Quarterly investment review",
    preview: "Here's a summary of this quarter's portfolio performance...",
    type: "investment",
    icon: <PiChartLineUpBold className="w-3 h-3" />,
  },
  {
    id: 3,
    subject: "Team meeting: Startup pitch preparation",
    preview: "Let's finalize our pitch deck for the upcoming VC meeting...",
    type: "meeting",
    icon: <PiUsersBold className="w-3 h-3" />,
  },
  {
    id: 4,
    subject: "Travel expense report ready",
    preview: "Your expense report for the NYC trip has been processed...",
    type: "report",
    icon: <PiCurrencyDollarBold className="w-3 h-3" />,
  },
]

const flightInfo: FlightInfo[] = [
  {
    id: 1,
    from: "SFO",
    fromCity: "San Francisco",
    to: "JFK",
    toCity: "New York",
    date: "May 15, 2025",
    airline: "United Airlines",
    airlineIcon: <SiUnitedairlines className="w-3 h-3 text-white" />,
    status: "Confirmed",
    flightNumber: "UA2478",
    duration: "5h 30m",
    connected: true,
  },
  {
    id: 2,
    from: "LAX",
    fromCity: "Los Angeles",
    to: "LHR",
    toCity: "London",
    date: "May 20, 2025",
    airline: "British Airways",
    airlineIcon: <SiBritishairways className="w-3 h-3 text-white" />,
    status: "Pending",
    flightNumber: "BA282",
    duration: "10h 45m",
  },
]

const meetingInfo: MeetingInfo[] = [
  {
    id: 1,
    title: "Pitch to Andreessen Horowitz",
    date: "May 16, 2025",
    time: "10:00 AM",
    attendees: 8,
    location: "Menlo Park, CA",
    type: "in-person",
    company: "a16z",
    companyLogo: "https://cdn.brandfetch.io/a16z.com/w/512/h/117/logo?c=1idU-l8vdm7C5__3dci",
  },
  {
    id: 2,
    title: "Team Sync: Investment Strategy",
    date: "May 18, 2025",
    time: "2:00 PM",
    attendees: 5,
    location: "Zoom",
    type: "virtual",
  },
]

const investmentOpportunities: InvestmentOpportunity[] = [
  {
    id: 1,
    company: "NeuralTech AI",
    logo: <SiOpenai className="w-4 h-4 text-white" />,
    stage: "Series A",
    sector: "Artificial Intelligence",
    location: "Boston, MA",
    amount: "$5M",
    progress: 75,
  },
  {
    id: 2,
    company: "GreenMobility",
    logo: <SiTesla className="w-4 h-4 text-white" />,
    stage: "Seed",
    sector: "Sustainable Transport",
    location: "Berlin, Germany",
    amount: "$1.2M",
    progress: 40,
  },
]

// Analytics data
const analyticsData = [
  {
    id: 1,
    metric: "Total Flights",
    value: "24",
    change: "+8%",
    positive: true,
    icon: <PiAirplaneTakeoffBold className="w-3 h-3" />,
  },
  {
    id: 2,
    metric: "Meetings",
    value: "18",
    change: "+12%",
    positive: true,
    icon: <PiUsersBold className="w-3 h-3" />,
  },
  {
    id: 3,
    metric: "Investments",
    value: "5",
    change: "+2",
    positive: true,
    icon: <PiBuildingsBold className="w-3 h-3" />,
  },
  {
    id: 4,
    metric: "ROI",
    value: "32%",
    change: "+5%",
    positive: true,
    icon: <PiTrendUpBold className="w-3 h-3" />,
  },
]

export const VCTravel = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [animateChart, setAnimateChart] = useState(false)
  const [animateDeals, setAnimateDeals] = useState(false)

  // Trigger animations after component mounts
  useEffect(() => {
    const timer1 = setTimeout(() => setAnimateChart(true), 500)
    const timer2 = setTimeout(() => setAnimateDeals(true), 1000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

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
              VC Travel Suite
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-white leading-none">
            Venture Capital Travel Management
          </h2>
          <p className="mt-3 text-sm font-medium text-white/80 max-w-2xl mb-6">
            Streamline investor meetings, portfolio company visits, and team travel with AI-powered coordination
          </p>

          {/* Títulos alternativos */}
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <span className="inline-flex items-center rounded-xl bg-white/5 px-3 py-1 text-[10px] font-medium text-white/70 border border-white/10">
              Portfolio Company Visits
            </span>
            <span className="inline-flex items-center rounded-xl bg-white/5 px-3 py-1 text-[10px] font-medium text-white/70 border border-white/10">
              Investor Relations
            </span>
            <span className="inline-flex items-center rounded-xl bg-white/5 px-3 py-1 text-[10px] font-medium text-white/70 border border-white/10">
              Deal Flow Management
            </span>
          </div>
        </div>

        {/* CRM Demo UI */}
        <div className="w-full mx-auto">
          <div className="bg-black/40 backdrop-blur-md rounded-xl shadow-lg border border-white/10 overflow-hidden">
            {/* CRM Navigation */}
            <TabNavigation
              tabs={["overview", "flights", "meetings", "investments"]}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />

            {/* CRM Content */}
            <div className="p-3 md:p-4 overflow-hidden">
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
                          <h3 className="text-base font-medium text-white">Welcome, Team!</h3>
                          <p className="text-xs text-white/60 mt-1">
                            You have 2 upcoming investor meetings and 3 portfolio company visits this month.
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

                    {/* Email example */}
                    <div className="bg-black/30 rounded-xl border border-white/10 p-3">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center text-white">
                            <PiEnvelopeBold className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-white">New Investment Opportunity</h3>
                            <p className="text-[10px] text-white/60">To: Investment Committee</p>
                          </div>
                        </div>
                        <span className="text-[9px] text-white/60">Just now</span>
                      </div>

                      <div className="bg-black/20 rounded-lg p-3 border border-white/10 mb-3">
                        <p className="text-xs mb-2 text-white">
                          <span className="font-medium">Subject:</span> Potential Investment in TechVenture AI
                        </p>
                        <p className="text-[10px] text-white/70 mb-3">
                          Dear Investment Committee,
                          <br />
                          <br />I hope this email finds you well. I wanted to bring to your attention an exciting
                          investment opportunity in TechVenture AI, a promising startup in the artificial intelligence
                          space.
                          <br />
                          <br />
                          Their innovative approach to natural language processing has shown remarkable results, with a
                          40% improvement over industry standards. The founding team has a strong background from MIT
                          and Google AI.
                          <br />
                          <br />
                          I've scheduled a meeting for next Tuesday at 2 PM to discuss this opportunity further. All
                          relevant documents are attached.
                          <br />
                          <br />
                          Best regards,
                          <br />
                          Team
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="bg-white/10 rounded-xl px-2 py-1 text-[9px] flex items-center gap-1 text-white/80">
                            <PiCalendarBold className="w-2.5 h-2.5" />
                            <span>Meeting scheduled</span>
                          </div>
                          <div className="bg-white/10 rounded-xl px-2 py-1 text-[9px] flex items-center gap-1 text-white/80">
                            <PiTrendUpBold className="w-2.5 h-2.5" />
                            <span>Documents attached</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div className="flex gap-2">
                          <button className="bg-white/10 hover:bg-white/20 text-white text-[9px] px-3 py-1 rounded-xl border border-white/20">
                            Send Now
                          </button>
                          <button className="bg-black/30 text-white border border-white/20 text-[9px] px-3 py-1 rounded-xl">
                            Edit
                          </button>
                        </div>
                        <div className="text-[9px] text-white/60 flex items-center">
                          <span>AI generated</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1"></div>
                        </div>
                      </div>
                    </div>

                    {/* Upcoming activity */}
                    <div className="bg-black/30 rounded-xl border border-white/10 p-3">
                      <h3 className="text-xs font-medium text-white mb-2">Upcoming Activity</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                          <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white overflow-hidden">
                            <Image
                              src="https://cdn.brandfetch.io/a16z.com/w/512/h/117/logo?c=1idU-l8vdm7C5__3dci"
                              alt="Andreessen Horowitz"
                              width={16}
                              height={16}
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-white">Andreessen Horowitz Meeting</p>
                            <div className="flex items-center gap-1 text-[9px] text-white/60">
                              <PiCalendarBold className="w-2.5 h-2.5" />
                              <span>May 16, 2025</span>
                              <span>•</span>
                              <PiClockBold className="w-2.5 h-2.5" />
                              <span>10:00 AM</span>
                            </div>
                          </div>
                          <span className="inline-flex items-center rounded-xl bg-indigo-500/20 px-2 py-0.5 text-[9px] font-medium text-indigo-400 border border-indigo-500/30">
                            In-person
                          </span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                          <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white">
                            <SiUnitedairlines className="w-3 h-3" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-white">Flight to New York</p>
                            <div className="flex items-center gap-1 text-[9px] text-white/60">
                              <PiAirplaneTakeoffBold className="w-2.5 h-2.5" />
                              <span>UA2478</span>
                              <span>•</span>
                              <PiCalendarBold className="w-2.5 h-2.5" />
                              <span>May 15, 2025</span>
                            </div>
                          </div>
                          <span className="inline-flex items-center rounded-xl bg-emerald-500/20 px-2 py-0.5 text-[9px] font-medium text-emerald-400 border border-emerald-500/30">
                            Confirmed
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "flights" && (
                  <motion.div
                    key="flights"
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {flightInfo.map((flight, index) => (
                        <motion.div
                          key={flight.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-black/30 rounded-xl border border-white/10 overflow-hidden"
                        >
                          <div className="p-3 border-b border-white/10 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
                                {flight.airlineIcon}
                              </div>
                              <span className="text-xs font-medium text-white">{flight.flightNumber}</span>
                            </div>
                            <span
                              className={`inline-flex items-center rounded-xl px-2 py-0.5 text-[9px] font-medium ${
                                flight.status === "Confirmed"
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              }`}
                            >
                              {flight.status}
                            </span>
                          </div>
                          <div className="p-3">
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-center">
                                <p className="text-xl font-bold text-white">{flight.from}</p>
                                <p className="text-[9px] text-white/60">{flight.fromCity}</p>
                              </div>
                              <div className="flex-1 px-4">
                                <div className="relative">
                                  <div className="h-0.5 bg-white/10 absolute top-1/2 w-full"></div>
                                  <div className="flex justify-between relative">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-center">
                                <p className="text-xl font-bold text-white">{flight.to}</p>
                                <p className="text-[9px] text-white/60">{flight.toCity}</p>
                              </div>
                            </div>
                            <div className="flex justify-between text-[9px] text-white/60">
                              <div className="flex items-center gap-1">
                                <PiCalendarBold className="w-2.5 h-2.5" />
                                <span>{flight.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <PiClockBold className="w-2.5 h-2.5" />
                                <span>{flight.duration}</span>
                              </div>
                              <div>{flight.airline}</div>
                            </div>
                            {flight.connected && (
                              <div className="mt-2 p-1.5 bg-black/30 rounded-lg border border-white/10">
                                <div className="flex items-center gap-1.5">
                                  <span className="flex items-center justify-center w-4 h-4 rounded-md bg-white/10 overflow-hidden">
                                    <Image
                                      src="https://cdn.brandfetch.io/a16z.com/w/512/h/117/logo?c=1idU-l8vdm7C5__3dci"
                                      alt="Andreessen Horowitz"
                                      width={12}
                                      height={12}
                                      className="object-contain"
                                    />
                                  </span>
                                  <span className="text-[9px] text-white/80">
                                    Connected to Andreessen Horowitz meeting
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="bg-black/40 p-2 border-t border-white/10 flex justify-between items-center">
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                              <span className="text-[9px] text-white/60">AI monitored</span>
                            </div>
                            <button className="text-[9px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded-xl border border-white/20">
                              View Details
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Quick actions */}
                    <div className="grid grid-cols-2 gap-3">
                      <button className="bg-black/30 border border-white/10 p-2 rounded-xl text-[10px] font-medium text-white flex items-center justify-center gap-2 hover:bg-black/40 transition-colors">
                        <PiAirplaneTakeoffBold className="w-3 h-3" />
                        Book New Flight
                      </button>
                      <button className="bg-black/30 border border-white/10 p-2 rounded-xl text-[10px] font-medium text-white flex items-center justify-center gap-2 hover:bg-black/40 transition-colors">
                        <PiUsersBold className="w-3 h-3" />
                        Team Travel
                      </button>
                    </div>

                    {/* AI insights */}
                    <div className="bg-black/30 rounded-xl border border-white/10 p-3">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="relative h-8 w-8 rounded-md overflow-hidden flex-shrink-0 border border-white/10">
                          <Image src="/agents/agent-10.png" alt="AI Agent" fill className="object-cover" />
                        </div>
                        <div>
                          <h3 className="text-xs font-medium text-white">Travel Insights</h3>
                          <p className="text-[9px] text-white/60">AI-powered recommendations</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-white/70 mb-3">
                        Based on your upcoming meeting with Andreessen Horowitz, I've identified a potential flight
                        delay risk due to weather conditions. Would you like me to suggest alternative options or
                        arrange for a backup virtual meeting setup?
                      </p>
                      <div className="flex gap-2">
                        <button className="bg-white/10 hover:bg-white/20 text-white text-[9px] px-3 py-1 rounded-xl border border-white/20">
                          Show Alternatives
                        </button>
                        <button className="bg-black/30 text-white border border-white/20 text-[9px] px-3 py-1 rounded-xl">
                          Setup Virtual Backup
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "meetings" && (
                  <motion.div
                    key="meetings"
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Meeting cards */}
                    <div className="space-y-3">
                      {meetingInfo.map((meeting, index) => (
                        <motion.div
                          key={meeting.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-black/30 rounded-xl border border-white/10 overflow-hidden"
                        >
                          <div className="p-3 border-b border-white/10 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {meeting.companyLogo ? (
                                <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center overflow-hidden">
                                  <Image
                                    src={meeting.companyLogo || "/placeholder.svg"}
                                    alt={meeting.company || "Company"}
                                    width={16}
                                    height={16}
                                    className="object-contain"
                                  />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white">
                                  <PiUsersBold className="w-3 h-3" />
                                </div>
                              )}
                              <span className="text-xs font-medium text-white">{meeting.title}</span>
                            </div>
                            <span
                              className={`inline-flex items-center rounded-xl px-2 py-0.5 text-[9px] font-medium ${
                                meeting.type === "in-person"
                                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                                  : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                              }`}
                            >
                              {meeting.type === "in-person" ? "In-person" : "Virtual"}
                            </span>
                          </div>
                          <div className="p-3">
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <div className="flex items-center gap-2">
                                <PiCalendarBold className="w-3 h-3 text-white/60" />
                                <div>
                                  <p className="text-[9px] text-white/60">Date</p>
                                  <p className="text-xs font-medium text-white">{meeting.date}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <PiClockBold className="w-3 h-3 text-white/60" />
                                <div>
                                  <p className="text-[9px] text-white/60">Time</p>
                                  <p className="text-xs font-medium text-white">{meeting.time}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <PiUsersBold className="w-3 h-3 text-white/60" />
                                <div>
                                  <p className="text-[9px] text-white/60">Attendees</p>
                                  <p className="text-xs font-medium text-white">{meeting.attendees} people</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <PiMapPinBold className="w-3 h-3 text-white/60" />
                                <div>
                                  <p className="text-[9px] text-white/60">Location</p>
                                  <p className="text-xs font-medium text-white">{meeting.location}</p>
                                </div>
                              </div>
                            </div>
                            {meeting.type === "in-person" && (
                              <div className="bg-black/40 rounded-lg p-2 text-[9px] flex items-center justify-between">
                                <span className="text-white/70">Travel arrangements required</span>
                                <button className="text-white/90 hover:text-white">Book Now</button>
                              </div>
                            )}
                          </div>
                          <div className="bg-black/40 p-2 border-t border-white/10 flex justify-between items-center">
                            <div className="flex -space-x-2">
                              {[1, 2, 3].map((i) => (
                                <div
                                  key={i}
                                  className="w-5 h-5 rounded-full bg-white/10 border border-black/40 flex items-center justify-center text-[8px] text-white"
                                >
                                  {i}
                                </div>
                              ))}
                              {meeting.attendees > 3 && (
                                <div className="w-5 h-5 rounded-full bg-emerald-950/80 border border-black/40 flex items-center justify-center text-[8px] text-white">
                                  +{meeting.attendees - 3}
                                </div>
                              )}
                            </div>
                            <button className="text-[9px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded-xl border border-white/20">
                              Prepare
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* AI meeting assistant */}
                    <div className="bg-black/30 rounded-xl border border-white/10 p-3">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="relative h-8 w-8 rounded-md overflow-hidden flex-shrink-0 border border-white/10">
                          <Image src="/agents/agent-12.png" alt="AI Agent" fill className="object-cover" />
                        </div>
                        <div>
                          <h3 className="text-xs font-medium text-white">Meeting Assistant</h3>
                          <p className="text-[9px] text-white/60">AI-powered preparation</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-white/70 mb-3">
                        I've prepared a briefing for your meeting with Andreessen Horowitz. Would you like me to:
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                          <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-white/80">
                            <PiTrendUpBold className="w-2.5 h-2.5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] font-medium text-white">Generate market analysis</p>
                            <p className="text-[9px] text-white/60">Latest trends in AI investment landscape</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                          <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-white/80">
                            <PiBuildingsBold className="w-2.5 h-2.5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] font-medium text-white">Prepare portfolio overview</p>
                            <p className="text-[9px] text-white/60">Summary of your current investments</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "investments" && (
                  <motion.div
                    key="investments"
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Investment cards */}
                    <div className="space-y-3">
                      {investmentOpportunities.map((investment, index) => (
                        <motion.div
                          key={investment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-black/30 rounded-xl border border-white/10 overflow-hidden"
                        >
                          <div className="p-3">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                <div className="relative h-8 w-8 rounded-md overflow-hidden flex-shrink-0 border border-white/10 bg-black/50 flex items-center justify-center">
                                  {investment.logo}
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-white">{investment.company}</h4>
                                  <p className="text-[9px] text-white/60">{investment.sector}</p>
                                </div>
                              </div>
                              <span className="inline-flex items-center rounded-xl bg-white/10 px-2 py-0.5 text-[9px] font-medium text-white/80 border border-white/20">
                                {investment.stage}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-3 mb-3 text-[9px]">
                              <div>
                                <p className="text-white/60">Location</p>
                                <p className="font-medium text-white">{investment.location}</p>
                              </div>
                              <div>
                                <p className="text-white/60">Seeking</p>
                                <p className="font-medium text-white">{investment.amount}</p>
                              </div>
                              <div>
                                <p className="text-white/60">Due Diligence</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-white rounded-full"
                                      style={{ width: `${investment.progress}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-white">{investment.progress}%</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="flex-1 bg-white/10 hover:bg-white/20 text-white text-[9px] px-3 py-1 rounded-xl border border-white/20">
                                Review Documents
                              </button>
                              <button className="flex-1 bg-black/30 text-white border border-white/20 text-[9px] px-3 py-1 rounded-xl">
                                Schedule Meeting
                              </button>
                            </div>
                          </div>
                          <div className="bg-black/40 p-2 border-t border-white/10 flex justify-between items-center text-[9px]">
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                              <span className="text-white/60">AI analysis available</span>
                            </div>
                            <span className="text-white/60">Added 2 days ago</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* AI insights */}
                    <div className="bg-black/30 rounded-xl border border-white/10 p-3">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="relative h-8 w-8 rounded-md overflow-hidden flex-shrink-0 border border-white/10">
                          <Image src="/agents/agent-13.png" alt="AI Agent" fill className="object-cover" />
                        </div>
                        <div>
                          <h3 className="text-xs font-medium text-white">Suitpax AI Insights</h3>
                          <p className="text-[9px] text-white/60">Investment recommendations</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-white/70 mb-3">
                        Based on your portfolio and market trends, NeuralTech AI shows strong potential with a 78%
                        compatibility score. Their technology aligns with your focus on AI infrastructure.
                      </p>
                      <div className="flex justify-end">
                        <button className="text-[9px] text-white/90 hover:text-white font-medium">
                          View Full Analysis
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mt-12">
          <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <p className="text-3xl font-medium text-white">24/7</p>
            <p className="text-xs text-white/60">AI assistance</p>
          </div>
          <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <p className="text-3xl font-medium text-white">100%</p>
            <p className="text-xs text-white/60">Travel management</p>
          </div>
          <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <p className="text-3xl font-medium text-white">50+</p>
            <p className="text-xs text-white/60">VC firms using Suitpax</p>
          </div>
          <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <p className="text-3xl font-medium text-white">85%</p>
            <p className="text-xs text-white/60">Time saved on admin tasks</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-white/80 mb-4">Streamline your venture operations with Suitpax</p>
          <button className="inline-flex items-center rounded-xl bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors border border-white/20">
            Request Demo
          </button>
        </div>
      </div>
    </section>
  )
}

export default VCTravel
