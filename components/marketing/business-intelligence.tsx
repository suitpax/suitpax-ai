"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import {
  PiTrendUpBold,
  PiPhoneBold,
  PiEnvelopeBold,
  PiUsersBold,
  PiCalendarBold,
  PiClockBold,
  PiChartLineUpBold,
  PiChartBarBold,
  PiChatTextBold,
  PiTagBold,
  PiMagnifyingGlassBold,
  PiPlusBold,
  PiArrowRightBold,
  PiCaretDownBold,
  PiCaretUpBold,
  PiDotsThreeBold,
  PiMapPinBold,
} from "react-icons/pi"

// Tipos de datos para las diferentes secciones
type Lead = {
  id: number
  name: string
  company: string
  position: string
  email: string
  phone: string
  status: "new" | "contacted" | "qualified" | "proposal" | "closed"
  score: number
  lastActivity: string
  avatar?: string
}

type Call = {
  id: number
  contact: string
  company: string
  date: string
  time: string
  duration: string
  status: "scheduled" | "completed" | "missed"
  notes?: string
  avatar?: string
}

type Email = {
  id: number
  subject: string
  recipient: string
  company: string
  sentDate: string
  status: "sent" | "opened" | "replied" | "bounced"
  openRate?: number
  avatar?: string
}

type Meeting = {
  id: number
  title: string
  attendees: string[]
  date: string
  time: string
  location: string
  type: "in-person" | "virtual"
  status: "upcoming" | "completed" | "canceled"
}

type AnalyticsStat = {
  id: number
  label: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
}

// Datos de ejemplo
const leadsData: Lead[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "TechVision Inc.",
    position: "Marketing Director",
    email: "sarah.j@techvision.com",
    phone: "+1 (555) 123-4567",
    status: "qualified",
    score: 85,
    lastActivity: "2 hours ago",
    avatar: "/agents/agent-5.png",
  },
  {
    id: 2,
    name: "Michael Chen",
    company: "Innovate Solutions",
    position: "CTO",
    email: "m.chen@innovatesol.com",
    phone: "+1 (555) 987-6543",
    status: "contacted",
    score: 72,
    lastActivity: "1 day ago",
    avatar: "/agents/agent-10.png",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    company: "Global Enterprises",
    position: "CEO",
    email: "e.rodriguez@globalent.com",
    phone: "+1 (555) 456-7890",
    status: "new",
    score: 65,
    lastActivity: "3 days ago",
    avatar: "/agents/agent-12.png",
  },
]

const callsData: Call[] = [
  {
    id: 1,
    contact: "Sarah Johnson",
    company: "TechVision Inc.",
    date: "Today",
    time: "2:30 PM",
    duration: "25 min",
    status: "scheduled",
    avatar: "/agents/agent-5.png",
  },
  {
    id: 2,
    contact: "Michael Chen",
    company: "Innovate Solutions",
    date: "Yesterday",
    time: "11:00 AM",
    duration: "15 min",
    status: "completed",
    notes: "Discussed new product features, follow up next week",
    avatar: "/agents/agent-10.png",
  },
  {
    id: 3,
    contact: "Emma Rodriguez",
    company: "Global Enterprises",
    date: "May 10, 2025",
    time: "3:45 PM",
    duration: "30 min",
    status: "missed",
    notes: "No answer, reschedule for next week",
    avatar: "/agents/agent-12.png",
  },
]

const emailsData: Email[] = [
  {
    id: 1,
    subject: "Follow-up on our conversation",
    recipient: "Sarah Johnson",
    company: "TechVision Inc.",
    sentDate: "Today, 10:15 AM",
    status: "opened",
    openRate: 75,
    avatar: "/agents/agent-5.png",
  },
  {
    id: 2,
    subject: "Product demo invitation",
    recipient: "Michael Chen",
    company: "Innovate Solutions",
    sentDate: "Yesterday, 2:30 PM",
    status: "replied",
    openRate: 100,
    avatar: "/agents/agent-10.png",
  },
  {
    id: 3,
    subject: "Partnership opportunity",
    recipient: "Emma Rodriguez",
    company: "Global Enterprises",
    sentDate: "May 10, 2025",
    status: "sent",
    openRate: 0,
    avatar: "/agents/agent-12.png",
  },
]

