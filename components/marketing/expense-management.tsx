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
  RiShieldCheckFill,
  RiFlashFill,
  RiTeamFill,
  RiGlobalFill,
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
  SiQuickbooks,
  SiSap,
  SiOracle,
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
    description: "Flight LHR-JFK Business Class",
  },
  {
    id: 2,
    company: "Slack",
    icon: <SiSlack className="text-black" />,
    category: "SOFTWARE",
    amount: "$89.00",
    status: "AUTOMATIC",
    date: "Apr 10",
    description: "Monthly Pro subscription",
  },
  {
    id: 3,
    company: "Uber",
    icon: <SiUber className="text-black" />,
    category: "TRANSPORT",
    amount: "$32.50",
    status: "IN-POLICY",
    date: "Apr 09",
    description: "Airport transfer",
  },
  {
    id: 4,
    company: "Airbnb",
    icon: <SiAirbnb className="text-black" />,
    category: "LODGING",
    amount: "$420.00",
    status: "PENDING",
    date: "Apr 08",
    description: "3 nights Manhattan apartment",
  },
  {
    id: 5,
    company: "Zoom",
    icon: <SiZoom className="text-black" />,
    category: "SOFTWARE",
    amount: "$149.90",
    status: "APPROVED",
    date: "Apr 07",
    description: "Annual Pro license",
  },
  {
    id: 6,
    company: "Stripe",
    icon: <SiStripe className="text-black" />,
    category: "PAYMENT",
    amount: "$2,340.00",
    status: "AUTOMATIC",
    date: "Apr 06",
    description: "Monthly processing fees",
  },
]

// Stats to display
const stats = [
  {
    id: 1,
    title: "Time Saved",
    value: "320",
    unit: "hours",
    description: "Annual reduction in manual processing",
    trend: "+45%",
  },
  {
    id: 2,
    title: "Policy Compliance",
    value: "98.5",
    unit: "%",
    description: "Travel and expense policy adherence",
    trend: "+12%",
  },
  {
    id: 3,
    title: "Processing Speed",
    value: "2.1",
    unit: "sec",
    description: "Average automatic approval time",
    trend: "-67%",
  },
  {
    id: 4,
    title: "Cost Reduction",
    value: "23",
    unit: "%",
    description: "Average expense reduction achieved",
    trend: "+8%",
  },
]

// Company connections for the grid
const companyConnections = [
  { id: 1, name: "Slack", icon: <SiSlack size={20} />, category: "Communication" },
  { id: 2, name: "Zoom", icon: <SiZoom size={20} />, category: "Video" },
  { id: 3, name: "Asana", icon: <SiAsana size={20} />, category: "Project Mgmt" },
  { id: 4, name: "Dropbox", icon: <SiDropbox size={20} />, category: "Storage" },
  { id: 5, name: "Adobe", icon: <SiAdobecreativecloud size={20} />, category: "Creative" },
  { id: 6, name: "Salesforce", icon: <SiSalesforce size={20} />, category: "CRM" },
  { id: 7, name: "HubSpot", icon: <SiHubspot size={20} />, category: "Marketing" },
  { id: 8, name: "Mailchimp", icon: <SiMailchimp size={20} />, category: "Email" },
  { id: 9, name: "Stripe", icon: <SiStripe size={20} />, category: "Payments" },
  { id: 10, name: "Expensify", icon: <SiExpensify size={20} />, category: "Expenses" },
  { id: 11, name: "Uber", icon: <SiUber size={20} />, category: "Transport" },
  { id: 12, name: "Airbnb", icon: <SiAirbnb size={20} />, category: "Lodging" },
  { id: 13, name: "QuickBooks", icon: <SiQuickbooks size={20} />, category: "Accounting" },
  { id: 14, name: "SAP", icon: <SiSap size={20} />, category: "ERP" },
  { id: 15, name: "Oracle", icon: <SiOracle size={20} />, category: "Database" },
]

// Advanced features
const advancedFeatures = [
  {
    id: 1,
    title: "AI-Powered Receipt Scanning",
    description: "Automatically extract data from receipts using advanced OCR and machine learning",
    icon: <RiFlashFill className="text-gray-700" size={24} />,
    benefits: ["99.8% accuracy", "Multi-language support", "Real-time processing"],
  },
  {
    id: 2,
    title: "Smart Policy Enforcement",
    description: "Dynamic policy rules that adapt to your company's specific requirements",
    icon: <RiShieldCheckFill className="text-gray-700" size={24} />,
    benefits: ["Custom rule engine", "Real-time validation", "Automated flagging"],
  },
  {
    id: 3,
    title: "Multi-Currency Management",
    description: "Handle global expenses with automatic currency conversion and compliance",
    icon: <RiGlobalFill className="text-gray-700" size={24} />,
    benefits: ["150+ currencies", "Real-time rates", "Tax compliance"],
  },
  {
    id: 4,
    title: "Team Collaboration",
    description: "Streamlined approval workflows with role-based access and notifications",
    icon: <RiTeamFill className="text-gray-700" size={24} />,
    benefits: ["Custom workflows", "Mobile approvals", "Audit trails"],
  },
]

