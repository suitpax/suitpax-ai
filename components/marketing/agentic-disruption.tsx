"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Zap, BarChart3, Layers, Globe, Clock } from "lucide-react"

// Title and subtitle variations focused on AI disruption
const titleVariations = [
  "Disrupting business travel with agentic AI",
  "The AI revolution in corporate travel is here",
  "How intelligent agents are transforming business travel",
  "Beyond automation: true AI intelligence for travel",
  "The end of traditional business travel management",
]

const subtitleVariations = [
  "Our AI agents don't just book travel—they understand context, predict needs, and make decisions like your best travel manager",
  "Moving beyond simple chatbots to truly intelligent agents that revolutionize how companies manage business travel",
  "Introducing AI that thinks, learns, and acts autonomously to solve complex travel challenges in real-time",
  "The first AI system that truly understands the nuances of business travel, policies, and human preferences",
]

// AI Agents specializing in business travel disruption
const disruptiveAgents = [
  "/agents/agent-2.png",
  "/agents/agent-41.png",
  "/agents/agent-9.png",
  "/agents/agent-54.png",
  "/agents/agent-1.png",
  "/agents/agent-5.png",
  "/agents/agent-6.png",
  "/agents/agent-7.png",
  "/agents/agent-8.png",
  "/agents/agent-10.png",
  "/agents/agent-11.png",
  "/agents/agent-12.png",
  "/agents/agent-13.png",
  "/agents/agent-15.png",
  "/agents/agent-16.png",
  "/agents/agent-17.png",
]

// Disruption metrics and achievements
const disruptionMetrics = [
  {
    metric: "87%",
    label: "Faster booking process",
    description: "vs traditional corporate travel tools",
    icon: <Clock className="w-4 h-4" />,
  },
  {
    metric: "94%",
    label: "Policy compliance rate",
    description: "automatic enforcement by AI",
    icon: <Layers className="w-4 h-4" />,
  },
  {
    metric: "76%",
    label: "Reduction in travel costs",
    description: "through intelligent optimization",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    metric: "99.2%",
    label: "Accuracy in predictions",
    description: "for travel disruptions and alternatives",
    icon: <Zap className="w-4 h-4" />,
  },
]

