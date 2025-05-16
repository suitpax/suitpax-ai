"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  PiDotsThreeCircleThin,
  PiDotsThreeOutlineThin,
  PiDotsThreeVerticalThin,
  PiRocketLaunchLight,
  PiCodeBold,
  PiBrainBold,
  PiAirplaneTakeoffBold,
} from "react-icons/pi"
import Link from "next/link"

// The three passions that drive Suitpax
const passions = [
  {
    id: 1,
    title: "Programming",
    description:
      "Programming is the art of turning ideas into reality. At Suitpax, we embrace elegant code, innovative architectures, and cutting-edge technologies to build systems that scale and adapt. Our passion for clean, efficient code drives us to create solutions that are both powerful and maintainable.",
    icon: PiDotsThreeCircleThin,
    color: "gray-400",
  },
  {
    id: 2,
    title: "Machine Learning",
    description:
      "Machine Learning transforms data into intelligence. We're obsessed with creating AI systems that learn, adapt, and provide increasingly personalized experiences. From natural language processing to predictive analytics, our ML models power the intelligence behind every aspect of the Suitpax platform.",
    icon: PiDotsThreeOutlineThin,
    color: "gray-400",
  },
  {
    id: 3,
    title: "Travel",
    description:
      "Travel connects people, cultures, and ideas. We believe business travel should be more than just getting from A to B—it should be efficient, personalized, and even enjoyable. Our deep understanding of the travel industry's challenges and opportunities informs every feature we build.",
    icon: PiDotsThreeVerticalThin,
    color: "gray-400",
  },
]

// How these passions intersect at Suitpax
const intersections = [
  {
    id: 1,
    title: "Programming + Machine Learning",
    description:
      "When programming expertise meets machine learning, we create intelligent systems that can process millions of travel options in milliseconds, learn from user behavior, and continuously improve. Our distributed architecture and advanced algorithms form the backbone of our AI capabilities.",
    icon: PiDotsThreeCircleThin,
  },
  {
    id: 2,
    title: "Machine Learning + Travel",
    description:
      "Combining machine learning with travel industry knowledge allows us to predict flight prices, recommend optimal itineraries, and personalize every aspect of the business travel experience. Our models understand the complexities of travel preferences, constraints, and opportunities.",
    icon: PiDotsThreeOutlineThin,
  },
  {
    id: 3,
    title: "Travel + Programming",
    description:
      "Our deep travel expertise informs how we architect our systems. We've built a platform that integrates with hundreds of travel providers, handles complex booking workflows, and manages the entire travel lifecycle—all while maintaining a seamless user experience.",
    icon: PiDotsThreeVerticalThin,
  },
  {
    id: 4,
    title: "The Perfect Convergence",
    description:
      "At the intersection of all three passions is Suitpax—a platform that combines technical excellence, artificial intelligence, and travel expertise to transform how businesses manage travel. This unique convergence enables us to solve problems that others can't even identify.",
    icon: PiRocketLaunchLight,
  },
]

// Vision statements about the future of travel
const visionStatements = [
  {
    id: 1,
    quote:
      "We envision a future where business travel is not just efficient, but truly intelligent—anticipating needs, removing friction, and adapting to each traveler's preferences.",
  },
  {
    id: 2,
    quote:
      "The convergence of programming, machine learning, and travel expertise will create experiences that seem magical—where complexity disappears and travelers can focus on what matters.",
  },
  {
    id: 3,
    quote:
      "Our mission is to build technology that understands the human aspects of travel while leveraging the power of AI to make every journey better than the last.",
  },
]

// Personal journey milestones
const journeyMilestones = [
  {
    year: "Q2 2024",
    title: "Suitpax Inception",
    description: "The journey began with a vision to transform business travel through AI and programming excellence.",
  },
  {
    year: "Q3 2024",
    title: "Core Architecture",
    description:
      "Development of the foundational architecture combining machine learning models with travel industry expertise.",
  },
  {
    year: "Q4 2024",
    title: "Alpha Testing",
    description:
      "First internal tests of the platform with a small group of early adopters providing valuable feedback.",
  },
  {
    year: "Q1 2025",
    title: "Internal Testing",
    description:
      "Started internal testing and limited trials with selected users, gathering critical feedback for refinement.",
  },
  {
    year: "Q2 2025",
    title: "Official Launch",
    description:
      "Scheduled official launch at the end of Q2, bringing our revolutionary business travel platform to the market.",
  },
]

