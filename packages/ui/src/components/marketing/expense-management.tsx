"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  RiArrowRightLine,
  RiCheckboxCircleFill,
  RiPieChartFill,
  RiWalletFill,
  RiFileList3Fill,
  RiMoneyDollarCircleFill,
} from "react-icons/ri"
import {
  SiMastercard,
  SiVisa,
  SiAmericanexpress,
  SiRevolut,
  SiChase,
  SiBritishairways,
  SiDelta,
  SiUnitedairlines,
  SiExpensify,
  SiSlack,
  SiUber,
  SiAirbnb,
  SiZoom,
  SiAsana,
  SiDropbox,
  SiAdobecreativecloud,
  SiSalesforce,
  SiHubspot,
  SiMailchimp,
  SiStripe,
} from "react-icons/si"

// Title and subtitle variations
const titleVariations = [
  "Expense Management 2.0: The Future of Financial Control",
  "Revolutionizing Corporate Expense Management",
  "Intelligent Automation for Business Finances",
  "Total Expense Control with Advanced AI",
  "Simplifying Enterprise Financial Management",
]

const subtitleVariations = [
  "Intelligent automation that transforms how your company manages corporate expenses",
  "Seamless integration between your workflows and financial management",
  "Empowering employees with smarter, more efficient solutions",
  "Real-time expense control with automated approvals",
  "Complete visibility and frictionless policy compliance",
]

// Transaction data to display
const transactions = [
  {
    id: 1,
    company: "British Airways",
    icon: <SiBritishairways className="text-black" />,
    category: "TRAVEL",
    amount: "$1,250.00",
    status: "APPROVED",
    date: "Apr 12",
  },
  {
    id: 2,
    company: "Slack",
    icon: <SiSlack className="text-black" />,
    category: "SOFTWARE",
    amount: "$89.00",
    status: "AUTOMATIC",
    date: "Apr 10",
  },
  {
    id: 3,
    company: "Uber",
    icon: <SiUber className="text-black" />,
    category: "TRANSPORT",
    amount: "$32.50",
    status: "IN-POLICY",
    date: "Apr 09",
  },
  {
    id: 4,
    company: "Airbnb",
    icon: <SiAirbnb className="text-black" />,
    category: "LODGING",
    amount: "$420.00",
    status: "PENDING",
    date: "Apr 08",
  },
]

// Stats to display
const stats = [
  {
    id: 1,
    title: "Annual Savings",
    value: "320",
    unit: "hours",
    description: "Time saved on manual expense processing",
  },
  {
    id: 2,
    title: "Compliance",
    value: "98",
    unit: "%",
    description: "Travel and expense policy compliance rate",
  },
  {
    id: 3,
    title: "Processing",
    value: "2.5",
    unit: "sec",
    description: "Average automatic approval time",
  },
]

// Company connections for the grid
const companyConnections = [
  { id: 1, name: "Slack", icon: <SiSlack size={20} /> },
  { id: 2, name: "Zoom", icon: <SiZoom size={20} /> },
  { id: 3, name: "Asana", icon: <SiAsana size={20} /> },
  { id: 4, name: "Dropbox", icon: <SiDropbox size={20} /> },
  { id: 5, name: "Adobe", icon: <SiAdobecreativecloud size={20} /> },
  { id: 6, name: "Salesforce", icon: <SiSalesforce size={20} /> },
  { id: 7, name: "HubSpot", icon: <SiHubspot size={20} /> },
  { id: 8, name: "Mailchimp", icon: <SiMailchimp size={20} /> },
  { id: 9, name: "Stripe", icon: <SiStripe size={20} /> },
  { id: 10, name: "Expensify", icon: <SiExpensify size={20} /> },
  { id: 11, name: "Uber", icon: <SiUber size={20} /> },
  { id: 12, name: "Airbnb", icon: <SiAirbnb size={20} /> },
]