const meetingsData: Meeting[] = [
  {
    id: 1,
    title: "Product Demo",
    attendees: ["Sarah Johnson", "Alex Thompson"],
    date: "Today",
    time: "4:00 PM",
    location: "Zoom",
    type: "virtual",
    status: "upcoming",
  },
  {
    id: 2,
    title: "Partnership Discussion",
    attendees: ["Michael Chen", "Lisa Wong", "David Miller"],
    date: "Tomorrow",
    time: "11:30 AM",
    location: "Conference Room A",
    type: "in-person",
    status: "upcoming",
  },
  {
    id: 3,
    title: "Quarterly Review",
    attendees: ["Emma Rodriguez", "Team"],
    date: "May 20, 2025",
    time: "2:00 PM",
    location: "Google Meet",
    type: "virtual",
    status: "upcoming",
  },
]

const analyticsData: AnalyticsStat[] = [
  {
    id: 1,
    label: "New Leads",
    value: "127",
    change: "+12%",
    trend: "up",
    icon: <PiUsersBold className="w-3 h-3" />,
  },
  {
    id: 2,
    label: "Emails Sent",
    value: "843",
    change: "+23%",
    trend: "up",
    icon: <PiEnvelopeBold className="w-3 h-3" />,
  },
  {
    id: 3,
    label: "Meetings",
    value: "56",
    change: "+8%",
    trend: "up",
    icon: <PiCalendarBold className="w-3 h-3" />,
  },
  {
    id: 4,
    label: "Conversion Rate",
    value: "24%",
    change: "+5%",
    trend: "up",
    icon: <PiTrendUpBold className="w-3 h-3" />,
  },
]

