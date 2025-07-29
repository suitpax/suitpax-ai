import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  PiArrowRightBold,
  PiChartLineUpBold,
  PiCurrencyDollarBold,
  PiLightningBold,
  PiShieldCheckBold,
  PiClockBold,
  PiTrendUpBold,
  PiCheckCircleBold,
} from "react-icons/pi"

import BankConnection from "@/components/marketing/bank-connection"

export const metadata: Metadata = {
  title: "Travel Expense Management | Suitpax - AI-Powered Business Travel Platform",
  description:
    "Simplify your business travel expense management with Suitpax's AI-powered tools, automated reporting, and seamless bank integrations. Reduce costs by up to 30%.",
  keywords:
    "travel expense management, business travel expenses, automated expense reporting, AI expense tracking, corporate travel costs, expense automation",
  openGraph: {
    title: "Travel Expense Management | Suitpax - AI-Powered Business Travel Platform",
    description:
      "Simplify your business travel expense management with Suitpax's AI-powered tools, automated reporting, and seamless bank integrations. Reduce costs by up to 30%.",
    url: "https://suitpax.com/travel-expense-management",
    siteName: "Suitpax",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Suitpax Travel Expense Management",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Expense Management | Suitpax - AI-Powered Business Travel Platform",
    description:
      "Simplify your business travel expense management with Suitpax's AI-powered tools, automated reporting, and seamless bank integrations. Reduce costs by up to 30%.",
    images: ["/twitter-image.png"],
    creator: "@suitpax",
  },
  alternates: {
    canonical: "https://suitpax.com/travel-expense-management",
  },
}

