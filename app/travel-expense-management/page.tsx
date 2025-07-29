import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  PiCreditCardBold,
  PiChartBarBold,
  PiShieldCheckBold,
  PiCheckCircleBold,
  PiArrowRightBold,
  PiCameraBold,
  PiRobotBold,
  PiGlobeBold,
} from "react-icons/pi"

export const metadata: Metadata = {
  title: "Travel Expense Management | Suitpax - Automated Business Travel Expenses",
  description:
    "Streamline your business travel expenses with Suitpax's AI-powered expense management platform. Automated receipt scanning, real-time reporting, and policy compliance.",
  keywords:
    "travel expense management, business travel expenses, automated expense reports, receipt scanning, corporate travel, expense tracking",
}

export default function TravelExpenseManagementPage() {
  const features = [
    {
      icon: PiCameraBold,
      title: "Smart Receipt Scanning",
      description:
        "AI-powered OCR technology automatically extracts data from receipts and categorizes expenses in seconds.",
      benefits: ["99.9% accuracy", "Multi-language support", "Instant processing"],
    },
    {
      icon: PiCreditCardBold,
      title: "Corporate Card Integration",
      description:
        "Seamlessly connect with major corporate credit cards for automatic transaction import and matching.",
      benefits: ["Real-time sync", "Automatic matching", "Fraud detection"],
    },
    {
      icon: PiChartBarBold,
      title: "Advanced Analytics",
      description: "Get detailed insights into spending patterns, budget utilization, and cost-saving opportunities.",
      benefits: ["Custom dashboards", "Predictive analytics", "Cost optimization"],
    },
    {
      icon: PiShieldCheckBold,
      title: "Policy Compliance",
      description: "Automated policy enforcement ensures all expenses comply with company guidelines and regulations.",
      benefits: ["Real-time validation", "Custom rules", "Audit trails"],
    },
    {
      icon: PiRobotBold,
      title: "AI-Powered Automation",
      description: "Intelligent automation handles routine tasks, reducing manual work by up to 90%.",
      benefits: ["Smart categorization", "Auto-approval", "Exception handling"],
    },
    {
      icon: PiGlobeBold,
      title: "Multi-Currency Support",
      description: "Handle international expenses with automatic currency conversion and tax calculations.",
      benefits: ["Real-time rates", "Tax compliance", "Global reporting"],
    },
  ]

  const stats = [
    { value: "90%", label: "Reduction in processing time" },
    { value: "99.9%", label: "Data accuracy rate" },
    { value: "30%", label: "Average cost savings" },
    { value: "24/7", label: "Automated monitoring" },
  ]

  const integrations = [
    { name: "SAP Concur", logo: "/logos/sap-concur.png" },
    { name: "Expensify", logo: "/logos/expensify.png" },
    { name: "QuickBooks", logo: "/logos/quickbooks.png" },
    { name: "NetSuite", logo: "/logos/netsuite.png" },
    { name: "Xero", logo: "/logos/xero.png" },
    { name: "Sage", logo: "/logos/sage.png" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pb-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center rounded-xl bg-gray-800 px-2.5 py-0.5 text-[10px] font-medium text-white mb-6">
              <Image
                src="/logo/suitpax-symbol.webp"
                alt="Suitpax"
                width={12}
                height={12}
                className="mr-1.5 w-3 h-3 brightness-0 invert"
              />
              Expense Management
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6 text-black">
              Automate your travel
              <br />
              <span className="text-gray-600">expense management</span>
            </h1>

            <p className="text-lg font-light text-gray-700 max-w-3xl mx-auto mb-8">
              Transform your business travel expense process with AI-powered automation. From receipt scanning to policy
              compliance, streamline every aspect of expense management.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="px-6 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-900 transition-colors flex items-center justify-center"
              >
                Start Free Trial
                <PiArrowRightBold className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 border border-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Schedule Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-medium tracking-tighter text-black mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-xl bg-gray-800 px-2.5 py-0.5 text-[10px] font-medium text-white mb-6">
              Key Features
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6 text-black">
              Everything you need for
              <br />
              <span className="text-gray-600">expense management</span>
            </h2>
            <p className="text-lg font-light text-gray-700 max-w-3xl mx-auto">
              Our comprehensive platform handles every aspect of travel expense management, from capture to reporting.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-6"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-gray-600" />
                </div>

                <h3 className="text-xl font-medium tracking-tighter mb-3 text-black">{feature.title}</h3>

                <p className="text-gray-600 mb-4 font-light">{feature.description}</p>

                <div className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center text-sm text-gray-700">
                      <PiCheckCircleBold className="w-4 h-4 text-green-500 mr-2" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-xl bg-gray-800 px-2.5 py-0.5 text-[10px] font-medium text-white mb-6">
              How It Works
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6 text-black">
              Simple, automated
              <br />
              <span className="text-gray-600">expense workflow</span>
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <PiCameraBold className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-medium tracking-tighter mb-3 text-black">1. Capture</h3>
                <p className="text-gray-600 font-light">
                  Snap a photo of your receipt or connect your corporate card for automatic transaction import.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <PiRobotBold className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-medium tracking-tighter mb-3 text-black">2. Process</h3>
                <p className="text-gray-600 font-light">
                  AI automatically extracts data, categorizes expenses, and checks policy compliance.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <PiChartBarBold className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-medium tracking-tighter mb-3 text-black">3. Report</h3>
                <p className="text-gray-600 font-light">
                  Generate comprehensive reports and sync with your accounting system automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-xl bg-gray-800 px-2.5 py-0.5 text-[10px] font-medium text-white mb-6">
              Integrations
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6 text-black">
              Connect with your
              <br />
              <span className="text-gray-600">existing tools</span>
            </h2>
            <p className="text-lg font-light text-gray-700 max-w-3xl mx-auto">
              Seamlessly integrate with popular accounting and expense management platforms.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-5xl mx-auto">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-center"
              >
                <Image
                  src={integration.logo || "/placeholder.svg"}
                  alt={integration.name}
                  width={80}
                  height={40}
                  className="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center rounded-xl bg-gray-800 px-2.5 py-0.5 text-[10px] font-medium text-white mb-6">
              Get Started Today
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6 text-black">
              Ready to automate your
              <br />
              <span className="text-gray-600">expense management?</span>
            </h2>

            <p className="text-lg font-light text-gray-700 max-w-3xl mx-auto mb-8">
              Join thousands of companies that have streamlined their travel expense processes with Suitpax.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="px-8 py-4 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-900 transition-colors flex items-center justify-center"
              >
                Start Free Trial
                <PiArrowRightBold className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 border border-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Schedule Demo
              </Link>
            </div>

            <p className="text-xs text-gray-500 mt-6">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </div>
      </section>
    </div>
  )
}
