"use client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { SiJapanairlines, SiTurkishairlines, SiUnitedairlines, SiEtihadairways, SiQatarairways } from "react-icons/si"
import {
  PiAirplaneTakeoffBold,
  PiChartLineBold,
  PiChartBarBold,
  PiUsersBold,
  PiGlobeBold,
  PiDatabaseBold,
  PiCurrencyDollarBold,
  PiPlusBold,
  PiCreditCardBold,
  PiReceiptBold,
  PiTrendUpBold,
  PiPercentBold,
  PiClockCountdownBold,
  PiLightningBold,
  PiCalendarCheckBold,
} from "react-icons/pi"

export default function SmartTravel() {
  const [activeTab, setActiveTab] = useState("travel")
  const [showPlaygroundContent, setShowPlaygroundContent] = useState(false)

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-medium text-white">
              Suitpax Travel
            </span>
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-[9px] font-medium text-blue-700">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse mr-1"></span>
              Interactive Demo
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-blue-950 leading-none">
            Smart Travel Platform
          </h2>
          <p className="mt-3 text-sm font-medium text-blue-700 max-w-2xl mb-6">
            Comprehensive travel management and analytics for corporate travelers and travel managers
          </p>
        </div>

        {/* CRM Demo UI */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
            {/* CRM Navigation */}
            <div className="flex overflow-x-auto bg-blue-50 border-b border-blue-100 p-1">
              {["travel", "expenses", "savings"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "travel" ? "Travel Data" : tab === "expenses" ? "Expenses" : "Savings Report"}
                </button>
              ))}
            </div>

            {/* CRM Content */}
            <div className="p-6">
              {/* Travel Data Tab */}
              {activeTab === "travel" && (
                <div className="content-travel space-y-6">
                  {/* Stats Row - Vertical Layout */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {
                        label: "Total Flights",
                        value: "248",
                        icon: <PiAirplaneTakeoffBold />,
                        color: "bg-blue-50 text-blue-600 border-blue-200",
                      },
                      {
                        label: "Total Savings",
                        value: "$12,450",
                        icon: <PiCurrencyDollarBold />,
                        color: "bg-green-50 text-green-600 border-green-200",
                      },
                      {
                        label: "Destinations",
                        value: "36",
                        icon: <PiGlobeBold />,
                        color: "bg-purple-50 text-purple-600 border-purple-200",
                      },
                      {
                        label: "Travelers",
                        value: "124",
                        icon: <PiUsersBold />,
                        color: "bg-amber-50 text-amber-600 border-amber-200",
                      },
                    ].map((stat, i) => (
                      <div key={i} className={`${stat.color} rounded-xl p-3 flex flex-col items-start w-full border`}>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-current shadow-sm">
                            {stat.icon}
                          </div>
                          <p className="text-current text-[10px] font-medium tracking-wide uppercase">{stat.label}</p>
                        </div>
                        <p className="text-current text-lg font-mono font-bold tracking-tight">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* AI Assistant Card */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl border border-blue-400 p-4 mt-4 text-white shadow-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white/30">
                        <Image
                          src="/agents/agent-15.png"
                          alt="AI Assistant"
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium tracking-tighter text-white">Hey, Claude!</h4>
                        <p className="text-[11px] text-white/90 mt-1">
                          Your team at Anthropic has 5 upcoming trips this month. Would you like to review the
                          itineraries?
                        </p>
                        <div className="flex gap-2 mt-3">
                          <button className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-[10px] rounded-lg transition-colors">
                            View Trips
                          </button>
                          <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] rounded-lg transition-colors">
                            Team Calendar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Trips - Modern Design */}
                  <div className="bg-white rounded-xl border border-blue-100 p-4 mt-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-blue-950">Anthropic Team Trips</h3>
                      <span className="inline-flex items-center rounded-md bg-blue-50 border border-blue-200 px-4 py-0.5 text-[10px] font-medium text-blue-700 tracking-wide">
                        <div className="w-4 h-4 rounded-md bg-blue-600 flex items-center justify-center text-white mr-2">
                          <PiCalendarCheckBold className="h-2.5 w-2.5" />
                        </div>
                        UPCOMING TRAVEL
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        {
                          route: "SFO → LHR",
                          company: "United Airlines",
                          date: "May 15, 2025",
                          traveler: "Dario Amodei",
                          icon: <SiUnitedairlines className="text-blue-700 w-full h-full" />,
                        },
                        {
                          route: "SFO → NRT",
                          company: "Japan Airlines",
                          date: "May 22, 2025",
                          traveler: "Jack Clark",
                          icon: <SiJapanairlines className="text-blue-700 w-full h-full" />,
                        },
                        {
                          route: "SFO → IST",
                          company: "Turkish Airlines",
                          date: "Jun 3, 2025",
                          traveler: "Daniela Amodei",
                          icon: <SiTurkishairlines className="text-blue-700 w-full h-full" />,
                        },
                        {
                          route: "SFO → AUH",
                          company: "Etihad Airways",
                          date: "Jun 10, 2025",
                          traveler: "Jared Kaplan",
                          icon: <SiEtihadairways className="text-blue-700 w-full h-full" />,
                        },
                        {
                          route: "SFO → DOH",
                          company: "Qatar Airways",
                          date: "Jun 18, 2025",
                          traveler: "Liane Lovitt",
                          icon: <SiQatarairways className="text-blue-700 w-full h-full" />,
                        },
                      ].map((trip, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors h-10"
                        >
                          <div className="w-7 h-7 rounded-lg bg-white border border-blue-200 flex items-center justify-center flex-shrink-0 p-1.5 shadow-sm">
                            {trip.icon}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-blue-950">{trip.route}</p>
                            <p className="text-[9px] text-blue-700">
                              {trip.traveler} • {trip.date}
                            </p>
                          </div>
                          <div className="ml-auto">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white border border-blue-200 text-[8px] font-medium text-blue-700 shadow-sm">
                              {trip.company}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Data Visualization */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Spend by Category */}
                    <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                          <PiChartBarBold />
                        </div>
                        <p className="text-blue-950 text-[11px] font-medium tracking-wide uppercase">
                          Travel Spend by Category
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-blue-700">Flights</span>
                            <span className="font-mono font-bold text-blue-950">$45,320</span>
                          </div>
                          <div className="w-full bg-blue-100 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-blue-700">Hotels</span>
                            <span className="font-mono font-bold text-blue-950">$28,450</span>
                          </div>
                          <div className="w-full bg-blue-100 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "40%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-blue-700">Transportation</span>
                            <span className="font-mono font-bold text-blue-950">$12,780</span>
                          </div>
                          <div className="w-full bg-blue-100 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-blue-700">Meals</span>
                            <span className="font-mono font-bold text-blue-950">$8,940</span>
                          </div>
                          <div className="w-full bg-blue-100 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "15%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Visualization Tools */}
                    <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                          <PiDatabaseBold />
                        </div>
                        <p className="text-blue-950 text-[11px] font-medium tracking-wide uppercase">
                          Upcoming Travelers
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-white border border-blue-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <PiChartBarBold className="text-blue-600 w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-blue-950">Team Analytics</p>
                            <p className="text-[9px] text-blue-700">View travel patterns by team</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-white border border-blue-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <PiChartLineBold className="text-blue-600 w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-blue-950">Travel Trends</p>
                            <p className="text-[9px] text-blue-700">Monitor travel frequency over time</p>
                          </div>
                        </div>

                        <button
                          className="flex items-center w-full gap-3 p-2 rounded-lg border border-dashed border-blue-300 hover:bg-blue-50 transition-colors"
                          onClick={() => setShowPlaygroundContent(!showPlaygroundContent)}
                        >
                          {!showPlaygroundContent ? (
                            <>
                              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                                <PiPlusBold className="text-blue-600 w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-blue-950">Playground</p>
                                <p className="text-[9px] text-blue-700">View upcoming traveler details</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0 border border-blue-200 shadow-sm">
                                <Image
                                  src="/agents/agent-13.png"
                                  alt="Traveler"
                                  width={32}
                                  height={32}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <p className="text-xs font-medium text-blue-950">Sarah Chen</p>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white border border-blue-200 text-[8px] font-medium text-blue-700 shadow-sm">
                                    SFO → BER
                                  </span>
                                </div>
                                <p className="text-[9px] text-blue-700">AI Research Conference • Jul 5, 2025</p>
                              </div>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Expenses Tab */}
              {activeTab === "expenses" && (
                <div className="content-expenses space-y-6">
                  {/* Stats Row - Vertical Layout */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {
                        label: "Total Expenses",
                        value: "$95,490",
                        icon: <PiCreditCardBold />,
                        color: "bg-blue-50 text-blue-600 border-blue-200",
                      },
                      {
                        label: "Receipts",
                        value: "342",
                        icon: <PiReceiptBold />,
                        color: "bg-purple-50 text-purple-600 border-purple-200",
                      },
                      {
                        label: "YoY Change",
                        value: "+12.4%",
                        icon: <PiTrendUpBold />,
                        color: "bg-green-50 text-green-600 border-green-200",
                      },
                      {
                        label: "Pending",
                        value: "$4,250",
                        icon: <PiClockCountdownBold />,
                        color: "bg-amber-50 text-amber-600 border-amber-200",
                      },
                    ].map((stat, i) => (
                      <div key={i} className={`${stat.color} rounded-xl p-3 flex flex-col items-start w-full border`}>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-current shadow-sm">
                            {stat.icon}
                          </div>
                          <p className="text-current text-[10px] font-medium tracking-wide uppercase">{stat.label}</p>
                        </div>
                        <p className="text-current text-lg font-mono font-bold tracking-tight">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent Expenses - Modern Design */}
                  <div className="bg-white rounded-xl border border-blue-100 p-4 mt-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-blue-950">Anthropic Team Expenses</h3>
                      <span className="inline-flex items-center rounded-md bg-blue-50 border border-blue-200 px-4 py-0.5 text-[10px] font-medium text-blue-700 tracking-wide">
                        <div className="w-4 h-4 rounded-md bg-blue-600 flex items-center justify-center text-white mr-2">
                          <PiCreditCardBold className="h-2.5 w-2.5" />
                        </div>
                        EXPENSE DATA
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        {
                          description: "Tokyo Conference",
                          category: "Flight",
                          date: "Apr 8, 2025",
                          amount: "$2,450",
                          traveler: "Dario Amodei",
                          icon: <SiJapanairlines className="text-blue-700 w-full h-full" />,
                        },
                        {
                          description: "Hilton London",
                          category: "Hotel",
                          date: "Apr 2, 2025",
                          amount: "$1,850",
                          traveler: "Jack Clark",
                          icon: <PiCreditCardBold className="text-blue-700 w-full h-full" />,
                        },
                        {
                          description: "Client Dinner - NYC",
                          category: "Meals",
                          date: "Mar 28, 2025",
                          amount: "$320",
                          traveler: "Daniela Amodei",
                          icon: <PiReceiptBold className="text-blue-700 w-full h-full" />,
                        },
                        {
                          description: "Istanbul Conference",
                          category: "Conference",
                          date: "Mar 15, 2025",
                          amount: "$1,750",
                          traveler: "Jared Kaplan",
                          icon: <SiTurkishairlines className="text-blue-700 w-full h-full" />,
                        },
                        {
                          description: "Transportation - Dubai",
                          category: "Transport",
                          date: "Mar 10, 2025",
                          amount: "$280",
                          traveler: "Liane Lovitt",
                          icon: <PiCreditCardBold className="text-blue-700 w-full h-full" />,
                        },
                      ].map((expense, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors h-10"
                        >
                          <div className="w-7 h-7 rounded-lg bg-white border border-blue-200 flex items-center justify-center flex-shrink-0 p-1.5 shadow-sm">
                            {expense.icon}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-blue-950">{expense.description}</p>
                            <p className="text-[9px] text-blue-700">
                              {expense.traveler} • {expense.date}
                            </p>
                          </div>
                          <div className="ml-auto">
                            <span className="text-xs font-mono font-bold text-blue-950">{expense.amount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expense Analytics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Expense Breakdown */}
                    <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                          <PiChartBarBold />
                        </div>
                        <p className="text-blue-950 text-[11px] font-medium tracking-wide uppercase">
                          Expense Breakdown
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-blue-700">Business</span>
                            <span className="font-mono font-bold text-blue-950">$78,320</span>
                          </div>
                          <div className="w-full bg-blue-100 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "82%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-blue-700">Personal</span>
                            <span className="font-mono font-bold text-blue-950">$17,170</span>
                          </div>
                          <div className="w-full bg-blue-100 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "18%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expense Tools */}
                    <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                          <PiReceiptBold />
                        </div>
                        <p className="text-blue-950 text-[11px] font-medium tracking-wide uppercase">Expense Tools</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-white border border-blue-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <PiReceiptBold className="text-blue-600 w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-blue-950">Receipt Scanner</p>
                            <p className="text-[9px] text-blue-700">Auto-categorize expenses</p>
                          </div>
                        </div>

                        <button
                          className="flex items-center w-full gap-3 p-2 rounded-lg border border-dashed border-blue-300 hover:bg-blue-50 transition-colors"
                          onClick={() => setShowPlaygroundContent(!showPlaygroundContent)}
                        >
                          {!showPlaygroundContent ? (
                            <>
                              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                                <PiPlusBold className="text-blue-600 w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-blue-950">Playground</p>
                                <p className="text-[9px] text-blue-700">View traveler expenses</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0 border border-blue-200 shadow-sm">
                                <Image
                                  src="/agents/agent-8.png"
                                  alt="Traveler"
                                  width={32}
                                  height={32}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <p className="text-xs font-medium text-blue-950">Tom Brown</p>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white border border-blue-200 text-[8px] font-medium text-blue-700 shadow-sm">
                                    $3,450
                                  </span>
                                </div>
                                <p className="text-[9px] text-blue-700">AI Research Conference • Jun 12, 2025</p>
                              </div>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Savings Report Tab */}
              {activeTab === "savings" && (
                <div className="content-savings space-y-6">
                  {/* Stats Row - Vertical Layout */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {
                        label: "Total Savings",
                        value: "$32,450",
                        icon: <PiCurrencyDollarBold />,
                        color: "bg-green-50 text-green-600 border-green-200",
                      },
                      {
                        label: "Savings Rate",
                        value: "24.8%",
                        icon: <PiPercentBold />,
                        color: "bg-blue-50 text-blue-600 border-blue-200",
                      },
                      {
                        label: "AI Optimizations",
                        value: "128",
                        icon: <PiLightningBold />,
                        color: "bg-purple-50 text-purple-600 border-purple-200",
                      },
                      {
                        label: "YoY Improvement",
                        value: "+8.3%",
                        icon: <PiTrendUpBold />,
                        color: "bg-amber-50 text-amber-600 border-amber-200",
                      },
                    ].map((stat, i) => (
                      <div key={i} className={`${stat.color} rounded-xl p-3 flex flex-col items-start w-full border`}>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-current shadow-sm">
                            {stat.icon}
                          </div>
                          <p className="text-current text-[10px] font-medium tracking-wide uppercase">{stat.label}</p>
                        </div>
                        <p className="text-current text-lg font-mono font-bold tracking-tight">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Savings Opportunities - Modern Design */}
                  <div className="bg-white rounded-xl border border-blue-100 p-4 mt-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-blue-950">Anthropic Savings Opportunities</h3>
                      <span className="inline-flex items-center rounded-md bg-blue-50 border border-blue-200 px-4 py-0.5 text-[10px] font-medium text-blue-700 tracking-wide">
                        <div className="w-4 h-4 rounded-md bg-blue-600 flex items-center justify-center text-white mr-2">
                          <PiCurrencyDollarBold className="h-2.5 w-2.5" />
                        </div>
                        SAVINGS DATA
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        {
                          route: "SFO → LHR",
                          company: "United Airlines",
                          standard: "$3,450",
                          discounted: "$2,780",
                          savings: "$670 (19%)",
                          traveler: "Dario Amodei",
                          icon: <SiUnitedairlines className="text-blue-700 w-full h-full" />,
                        },
                        {
                          route: "JFK → NRT",
                          company: "Japan Airlines",
                          standard: "$4,200",
                          discounted: "$3,150",
                          savings: "$1,050 (25%)",
                          traveler: "Jack Clark",
                          icon: <SiJapanairlines className="text-blue-700 w-full h-full" />,
                        },
                        {
                          route: "LAX → DOH",
                          company: "Qatar Airways",
                          standard: "$3,850",
                          discounted: "$2,920",
                          savings: "$930 (24%)",
                          traveler: "Daniela Amodei",
                          icon: <SiQatarairways className="text-blue-700 w-full h-full" />,
                        },
                        {
                          route: "MIA → IST",
                          company: "Turkish Airlines",
                          standard: "$2,950",
                          discounted: "$2,380",
                          savings: "$570 (19%)",
                          traveler: "Jared Kaplan",
                          icon: <SiTurkishairlines className="text-blue-700 w-full h-full" />,
                        },
                        {
                          route: "DFW → AUH",
                          company: "Etihad Airways",
                          standard: "$3,750",
                          discounted: "$2,850",
                          savings: "$900 (24%)",
                          traveler: "Liane Lovitt",
                          icon: <SiEtihadairways className="text-blue-700 w-full h-full" />,
                        },
                      ].map((saving, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors h-10"
                        >
                          <div className="w-7 h-7 rounded-lg bg-white border border-blue-200 flex items-center justify-center flex-shrink-0 p-1.5 shadow-sm">
                            {saving.icon}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-blue-950">{saving.route}</p>
                            <p className="text-[9px] text-blue-700">
                              {saving.traveler} • <span className="line-through">{saving.standard}</span>{" "}
                              <span className="font-medium">{saving.discounted}</span>
                            </p>
                          </div>
                          <div className="ml-auto">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white border border-green-200 text-[8px] font-medium text-green-600 shadow-sm">
                              {saving.savings}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Savings Analytics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Savings by Category */}
                    <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                          <PiChartBarBold />
                        </div>
                        <p className="text-blue-950 text-[11px] font-medium tracking-wide uppercase">
                          Savings by Category
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-blue-700">Corporate Rates</span>
                            <span className="font-mono font-bold text-blue-950">$18,450</span>
                          </div>
                          <div className="w-full bg-blue-100 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "57%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-blue-700">AI Price Predictions</span>
                            <span className="font-mono font-bold text-blue-950">$8,320</span>
                          </div>
                          <div className="w-full bg-blue-100 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "26%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-blue-700">Loyalty Programs</span>
                            <span className="font-mono font-bold text-blue-950">$5,680</span>
                          </div>
                          <div className="w-full bg-blue-100 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "17%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Savings Tools */}
                    <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                          <PiPercentBold />
                        </div>
                        <p className="text-blue-950 text-[11px] font-medium tracking-wide uppercase">Savings Tools</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-white border border-blue-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <PiTrendUpBold className="text-blue-600 w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-blue-950">Price Predictor</p>
                            <p className="text-[9px] text-blue-700">AI-powered booking recommendations</p>
                          </div>
                        </div>

                        <button
                          className="flex items-center w-full gap-3 p-2 rounded-lg border border-dashed border-blue-300 hover:bg-blue-50 transition-colors"
                          onClick={() => setShowPlaygroundContent(!showPlaygroundContent)}
                        >
                          {!showPlaygroundContent ? (
                            <>
                              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                                <PiPlusBold className="text-blue-600 w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-blue-950">Playground</p>
                                <p className="text-[9px] text-blue-700">View traveler savings</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0 border border-blue-200 shadow-sm">
                                <Image
                                  src="/agents/agent-5.png"
                                  alt="Traveler"
                                  width={32}
                                  height={32}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <p className="text-xs font-medium text-blue-950">Chris Olah</p>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white border border-green-200 text-[8px] font-medium text-green-600 shadow-sm">
                                    $1,250 saved
                                  </span>
                                </div>
                                <p className="text-[9px] text-blue-700">Research Trip to Berlin • Aug 15, 2025</p>
                              </div>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <Link
            href="#"
            className="inline-flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-xl text-sm font-medium tracking-tighter shadow-sm transition-colors"
          >
            Try our AI travel platform
          </Link>
        </div>
      </div>
    </section>
  )
}