export default function ExpenseManagement() {
  const [randomTitle, setRandomTitle] = useState("")
  const [randomSubtitle, setRandomSubtitle] = useState("")
  const [activeCard, setActiveCard] = useState(1)

  useEffect(() => {
    // Select random title and subtitle
    const titleIndex = Math.floor(Math.random() * titleVariations.length)
    setRandomTitle(titleVariations[titleIndex])

    const subtitleIndex = Math.floor(Math.random() * subtitleVariations.length)
    setRandomSubtitle(subtitleVariations[subtitleIndex])

    // Rotate cards every 3 seconds
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev === 1 ? 2 : 1))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative py-20 overflow-hidden bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <Image
                src="/logo/suitpax-bl-logo.webp"
                alt="Suitpax"
                width={60}
                height={15}
                className="h-3 w-auto mr-1"
              />
              Finance
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[8px] font-medium text-gray-700">
              <span className="w-1 h-1 rounded-full bg-black animate-pulse mr-1"></span>
              Launching Q3 2025
            </span>
          </div>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-center mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Where human intuition meets AI agents to redefine corporate travel and financial control.
          </motion.h2>

          <motion.div
            className="mt-6 mb-4 inline-flex items-center bg-black text-white px-6 py-2 rounded-xl shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-lg font-semibold tracking-tighter mr-2">LAUNCHING Q3 2025</span>
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          </motion.div>

          <motion.p
            className="mt-3 text-sm font-medium text-gray-600 max-w-2xl mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {randomSubtitle}
          </motion.p>
        </div>

        {/* Main section with dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* Left panel - Transactions */}
          <motion.div
            className="lg:col-span-7 bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium tracking-tighter">Recent Transactions</h3>
              <span className="text-xs text-gray-500">View all</span>
            </div>

            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl">
                      {transaction.icon}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.company}</p>
                      <p className="text-xs text-gray-500">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{transaction.amount}</p>
                    <span
                      className={`inline-flex items-center rounded-xl px-2 py-0.5 text-[10px] font-medium ${
                        transaction.status === "APPROVED" ||
                        transaction.status === "AUTOMATIC" ||
                        transaction.status === "IN-POLICY"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {transaction.status === "APPROVED" && (
                        <RiCheckboxCircleFill className="mr-1 text-gray-700" size={10} />
                      )}
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right panel - Stats and cards */}
          <motion.div
            className="lg:col-span-5 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Corporate cards */}
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium tracking-tighter mb-4">Corporate Cards</h3>
              <div className="relative h-44">
                <div
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                    activeCard === 1 ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/suitpax-dark-card%20%281%29-Qz0iI04gBw7gbYESiK8lQ1ofqid4nt.png"
                    alt="Suitpax Corporate Card - Dark"
                    width={600}
                    height={338}
                    className="h-full w-full object-contain rounded-xl"
                  />
                </div>
                <div
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                    activeCard === 2 ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/suitpax-light-card-cKzP4eYvKvq65D4SljVnd8OrHeiWAW.png"
                    alt="Suitpax Corporate Card - Light"
                    width={600}
                    height={338}
                    className="h-full w-full object-contain rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium tracking-tighter mb-4">Key Metrics</h3>
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <div key={stat.id} className="text-center">
                    <div className="text-2xl font-bold">
                      {stat.value}
                      <span className="text-sm font-normal">{stat.unit}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{stat.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Company connections grid */}
        <motion.div
          className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium tracking-tighter">Connected Services</h3>
            <span className="text-xs text-gray-500 cursor-pointer">Manage connections</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {companyConnections.map((company) => (
              <div
                key={company.id}
                className="bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-2 hover:shadow-sm transition-shadow"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-xl">{company.icon}</div>
                <span className="text-sm font-medium">{company.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Features section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl mb-4">
              <RiWalletFill className="text-gray-700" size={20} />
            </div>
            <h3 className="text-lg font-medium tracking-tighter mb-2">Expense Control</h3>
            <p className="text-sm text-gray-600">Set automatic limits and policies for each department and employee.</p>
          </motion.div>

          <motion.div
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl mb-4">
              <RiFileList3Fill className="text-gray-700" size={20} />
            </div>
            <h3 className="text-lg font-medium tracking-tighter mb-2">AI Approvals</h3>
            <p className="text-sm text-gray-600">
              Automate approvals based on predefined policies and continuous learning.
            </p>
          </motion.div>

          <motion.div
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl mb-4">
              <RiPieChartFill className="text-gray-700" size={20} />
            </div>
            <h3 className="text-lg font-medium tracking-tighter mb-2">Advanced Analytics</h3>
            <p className="text-sm text-gray-600">
              Visualize spending patterns and get recommendations to optimize resources.
            </p>
          </motion.div>

          <motion.div
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl mb-4">
              <RiMoneyDollarCircleFill className="text-gray-700" size={20} />
            </div>
            <h3 className="text-lg font-medium tracking-tighter mb-2">Financial Integration</h3>
            <p className="text-sm text-gray-600">
              Connect with your ERP and accounting systems for frictionless reconciliation.
            </p>
          </motion.div>
        </div>

        {/* Integrations section */}
        <motion.div
          className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <h3 className="text-lg font-medium tracking-tighter mb-6 text-center">Key Integrations</h3>
          <div className="flex flex-wrap justify-center gap-8">
            <SiMastercard size={30} className="text-black opacity-70 hover:opacity-100 transition-opacity" />
            <SiVisa size={30} className="text-black opacity-70 hover:opacity-100 transition-opacity" />
            <SiAmericanexpress size={30} className="text-black opacity-70 hover:opacity-100 transition-opacity" />
            <SiRevolut size={30} className="text-black opacity-70 hover:opacity-100 transition-opacity" />
            <SiChase size={30} className="text-black opacity-70 hover:opacity-100 transition-opacity" />
            <SiBritishairways size={30} className="text-black opacity-70 hover:opacity-100 transition-opacity" />
            <SiDelta size={30} className="text-black opacity-70 hover:opacity-100 transition-opacity" />
            <SiUnitedairlines size={30} className="text-black opacity-70 hover:opacity-100 transition-opacity" />
            <SiExpensify size={30} className="text-black opacity-70 hover:opacity-100 transition-opacity" />
          </div>
        </motion.div>

        {/* CTA */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            whileHover={{ y: -2 }}
            whileTap={{ y: 1 }}
          >
            <Link
              href="https://accounts.suitpax.com/sign-up"
              className="inline-flex items-center justify-center bg-white text-black hover:bg-white/90 px-8 py-3 rounded-xl text-sm font-medium tracking-tighter shadow-lg w-full sm:w-auto min-w-[220px] transition-colors relative group overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Pre-register <RiArrowRightLine className="ml-2" />
              </span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-300 via-white to-sky-300 opacity-30 group-hover:opacity-50 blur-xl transition-all duration-500 animate-flow-slow"></span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
