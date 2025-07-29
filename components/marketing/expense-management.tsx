"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Receipt, CreditCard, TrendingUp, CheckCircle, Clock, DollarSign } from "lucide-react"

export default function ExpenseManagement() {
  const [activeTab, setActiveTab] = useState("capture")

  const tabs = [
    { id: "capture", label: "Smart Capture", icon: Receipt },
    { id: "categorize", label: "Auto-Categorize", icon: CreditCard },
    { id: "approve", label: "Instant Approval", icon: CheckCircle },
    { id: "insights", label: "AI Insights", icon: TrendingUp },
  ]

  const expenses = [
    {
      id: 1,
      type: "Flight",
      amount: "$1,247.50",
      vendor: "Delta Airlines",
      date: "Dec 15, 2024",
      location: "NYC → SF",
      status: "approved",
      category: "Transportation",
    },
    {
      id: 2,
      type: "Hotel",
      amount: "$389.00",
      vendor: "Hilton San Francisco",
      date: "Dec 15-17, 2024",
      location: "San Francisco, CA",
      status: "pending",
      category: "Accommodation",
    },
    {
      id: 3,
      type: "Meals",
      amount: "$127.80",
      vendor: "Various Restaurants",
      date: "Dec 16, 2024",
      location: "San Francisco, CA",
      status: "approved",
      category: "Meals & Entertainment",
    },
  ]

  const insights = [
    { label: "Monthly Savings", value: "$12,450", trend: "+23%" },
    { label: "Processing Time", value: "2.3 min", trend: "-67%" },
    { label: "Compliance Rate", value: "98.7%", trend: "+12%" },
    { label: "Auto-Approval", value: "89%", trend: "+45%" },
  ]

  return (
    <section className="w-full py-12 pb-6 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center items-center gap-1.5 mb-4">
              <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
                Expense Management
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none max-w-4xl mx-auto mb-6 text-black">
              Automated expense tracking and intelligent reporting
            </h2>

            <p className="mt-4 text-base font-light text-gray-600 max-w-3xl mb-8">
              Streamline your expense management with AI-powered receipt scanning, automated categorization, and
              real-time reporting that saves time and ensures compliance.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Content Area */}
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <DollarSign className="w-12 h-12 text-gray-600" />
                  </div>
                  <h3 className="text-2xl font-medium tracking-tighter text-black mb-4">Smart Expense Management</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    AI-powered expense tracking that automatically captures, categorizes, and processes your business
                    expenses with 99.2% accuracy.
                  </p>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card className="bg-white/50 backdrop-blur-sm border-gray-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <Receipt className="w-6 h-6 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium tracking-tighter text-black mb-2">Mobile Receipt Capture</h3>
                  <p className="text-sm font-light text-gray-600">
                    Snap photos of receipts and let AI extract all the details automatically with OCR technology.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur-sm border-gray-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <CreditCard className="w-6 h-6 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium tracking-tighter text-black mb-2">Smart Categorization</h3>
                  <p className="text-sm font-light text-gray-600">
                    AI automatically categorizes expenses and flags policy violations before submission.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur-sm border-gray-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium tracking-tighter text-black mb-2">Instant Reimbursement</h3>
                  <p className="text-sm font-light text-gray-600">
                    Get reimbursed faster with automated approval workflows and real-time processing.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 p-6 bg-gray-50 rounded-xl">
              {insights.map((insight, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-medium text-black mb-1">{insight.value}</div>
                  <div className="text-sm text-gray-600 mb-1">{insight.label}</div>
                  <div
                    className={`text-xs font-medium ${
                      insight.trend.startsWith("+") ? "text-green-600" : "text-blue-600"
                    }`}
                  >
                    {insight.trend}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-8">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl">
                Try Expense Management
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