export default function TravelExpenseManagement() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden bg-gray-50">
        <div className="absolute inset-0 opacity-[0.03] bg-repeat bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-xl bg-gray-800 px-2.5 py-0.5 text-[10px] font-medium text-white mb-6">
              <PiCurrencyDollarBold className="mr-1 h-3 w-3" />
              Travel Expense Management
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6 text-black">
              Automate your travel
              <br />
              <span className="text-gray-600">expense management</span>
            </h1>
            <p className="text-lg font-light text-gray-700 mb-8 max-w-3xl">
              Transform how your company handles travel expenses with our AI platform that automates tracking, approval,
              and reimbursement of business travel expenses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="#connect-bank"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-black text-white font-medium transition-all hover:bg-gray-900 shadow-lg"
              >
                Connect Bank
                <PiArrowRightBold className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white border border-gray-200 text-black font-medium transition-all hover:bg-gray-50 shadow-sm"
              >
                View Features
              </Link>
            </div>
          </div>

          <div className="relative w-full max-w-5xl mx-auto">
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-lg">
              <Image
                src="/business-expense.png"
                alt="Travel expense management dashboard"
                width={1200}
                height={675}
                className="w-full h-auto rounded-xl shadow-sm"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-lg hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <PiTrendUpBold className="h-6 w-6 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Average Savings</p>
                  <p className="text-2xl font-bold text-black">30%</p>
                  <p className="text-xs text-gray-500">on travel expenses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 bg-white" id="features">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter mb-6 text-black">
              Optimize your business
              <br />
              <span className="text-gray-600">expense workflow</span>
            </h2>
            <p className="text-lg font-light text-gray-700 max-w-3xl mx-auto">
              Our platform eliminates manual paperwork and automates the entire process from transaction to
              reimbursement, saving time and reducing errors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {/* Benefit 1 */}
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
                <PiLightningBold className="h-7 w-7 text-gray-700" />
              </div>
              <h3 className="text-xl font-medium tracking-tighter mb-4 text-black">Automatic Capture</h3>
              <p className="text-gray-700 font-light leading-relaxed">
                Automatically import and categorize transactions from your connected financial accounts. No more lost
                receipts or manual data entry.
              </p>
              <div className="mt-6 flex items-center text-sm font-medium text-gray-600">
                <PiCheckCircleBold className="h-4 w-4 mr-2 text-gray-400" />
                Real-time bank integration
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
                <PiShieldCheckBold className="h-7 w-7 text-gray-700" />
              </div>
              <h3 className="text-xl font-medium tracking-tighter mb-4 text-black">Policy Compliance</h3>
              <p className="text-gray-700 font-light leading-relaxed">
                Automatically flag expenses that don't comply with your company's travel policies. Maintain control and
                transparency in every transaction.
              </p>
              <div className="mt-6 flex items-center text-sm font-medium text-gray-600">
                <PiCheckCircleBold className="h-4 w-4 mr-2 text-gray-400" />
                Smart policy alerts
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
                <PiChartLineUpBold className="h-7 w-7 text-gray-700" />
              </div>
              <h3 className="text-xl font-medium tracking-tighter mb-4 text-black">Smart Reporting</h3>
              <p className="text-gray-700 font-light leading-relaxed">
                Generate detailed expense reports with just a few clicks and get insights into spending patterns to
                optimize your travel budget.
              </p>
              <div className="mt-6 flex items-center text-sm font-medium text-gray-600">
                <PiCheckCircleBold className="h-4 w-4 mr-2 text-gray-400" />
                Advanced analytics included
              </div>
            </div>
          </div>

          {/* Process Flow */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-medium tracking-tighter text-center mb-12 text-black">
              Simplified process in 4 steps
            </h3>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Connect",
                  description: "Link your bank accounts and corporate cards securely",
                },
                {
                  step: "02",
                  title: "Travel",
                  description: "Make your travel expenses normally, without changing your routine",
                },
                {
                  step: "03",
                  title: "Automate",
                  description: "AI automatically categorizes and processes all expenses",
                },
                {
                  step: "04",
                  title: "Approve",
                  description: "Review and approve automatically generated reports",
                },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                    {item.step}
                  </div>
                  <h4 className="text-lg font-medium mb-2 text-black">{item.title}</h4>
                  <p className="text-sm text-gray-600 font-light">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bank Connection Section */}
      <div id="connect-bank">
        <BankConnection />
      </div>

      {/* ROI Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <div className="inline-flex items-center rounded-xl bg-gray-800 px-2.5 py-0.5 text-[10px] font-medium text-white mb-6">
                <PiChartLineUpBold className="mr-1 h-3 w-3" />
                ROI Calculator
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter mb-6 text-black">
                Calculate your potential
                <br />
                <span className="text-gray-600">savings</span>
              </h2>
              <p className="text-lg font-light text-gray-700 mb-8">
                Our clients typically save 30% on travel expenses through better policy compliance, automated
                processing, and negotiated rates.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "Reduce processing time by 75%",
                  "Decrease travel costs up to 30%",
                  "Eliminate 99% of reporting errors",
                  "Improve employee satisfaction",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <PiCheckCircleBold className="h-5 w-5 text-gray-700 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-light">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="#connect-bank"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-black text-white font-medium transition-all hover:bg-gray-900 shadow-lg"
              >
                Get Started Now
                <PiArrowRightBold className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-lg">
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700">Manual processing</p>
                    <p className="text-lg font-bold text-gray-900">$28.50</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gray-400 h-3 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                  <p className="text-xs text-gray-500">Average cost per expense report</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700">With Suitpax automation</p>
                    <p className="text-lg font-bold text-gray-900">$7.25</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gray-700 h-3 rounded-full" style={{ width: "25%" }}></div>
                  </div>
                  <p className="text-xs text-gray-700">75% cost reduction</p>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-700">Annual savings for 100 employees</p>
                    <p className="text-2xl font-bold text-black">$63,750</p>
                  </div>
                  <p className="text-xs text-gray-500">Based on average of 15 expense reports per employee annually</p>
                </div>

                <div className="bg-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <PiClockBold className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Time saved</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">1,200 hours/year</p>
                  <p className="text-xs text-gray-500">Equivalent to 30 weeks of work</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter mb-6">
              Ready to transform your company's
              <br />
              <span className="text-gray-400">expense management?</span>
            </h2>
            <p className="text-white/70 font-light mb-8 max-w-3xl mx-auto text-lg">
              Join thousands of companies that have simplified travel expense management with Suitpax. Start your
              digital transformation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#connect-bank"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-black font-medium transition-all hover:bg-gray-100 shadow-lg"
              >
                Connect Bank
                <PiArrowRightBold className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-transparent border border-white/20 text-white font-medium transition-all hover:bg-white/10"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
