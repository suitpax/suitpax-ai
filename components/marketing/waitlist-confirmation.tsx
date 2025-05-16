"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import CounterBadge from "@/components/ui/counter-badge"
import { SiX, SiLinkedin, SiGmail } from "react-icons/si"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}

// Referral rewards
const referralRewards = [
  {
    count: 3,
    reward: "Move up 10 positions in the waitlist",
  },
  {
    count: 5,
    reward: "Get 1 month of Early plan free",
  },
  {
    count: 10,
    reward: "Exclusive early access to premium features",
  },
]

// AI Travel Agents data
const travelAgents = [
  { id: 1, image: "/agents/agent-1.png" },
  { id: 2, image: "/agents/agent-2.png" },
  { id: 3, image: "/agents/agent-3.png" },
  { id: 4, image: "/agents/agent-4.png" },
  { id: 5, image: "/agents/agent-5.png" },
  { id: 6, image: "/agents/agent-6.png" },
  { id: 7, image: "/agents/agent-7.png" },
  { id: 8, image: "/agents/agent-8.png" },
  { id: 9, image: "/agents/agent-9.png" },
  { id: 10, image: "/agents/agent-10.png" },
  { id: 11, image: "/agents/agent-11.png" },
  { id: 12, image: "/agents/agent-12.png" },
  { id: 13, image: "/agents/agent-13.png" },
  { id: 14, image: "/agents/kahn-avatar.png" },
  { id: 15, image: "/agents/agent-15.png" },
  { id: 16, image: "/agents/agent-16.png" },
  { id: 17, image: "/agents/agent-17.png" },
  { id: 18, image: "/agents/agent-18.png" },
  { id: 19, image: "/agents/agent-19.png" },
  { id: 20, image: "/agents/agent-20.png" },
]

// Mini badges para categorías de viajes de negocios
const travelCategories = [
  "Business Travel",
  "Automated Travel Policies",
  "Expense Management",
  "Corporate Rates",
  "Team Travel",
  "Executive Travel",
  "Duty of Care",
  "Travel Analytics",
  "Sustainability",
  "VIP Services",
  "Airport Lounges",
  "Visa Assistance",
]

// Function to generate the agent grid
const generateAgentGrid = () => {
  const grid = []
  // Generate a 10×12 grid (120 agents) like in Business Travel Revolution
  for (let i = 0; i < 120; i++) {
    // Use modulo to ensure even distribution of all agent images
    const agentIndex = i % travelAgents.length
    const agent = travelAgents[agentIndex]

    grid.push({
      id: `agent-${i}`,
      image: agent.image,
    })
  }
  return grid
}