// Component for a skill bar (thin and gray)
const SkillBar = ({ skill, level }) => (
  <div className="mb-3">
    <div className="flex justify-between items-center mb-1">
      <span className="text-xs text-white/80 font-medium">{skill}</span>
      <span className="text-xs text-white/60">{level}%</span>
    </div>
    <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gray-400 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${level}%` }}
        transition={{ duration: 1, delay: 0.2 }}
      />
    </div>
  </div>
)

// Component for a team member card
const TeamMemberCard = ({ member }) => (
  <motion.div
    className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:border-white/20 transition-all"
    whileHover={{ y: -5 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/20">
        <Image
          src={member.image || "/placeholder.svg"}
          alt={member.name}
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h4 className="text-sm font-medium text-white">{member.name}</h4>
        <p className="text-xs text-white/60">{member.role}</p>
      </div>
    </div>
    <div className="bg-white/5 rounded-lg p-2 text-xs text-white/70">
      <span className="text-[10px] text-white/50 block mb-1">Specialty:</span>
      {member.specialty}
    </div>
  </motion.div>
)

// Component for passion card
const PassionCard = ({ passion }) => (
  <motion.div
    className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:border-white/20 transition-all"
    whileHover={{ y: -5 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-md bg-transparent backdrop-blur-xl flex items-center justify-center border border-white/10">
        <passion.icon className={`h-5 w-5 text-${passion.color}`} />
      </div>
      <h4 className="text-sm font-medium text-white">{passion.title}</h4>
    </div>
    <p className="text-xs text-white/70 leading-relaxed">{passion.description}</p>
  </motion.div>
)

// Component for code example
const CodeExample = ({ example }) => (
  <motion.div
    className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="p-3 border-b border-white/10">
      <h4 className="text-sm font-medium text-white">{example.title}</h4>
    </div>
    <div className="p-4 bg-gray-900/50 overflow-x-auto">
      <pre className="text-xs text-gray-300 font-mono">
        <code>{example.code}</code>
      </pre>
    </div>
  </motion.div>
)

// Component for intersection card
const IntersectionCard = ({ intersection }) => (
  <motion.div
    className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-md bg-transparent backdrop-blur-xl flex items-center justify-center border border-white/10">
        <intersection.icon className="h-5 w-5 text-gray-400" />
      </div>
      <h4 className="text-sm font-medium text-white">{intersection.title}</h4>
    </div>
    <p className="text-xs text-white/70">{intersection.description}</p>
  </motion.div>
)

// Component for Suitpax foundation
const FoundationCard = ({ foundation }) => (
  <motion.div
    className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center border border-gray-700">
        <foundation.icon className="h-5 w-5 text-gray-400" />
      </div>
      <h4 className="text-sm font-medium text-white">{foundation.title}</h4>
    </div>
    <p className="text-xs text-white/70">{foundation.description}</p>
  </motion.div>
)

// Component for vision statement
const VisionCard = ({ statement }) => (
  <motion.div
    className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={{ scale: 1.02 }}
  >
    <p className="text-sm text-white/90 mb-3">{statement.quote}</p>
  </motion.div>
)

// Component for journey milestone
const MilestoneCard = ({ milestone }) => (
  <motion.div
    className="flex gap-4 items-start"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="w-20 flex-shrink-0">
      <div className="text-lg font-bold text-gray-400">{milestone.year}</div>
      <div className="h-px w-full bg-gray-700 mt-2"></div>
    </div>
    <div>
      <h4 className="text-sm font-medium text-white">{milestone.title}</h4>
      <p className="text-xs text-white/70 mt-1">{milestone.description}</p>
    </div>
  </motion.div>
)

// Main component
export default function ManifestoShowcaseAlt() {
  const [activeTab, setActiveTab] = useState("passions")

  // Logos array with the two remaining logos
  const logos = [
    {
      id: 1,
      src: "/logo/manifesto-logo-2.jpeg",
      alt: "Suitpax Technical Vision",
    },
    {
      id: 2,
      src: "/logo/manifesto-logo-3.jpeg",
      alt: "Suitpax Innovation Symbol",
    },
    {
      id: 3,
      src: "/logo/manifesto-logo-4.jpeg",
      alt: "Suitpax Connection Paths",
    },
  ]

  return (
    <div className="relative py-20 md:py-28 lg:py-32 overflow-hidden bg-black">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-[0.03] bg-repeat bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12 relative z-10 pt-16 md:pt-24 lg:pt-28">
        {/* Header section */}
        <div className="flex flex-col items-center text-center mb-16 relative">
          <div className="inline-flex items-center rounded-md bg-white/5 backdrop-blur-sm px-3 py-1 text-[10px] font-medium text-white/80 border border-white/10 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
            The Suitpax Story
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-tighter leading-tight max-w-5xl mx-auto bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
            Three passions united
          </h2>

          <p className="mt-4 text-sm font-medium text-white/60 max-w-2xl">
            Suitpax was born from the convergence of three passions: programming excellence, machine learning
            innovation, and a deep understanding of travel. Together, they create something truly transformative.
          </p>
        </div>

        {/* Logo section with three small titles */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {/* First title and logo */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg lg:text-xl font-medium tracking-tighter text-white mb-4">Technical Innovation</h3>
            <div className="w-28 h-28 lg:w-36 lg:h-36 relative mb-4">
              <div className="absolute inset-0 rounded-xl overflow-hidden border border-white/20">
                <Image
                  src={logos[0].src || "/placeholder.svg"}
                  alt={logos[0].alt}
                  fill
                  className="object-contain p-1"
                />
              </div>
            </div>
            <p className="text-xs text-white/70 text-center max-w-xs">
              Our commitment to technical excellence drives us to push the boundaries of what's possible in travel
              technology
            </p>
          </div>

          {/* Second title and logo */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium tracking-tighter text-white mb-4">Collaborative Growth</h3>
            <div className="w-28 h-28 lg:w-36 lg:h-36 relative mb-4">
              <div className="absolute inset-0 rounded-xl overflow-hidden border border-white/20">
                <Image
                  src={logos[1].src || "/placeholder.svg"}
                  alt={logos[1].alt}
                  fill
                  className="object-contain p-1"
                />
              </div>
            </div>
            <p className="text-xs text-white/70 text-center max-w-xs">
              We grow together as a team, combining diverse skills and perspectives to create AI solutions that
              transform business travel
            </p>
          </div>

          {/* Third title and logo - NEW */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium tracking-tighter text-white mb-4">Travel Connections</h3>
            <div className="w-28 h-28 lg:w-36 lg:h-36 relative mb-4">
              <div className="absolute inset-0 rounded-xl overflow-hidden border border-white/20">
                <Image
                  src={logos[2].src || "/placeholder.svg"}
                  alt={logos[2].alt}
                  fill
                  className="object-contain p-1"
                />
              </div>
            </div>
            <p className="text-xs text-white/70 text-center max-w-xs">
              Our passion for creating meaningful connections through travel drives us to build tools that bring people
              together across the global business landscape
            </p>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-1">
            <button
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                activeTab === "passions" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
              }`}
              onClick={() => setActiveTab("passions")}
            >
              Passions
            </button>
            <button
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                activeTab === "intersections" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
              }`}
              onClick={() => setActiveTab("intersections")}
            >
              Intersections
            </button>
            <button
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                activeTab === "vision" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
              }`}
              onClick={() => setActiveTab("vision")}
            >
              Vision
            </button>
            <button
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                activeTab === "journey" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
              }`}
              onClick={() => setActiveTab("journey")}
            >
              Journey
            </button>
          </div>
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === "passions" && (
            <motion.div
              key="passions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid md:grid-cols-3 gap-4 lg:gap-6 xl:gap-8 mb-12">
                {passions.map((passion) => (
                  <PassionCard key={passion.id} passion={passion} />
                ))}
              </div>

              <div className="text-center">
                <p className="text-white/70 text-sm mb-4">
                  These three passions form the foundation of everything we build at Suitpax
                </p>
                <div className="inline-flex items-center bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 px-4 py-2">
                  <span className="text-xs text-white/80">Learn more about our approach</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 ml-2"></span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "intersections" && (
            <motion.div
              key="intersections"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid md:grid-cols-2 gap-4 lg:gap-6 xl:gap-8 mb-12">
                {intersections.map((intersection) => (
                  <IntersectionCard key={intersection.id} intersection={intersection} />
                ))}
              </div>

              <div className="text-center">
                <p className="text-white/70 text-sm mb-4">
                  When our passions intersect, they create something greater than the sum of their parts
                </p>
                <div className="inline-flex items-center bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 px-4 py-2">
                  <span className="text-xs text-white/80">Explore our technology</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 ml-2"></span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "vision" && (
            <motion.div
              key="vision"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid md:grid-cols-1 gap-4 mb-12 max-w-2xl mx-auto">
                {visionStatements.map((statement) => (
                  <VisionCard key={statement.id} statement={statement} />
                ))}
              </div>

              <div className="text-center">
                <p className="text-white/70 text-sm mb-4">
                  Our vision for the future of business travel drives everything we do
                </p>
                <Link
                  href="mailto:hiring@suitpax.com"
                  className="inline-flex items-center bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 px-4 py-2 hover:bg-black/50 hover:border-white/20 transition-all"
                >
                  <span className="text-xs text-white/80">Join our founding team</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 ml-2"></span>
                </Link>
              </div>
            </motion.div>
          )}

          {activeTab === "journey" && (
            <motion.div
              key="journey"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-2xl mx-auto mb-12">
                <div className="space-y-8">
                  {journeyMilestones.map((milestone) => (
                    <MilestoneCard key={milestone.year} milestone={milestone} />
                  ))}
                </div>
              </div>

              <div className="text-center">
                <p className="text-white/70 text-sm mb-4">
                  Our journey is just beginning—join us as we transform business travel
                </p>
                <div className="flex flex-col items-center">
                  <Link
                    href="https://accounts.suitpax.com/sign-up"
                    className="inline-flex items-center bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 px-4 py-2"
                  >
                    <span className="text-xs text-white/80 hover:text-gray-300">Pre-register for early access</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500 ml-2"></span>
                  </Link>
                  <span className="text-[9px] text-white/50 mt-2">*Limited access approval not guaranteed*</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom section with featured logo */}
        <div className="mt-16 border-t border-white/10 pt-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Logo */}
            <div className="w-24 h-24 relative flex-shrink-0">
              <div className="absolute inset-0 rounded-xl overflow-hidden border border-white/20">
                <Image
                  src="/images/suitpax-diamond-logo.png"
                  alt="Suitpax Diamond"
                  fill
                  className="object-contain p-2"
                />
              </div>
            </div>

            {/* Text content */}
            <div>
              <h4 className="text-xl font-medium tracking-tighter text-white mb-2">Join our journey</h4>
              <p className="text-sm text-white/70">
                At Suitpax, we're bringing together programming excellence, machine learning innovation, and deep travel
                expertise to create something truly transformative. Our passion for these three domains drives us to
                build a platform that will forever change how businesses approach travel.
              </p>

              <div className="flex flex-wrap gap-3 mt-4">
                <div className="inline-flex items-center bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 px-3 py-1.5">
                  <PiCodeBold className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                  <span className="text-xs text-white/80">Programming</span>
                </div>
                <div className="inline-flex items-center bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 px-3 py-1.5">
                  <PiBrainBold className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                  <span className="text-xs text-white/80">Machine Learning</span>
                </div>
                <div className="inline-flex items-center bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 px-3 py-1.5">
                  <PiAirplaneTakeoffBold className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                  <span className="text-xs text-white/80">Travel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
