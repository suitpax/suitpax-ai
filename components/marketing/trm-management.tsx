"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { PiTrendUpBold } from "react-icons/pi"
import { SiMarriott, SiBritishairways, SiAirbnb } from "react-icons/si"

// Import modular components
import { TabNavigation } from "../ui-trm/tab-navigation"
import { OverviewSection } from "../ui-trm/overview-section"
import { DealsPipeline } from "../ui-trm/deals-pipeline"
import { ContactsSection } from "../ui-trm/contacts-section"
import { WorkflowsSection } from "../ui-trm/workflows-section"

// Analytics user data
const analyticsUsers = [
  {
    name: "Sarah Johnson",
    image: "/community/ashton-blackwell.webp",
    role: "Travel Manager",
    company: "Marriott",
    companyIcon: <SiMarriott className="w-full h-full text-white" />,
    stats: [
      { label: "Bookings", value: 127, change: "+12%", color: "gray" },
      { label: "Spend", value: "$45.2K", change: "+8%", color: "gray" },
      { label: "Savings", value: "$12.8K", change: "+15%", color: "gray" },
    ],
  },
  {
    name: "Michael Chen",
    image: "/community/jordan-burgess.webp",
    role: "Procurement Director",
    company: "British Airways",
    companyIcon: <SiBritishairways className="w-full h-full text-white" />,
    stats: [
      { label: "Bookings", value: 89, change: "+5%", color: "gray" },
      { label: "Spend", value: "$32.7K", change: "-3%", color: "gray" },
      { label: "Savings", value: "$8.4K", change: "+10%", color: "gray" },
    ],
  },
  {
    name: "Emma Wilson",
    image: "/community/bec-ferguson.webp",
    role: "Business Travel Lead",
    company: "Airbnb",
    companyIcon: <SiAirbnb className="w-full h-full text-white" />,
    stats: [
      { label: "Bookings", value: 156, change: "+18%", color: "gray" },
      { label: "Spend", value: "$58.9K", change: "+12%", color: "gray" },
      { label: "Savings", value: "$15.3K", change: "+22%", color: "gray" },
    ],
  },
]

// Títulos alternativos para el componente TRM
const trmTitles = [
  "Intelligent TRM for the human side of business travel.",
  "Next-generation TRM: Relationships that drive business growth.",
  "TRM reimagined for the modern business traveler.",
  "Strategic TRM for meaningful business connections.",
  "Data-driven TRM that puts relationships first.",
  "All in one TRM solution for travel relationship excellence.",
  "Comprehensive TRM platform for the travel industry leaders.",
  "TRM that transforms business travel into strategic partnerships.",
  "All in one travel relationship management for global enterprises.",
  "The future of TRM: Intelligent, intuitive, and integrated.",
  "All in one TRM platform that grows with your business network.",
  "Relationship-centric TRM for the travel ecosystem.",
]

// Descripciones alternativas para el componente TRM
const trmDescriptions = [
  "Manage business relationships, track opportunities, and nurture strategic partnerships with our comprehensive TRM solution designed specifically for corporate travel businesses",
  "Transform your business travel relationships into strategic assets with our all in one TRM platform built for the modern enterprise",
  "Elevate your business connections with our intelligent TRM system that combines relationship data with travel insights",
  "Our all in one TRM solution helps you build, maintain and leverage business relationships across your travel ecosystem",
  "Streamline relationship management across your travel operations with our comprehensive TRM platform",
  "Connect the dots between travel data and business relationships with our intelligent TRM solution",
  "The all in one TRM platform that helps you turn travel touchpoints into lasting business relationships",
  "Build stronger business connections with our relationship-focused TRM designed for travel professionals",
]