// Componente principal
export const BusinessIntelligence = () => {
  const [activeTab, setActiveTab] = useState("leads")
  const [animateChart, setAnimateChart] = useState(false)

  // Trigger animations after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setAnimateChart(true), 500)
    return () => clearTimeout(timer)
  }, [])

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  // Render status badge
  const renderStatusBadge = (status: string) => {
    let bgColor = "bg-gray-200"
    let textColor = "text-gray-700"
    let borderColor = "border-gray-200"

    switch (status) {
      case "new":
      case "upcoming":
        bgColor = "bg-gray-200"
        textColor = "text-gray-700"
        borderColor = "border-gray-200"
        break
      case "contacted":
      case "scheduled":
        bgColor = "bg-gray-200"
        textColor = "text-gray-700"
        borderColor = "border-gray-200"
        break
      case "qualified":
      case "completed":
      case "opened":
      case "replied":
        bgColor = "bg-gray-200"
        textColor = "text-gray-700"
        borderColor = "border-gray-200"
        break
      case "proposal":
        bgColor = "bg-gray-200"
        textColor = "text-gray-700"
        borderColor = "border-gray-200"
        break
      case "closed":
        bgColor = "bg-gray-200"
        textColor = "text-gray-700"
        borderColor = "border-gray-200"
        break
      case "missed":
      case "bounced":
      case "canceled":
        bgColor = "bg-gray-200"
        textColor = "text-gray-700"
        borderColor = "border-gray-200"
        break
      case "sent":
        bgColor = "bg-gray-200"
        textColor = "text-gray-700"
        borderColor = "border-gray-200"
        break
    }

    return (
      <span
        className={`inline-flex items-center rounded-xl ${bgColor} px-2.5 py-0.5 text-[10px] font-medium ${textColor} border ${borderColor}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <section className="relative py-16 overflow-hidden bg-black">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-repeat bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
              <Image src="/logo/suitpax-cloud-logo.webp" alt="Suitpax" width={16} height={16} className="mr-1.5" />
              Technology by Suitpax
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-700 animate-pulse mr-1"></span>
              Business Intelligence
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-white leading-none max-w-4xl">
            Intelligent Sales & Marketing
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-medium text-white/80 max-w-2xl mb-6">
            Streamline your sales process with AI-powered insights, lead management, and communication tools
          </p>

          {/* Títulos alternativos */}
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <span className="inline-flex items-center rounded-xl bg-white/5 px-3 py-1 text-[10px] font-medium text-white/70 border border-white/10">
              Lead Management
            </span>
            <span className="inline-flex items-center rounded-xl bg-white/5 px-3 py-1 text-[10px] font-medium text-white/70 border border-white/10">
              Email Campaigns
            </span>
            <span className="inline-flex items-center rounded-xl bg-white/5 px-3 py-1 text-[10px] font-medium text-white/70 border border-white/10">
              Sales Analytics
            </span>
          </div>
        </div>

        {/* Dashboard UI */}
        <div className="w-full mx-auto">
          <div className="bg-black/40 backdrop-blur-md rounded-xl shadow-lg border border-white/10 overflow-hidden">
            {/* Navigation */}
            <div className="flex border-b border-white/10">
              {["leads", "calls", "emails", "meetings", "analytics"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-3 text-xs font-medium transition-colors ${
                    activeTab === tab
                      ? "text-white border-b-2 border-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => handleTabChange(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-3 md:p-4 overflow-hidden">
              <AnimatePresence mode="wait">
                {activeTab === "leads" && (
                  <motion.div
                    key="leads"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium text-white">Lead Management</h3>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search leads..."
                            className="bg-black/30 border border-white/10 rounded-xl text-[10px] py-1.5 pl-7 pr-3 text-white w-40 focus:outline-none focus:ring-1 focus:ring-white/20"
                          />
                          <PiMagnifyingGlassBold className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/60 w-3 h-3" />
                        </div>
                        <button className="bg-white/10 hover:bg-white/20 text-white text-[10px] px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1">
                          <PiPlusBold className="w-3 h-3" />
                          <span>Add Lead</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-black/30 rounded-xl border border-white/10 overflow-hidden">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="px-4 py-2 text-[10px] font-medium text-white/60">Name</th>
                            <th className="px-4 py-2 text-[10px] font-medium text-white/60">Company</th>
                            <th className="px-4 py-2 text-[10px] font-medium text-white/60">Status</th>
                            <th className="px-4 py-2 text-[10px] font-medium text-white/60">Score</th>
                            <th className="px-4 py-2 text-[10px] font-medium text-white/60">Last Activity</th>
                            <th className="px-4 py-2 text-[10px] font-medium text-white/60">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leadsData.map((lead, index) => (
                            <motion.tr
                              key={lead.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="border-b border-white/5 hover:bg-white/5"
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="relative h-8 w-8 rounded-md overflow-hidden flex-shrink-0 border border-white/10">
                                    <Image
                                      src={lead.avatar || "/placeholder.svg?height=32&width=32&query=person"}
                                      alt={lead.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-white">{lead.name}</p>
                                    <p className="text-[10px] text-white/60">{lead.position}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <p className="text-xs text-white">{lead.company}</p>
                              </td>
                              <td className="px-4 py-3">{renderStatusBadge(lead.status)}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden w-16">
                                    <div
                                      className="h-full bg-white rounded-full"
                                      style={{ width: `${lead.score}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-[10px] text-white">{lead.score}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <p className="text-[10px] text-white/60">{lead.lastActivity}</p>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <button className="p-1 rounded-md hover:bg-white/10">
                                    <PiPhoneBold className="w-3 h-3 text-white/80" />
                                  </button>
                                  <button className="p-1 rounded-md hover:bg-white/10">
                                    <PiEnvelopeBold className="w-3 h-3 text-white/80" />
                                  </button>
                                  <button className="p-1 rounded-md hover:bg-white/10">
                                    <PiCalendarBold className="w-3 h-3 text-white/80" />
                                  </button>
                                  <button className="p-1 rounded-md hover:bg-white/10">
                                    <PiDotsThreeBold className="w-3 h-3 text-white/80" />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <p className="text-[10px] text-white/60">Showing 3 of 127 leads</p>
                      <div className="flex items-center gap-1">
                        <button className="bg-white/10 hover:bg-white/20 text-white text-[10px] px-2 py-1 rounded-md border border-white/20">
                          Previous
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 text-white text-[10px] px-2 py-1 rounded-md border border-white/20">
                          Next
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "calls" && (
                  <motion.div
                    key="calls"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium text-white">Call Management</h3>
                      <button className="bg-white/10 hover:bg-white/20 text-white text-[10px] px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1">
                        <PiPhoneBold className="w-3 h-3" />
                        <span>Schedule Call</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {callsData.map((call, index) => (
                        <motion.div
                          key={call.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-black/30 rounded-xl border border-white/10 p-3"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <div className="relative h-10 w-10 rounded-md overflow-hidden flex-shrink-0 border border-white/10">
                                <Image
                                  src={call.avatar || "/placeholder.svg?height=40&width=40&query=person"}
                                  alt={call.contact}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{call.contact}</p>
                                <p className="text-[10px] text-white/60">{call.company}</p>
                              </div>
                            </div>
                            {renderStatusBadge(call.status)}
                          </div>

                          <div className="grid grid-cols-3 gap-3 mb-3">
                            <div className="flex items-center gap-1.5">
                              <PiCalendarBold className="w-3 h-3 text-white/60" />
                              <div>
                                <p className="text-[9px] text-white/60">Date</p>
                                <p className="text-xs text-white">{call.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <PiClockBold className="w-3 h-3 text-white/60" />
                              <div>
                                <p className="text-[9px] text-white/60">Time</p>
                                <p className="text-xs text-white">{call.time}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <PiClockBold className="w-3 h-3 text-white/60" />
                              <div>
                                <p className="text-[9px] text-white/60">Duration</p>
                                <p className="text-xs text-white">{call.duration}</p>
                              </div>
                            </div>
                          </div>

                          {call.notes && (
                            <div className="bg-black/40 rounded-lg p-2 mb-3 border border-white/10">
                              <p className="text-[10px] text-white/70">{call.notes}</p>
                            </div>
                          )}

                          <div className="flex justify-between">
                            <div className="flex gap-1">
                              <button className="bg-white/10 hover:bg-white/20 text-white text-[10px] px-2 py-1 rounded-md border border-white/20 flex items-center gap-1">
                                <PiPhoneBold className="w-2.5 h-2.5" />
                                {call.status === "scheduled" ? "Start Call" : "Call Again"}
                              </button>
                              <button className="bg-black/30 text-white border border-white/20 text-[10px] px-2 py-1 rounded-md flex items-center gap-1">
                                <PiCalendarBold className="w-2.5 h-2.5" />
                                Reschedule
                              </button>
                            </div>
                            <button className="text-[10px] text-white/60 hover:text-white">View Details</button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "emails" && (
                  <motion.div
                    key="emails"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium text-white">Email Campaigns</h3>
                      <div className="flex items-center gap-2">
                        <button className="bg-white/10 hover:bg-white/20 text-white text-[10px] px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1">
                          <PiEnvelopeBold className="w-3 h-3" />
                          <span>Compose</span>
                        </button>
                        <button className="bg-black/30 text-white border border-white/20 text-[10px] px-3 py-1.5 rounded-xl flex items-center gap-1">
                          <PiChartBarBold className="w-3 h-3" />
                          <span>Analytics</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-black/30 rounded-xl border border-white/10 overflow-hidden">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="px-4 py-2 text-[10px] font-medium text-white/60">Email</th>
                            <th className="px-4 py-2 text-[10px] font-medium text-white/60">Recipient</th>
                            <th className="px-4 py-2 text-[10px] font-medium text-white/60">Sent Date</th>
                            <th className="px-4 py-2 text-[10px] font-medium text-white/60">Status</th>
                            <th className="px-4 py-2 text-[10px] font-medium text-white/60">Open Rate</th>
                            <th className="px-4 py-2 text-[10px] font-medium text-white/60">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {emailsData.map((email, index) => (
                            <motion.tr
                              key={email.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="border-b border-white/5 hover:bg-white/5"
                            >
                              <td className="px-4 py-3">
                                <p className="text-xs font-medium text-white">{email.subject}</p>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="relative h-6 w-6 rounded-md overflow-hidden flex-shrink-0 border border-white/10">
                                    <Image
                                      src={email.avatar || "/placeholder.svg?height=24&width=24&query=person"}
                                      alt={email.recipient}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-xs text-white">{email.recipient}</p>
                                    <p className="text-[9px] text-white/60">{email.company}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <p className="text-[10px] text-white/60">{email.sentDate}</p>
                              </td>
                              <td className="px-4 py-3">{renderStatusBadge(email.status)}</td>
                              <td className="px-4 py-3">
                                {email.openRate !== undefined ? (
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden w-16">
                                      <div
                                        className="h-full bg-white rounded-full"
                                        style={{ width: `${email.openRate}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-[10px] text-white">{email.openRate}%</span>
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-white/60">-</span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <button className="p-1 rounded-md hover:bg-white/10">
                                    <PiEnvelopeBold className="w-3 h-3 text-white/80" />
                                  </button>
                                  <button className="p-1 rounded-md hover:bg-white/10">
                                    <PiChartLineUpBold className="w-3 h-3 text-white/80" />
                                  </button>
                                  <button className="p-1 rounded-md hover:bg-white/10">
                                    <PiDotsThreeBold className="w-3 h-3 text-white/80" />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 bg-black/30 rounded-xl border border-white/10 p-3">
                      <h4 className="text-xs font-medium text-white mb-2">Email Performance</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-black/40 rounded-lg p-2 border border-white/10">
                          <p className="text-[9px] text-white/60">Open Rate</p>
                          <p className="text-lg font-medium text-white">58.3%</p>
                          <p className="text-[9px] text-white/60 flex items-center">
                            <PiCaretUpBold className="w-2.5 h-2.5 text-white" />
                            <span>+5.2% from last month</span>
                          </p>
                        </div>
                        <div className="bg-black/40 rounded-lg p-2 border border-white/10">
                          <p className="text-[9px] text-white/60">Click Rate</p>
                          <p className="text-lg font-medium text-white">24.7%</p>
                          <p className="text-[9px] text-white/60 flex items-center">
                            <PiCaretUpBold className="w-2.5 h-2.5 text-white" />
                            <span>+2.1% from last month</span>
                          </p>
                        </div>
                        <div className="bg-black/40 rounded-lg p-2 border border-white/10">
                          <p className="text-[9px] text-white/60">Response Rate</p>
                          <p className="text-lg font-medium text-white">12.9%</p>
                          <p className="text-[9px] text-white/60 flex items-center">
                            <PiCaretUpBold className="w-2.5 h-2.5 text-white" />
                            <span>+1.5% from last month</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "meetings" && (
                  <motion.div
                    key="meetings"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium text-white">Meeting Schedule</h3>
                      <button className="bg-white/10 hover:bg-white/20 text-white text-[10px] px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1">
                        <PiCalendarBold className="w-3 h-3" />
                        <span>Schedule Meeting</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {meetingsData.map((meeting, index) => (
                        <motion.div
                          key={meeting.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-black/30 rounded-xl border border-white/10 p-3"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="text-sm font-medium text-white">{meeting.title}</h4>
                              <p className="text-[10px] text-white/60">{meeting.attendees.length} attendees</p>
                            </div>
                            {renderStatusBadge(meeting.status)}
                          </div>

                          <div className="grid grid-cols-3 gap-3 mb-3">
                            <div className="flex items-center gap-1.5">
                              <PiCalendarBold className="w-3 h-3 text-white/60" />
                              <div>
                                <p className="text-[9px] text-white/60">Date</p>
                                <p className="text-xs text-white">{meeting.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <PiClockBold className="w-3 h-3 text-white/60" />
                              <div>
                                <p className="text-[9px] text-white/60">Time</p>
                                <p className="text-xs text-white">{meeting.time}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <PiMapPinBold className="w-3 h-3 text-white/60" />
                              <div>
                                <p className="text-[9px] text-white/60">Location</p>
                                <p className="text-xs text-white">{meeting.location}</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-black/40 rounded-lg p-2 mb-3 border border-white/10">
                            <p className="text-[10px] font-medium text-white mb-1">Attendees</p>
                            <div className="flex flex-wrap gap-1">
                              {meeting.attendees.map((attendee, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center rounded-xl bg-white/5 px-2 py-0.5 text-[9px] text-white/80 border border-white/10"
                                >
                                  {attendee}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-between">
                            <div className="flex gap-1">
                              <button className="bg-white/10 hover:bg-white/20 text-white text-[10px] px-2 py-1 rounded-md border border-white/20 flex items-center gap-1">
                                {meeting.type === "virtual" ? (
                                  <>
                                    <PiChatTextBold className="w-2.5 h-2.5" />
                                    Join Meeting
                                  </>
                                ) : (
                                  <>
                                    <PiMapPinBold className="w-2.5 h-2.5" />
                                    Directions
                                  </>
                                )}
                              </button>
                              <button className="bg-black/30 text-white border border-white/20 text-[10px] px-2 py-1 rounded-md flex items-center gap-1">
                                <PiCalendarBold className="w-2.5 h-2.5" />
                                Reschedule
                              </button>
                            </div>
                            <button className="text-[10px] text-white/60 hover:text-white">View Details</button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "analytics" && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium text-white">Performance Analytics</h3>
                      <div className="flex items-center gap-2">
                        <select className="bg-black/30 border border-white/10 rounded-xl text-[10px] py-1.5 px-3 text-white focus:outline-none focus:ring-1 focus:ring-white/20">
                          <option>Last 30 days</option>
                          <option>Last 90 days</option>
                          <option>This year</option>
                        </select>
                        <button className="bg-white/10 hover:bg-white/20 text-white text-[10px] px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1">
                          <PiChartBarBold className="w-3 h-3" />
                          <span>Export</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {analyticsData.map((stat, index) => (
                        <motion.div
                          key={stat.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-black/30 rounded-xl border border-white/10 p-3"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white">
                              {stat.icon}
                            </div>
                            <span
                              className={`text-[10px] font-medium flex items-center ${
                                stat.trend === "up" ? "text-white" : stat.trend === "down" ? "text-white" : "text-white"
                              }`}
                            >
                              {stat.trend === "up" ? (
                                <PiCaretUpBold className="w-2.5 h-2.5 mr-0.5" />
                              ) : stat.trend === "down" ? (
                                <PiCaretDownBold className="w-2.5 h-2.5 mr-0.5" />
                              ) : null}
                              {stat.change}
                            </span>
                          </div>
                          <p className="text-lg font-medium text-white">{stat.value}</p>
                          <p className="text-[10px] text-white/60">{stat.label}</p>
                        </motion.div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-black/30 rounded-xl border border-white/10 p-3">
                        <h4 className="text-xs font-medium text-white mb-3">Lead Conversion Funnel</h4>
                        <div className="relative h-40">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={animateChart ? { height: "auto" } : { height: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-2"
                          >
                            <div className="relative">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] text-white/60">New Leads</span>
                                <span className="text-[10px] font-medium text-white">127</span>
                              </div>
                              <div className="h-6 bg-white/10 rounded-md overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: "100%" }}
                                  transition={{ duration: 0.5, delay: 0.1 }}
                                  className="h-full bg-white/20 rounded-md"
                                ></motion.div>
                              </div>
                            </div>
                            <div className="relative">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] text-white/60">Contacted</span>
                                <span className="text-[10px] font-medium text-white">98</span>
                              </div>
                              <div className="h-6 bg-white/10 rounded-md overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: "77%" }}
                                  transition={{ duration: 0.5, delay: 0.2 }}
                                  className="h-full bg-white/30 rounded-md"
                                ></motion.div>
                              </div>
                            </div>
                            <div className="relative">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] text-white/60">Qualified</span>
                                <span className="text-[10px] font-medium text-white">64</span>
                              </div>
                              <div className="h-6 bg-white/10 rounded-md overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: "50%" }}
                                  transition={{ duration: 0.5, delay: 0.3 }}
                                  className="h-full bg-white/40 rounded-md"
                                ></motion.div>
                              </div>
                            </div>
                            <div className="relative">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] text-white/60">Proposal</span>
                                <span className="text-[10px] font-medium text-white">42</span>
                              </div>
                              <div className="h-6 bg-white/10 rounded-md overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: "33%" }}
                                  transition={{ duration: 0.5, delay: 0.4 }}
                                  className="h-full bg-white/60 rounded-md"
                                ></motion.div>
                              </div>
                            </div>
                            <div className="relative">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] text-white/60">Closed</span>
                                <span className="text-[10px] font-medium text-white">31</span>
                              </div>
                              <div className="h-6 bg-white/10 rounded-md overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: "24%" }}
                                  transition={{ duration: 0.5, delay: 0.5 }}
                                  className="h-full bg-white rounded-md"
                                ></motion.div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      <div className="bg-black/30 rounded-xl border border-white/10 p-3">
                        <h4 className="text-xs font-medium text-white mb-3">Activity Overview</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white">
                                <PiEnvelopeBold className="w-3 h-3" />
                              </div>
                              <span className="text-xs text-white">Emails Sent</span>
                            </div>
                            <span className="text-xs font-medium text-white">843</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white">
                                <PiPhoneBold className="w-3 h-3" />
                              </div>
                              <span className="text-xs text-white">Calls Made</span>
                            </div>
                            <span className="text-xs font-medium text-white">215</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white">
                                <PiCalendarBold className="w-3 h-3" />
                              </div>
                              <span className="text-xs text-white">Meetings Held</span>
                            </div>
                            <span className="text-xs font-medium text-white">56</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white">
                                <PiTagBold className="w-3 h-3" />
                              </div>
                              <span className="text-xs text-white">Deals Closed</span>
                            </div>
                            <span className="text-xs font-medium text-white">31</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white">
                                <PiUsersBold className="w-3 h-3" />
                              </div>
                              <span className="text-xs text-white">New Contacts</span>
                            </div>
                            <span className="text-xs font-medium text-white">127</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 bg-black/30 rounded-xl border border-white/10 p-3">
                      <h4 className="text-xs font-medium text-white mb-2">AI Insights</h4>
                      <div className="bg-black/40 rounded-lg p-2 border border-white/10">
                        <div className="flex items-start gap-2">
                          <div className="relative h-8 w-8 rounded-md overflow-hidden flex-shrink-0 border border-white/10">
                            <Image src="/agents/agent-13.png" alt="AI Agent" fill className="object-cover" />
                          </div>
                          <div>
                            <p className="text-[10px] text-white/70 mb-2">
                              Based on your recent activity, I've identified potential opportunities to improve your
                              conversion rate:
                            </p>
                            <ul className="space-y-1 text-[10px] text-white/70">
                              <li className="flex items-center gap-1">
                                <PiArrowRightBold className="w-2.5 h-2.5 text-white/60 flex-shrink-0" />
                                <span>
                                  Follow-up emails sent 3-5 days after initial contact have 27% higher response rates
                                </span>
                              </li>
                              <li className="flex items-center gap-1">
                                <PiArrowRightBold className="w-2.5 h-2.5 text-white/60 flex-shrink-0" />
                                <span>
                                  Leads from the technology sector are converting at 35% - consider increasing focus in
                                  this area
                                </span>
                              </li>
                              <li className="flex items-center gap-1">
                                <PiArrowRightBold className="w-2.5 h-2.5 text-white/60 flex-shrink-0" />
                                <span>
                                  Your best performing email subject lines include specific metrics or results
                                </span>
                              </li>
                            </ul>
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

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mt-12">
          <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <p className="text-3xl font-medium text-white">24/7</p>
            <p className="text-xs text-white/60">AI assistance</p>
          </div>
          <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <p className="text-3xl font-medium text-white">100%</p>
            <p className="text-xs text-white/60">Sales automation</p>
          </div>
          <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <p className="text-3xl font-medium text-white">50+</p>
            <p className="text-xs text-white/60">Integrations</p>
          </div>
          <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <p className="text-3xl font-medium text-white">85%</p>
            <p className="text-xs text-white/60">Time saved on admin tasks</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-white/80 mb-4">Streamline your sales and marketing with Suitpax</p>
          <a
            href="mailto:hello@suitpax.com"
            className="inline-flex items-center rounded-xl bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors border border-white/20"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  )
}

export default BusinessIntelligence
