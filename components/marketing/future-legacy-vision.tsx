"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { SiSouthwestairlines } from "react-icons/si"

// Title and subtitle variations
const titleVariations = [
  "Shaping the next 40 years of business travel",
  "Our vision for the future of travel: 2025-2065",
  "Building a legacy for generations to come",
  "The next chapter in business travel evolution",
  "Reimagining travel for the next four decades",
]

const subtitleVariations = [
  "Creating sustainable systems that will transform how humanity moves across the globe",
  "Designing the frameworks that will empower the next generation of business travelers",
  "Establishing the foundation for a more connected, efficient, and sustainable world",
  "Developing technologies today that will become the standard for tomorrow",
]

// AI Agents appearing in videos
const aiAgents = [
  {
    name: "Elara",
    description: "Legacy AI",
    image: "/agents/agent-54.png",
  },
  {
    name: "Kia",
    description: "Heritage AI",
    image: "/agents/agent-9.png",
  },
  {
    name: "Zoe",
    description: "Future A",
    image: "/agents/agent-41.png",
  },
  {
    name: "Aria",
    description: "AI Agent",
    image: "/agents/agent-2.png",
  },
]

export default function FutureLegacyVision() {
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
    <div className="relative py-20 overflow-hidden bg-gray-50">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 opacity-70"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-25"></div>

      {/* Subtle animated lines */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-gray-400/30 to-transparent"
            style={{
              top: `${10 + i * 10}%`,
              left: 0,
              width: "100%",
              opacity: 0.1 + Math.random() * 0.2,
              transform: `translateY(${Math.sin(i) * 10}px)`,
              animation: `flow-x ${20 + Math.random() * 10}s linear infinite`,
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <Image
                src="/logo/suitpax-bl-logo.webp"
                alt="Suitpax"
                width={60}
                height={15}
                className="h-3 w-auto mr-1"
              />
              Future Vision
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[8px] font-medium text-gray-700">
              <span className="w-1 h-1 rounded-full bg-black animate-pulse mr-1"></span>
              2025-2065
            </span>
          </div>

          <motion.h2
            className="text-2xl md:text-2xl lg:text-2xl font-medium tracking-tighter text-black leading-none max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {randomTitle}
          </motion.h2>

          <motion.p
            className="mt-4 text-sm font-medium text-gray-600 max-w-2xl mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {randomSubtitle}
          </motion.p>
        </div>

        {/* AI Agents Badge */}
        <div className="flex flex-col items-center mb-6">
          <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-3">
            Future AI travel agents
          </span>
          <div className="flex justify-center gap-3 mb-2">
            {aiAgents.map((agent, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-md overflow-hidden border border-gray-200">
                  <Image
                    src={agent.image || "/placeholder.svg"}
                    alt={agent.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[9px] font-medium text-gray-700 mt-1">{agent.name}</span>
                <span className="text-[7px] text-gray-500">{agent.description}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-600 max-w-md text-center">
            Our legacy-building AI agents are designed to evolve over decades, creating a lasting foundation for the
            future of intelligent business travel
          </p>
        </div>

        {/* Mini Chat and Contract Card - Modified to be more vertical and look like a business agreement */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 shadow-sm mb-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                <Image
                  src="/agents/agent-41.png"
                  alt="Zoe from Suitpax"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-800 mb-1">
                  <span className="font-medium">Zoe:</span> In 2055, our neural interfaces will allow you to book travel
                  with just a thought. Your preferences will be understood instantly.
                </p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                  <span className="text-[10px] text-gray-500">Training...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Business Agreement Card - More vertical and contract-like */}
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-sm max-w-xs mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Image
                  src="/logo/suitpax-bl-logo.webp"
                  alt="Suitpax"
                  width={60}
                  height={15}
                  className="h-4 w-auto mr-1"
                />
                <span className="text-[10px] font-medium text-gray-700">AGREEMENT</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-500"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span className="text-[8px] text-gray-500">CONFIDENTIAL</span>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-2 mb-3">
              <h3 className="text-[11px] font-medium mb-1">BUSINESS TRAVEL PARTNERSHIP</h3>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] text-gray-700">Contract ID:</span>
                <span className="text-[9px] font-medium">SX-2055-NT-8742</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-gray-700">Effective Date:</span>
                <span className="text-[9px] font-medium">May 15, 2055</span>
              </div>
            </div>

            <div className="mb-3">
              <h4 className="text-[10px] font-medium mb-1">PARTIES</h4>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <SiSouthwestairlines className="text-[#304CB2] mr-1.5" size={10} />
                  <span className="text-[9px] font-medium">Southwest Airlines Inc.</span>
                </div>
                <span className="text-[8px] bg-gray-100 px-1 py-0.5 rounded-md text-gray-700">PROVIDER</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image
                    src="/logo/suitpax-symbol.webp"
                    alt="Suitpax"
                    width={10}
                    height={10}
                    className="h-2.5 w-auto mr-1.5"
                  />
                  <span className="text-[9px] font-medium">Suitpax Technologies Inc.</span>
                </div>
                <span className="text-[8px] bg-gray-100 px-1 py-0.5 rounded-md text-gray-700">CLIENT</span>
              </div>
            </div>

            <div className="mb-3">
              <h4 className="text-[10px] font-medium mb-1">SERVICES</h4>
              <p className="text-[8px] text-gray-600 mb-1">
                Neural-integrated flight booking services with quantum-secured authentication for all Suitpax enterprise
                clients.
              </p>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1 animate-pulse"></div>
                <span className="text-[7px] text-gray-600">Neural-verified • Quantum-secured</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[8px] text-gray-500 mt-2">
              <span>Page 1 of 12</span>
              <span>CONFIDENTIAL</span>
            </div>
          </div>
        </div>

        {/* Video Showcase - Now with three videos */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* First Video */}
            <div className="relative overflow-hidden rounded-2xl shadow-lg h-[320px] group">
              <div className="absolute top-0 left-0 z-20 p-3">
                <span className="inline-flex items-center rounded-xl bg-black/40 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-white">
                  Intelligent Travel Platform
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <span className="inline-flex items-center rounded-xl bg-gray-200/30 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-medium text-white mb-2">
                  2025-2035
                </span>
                <h4 className="text-white text-sm font-medium tracking-tight mb-0.5">AI agent evolution</h4>
                <p className="text-gray-200 text-[10px] max-w-xs">
                  Next-gen AI travel assistants with enhanced contextual awareness
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

            {/* Second Video */}
            <div className="relative overflow-hidden rounded-2xl shadow-lg h-[320px] group">
              <div className="absolute top-0 left-0 z-20 p-3">
                <span className="inline-flex items-center rounded-xl bg-black/40 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-white">
                  Neural Finance Management
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <span className="inline-flex items-center rounded-xl bg-gray-200/30 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-medium text-white mb-2">
                  2035-2050
                </span>
                <h4 className="text-white text-sm font-medium tracking-tight mb-0.5">AI-human collaboration</h4>
                <p className="text-gray-200 text-[10px] max-w-xs">
                  Seamless integration of AI agents with human expertise
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

            {/* Third Video */}
            <div className="relative overflow-hidden rounded-2xl shadow-lg h-[320px] group">
              <div className="absolute top-0 left-0 z-20 p-3">
                <span className="inline-flex items-center rounded-xl bg-black/40 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-white">
                  Global Premium Access
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <span className="inline-flex items-center rounded-xl bg-gray-200/30 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-medium text-white mb-2">
                  2050-2065
                </span>
                <h4 className="text-white text-sm font-medium tracking-tight mb-0.5">Neural travel interfaces</h4>
                <p className="text-gray-200 text-[10px] max-w-xs">
                  Direct neural connections for immersive travel planning
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

        {/* Vision Pillars - Smaller and horizontal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center">
            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-700"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-medium tracking-tighter mb-1">Our 40-year vision</h3>
              <p className="text-gray-600 text-xs">
                Building sustainable travel ecosystems and AI-human collaboration frameworks that will transform global
                mobility for decades to come.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center">
            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-700"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-medium tracking-tighter mb-1">Legacy for next generation</h3>
              <p className="text-gray-600 text-xs">
                Creating open frameworks and mentorship systems that empower future innovators to build upon our
                foundation.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline redesigned - Smaller, horizontal and compact */}
        <div className="mb-12">
          <h3 className="text-xl font-medium tracking-tighter mb-4">Suitpax Legacy Timeline</h3>

          <div className="flex flex-nowrap overflow-x-auto pb-4 gap-3 scrollbar-hide">
            {[
              {
                year: "2025-2030",
                title: "Foundation Building",
                description:
                  "Establishing core AI travel infrastructure and developing the first generation of specialized business travel agents with MCP technology. Pioneering neural interfaces for travel planning.",
              },
              {
                year: "2030-2040",
                title: "Enterprise Integration",
                description:
                  "Revolutionizing corporate travel with unified booking systems for Fortune 500 companies. Implementing AI-driven policy compliance and real-time expense management for multinational organizations.",
              },
              {
                year: "2040-2050",
                title: "Sustainable Travel Revolution",
                description:
                  "Leading the carbon-negative travel movement with proprietary atmospheric carbon capture technology. Suitpax becomes the global standard for ethical business travel certification.",
              },
              {
                year: "2050-2060",
                title: "Neural-Biometric Access",
                description:
                  "Pioneering neural-biometric authentication for seamless travel experiences in smart cities. Revolutionizing business travel with AI-powered urban mobility networks in megacities worldwide.",
              },
              {
                year: "2060-2065",
                title: "Global Identity & Space Travel",
                description:
                  "Establishing the Universal Business Traveler Identity standard. Launching the first commercial space travel management system for corporate orbital meetings and lunar business retreats.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-56 bg-white rounded-xl p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                    {item.year}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                </div>
                <h4 className="text-xs font-medium tracking-tight mb-0.5">{item.title}</h4>
                <p className="text-[9px] text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-3">
            <p className="text-xs text-gray-500 italic">
              Building a lasting foundation for the future of business travel
            </p>
          </div>
        </div>

        {/* Innovation Highlights - Smaller */}
        <div className="mb-12">
          <h3 className="text-xl font-medium tracking-tighter text-center mb-5">Innovation highlights</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                ),
                title: "Quantum Neural Networks",
                description:
                  "Revolutionary quantum-powered AI systems that process travel data at unprecedented speeds with perfect accuracy",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2v4"></path>
                    <path d="M12 18v4"></path>
                    <path d="m4.93 4.93 2.83 2.83"></path>
                    <path d="m16.24 16.24 2.83 2.83"></path>
                    <path d="M2 12h4"></path>
                    <path d="M18 12h4"></path>
                    <path d="m4.93 19.07 2.83-2.83"></path>
                    <path d="m16.24 7.76 2.83-2.83"></path>
                  </svg>
                ),
                title: "Orbital Travel Network",
                description:
                  "The first comprehensive business travel system extending beyond Earth, connecting global and orbital destinations",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                  </svg>
                ),
                title: "Thought-Driven Interfaces",
                description:
                  "Direct neural interfaces allowing travel planning and booking through thought alone, with perfect security and privacy",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  {item.icon}
                </div>
                <h4 className="text-sm font-medium tracking-tight mb-1">{item.title}</h4>
                <p className="text-xs text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright Notice - Expanded with more points */}
        <div className="mb-8 max-w-xl mx-auto">
          <h3 className="text-sm font-medium tracking-tighter mb-2">Intellectual property notice</h3>
          <ol className="list-decimal pl-4 space-y-1 font-light text-[10px]">
            <li>
              All Suitpax AI agents, including their visual appearance, design, clothing, colors, and facial features
              represent Suitpax's original creation.
            </li>
            <li>
              The prompts used to generate and interact with our AI agents are proprietary and developed exclusively by
              Suitpax.
            </li>
            <li>
              The visual style, design language, and aesthetic elements of our AI agents are subject to copyright
              protection.
            </li>
            <li>
              The unique personality traits, specializations, and interaction patterns of each AI agent are the result
              of Suitpax's innovative development.
            </li>
            <li>
              Any unauthorized replication, distribution, or adaptation of our AI agents constitutes copyright
              infringement.
            </li>
            <li>
              The neural interface technologies and thought-driven booking systems depicted are protected by multiple
              pending patents and trade secrets owned by Suitpax.
            </li>
            <li>
              The timeline, roadmap, and future vision concepts presented are confidential intellectual property of
              Suitpax and subject to legal protection.
            </li>
            <li>
              The quantum neural networks and orbital travel network concepts are proprietary technologies developed
              exclusively by Suitpax's research division.
            </li>
            <li>
              The business agreements, partnerships, and contract formats shown are proprietary business methods of
              Suitpax.
            </li>
            <li>
              All future AI agent iterations, including their evolutionary development paths, are protected as Suitpax
              trade secrets.
            </li>
          </ol>
        </div>

        {/* Call to Action - Simplified */}
        <div className="text-center">
          <h3 className="text-xl font-medium tracking-tighter mb-3">Join us in building this legacy</h3>
          <p className="text-gray-600 text-xs max-w-xl mx-auto mb-4">
            Be part of creating the systems and frameworks that will shape business travel for generations to come.
          </p>
          <Link
            href="mailto:ai@suitpax.com"
            className="inline-flex items-center justify-center bg-transparent text-black hover:bg-black/5 px-5 py-2 rounded-xl text-xs font-medium tracking-tighter border border-black"
          >
            Partner with us
          </Link>
        </div>
      </div>
    </div>
  )
}