export default function AgenticDisruption() {
  const [randomTitle, setRandomTitle] = useState("")
  const [randomSubtitle, setRandomSubtitle] = useState("")
  const video1Ref = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)
  const video3Ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Select random title and subtitle
    const titleIndex = Math.floor(Math.random() * titleVariations.length)
    setRandomTitle(titleVariations[titleIndex])

    const subtitleIndex = Math.floor(Math.random() * subtitleVariations.length)
    setRandomSubtitle(subtitleVariations[subtitleIndex])
  }, [])

  return (
    <div className="relative py-20 overflow-hidden bg-white">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-25"></div>

      {/* Animated disruption lines */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-gray-400/30 to-transparent"
            style={{
              top: `${15 + i * 12}%`,
              left: 0,
              width: "100%",
              opacity: 0.2 + Math.random() * 0.3,
              transform: `translateY(${Math.sin(i) * 15}px)`,
              animation: `flow-x ${15 + Math.random() * 8}s linear infinite`,
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-medium text-gray-800">
              <Image
                src="/logo/suitpax-bl-logo.webp"
                alt="Suitpax"
                width={60}
                height={15}
                className="h-3 w-auto mr-1"
              />
              AI Disruption
            </span>
          </div>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none max-w-3xl mx-auto mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-serif italic">{randomTitle.split(" ").slice(0, 3).join(" ")}</span>{" "}
            <span className="font-medium">{randomTitle.split(" ").slice(3).join(" ")}</span>
          </motion.h2>

          <motion.p
            className="mt-2 text-lg font-medium text-gray-600 max-w-2xl mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {randomSubtitle}
          </motion.p>
        </div>

        {/* Disruption Metrics */}
        <div className="mb-16">
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {disruptionMetrics.map((metric, index) => (
              <motion.div
                key={index}
                className="inline-flex items-center rounded-xl bg-gray-200 px-4 py-2 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-2">
                  <div className="text-gray-800">{metric.icon}</div>
                  <span className="text-sm font-medium text-gray-800">{metric.metric}</span>
                  <span className="text-xs text-gray-600">{metric.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Agents Showcase */}
        <div className="flex flex-col items-center mb-16">
          <span className="inline-flex items-center rounded-xl bg-gray-200 px-3 py-1 text-xs font-medium text-gray-800 mb-6">
            AI Travel Agents
          </span>
          <div className="flex justify-center gap-2 mb-4 flex-wrap max-w-2xl">
            {[
              "/agents/agent-2.png",
              "/agents/agent-41.png",
              "/agents/agent-9.png",
              "/agents/agent-54.png",
              "/agents/agent-1.png",
              "/agents/agent-5.png",
              "/agents/agent-6.png",
              "/agents/agent-7.png",
              "/agents/agent-8.png",
              "/agents/agent-10.png",
              "/agents/agent-11.png",
              "/agents/agent-12.png",
              "/agents/agent-13.png",
              "/agents/agent-15.png",
              "/agents/agent-16.png",
              "/agents/agent-17.png",
            ].map((image, index) => (
              <motion.div
                key={index}
                className="w-8 h-8 rounded-md overflow-hidden border border-gray-300 bg-white"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.03 }}
                viewport={{ once: true }}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt="AI Agent"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-gray-600 max-w-md text-center">
            Specialized AI agents for every aspect of business travel
          </p>
        </div>

        {/* Video Showcase - AI in Action */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* First Video - Smart Booking */}
            <div className="relative overflow-hidden rounded-xl shadow-lg h-[320px] group">
              <div className="absolute top-0 left-0 z-20 p-4">
                <span className="inline-flex items-center rounded-full bg-gray-800/60 backdrop-blur-md px-3 py-1 text-xs font-medium text-white">
                  Smart Booking Revolution
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h4 className="text-white text-lg font-medium tracking-tight mb-1">From 12 minutes to 30 seconds</h4>
                <p className="text-gray-300 text-sm max-w-xs">
                  Watch how our AI transforms the traditional booking experience
                </p>
              </div>
              <video
                ref={video1Ref}
                className="w-full h-full object-cover scale-[1.5] object-center"
                autoPlay
                muted
                loop
                playsInline
              >
                <source
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/372667474502451203%20%28online-video-cutter.com%29%20%281%29-cMldY8CRYlKeR2Ppc8vnuyqiUzfGWe.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-300"></div>
            </div>

            {/* Second Video - Policy Intelligence */}
            <div className="relative overflow-hidden rounded-xl shadow-lg h-[320px] group">
              <div className="absolute top-0 left-0 z-20 p-4">
                <span className="inline-flex items-center rounded-full bg-gray-800/60 backdrop-blur-md px-3 py-1 text-xs font-medium text-white">
                  Policy Intelligence
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h4 className="text-white text-lg font-medium tracking-tight mb-1">Automatic policy enforcement</h4>
                <p className="text-gray-300 text-sm max-w-xs">
                  AI that understands and enforces travel policies in real-time
                </p>
              </div>
              <video
                ref={video2Ref}
                className="w-full h-full object-cover scale-[1.5] object-center"
                autoPlay
                muted
                loop
                playsInline
              >
                <source
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/372670580883685377%20%28online-video-cutter.com%29%20%281%29%20%281%29-EIRyjgj1RasF39wL5XnuWI6ZQUmOZE.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-300"></div>
            </div>

            {/* Third Video - Predictive Analytics */}
            <div className="relative overflow-hidden rounded-xl shadow-lg h-[320px] group">
              <div className="absolute top-0 left-0 z-20 p-4">
                <span className="inline-flex items-center rounded-full bg-gray-800/60 backdrop-blur-md px-3 py-1 text-xs font-medium text-white">
                  Predictive Analytics
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h4 className="text-white text-lg font-medium tracking-tight mb-1">Predicting travel disruptions</h4>
                <p className="text-gray-300 text-sm max-w-xs">
                  AI that anticipates problems and provides solutions before they happen
                </p>
              </div>
              <video
                ref={video3Ref}
                className="w-full h-full object-cover scale-[1.5] object-center"
                autoPlay
                muted
                loop
                playsInline
              >
                <source
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/372671794094522374%20%281%29-mXhXqJuzE8yRQG72P48PBvFH1FNb7X.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-300"></div>
            </div>
          </div>
        </div>

        {/* Disruption Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
              <Globe className="w-5 h-5 text-gray-800" />
            </div>
            <div>
              <h3 className="text-xl font-medium tracking-tighter mb-2 text-gray-900">End of manual processes</h3>
              <p className="text-gray-600 text-sm">
                Our AI eliminates expense reports, manual approvals, and policy violations through intelligent
                automation.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
              <BarChart3 className="w-5 h-5 text-gray-800" />
            </div>
            <div>
              <h3 className="text-xl font-medium tracking-tighter mb-2 text-gray-900">Intelligent cost optimization</h3>
              <p className="text-gray-600 text-sm">
                AI that learns your company's patterns and automatically finds the best deals while maintaining policy
                compliance.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-medium tracking-tighter mb-4 text-gray-900">Experience the disruption</h3>
          <p className="text-gray-600 text-base max-w-xl mx-auto mb-8">
            See how our AI agents are transforming business travel for companies worldwide. Join the revolution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-black text-white hover:bg-black/90 px-6 py-3 rounded-full text-sm font-medium tracking-tighter group"
            >
              <span>Try our AI agents</span>
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="mailto:ai@suitpax.com"
              className="inline-flex items-center justify-center bg-transparent text-black hover:bg-black/5 px-6 py-3 rounded-full text-sm font-medium tracking-tighter border border-black"
            >
              Request demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