export function WaitlistConfirmation() {
  const [referralLink, setReferralLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState("")
  const [agentGrid, setAgentGrid] = useState<any[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    // Generate a referral link to accounts.suitpax.com/waitlist
    const randomString = Math.random().toString(36).substring(2, 8)
    setReferralLink(`https://accounts.suitpax.com/waitlist?ref=${randomString}`)

    // Try to get email from localStorage or use a placeholder
    const storedEmail = localStorage.getItem("userEmail") || "your.email@example.com"
    setEmail(storedEmail)

    // Generate the agent grid
    setAgentGrid(generateAgentGrid())
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Function to handle agent selection
  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(agentId === selectedAgent ? null : agentId)
  }

  // Function to handle category selection
  const handleCategorySelect = (category: string) => {
    setActiveCategory(category === activeCategory ? null : category)
  }

  return (
    <section className="relative py-12 overflow-hidden bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="max-w-4xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
          {/* Header */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <div className="inline-flex items-center gap-1.5 mb-3">
              <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
                <Image
                  src="/logo/suitpax-bl-logo.webp"
                  alt="Suitpax"
                  width={60}
                  height={15}
                  className="h-3 w-auto mr-1"
                />
                Waitlist
              </span>
              <CounterBadge className="mb-0" />
            </div>

            <div className="inline-flex items-center justify-center p-1 px-3 mb-3 rounded-full bg-gray-100 text-gray-800">
              <span className="inline-block w-1.5 h-1.5 mr-2 bg-black rounded-full animate-pulse"></span>
              <span className="text-xs font-medium">Registration Successful</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-black mb-3 leading-none">
              Join our waitlist for early access
            </h1>

            <p className="text-sm text-gray-600 max-w-xl mx-auto">
              Thank you for joining the Suitpax waitlist. We're excited to have you on board as we revolutionize
              business travel with AI.
            </p>
          </motion.div>

          {/* AI Agents Grid - Styled exactly like AI Travel Agents */}
          <motion.div className="relative mb-12 overflow-hidden" variants={itemVariants}>
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
              {/* Flow effect background */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-1 bg-gray-200/40 blur-xl"></div>
                <motion.div
                  className="absolute top-0 left-0 w-full h-60 bg-gray-200/30"
                  animate={{
                    y: [0, 100, 0],
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 15,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute bottom-0 right-0 w-full h-40 bg-gray-200/20"
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0.1, 0.2, 0.1],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 18,
                    ease: "easeInOut",
                    delay: 2,
                  }}
                />
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-medium text-left tracking-tighter text-black mb-4 leading-none">
                  Meet our AI Travel Agents
                </h3>
                <p className="text-lg font-medium text-gray-700 tracking-tighter mb-4">
                  Transforming business travel with instant decisions and personalized experiences
                </p>

                <p className="text-sm text-gray-600 mb-6">
                  Our AI agents are designed to revolutionize your business travel experience with lightning-fast
                  decisions, personalized recommendations, and seamless journey orchestration.
                </p>

                <div className="grid grid-cols-5 gap-2 md:gap-3 mb-8">
                  {travelAgents.slice(0, 15).map((agent, index) => (
                    <motion.div
                      key={index}
                      className="flex flex-col items-center cursor-pointer relative"
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleAgentSelect(`agent-${index}`)}
                    >
                      <div className="relative mb-2 group">
                        {/* Highlight effect for active agent */}
                        {selectedAgent === `agent-${index}` && (
                          <motion.div
                            className="absolute -inset-1 rounded-xl bg-emerald-950/10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.3 }}
                            layoutId="highlight"
                          />
                        )}

                        {/* Flow effect for active agent */}
                        {selectedAgent === `agent-${index}` && (
                          <motion.div
                            className="absolute -inset-3 rounded-xl bg-gray-200/40 -z-10"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                              opacity: [0.4, 0.7, 0.4],
                              scale: [0.9, 1.1, 0.9],
                              rotate: [0, 5, 0, -5, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                          />
                        )}

                        <div
                          className={`relative w-12 h-12 overflow-hidden rounded-xl border-2 ${
                            selectedAgent === `agent-${index}` ? "border-emerald-950/30 shadow-lg" : "border-gray-200"
                          }`}
                        >
                          <Image
                            src={agent.image || "/placeholder.svg"}
                            alt={`AI Agent ${index + 1}`}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Mini badges para categorías de viajes de negocios - Estilo igual al de AI Travel Agents */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {travelCategories.map((category, index) => (
                    <motion.span
                      key={index}
                      className={`inline-flex items-center rounded-xl border border-black/30 px-2 py-0.5 text-[10px] font-medium cursor-pointer hover:bg-gray-100 transition-colors ${
                        activeCategory === category
                          ? "bg-emerald-950/5 text-emerald-950 border-emerald-950/30"
                          : "text-black"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCategorySelect(category)}
                    >
                      {activeCategory === category && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 mr-1"></span>
                      )}
                      {category}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Referral Section */}
          <motion.div
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm mb-8 relative overflow-hidden"
            variants={itemVariants}
          >
            {/* Flow effect background - igual que en AI Travel Agents */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -inset-1 bg-gray-200/40 blur-xl"></div>
              <motion.div
                className="absolute top-0 left-0 w-full h-60 bg-gray-200/30"
                animate={{
                  y: [0, 100, 0],
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 15,
                  ease: "easeInOut",
                }}
              />
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl font-medium tracking-tighter text-black mb-2">Skip the Line: Refer Friends</h2>
              <p className="text-sm text-gray-600 mb-4">
                Share your unique referral link with friends and colleagues to move up in the waitlist and unlock
                exclusive rewards.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs font-medium text-gray-800"
                  />
                </div>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <span className="text-xs font-medium">{copied ? "Copied!" : "Copy Link"}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <p className="text-xs text-gray-500 mr-1 flex items-center">Share via:</p>
                <div className="flex space-x-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      "I just joined the waitlist for @suitpax, the AI-powered business travel platform! Skip the line and join me using my referral link:",
                    )}&url=${encodeURIComponent(referralLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <SiX size={16} />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}&title=${encodeURIComponent(
                      "Join me on the Suitpax waitlist",
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <SiLinkedin size={16} />
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent("Join me on the Suitpax waitlist")}&body=${encodeURIComponent(
                      `Hey,\n\nI just joined the waitlist for Suitpax, the AI-powered business travel platform that's going to revolutionize how we manage business travel.\n\nUse my referral link to skip the line: ${referralLink}\n\nCheers!`,
                    )}`}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <SiGmail size={16} />
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-black mb-3">Referral Rewards</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {referralRewards.map((reward, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="text-lg font-medium text-black mb-1">{reward.count} Referrals</div>
                      <p className="text-xs text-gray-600">{reward.reward}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div className="text-center" variants={itemVariants}>
            <h2 className="text-xl font-medium tracking-tight text-black mb-3">What Happens Next?</h2>

            <p className="text-xs text-gray-600 mb-4 max-w-xl mx-auto">
              We're working hard to get Suitpax ready for you. In the meantime, here's what you can expect:
            </p>

            <div className="flex flex-row gap-4 justify-center mb-6">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <span className="text-gray-800 text-xs font-medium">1</span>
                </div>
                <p className="text-xs font-medium text-black">Confirmation</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <span className="text-gray-800 text-xs font-medium">2</span>
                </div>
                <p className="text-xs font-medium text-black">Updates</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <span className="text-gray-800 text-xs font-medium">3</span>
                </div>
                <p className="text-xs font-medium text-black">Invitation</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <span className="text-gray-800 text-xs font-medium">4</span>
                </div>
                <p className="text-xs font-medium text-black">Access</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-xs font-medium"
              >
                Return to Homepage
              </Link>
              <Link
                href="/manifesto"
                className="px-5 py-2 bg-transparent border border-black text-black rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium"
              >
                Read Our Manifesto
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
