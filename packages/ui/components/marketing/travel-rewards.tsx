"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Award, CreditCard, Plane, Hotel, Gift, Ticket, Utensils, Briefcase, Clock, Shield } from "lucide-react"

export const TravelRewards = () => {
  const [activeCard, setActiveCard] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 3)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const rewardCards = [
    {
      airline: "American Airlines",
      logo: "https://cdn.brandfetch.io/aa.com/w/512/h/78/theme/light/logo?c=1idU-l8vdm7C5__3dci",
      route: "New York (JFK) → London (LHR)",
      miles: "11,500 miles",
      status: "Gold status fast-track",
      details: "Priority boarding + Extra baggage allowance",
    },
    {
      airline: "Delta Air Lines",
      logo: "https://cdn.brandfetch.io/delta.com/w/512/h/80/logo?c=1idU-l8vdm7C5__3dci",
      route: "San Francisco (SFO) → Tokyo (HND)",
      miles: "15,200 miles",
      status: "Platinum status boost",
      details: "Lounge access + Upgrade priority",
    },
    {
      airline: "Emirates",
      logo: "https://cdn.brandfetch.io/emirates.com/w/512/h/80/logo?c=1idU-l8vdm7C5__3dci",
      route: "Dubai (DXB) → Sydney (SYD)",
      miles: "18,400 miles",
      status: "Skywards Silver fast-track",
      details: "Complimentary chauffeur service + Spa voucher",
    },
  ]

  const partnerBenefits = [
    {
      name: "Airline Miles",
      icon: <Plane className="h-4 w-4 text-gray-300" />,
      description: "3x miles on all business flights",
    },
    {
      name: "Hotel Points",
      icon: <Hotel className="h-4 w-4 text-gray-300" />,
      description: "2x points on premium accommodations",
    },
    {
      name: "Credit Card",
      icon: <CreditCard className="h-4 w-4 text-gray-300" />,
      description: "5% cashback on travel expenses",
    },
    {
      name: "Priority Access",
      icon: <Award className="h-4 w-4 text-gray-300" />,
      description: "Fast-track security at 250+ airports",
    },
    {
      name: "Lounge Access",
      icon: <Briefcase className="h-4 w-4 text-gray-300" />,
      description: "Complimentary entry to 1,200+ lounges",
    },
    {
      name: "Dining Rewards",
      icon: <Utensils className="h-4 w-4 text-gray-300" />,
      description: "4x points at partner restaurants",
    },
    {
      name: "Event Access",
      icon: <Ticket className="h-4 w-4 text-gray-300" />,
      description: "VIP tickets to exclusive events",
    },
    {
      name: "Gift Rewards",
      icon: <Gift className="h-4 w-4 text-gray-300" />,
      description: "Premium gifts from luxury brands",
    },
    {
      name: "Time Savings",
      icon: <Clock className="h-4 w-4 text-gray-300" />,
      description: "Priority check-in and boarding",
    },
    {
      name: "Travel Insurance",
      icon: <Shield className="h-4 w-4 text-gray-300" />,
      description: "Premium coverage on all bookings",
    },
  ]

  return (
    <section className="w-full bg-black py-24 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-repeat bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-4">
              Suitpax Rewards Program
            </div>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-white leading-none mb-3">
              Earn rewards with every business trip
            </h2>
            <p className="text-gray-400 text-sm sm:text-base font-medium max-w-2xl mx-auto mb-2">
              Our exclusive rewards program multiplies your travel benefits, combining airline miles, hotel points, and
              premium perks in one unified platform.
            </p>
            <p className="text-gray-500 text-xs sm:text-sm font-light max-w-xl mx-auto">
              Maximize your company's travel investment while enjoying personalized rewards that enhance your business
              travel experience.
            </p>
          </div>

          {/* Partner Benefits Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-16">
            {partnerBenefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-black/20 backdrop-blur-sm p-3 rounded-xl border border-gray-400/20 hover:border-gray-400/40 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="h-8 w-8 rounded-full bg-black/40 flex items-center justify-center mb-2">
                    {benefit.icon}
                  </div>
                  <h3 className="text-gray-200 text-xs font-medium mb-1">{benefit.name}</h3>
                  <p className="text-gray-400 text-[10px] leading-tight">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats and Benefits Section */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center mb-16">
            {/* Stats */}
            <div className="text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-1 sm:mb-2"
              >
                <span className="text-5xl sm:text-7xl md:text-8xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
                  3.2x
                </span>
              </motion.div>
              <p className="text-gray-400 text-sm sm:text-base font-medium">
                Average reward multiplier compared to standard loyalty programs
              </p>
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2 justify-center md:justify-start">
                <span className="inline-flex items-center rounded-full bg-black/60 border border-white/10 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-gray-300">
                  Miles multiplier
                </span>
                <span className="inline-flex items-center rounded-full bg-black/60 border border-white/10 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-gray-300">
                  Status acceleration
                </span>
                <span className="inline-flex items-center rounded-full bg-black/60 border border-white/10 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-gray-300">
                  Premium perks
                </span>
              </div>
            </div>

            {/* Benefits List */}
            <div className="bg-black/20 backdrop-blur-xl p-5 sm:p-7 rounded-xl border border-gray-400/20 shadow-xl">
              <h3 className="text-white text-lg font-medium mb-4">Suitpax Rewards Benefits</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 h-5 w-5 rounded-full bg-black/40 flex items-center justify-center flex-shrink-0">
                    <Award className="h-3 w-3 text-gray-300" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Unified rewards across multiple loyalty programs</p>
                    <p className="text-gray-500 text-xs">
                      Combine and redeem points from different airlines and hotels
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 h-5 w-5 rounded-full bg-black/40 flex items-center justify-center flex-shrink-0">
                    <Plane className="h-3 w-3 text-gray-300" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Accelerated status tiers</p>
                    <p className="text-gray-500 text-xs">Reach elite status 2-3x faster than standard programs</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 h-5 w-5 rounded-full bg-black/40 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="h-3 w-3 text-gray-300" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Corporate + personal rewards</p>
                    <p className="text-gray-500 text-xs">Earn both company and individual benefits on the same trip</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 h-5 w-5 rounded-full bg-black/40 flex items-center justify-center flex-shrink-0">
                    <Gift className="h-3 w-3 text-gray-300" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Exclusive partner benefits</p>
                    <p className="text-gray-500 text-xs">
                      Access to premium services not available to regular travelers
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Vertical Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {rewardCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0.7, y: 10 }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.7,
                  y: activeCard === index ? 0 : 10,
                  scale: activeCard === index ? 1.02 : 1,
                }}
                transition={{ duration: 0.5 }}
                className={`bg-black rounded-xl border ${activeCard === index ? "border-gray-400/30" : "border-gray-400/10"} overflow-hidden`}
              >
                <div className="p-5">
                  {/* Airline Logo */}
                  <div className="h-12 flex items-center justify-center mb-4">
                    <Image
                      src={card.logo || "/placeholder.svg"}
                      alt={card.airline}
                      width={120}
                      height={40}
                      className="h-8 w-auto object-contain invert brightness-0 filter"
                    />
                  </div>

                  {/* Flight Route */}
                  <div className="text-center mb-4">
                    <p className="text-gray-300 text-sm font-medium">{card.route}</p>
                    <div className="h-0.5 w-16 bg-gradient-to-r from-gray-700 to-gray-500 mx-auto my-3 rounded-full"></div>
                  </div>

                  {/* Rewards */}
                  <div className="space-y-4">
                    <div className="bg-black/40 rounded-lg p-3 border border-gray-700/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="h-4 w-4 text-gray-300" />
                        <p className="text-gray-300 text-xs font-medium">Miles Earned</p>
                      </div>
                      <p className="text-emerald-400 text-sm font-medium pl-6">{card.miles}</p>
                    </div>

                    <div className="bg-black/40 rounded-lg p-3 border border-gray-700/30">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="h-4 w-4 text-gray-300" />
                        <p className="text-gray-300 text-xs font-medium">Status Benefit</p>
                      </div>
                      <p className="text-emerald-400 text-sm font-medium pl-6">{card.status}</p>
                    </div>

                    <div className="bg-black/40 rounded-lg p-3 border border-gray-700/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Gift className="h-4 w-4 text-gray-300" />
                        <p className="text-gray-300 text-xs font-medium">Additional Perks</p>
                      </div>
                      <p className="text-emerald-400 text-sm font-medium pl-6">{card.details}</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gradient-to-r from-gray-900 to-black p-3 border-t border-gray-800">
                  <p className="text-center text-gray-400 text-xs">Book with Suitpax to unlock these rewards</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TravelRewards