const TrmManagement = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [animateChart, setAnimateChart] = useState(false)
  const [animateDeals, setAnimateDeals] = useState(false)
  const [demoStep, setDemoStep] = useState(0)
  const [trmTitle, setTrmTitle] = useState(trmTitles[0])
  const [trmDescription, setTrmDescription] = useState(trmDescriptions[0])

  // Trigger animations after component mounts
  useEffect(() => {
    const timer1 = setTimeout(() => setAnimateChart(true), 500)
    const timer2 = setTimeout(() => setAnimateDeals(true), 1000)

    // Seleccionar un título y descripción aleatorios
    const titleIndex = Math.floor(Math.random() * trmTitles.length)
    setTrmTitle(trmTitles[titleIndex])

    const descIndex = Math.floor(Math.random() * trmDescriptions.length)
    setTrmDescription(trmDescriptions[descIndex])

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
    <section className="relative py-12 overflow-hidden bg-black">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-repeat bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center rounded-xl bg-white/10 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-medium text-white border border-white/20">
              <Image src="/logo/suitpax-cloud-logo.webp" alt="Suitpax" width={16} height={16} className="mr-1.5" />
              Technology by Suitpax
            </span>
            <span className="inline-flex items-center rounded-xl bg-white/10 backdrop-blur-sm px-2.5 py-0.5 text-[9px] font-medium text-white/80 border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-1"></span>
              TRM Intelligence
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-white leading-none max-w-4xl">
            {trmTitle}
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-medium text-white/80 max-w-2xl mb-4">{trmDescription}</p>
        </div>

        {/* TRM Demo UI */}
        <div className="w-full max-w-4xl mx-auto">
          {/* Floating Tab Navigation */}
          <div className="relative mb-2">
            <TabNavigation
              tabs={["overview", "deals", "contacts", "workflows", "analytics"]}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              className="rounded-xl overflow-hidden shadow-lg"
            />
          </div>

          {/* TRM Content */}
          <div className="bg-black backdrop-blur-md rounded-xl shadow-lg border border-white/10 overflow-hidden">
            <div className="p-3 md:p-4 grid grid-cols-1 gap-4">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && <OverviewSection animateChart={animateChart} />}
                {activeTab === "deals" && <DealsPipeline animateDeals={animateDeals} />}
                {activeTab === "contacts" && <ContactsSection />}
                {activeTab === "workflows" && <WorkflowsSection />}
                {activeTab === "analytics" && (
                  <motion.div
                    key="analytics"
                    className="content-analytics space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Analytics Header */}
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-white text-sm">User Analytics</h3>
                      <div className="flex gap-2">
                        <span className="inline-flex items-center rounded-xl bg-white/10 px-3 py-1 text-[10px] font-medium text-white tracking-wide border border-white/20">
                          <div className="w-4 h-4 rounded-md bg-black flex items-center justify-center text-white mr-2">
                            <PiTrendUpBold className="h-2.5 w-2.5" />
                          </div>
                          TRAVEL METRICS
                        </span>
                        <span className="inline-flex items-center rounded-xl bg-white/10 px-3 py-1 text-[10px] font-medium text-white/80 tracking-wide border border-white/20">
                          UPDATED TODAY
                        </span>
                      </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                      <div className="bg-white/5 border border-white/10 rounded-xl p-2">
                        <div className="text-xs text-white/60 mb-1">Total Users</div>
                        <div className="text-lg font-bold text-white">1,248</div>
                        <div className="text-[10px] text-white/60 mt-1">+12.5% this month</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-2">
                        <div className="text-xs text-white/60 mb-1">Total Bookings</div>
                        <div className="text-lg font-bold text-white">8,742</div>
                        <div className="text-[10px] text-white/60 mt-1">+8.3% this month</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-2">
                        <div className="text-xs text-white/60 mb-1">Total Spend</div>
                        <div className="text-lg font-bold text-white">$2.4M</div>
                        <div className="text-[10px] text-white/60 mt-1">+5.7% this month</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-2">
                        <div className="text-xs text-white/60 mb-1">Total Savings</div>
                        <div className="text-lg font-bold text-white">$487K</div>
                        <div className="text-[10px] text-white/60 mt-1">+15.2% this month</div>
                      </div>
                    </div>

                    {/* User Analytics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {analyticsUsers.map((user, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-transparent border border-white/20 rounded-xl p-2 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20">
                              <Image
                                src={user.image || "/placeholder.svg"}
                                alt={user.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs font-medium text-white">{user.name}</div>
                              <div className="text-[9px] text-white/60 flex items-center gap-1">
                                {user.role} •
                                <div className="w-3 h-3 rounded-full bg-black/50 flex items-center justify-center">
                                  {user.companyIcon}
                                </div>
                                {user.company}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-1">
                            {user.stats.map((stat, i) => (
                              <div key={i} className="bg-black/30 rounded-lg p-1 text-center">
                                <div className="text-[9px] text-white/70">{stat.label}</div>
                                <div className="text-xs font-bold text-white">{stat.value}</div>
                                <div className={`text-[8px] font-medium text-white/60`}>{stat.change}</div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
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

export default TrmManagement