export default function ExpenseManagement() {
  const [randomTitle, setRandomTitle] = useState("")
  const [randomSubtitle, setRandomSubtitle] = useState("")
  const [activeCard, setActiveCard] = useState(1)
  const [visibleTransactions, setVisibleTransactions] = useState(4)

  useEffect(() => {
    // Select random title and subtitle
    const titleIndex = Math.floor(Math.random() * titleVariations.length)
    setRandomTitle(titleVariations[titleIndex])

    const subtitleIndex = Math.floor(Math.random() * subtitleVariations.length)
    setRandomSubtitle(subtitleVariations[subtitleIndex])

    // Rotate cards every 4 seconds
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev === 1 ? 2 : 1))
    }, 4000)

    // Show more transactions gradually
    const transactionInterval = setInterval(() => {
      setVisibleTransactions((prev) => (prev >= transactions.length ? 4 : prev + 1))
    }, 2000)

    return () => {
      clearInterval(interval)
      clearInterval(transactionInterval)
    }
  }, [])

  return (
    <div className="relative py-20 overflow-hidden bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-1.5 mb-4">
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
              <span className="w-1 h-1 rounded-full bg-emerald-600 animate-pulse mr-1"></span>
              Launching Q3 2025
            </span>
          </div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-center mb-6 leading-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Where human intuition meets{" "}
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
              AI agents
            </span>{" "}
            to redefine corporate travel and financial control.
          </motion.h1>

          <motion.div
            className="mt-8 mb-6 inline-flex items-center bg-black text-white px-8 py-3 rounded-xl shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-lg font-semibold tracking-tighter mr-2">LAUNCHING Q3 2025</span>
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          </motion.div>

          <motion.p
            className="mt-4 text-base font-medium text-gray-600 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {randomSubtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-xl text-sm font-medium tracking-tighter shadow-lg transition-colors relative group overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Start Free Trial <RiArrowRightLine className="ml-2" />
              </span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-800 via-black to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center bg-white text-black hover:bg-gray-50 px-8 py-3 rounded-xl text-sm font-medium tracking-tighter shadow-lg border border-gray-200 transition-colors"
            >
              Sign In
            </Link>
          </motion.div>
        </div>

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm text-center"
            >
              <div className="text-3xl font-bold mb-1">
                {stat.value}
                <span className="text-lg font-normal text-gray-600">{stat.unit}</span>
              </div>
              <div className="text-sm font-medium text-gray-900 mb-1">{stat.title}</div>
              <div className="text-xs text-gray-500 mb-2">{stat.description}</div>
              <span className="inline-flex items-center rounded-xl bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                {stat.trend}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Main Dashboard Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Left panel - Transactions */}
          <motion.div
            className="lg:col-span-8 bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-medium tracking-tighter mb-1">Recent Transactions</h3>
                <p className="text-sm text-gray-500">Real-time expense tracking and approval</p>
              </div>
              <Link href="/auth/signup" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                View all →
              </Link>
            </div>

            <div className="space-y-4">
              {transactions.slice(0, visibleTransactions).map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl">
                      {transaction.icon}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.company}</p>
                      <p className="text-xs text-gray-500 mb-1">{transaction.description}</p>
                      <p className="text-xs text-gray-400">
                        {transaction.category} • {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">{transaction.amount}</p>
                    <span
                      className={`inline-flex items-center rounded-xl px-2.5 py-0.5 text-[10px] font-medium ${
                        transaction.status === "APPROVED" ||
                        transaction.status === "AUTOMATIC" ||
                        transaction.status === "IN-POLICY"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {(transaction.status === "APPROVED" ||
                        transaction.status === "AUTOMATIC" ||
                        transaction.status === "IN-POLICY") && <RiCheckboxCircleFill className="mr-1" size={10} />}
                      {transaction.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right panel - Cards and Quick Stats */}
          <motion.div
            className="lg:col-span-4 space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {/* Corporate cards */}
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium tracking-tighter mb-4">Corporate Cards</h3>
              <div className="relative h-48">
                <div
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    activeCard === 1 ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-95"
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
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    activeCard === 2 ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-95"
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
              <div className="mt-4 text-center">
                <Link href="/auth/signup" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                  Request corporate card →
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium tracking-tighter mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/auth/signup"
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg">
                      <RiWalletFill className="text-gray-700" size={16} />
                    </div>
                    <span className="text-sm font-medium">Submit Expense</span>
                  </div>
                  <RiArrowRightLine className="text-gray-400 group-hover:text-gray-600 transition-colors" size={16} />
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg">
                      <RiPieChartFill className="text-gray-700" size={16} />
                    </div>
                    <span className="text-sm font-medium">View Reports</span>
                  </div>
                  <RiArrowRightLine className="text-gray-400 group-hover:text-gray-600 transition-colors" size={16} />
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg">
                      <RiFileList3Fill className="text-gray-700" size={16} />
                    </div>
                    <span className="text-sm font-medium">Manage Policies</span>
                  </div>
                  <RiArrowRightLine className="text-gray-400 group-hover:text-gray-600 transition-colors" size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Advanced Features Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter mb-4">Advanced Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powered by cutting-edge AI and machine learning to deliver unparalleled expense management capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {advancedFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              >
                <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium tracking-tighter mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <RiCheckboxCircleFill className="text-emerald-600" size={14} />
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Company connections grid */}
        <motion.div
          className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-medium tracking-tighter mb-1">Connected Services</h3>
              <p className="text-sm text-gray-500">Seamlessly integrate with your existing business tools</p>
            </div>
            <Link href="/auth/signup" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
              Manage connections →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {companyConnections.map((company, index) => (
              <motion.div
                key={company.id}
                className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center gap-2 hover:shadow-sm transition-all duration-300 hover:scale-105"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 1.1 + index * 0.05 }}
              >
                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl">{company.icon}</div>
                <span className="text-xs font-medium text-center">{company.name}</span>
                <span className="text-[10px] text-gray-500">{company.category}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Basic Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <motion.div
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl mb-4">
              <RiWalletFill className="text-gray-700" size={20} />
            </div>
            <h3 className="text-lg font-medium tracking-tighter mb-2">Expense Control</h3>
            <p className="text-sm text-gray-600">
              Set automatic limits and policies for each department and employee with real-time monitoring.
            </p>
          </motion.div>

          <motion.div
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl mb-4">
              <RiFileList3Fill className="text-gray-700" size={20} />
            </div>
            <h3 className="text-lg font-medium tracking-tighter mb-2">AI Approvals</h3>
            <p className="text-sm text-gray-600">
              Automate approvals based on predefined policies and continuous learning from past decisions.
            </p>
          </motion.div>

          <motion.div
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl mb-4">
              <RiPieChartFill className="text-gray-700" size={20} />
            </div>
            <h3 className="text-lg font-medium tracking-tighter mb-2">Advanced Analytics</h3>
            <p className="text-sm text-gray-600">
              Visualize spending patterns and get AI-powered recommendations to optimize resource allocation.
            </p>
          </motion.div>

          <motion.div
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl mb-4">
              <RiMoneyDollarCircleFill className="text-gray-700" size={20} />
            </div>
            <h3 className="text-lg font-medium tracking-tighter mb-2">Financial Integration</h3>
            <p className="text-sm text-gray-600">
              Connect with your ERP and accounting systems for frictionless reconciliation and reporting.
            </p>
          </motion.div>
        </div>

        {/* Integrations section */}
        <motion.div
          className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          <h3 className="text-xl font-medium tracking-tighter mb-2 text-center">Payment & Banking Partners</h3>
          <p className="text-sm text-gray-500 text-center mb-8">Trusted by leading financial institutions worldwide</p>
          <div className="flex flex-wrap justify-center gap-12">
            <SiMastercard size={40} className="text-black opacity-60 hover:opacity-100 transition-opacity" />
            <SiVisa size={40} className="text-black opacity-60 hover:opacity-100 transition-opacity" />
            <SiAmericanexpress size={40} className="text-black opacity-60 hover:opacity-100 transition-opacity" />
            <SiRevolut size={40} className="text-black opacity-60 hover:opacity-100 transition-opacity" />
            <SiChase size={40} className="text-black opacity-60 hover:opacity-100 transition-opacity" />
            <SiBritishairways size={40} className="text-black opacity-60 hover:opacity-100 transition-opacity" />
            <SiDelta size={40} className="text-black opacity-60 hover:opacity-100 transition-opacity" />
            <SiUnitedairlines size={40} className="text-black opacity-60 hover:opacity-100 transition-opacity" />
            <SiExpensify size={40} className="text-black opacity-60 hover:opacity-100 transition-opacity" />
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
        >
          <h2 className="text-2xl md:text-3xl font-medium tracking-tighter mb-4">
            Ready to transform your expense management?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of companies already using Suitpax to streamline their financial operations and reduce costs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.9 }}
              whileHover={{ y: -2 }}
              whileTap={{ y: 1 }}
            >
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-xl text-sm font-medium tracking-tighter shadow-lg transition-colors relative group overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Start Free Trial <RiArrowRightLine className="ml-2" />
                </span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-800 via-black to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2 }}
              whileHover={{ y: -2 }}
              whileTap={{ y: 1 }}
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-white text-black hover:bg-gray-50 px-8 py-3 rounded-xl text-sm font-medium tracking-tighter shadow-lg border border-gray-200 transition-colors"
              >
                Schedule Demo
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
