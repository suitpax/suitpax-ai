import type { Metadata } from "next"
import Image from "next/image"
import { PiArrowRightBold, PiChartLineUpBold, PiCurrencyDollarBold, PiLightningBold } from "react-icons/pi"

import BankConnection from "@/components/marketing/bank-connection"

export const metadata: Metadata = {
  title: "Travel Expense Management | Suitpax",
  description:
    "Simplify your business travel expense management with Suitpax's AI-powered tools and bank integrations.",
  openGraph: {
    title: "Travel Expense Management | Suitpax",
    description:
      "Simplify your business travel expense management with Suitpax's AI-powered tools and bank integrations.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Suitpax Travel Expense Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Expense Management | Suitpax",
    description:
      "Simplify your business travel expense management with Suitpax's AI-powered tools and bank integrations.",
    images: ["/twitter-image.png"],
  },
}

export default function TravelExpenseManagement() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden bg-gray-50">
        <div className="absolute inset-0 opacity-[0.03] bg-repeat bg-[radial-gradient(#000000 1px,transparent 1px)] [background-size:20px_20px]"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-4">
              <PiCurrencyDollarBold className="mr-1 h-3 w-3" />
              Expense Management
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6">
              Simplify your travel expenses
            </h1>
            <p className="text-lg font-light text-gray-700 mb-8 max-w-2xl">
              Automate expense tracking, reporting, and reimbursements with our AI-powered platform that connects
              directly to your financial institutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a
                href="#connect-bank"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-black text-white font-medium transition-all hover:bg-gray-900"
              >
                Connect your bank
                <PiArrowRightBold className="ml-2 h-4 w-4" />
              </a>
              <a
                href="#learn-more"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white border border-gray-200 text-black font-medium transition-all hover:bg-gray-50"
              >
                Learn more
              </a>
            </div>
          </div>

          <div className="relative w-full max-w-4xl mx-auto">
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <Image
                src="/business-expense.png"
                alt="Travel expense management dashboard"
                width={1200}
                height={675}
                className="w-full h-auto rounded-xl"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-sm hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-950/10 flex items-center justify-center">
                  <PiChartLineUpBold className="h-5 w-5 text-emerald-950" />
                </div>
                <div>
                  <p className="text-sm font-medium">Average savings</p>
                  <p className="text-xl font-bold">23%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 bg-white" id="learn-more">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter mb-4">Streamline your expense workflow</h2>
            <p className="text-gray-700 font-light max-w-2xl mx-auto">
              Our platform eliminates manual expense reporting and automates the entire process from transaction to
              reimbursement.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Benefit 1 */}
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <PiLightningBold className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="text-xl font-medium tracking-tighter mb-2">Automated Capture</h3>
              <p className="text-gray-700 font-light">
                Automatically import and categorize transactions from your connected financial accounts.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-gray-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium tracking-tighter mb-2">Policy Compliance</h3>
              <p className="text-gray-700 font-light">
                Automatically flag expenses that don't comply with your company's travel policy.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-gray-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 19V13C9 11.8954 8.10457 11 7 11H5M9 19V5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V19M9 19H15M15 19H19M15 7H17C18.1046 7 19 7.89543 19 9V19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium tracking-tighter mb-2">Smart Reporting</h3>
              <p className="text-gray-700 font-light">
                Generate detailed expense reports with just a few clicks and gain insights into spending patterns.
              </p>
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
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-4">
                <PiChartLineUpBold className="mr-1 h-3 w-3" />
                ROI Calculator
              </div>
              <h2 className="text-3xl md:text-4xl font-medium tracking-tighter mb-4">Calculate your savings</h2>
              <p className="text-gray-700 font-light mb-6">
                Our customers typically save 23% on travel expenses through better policy compliance, automated
                processing, and negotiated rates.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "Reduce processing time by 45%",
                  "Lower travel costs by up to 23%",
                  "Eliminate 99% of expense report errors",
                  "Improve employee satisfaction",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg
                      className="h-5 w-5 text-emerald-950 mt-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 13L9 17L19 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#connect-bank"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-black text-white font-medium transition-all hover:bg-gray-900"
              >
                Start saving now
                <PiArrowRightBold className="ml-2 h-4 w-4" />
              </a>
            </div>

            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Manual expense processing</p>
                    <p className="text-sm font-bold">$28.50</p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-gray-400 h-2 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                  <p className="text-xs text-gray-500">Average cost per expense report</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">With Suitpax automation</p>
                    <p className="text-sm font-bold text-emerald-950">$6.85</p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-emerald-950 h-2 rounded-full" style={{ width: "24%" }}></div>
                  </div>
                  <p className="text-xs text-emerald-950">76% cost reduction</p>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium">Annual savings for 100 employees</p>
                    <p className="text-xl font-bold">$51,975</p>
                  </div>
                  <p className="text-xs text-gray-500">Based on average of 15 expense reports per employee annually</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter mb-6">
              Ready to transform your expense management?
            </h2>
            <p className="text-white/70 font-light mb-8 max-w-2xl mx-auto">
              Join thousands of businesses that have simplified their travel expense management with Suitpax.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#connect-bank"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-black font-medium transition-all hover:bg-gray-100"
              >
                Connect your bank
                <PiArrowRightBold className="ml-2 h-4 w-4" />
              </a>
              <a
                href="/pricing"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-transparent border border-white/20 text-white font-medium transition-all hover:bg-white/10"
              >
                View pricing
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
