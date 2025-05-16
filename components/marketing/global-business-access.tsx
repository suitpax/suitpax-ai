"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  SiSlack,
  SiVercel,
  SiNike,
  SiHubspot,
  SiIntercom,
  SiAsana,
  SiAmericanairlines,
  SiQatarairways,
  SiUnitedairlines,
  SiFerrari,
} from "react-icons/si"

// Lounge features
const loungeFeatures = [
  {
    title: "Premium Lounges",
    description: "Access to over 650 VIP airport lounges worldwide",
    icon: <SiQatarairways className="h-6 w-6" />,
  },
  {
    title: "Fast-Track Security",
    description: "Skip the lines with priority security access",
    icon: <SiAmericanairlines className="h-6 w-6" />,
  },
  {
    title: "Concierge Service",
    description: "24/7 personal travel assistance for executives",
    icon: <SiFerrari className="h-6 w-6" />,
  },
  {
    title: "Global Coverage",
    description: "Seamless service in over 190 countries",
    icon: <SiUnitedairlines className="h-6 w-6" />,
  },
]

// Testimonials
const testimonials = [
  {
    quote: "Suitpax transformed how our executive team travels. The VIP lounge access alone saved us countless hours.",
    author: "Sarah Johnson",
    role: "CFO, TechGlobal Inc.",
    avatar: "/agents/agent-13.png",
  },
  {
    quote:
      "The seamless integration with our expense system and the VIP benefits make business travel actually enjoyable.",
    author: "Michael Chen",
    role: "VP of Operations, Nexus Group",
    avatar: "/agents/agent-5.png",
  },
  {
    quote: "Our team's productivity increased by 35% when traveling thanks to Suitpax's premium lounge access.",
    author: "Elena Rodriguez",
    role: "Travel Manager, Vertex Solutions",
    avatar: "/agents/agent-8.png",
  },
]

export default function GlobalBusinessAccess() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-950 opacity-80" />

        {/* Animated particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-emerald-500/10"
            style={{
              width: Math.random() * 6 + 2 + "px",
              height: Math.random() * 6 + 2 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}

        {/* Gradient orbs */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-emerald-500/5 to-blue-500/5"
            style={{
              width: Math.random() * 300 + 100 + "px",
              height: Math.random() * 300 + 100 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              filter: "blur(60px)",
              opacity: Math.random() * 0.3,
            }}
          />
        ))}
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 max-w-3xl mx-auto">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-emerald-500/10 px-3 py-1 text-sm text-emerald-500 mb-4">
              <span className="font-medium">Enterprise Solution</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
              Global VIP Access for Business Teams
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
              Elevate your corporate travel experience with exclusive access to premium lounges and VIP services
              worldwide.
            </p>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column: Lounge image carousel */}
          <div className="relative rounded-2xl overflow-hidden h-[400px] md:h-[500px] shadow-2xl shadow-emerald-500/10">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-10" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <img
                  src={`/images/vip-lounge-${(activeTestimonial % 4) + 1}.png`}
                  alt="VIP Airport Lounge"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Testimonial overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-slate-800"
                >
                  <p className="text-slate-300 italic mb-3">"{testimonials[activeTestimonial].quote}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img
                        src={testimonials[activeTestimonial].avatar || "/placeholder.svg"}
                        alt={testimonials[activeTestimonial].author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white font-medium">{testimonials[activeTestimonial].author}</p>
                      <p className="text-emerald-400 text-sm">{testimonials[activeTestimonial].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Testimonial navigation dots */}
              <div className="flex justify-center mt-4 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeTestimonial === index ? "bg-emerald-500 w-6" : "bg-slate-600"
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Features */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white">Exclusive Benefits</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loungeFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-slate-900/60 backdrop-blur-sm rounded-xl p-5 border border-slate-800 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-glow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-full bg-emerald-500/10 p-2.5 text-emerald-400">{feature.icon}</div>
                    <div>
                      <h4 className="text-lg font-medium text-white mb-1">{feature.title}</h4>
                      <p className="text-slate-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {[
                { value: "650+", label: "VIP Lounges" },
                { value: "190", label: "Countries" },
                { value: "24/7", label: "Support" },
                { value: "68%", label: "Time Saved" },
              ].map((stat, index) => (
                <div key={index} className="text-center p-3 bg-slate-900/40 rounded-lg border border-slate-800">
                  <div className="text-2xl font-bold text-emerald-500">{stat.value}</div>
                  <div className="text-xs text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-emerald-600 text-white hover:bg-emerald-700 h-11 px-6 py-2">
                Request Enterprise Demo
              </button>
            </div>
          </div>
        </div>

        {/* Partner logos */}
        <div className="mt-20">
          <p className="text-center text-sm text-slate-500 mb-6">TRUSTED BY LEADING COMPANIES WORLDWIDE</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-70">
            {[SiVercel, SiNike, SiHubspot, SiIntercom, SiAsana, SiSlack].map((Icon, i) => (
              <Icon key={i} className="h-6 w-auto text-slate-400" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
