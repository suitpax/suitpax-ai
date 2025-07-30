"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Receipt,
  BarChart3,
  Zap,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Globe,
  Smartphone,
  Camera,
  FileText,
  ArrowRight,
} from "lucide-react"
import Image from "next/image"

const tabs = [
  {
    id: "capture",
    label: "Receipt Capture",
    icon: Camera,
    title: "Smart Receipt Capture",
    description: "AI-powered receipt scanning with 99.2% accuracy",
    features: ["Instant OCR processing", "Auto-categorization", "Multi-currency support", "Duplicate detection"],
  },
  {
    id: "approval",
    label: "Approval Flow",
    icon: CheckCircle,
    title: "Automated Approvals",
    description: "Streamlined approval workflows that save 75% of processing time",
    features: ["Custom approval rules", "Real-time notifications", "Mobile approvals", "Audit trail tracking"],
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Deep insights into spending patterns and cost optimization",
    features: ["Real-time dashboards", "Spending forecasts", "Policy compliance", "Custom reports"],
  },
  {
    id: "integration",
    label: "Integration",
    icon: Zap,
    title: "Seamless Integration",
    description: "Connect with your existing accounting and ERP systems",
    features: ["QuickBooks integration", "SAP Concur sync", "Xero compatibility", "API access"],
  },
]

const stats = [
  { label: "Time Saved", value: "75%", icon: Clock, color: "blue" },
  { label: "Accuracy Rate", value: "99.2%", icon: CheckCircle, color: "green" },
  { label: "Cost Reduction", value: "40%", icon: DollarSign, color: "purple" },
  { label: "Processing Speed", value: "10x", icon: TrendingUp, color: "orange" },
]

const integrations = [
  { name: "QuickBooks", logo: "/logos/quickbooks-logo.png" },
  { name: "Xero", logo: "/logos/xero-logo.png" },
  { name: "SAP Concur", logo: "/logos/sap-concur-logo.png" },
  { name: "NetSuite", logo: "/logos/netsuite-logo.png" },
  { name: "Sage", logo: "/logos/sage-logo.png" },
  { name: "FreshBooks", logo: "/logos/freshbooks-logo.png" },
]

export default function ExpenseManagement() {
  const [activeTab, setActiveTab] = useState("capture")

  const activeTabData = tabs.find((tab) => tab.id === activeTab) || tabs[0]

  return (
    <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center rounded-2xl bg-green-50 px-4 py-2 text-sm font-medium text-green-700 border border-green-200">
              <Receipt className="w-4 h-4 mr-2" />
              Expense Management
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-none mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Automate your expense workflow
          </h2>

          <p className="text-xl font-light text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform tedious expense reporting into an effortless, automated process. From receipt capture to
            reimbursement, we've got you covered.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardContent className="p-6 text-center">
                <div
                  className={`w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                    stat.color === "blue"
                      ? "bg-blue-100"
                      : stat.color === "green"
                        ? "bg-green-100"
                        : stat.color === "purple"
                          ? "bg-purple-100"
                          : "bg-orange-100"
                  }`}
                >
                  <stat.icon
                    className={`w-6 h-6 ${
                      stat.color === "blue"
                        ? "text-blue-600"
                        : stat.color === "green"
                          ? "text-green-600"
                          : stat.color === "purple"
                            ? "text-purple-600"
                            : "text-orange-600"
                    }`}
                  />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src="/business-travel-dashboard.png"
                    alt="Expense Management Dashboard"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-t-3xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-3xl" />

                  {/* Floating Elements */}
                  <motion.div
                    className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg"
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    Live Updates
                  </motion.div>

                  <motion.div
                    className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-gray-900">Processing receipts...</span>
                    </div>
                  </motion.div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Expense Dashboard</h3>
                  <p className="text-gray-600 font-light mb-4">
                    Monitor all expenses, approvals, and analytics in one unified interface
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {["Real-time sync", "Mobile ready", "Custom reports", "API access"].map((feature, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Interactive Tabs */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Tab Navigation */}
            <div className="grid grid-cols-2 gap-3">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-4 h-auto rounded-2xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-200"
                      : "bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </div>
                </Button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <activeTabData.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{activeTabData.title}</h3>
                        <p className="text-gray-600 font-light">{activeTabData.description}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {activeTabData.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-3"
                        >
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl px-6 py-3 font-semibold shadow-lg shadow-blue-200 transition-all duration-300 hover:scale-105">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Key Features */}
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  icon: Smartphone,
                  title: "Mobile-First Design",
                  description: "Capture receipts on-the-go with our mobile app",
                },
                {
                  icon: Globe,
                  title: "Multi-Currency Support",
                  description: "Handle expenses in 150+ currencies automatically",
                },
                {
                  icon: Users,
                  title: "Team Collaboration",
                  description: "Streamlined workflows for teams of any size",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-600 font-light text-sm">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Seamless Integrations</h3>
            <p className="text-gray-600 font-light max-w-2xl mx-auto">
              Connect with your existing accounting and ERP systems for a unified workflow
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-gray-600" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 text-sm">{integration.name}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
