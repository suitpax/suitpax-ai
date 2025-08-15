"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { PiGlobeBold, PiLightningBold, PiShieldCheckBold, PiDotsSixBold, PiDotsNineBold } from "react-icons/pi"

// Real user photos from Unsplash
const communityMembers = [
  {
    id: 1,
    image: "/community/ammar-foley.webp",
  },
  {
    id: 2,
    image: "/community/owen-harding.webp",
  },
  {
    id: 3,
    image: "/community/jordan-burgess.webp",
  },
  {
    id: 4,
    image: "/community/adil-floyd.webp",
  },
  {
    id: 5,
    image: "/community/nicolas-trevino.webp",
  },
  {
    id: 6,
    image: "/community/ashton-blackwell.webp",
  },
  {
    id: 7,
    image: "/community/scott-clayton.webp",
  },
  {
    id: 8,
    image: "/community/bec-ferguson.webp",
  },
  {
    id: 9,
    image: "/community/byron-robertson.webp",
  },
  {
    id: 10,
    image: "/community/isobel-fuller.webp",
  },
  {
    id: 11,
    image: "/community/lana-steiner.jpg",
  },
  {
    id: 12,
    image: "/community/nikolas-gibbons.jpg",
  },
  {
    id: 13,
    image: "/community/kelsey-lowe.webp",
  },
  {
    id: 14,
    image: "/community/brianna-ware.webp",
  },
  {
    id: 15,
    image: "/community/harriet-rojas.jpg",
  },
  {
    id: 16,
    image: "/community/sienna-hewitt.jpg",
  },
  {
    id: 17,
    image: "/community/belle-woods.webp",
  },
  {
    id: 18,
    image: "/community/elisa-nishikawa.jpg",
  },
  {
    id: 19,
    image: "/community/olly-schroeder.jpg",
  },
  {
    id: 20,
    image: "/community/loki-bright.jpg",
  },
]

// Manifesto points
const manifestoPoints = [
  {
    id: 1,
    title: "Efficiency is Everything.",
    description:
      "We don't waste time. We don't waste resources. We focus on building streamlined, optimized solutions that get results. Every line of code, every feature, every system must be efficient, fast, and scalable. If it doesn't drive efficiency, we don't do it.",
  },
  {
    id: 2,
    title: "Automate or Die.",
    description:
      "Manual processes are a thing of the past. In the world of business travel, automation is the backbone of success. If it can be automated, it will be. We design systems that handle complex tasks effortlessly, freeing up time and resources for the things that matter.",
  },
  {
    id: 3,
    title: "Data is Power.",
    description:
      "Our decisions are guided by data, not assumptions. Every action we take is rooted in real-time analytics, insights, and machine learning. Our platform evolves by learning from the data, continuously improving, and adapting to meet user needs with pinpoint accuracy.",
  },
  {
    id: 4,
    title: "Scalability is in Our DNA.",
    description:
      "We build with the future in mind. Suitpax isn't designed for today's needs – it's built to scale for tomorrow's challenges. Whether it's processing millions of data points or integrating new technologies, we prepare our platform to grow without limits.",
  },
  {
    id: 5,
    title: "Move Fast, Fail Fast, Learn Fast.",
    description:
      "We don't wait for perfection. We iterate quickly, deploy often, and learn from our mistakes. Speed is crucial, but so is resilience. We embrace failure as a stepping stone to success and constantly refine our processes to move faster and smarter.",
  },
  {
    id: 6,
    title: "Users Are the Heartbeat.",
    description:
      "We are relentless in our pursuit of the best possible user experience. Every design, every interaction, every feature is crafted with the end-user in mind. Our goal is to make business travel not just efficient, but seamless, enjoyable, and intuitive.",
  },
  {
    id: 7,
    title: "Security is Non-Negotiable.",
    description:
      "In an age where data breaches are common, security is our top priority. We build systems that protect user data with the highest standards. Our users trust us with sensitive information, and we deliver on that trust with uncompromising security.",
  },
  {
    id: 8,
    title: "Collaboration > Ego.",
    description:
      "We're a team of doers, not talkers. Our success is driven by collaboration, not individual accolades. The best ideas come from the collective, and we embrace diverse perspectives to build the most innovative solutions. Ego has no place here – only results.",
  },
  {
    id: 9,
    title: "Disrupt or Be Disrupted.",
    description:
      "Innovation is in our DNA. We're here to challenge the status quo, to break down barriers and push the boundaries of what's possible. Disruption is our goal, and we won't stop until we've reshaped the business travel landscape for good.",
  },
  {
    id: 10,
    title: "Keep it Simple.",
    description:
      "Complexity doesn't always lead to better solutions. We believe in elegant, simple designs that pack power beneath the surface. Our technology may be sophisticated, but the experience is straightforward, easy to use, and intuitive.",
  },
  {
    id: 11,
    title: "Own the Outcome.",
    description:
      "We take full responsibility for our impact. Every decision, every line of code, every interaction, and every result is owned by the team. We don't pass blame—we learn, we adapt, and we own our success and failure.",
  },
  {
    id: 12,
    title: "Build with Purpose.",
    description:
      "Every feature we develop, every product we launch, has a purpose. We're not just building for the sake of building; we're creating solutions that solve real problems in the business travel world. Our mission is clear: to make travel smarter, more efficient, and more personalized for everyone.",
  },
  {
    id: 13,
    title: "Innovate Relentlessly.",
    description:
      "We never stop pushing the boundaries of what's possible. Whether it's integrating the latest AI advancements, building smarter automation workflows, or optimizing user experiences, we're always looking ahead. The next big idea is just around the corner.",
  },
  {
    id: 14,
    title: "No Boundaries.",
    description:
      "We think beyond traditional limits. Geography, industry, and process boundaries don't restrict us. We build a global platform with limitless potential to change the way business travel operates everywhere.",
  },
  {
    id: 15,
    title: "Customer Obsession.",
    description:
      "We are obsessed with our customers' success. Every decision we make is driven by how it will impact our users. We listen, we adapt, and we evolve based on their feedback. Their success is our success, and we won't rest until we've exceeded their expectations.",
  },
  {
    id: 16,
    title: "Transparency Above All.",
    description:
      "We believe in radical transparency with our team, our customers, and our partners. No hidden agendas, no secret plans. We communicate openly about our successes, our failures, and our roadmap. Trust is built on transparency, and we're committed to earning that trust every day.",
  },
  {
    id: 17,
    title: "Embrace the Future.",
    description:
      "We don't just adapt to change – we anticipate it. The future of travel is evolving rapidly, and we're at the forefront of that evolution. We embrace new technologies, new methodologies, and new ideas with open arms, always looking ahead to what's next.",
  },
  {
    id: 18,
    title: "Sustainable by Design.",
    description:
      "We build with sustainability in mind. Our platform is designed to reduce the environmental impact of business travel through smart routing, carbon offsetting, and digital-first solutions. We believe that efficiency and sustainability go hand in hand.",
  },
  {
    id: 19,
    title: "Global Mindset.",
    description:
      "We think and operate globally from day one. Our platform is built for international scale, supporting multiple languages, currencies, and regional requirements. We understand that business travel crosses borders, and our solutions do too.",
  },
  {
    id: 20,
    title: "Measure What Matters.",
    description:
      "We focus on metrics that drive real value. Vanity metrics don't impress us – we care about the numbers that reflect actual impact for our users. Every feature, every update, every decision is measured against its ability to deliver meaningful results.",
  },
]

// Function to generate the community grid
const generateCommunityGrid = () => {
  const grid = []
  const totalCells = 120 // 10×12 grid (igual que en BusinessTravelRevolution)

  // Use each member exactly once first
  for (let i = 0; i < Math.min(totalCells, communityMembers.length); i++) {
    grid.push({
      id: `user-${i}`,
      image: communityMembers[i].image,
    })
  }

  // If we need more cells than we have members, fill the rest with random members
  // but ensure we don't use the same member twice in a row
  if (totalCells > communityMembers.length) {
    for (let i = communityMembers.length; i < totalCells; i++) {
      let randomIndex
      // Make sure we don't use the same image as the previous cell
      do {
        randomIndex = Math.floor(Math.random() * communityMembers.length)
      } while (i > 0 && grid[i - 1].image === communityMembers[randomIndex].image)

      grid.push({
        id: `user-${i}`,
        image: communityMembers[randomIndex].image,
      })
    }
  }

  return grid
}

// Component for a single manifesto point
const ManifestoPoint = ({ point, isActive, onClick, onHover }) => (
  <motion.button
    className={`w-full text-left px-2 py-1 rounded-md text-xs font-medium tracking-tighter transition-all ${
      isActive ? "bg-white/10 text-white" : "text-white/60 hover:text-white/80 hover:bg-white/5"
    }`}
    onClick={onClick}
    onMouseEnter={onHover}
    onMouseLeave={() => onHover(null)}
    whileHover={{ x: 2 }}
  >
    <div className="flex items-center">
      <span className={`w-1 h-1 rounded-full mr-1.5 ${isActive ? "bg-emerald-500" : "bg-white/30"}`}></span>
      <span className="truncate">{point.title.replace(".", "")}</span>
    </div>
  </motion.button>
)

// Estilos CSS personalizados para la barra de desplazamiento
const scrollbarStyles = `
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`

// Component for the manifesto detail view
const ManifestoDetail = ({ point, communityMembers }) => (
  <motion.div
    key={point.id}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.5 }}
    className="h-full flex flex-col"
  >
    <div className="flex items-center gap-2 mb-4">
      <div className="w-6 h-6 rounded-full bg-emerald-900/30 flex items-center justify-center border border-emerald-500/20">
        <PiDotsNineBold className="h-4 w-4 text-emerald-400" />
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
    </div>

    <h3 className="text-lg md:text-xl font-medium tracking-tighter bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent mb-3">
      {point.title}
    </h3>

    <p className="text-xs text-white/80 font-medium tracking-tighter leading-relaxed">{point.description}</p>

    <div className="mt-auto pt-4">
      <div className="flex items-center gap-2 text-[9px] text-white/60">
        <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
        <span>Active principle</span>
      </div>
    </div>
  </motion.div>
)

// Component for a mini badge
const MiniBadge = ({ icon: Icon, title }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:bg-white/10 transition-all">
    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
    <span className="text-xs text-white font-medium">{title}</span>
    <Icon className="h-3.5 w-3.5 text-white/80" />
  </div>
)

// Main component
export default function ModernManifestoShowcase() {
  const [communityGrid, setCommunityGrid] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [activeManifesto, setActiveManifesto] = useState(1)
  const [hoveredManifesto, setHoveredManifesto] = useState(null)

  // Mover las referencias de video dentro del componente
  const video1Ref = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setCommunityGrid(generateCommunityGrid())

    // Auto-rotate through manifesto points
    const interval = setInterval(() => {
      setActiveManifesto((prev) => (prev % manifestoPoints.length) + 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Get the active manifesto point
  const activePoint = manifestoPoints.find((point) => point.id === activeManifesto) || manifestoPoints[0]

  return (
    <div className="relative py-20 md:py-28 lg:py-32 overflow-hidden bg-black">
      <style jsx global>
        {scrollbarStyles}
      </style>
      {/* Background elements */}
      <div className="absolute inset-0 opacity-[0.03] bg-repeat bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <motion.div
        className="absolute top-0 left-0 w-full h-full opacity-20"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(6, 95, 70, 0.3) 0%, transparent 50%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12 relative z-10 pt-16 md:pt-24 lg:pt-28">
        {/* Header section */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-md bg-white/5 backdrop-blur-sm px-3 py-1 text-[10px] font-medium text-white/80 border border-white/10 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            The Suitpax Manifesto
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-tighter leading-tight max-w-5xl mx-auto bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent"
          >
            Our code of vision: Suitpax 2031
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-sm font-medium text-white/60 max-w-2xl"
          >
            Our mission is to transform how companies manage travel, combining cutting-edge AI with human-centered
            design to create a platform that empowers both travelers and businesses
          </motion.p>

          {/* Añadir badges de visión directamente en el header */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mt-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <MiniBadge icon={PiDotsSixBold} title="Human-Centered Travel" />
            <MiniBadge icon={PiLightningBold} title="Efficiency First" />
            <MiniBadge icon={PiGlobeBold} title="Global Perspective" />
            <MiniBadge icon={PiShieldCheckBold} title="Ethical AI" />
          </motion.div>
        </div>

        {/* Community grid */}
        <div className="relative mb-16">
          <div className="max-w-5xl mx-auto mb-16">
            <div className="grid grid-cols-10 gap-1.5 md:gap-2">
              {communityGrid.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.003 }}
                  className="aspect-square relative cursor-pointer"
                  onClick={() => setSelectedUser(member.id === selectedUser ? null : member.id)}
                >
                  {/* Glowing effect for selected user */}
                  <AnimatePresence>
                    {selectedUser === member.id && (
                      <motion.div
                        className="absolute inset-0 rounded-md z-10 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: [0.4, 0.7, 0.4],
                          scale: [0.9, 1.1, 0.9],
                        }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                        style={{
                          background: "rgba(6, 95, 70, 0.3)",
                          boxShadow: "0 0 15px 5px rgba(6, 95, 70, 0.2)",
                        }}
                      />
                    )}
                  </AnimatePresence>

                  <div className="absolute inset-0 rounded-md overflow-hidden bg-gray-800">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt="Community member"
                      fill
                      className={`object-cover transition-all duration-300 ${selectedUser === member.id ? "" : "grayscale"}`}
                      sizes="(max-width: 768px) 30px, (max-width: 1024px) 40px, 50px"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none"></div>
        </div>

        {/* Videos del Future Legacy Vision */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primer video */}
            <div className="relative overflow-hidden rounded-xl shadow-sm h-[180px] group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <span className="inline-flex items-center rounded-xl bg-gray-200/30 backdrop-blur-sm px-2 py-0.5 text-[8px] font-medium text-white mb-1">
                  2025-2035
                </span>
                <h4 className="text-white text-sm font-medium tracking-tight mb-0.5">AI agent evolution</h4>
              </div>
              <video
                ref={video1Ref}
                className="w-full h-full object-cover scale-[1.2] object-[center_top]"
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

            {/* Segundo video */}
            <div className="relative overflow-hidden rounded-xl shadow-sm h-[180px] group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <span className="inline-flex items-center rounded-xl bg-gray-200/30 backdrop-blur-sm px-2 py-0.5 text-[8px] font-medium text-white mb-1">
                  2035-2050
                </span>
                <h4 className="text-white text-sm font-medium tracking-tight mb-0.5">AI-human collaboration</h4>
              </div>
              <video ref={video2Ref} className="w-full h-full object-cover scale-[1.1]" autoPlay muted loop playsInline>
                <source
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/372670580883685377%20%28online-video-cutter.com%29%20%281%29%20%281%29-EIRyjgj1RasF39wL5XnuWI6ZQUmOZE.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-300"></div>
            </div>
          </div>

          <div className="flex justify-center mt-3">
            <span className="inline-flex items-center rounded-xl bg-gray-200/10 backdrop-blur-sm px-2.5 py-0.5 text-[9px] font-medium text-white/70">
              <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1.5"></span>
              Future AI vision 2025-2065
            </span>
          </div>
        </div>

        {/* Manifesto content */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            {/* Left column - Manifesto navigation */}
            <div className="md:w-1/3 lg:w-1/4">
              <h3 className="text-lg font-medium tracking-tighter bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent mb-4 sticky top-0 bg-black/80 py-2">
                Our 20 Principles
              </h3>

              <div className="grid grid-cols-2 gap-1.5">
                {manifestoPoints.slice(0, 20).map((point) => (
                  <ManifestoPoint
                    key={point.id}
                    point={point}
                    isActive={activeManifesto === point.id}
                    onClick={() => setActiveManifesto(point.id)}
                    onHover={(id) => setHoveredManifesto(id)}
                  />
                ))}
              </div>
            </div>

            {/* Right column - Active manifesto point */}
            <div className="md:w-2/3 md:border-l border-white/10 md:pl-8">
              <AnimatePresence mode="wait">
                <ManifestoDetail point={activePoint} communityMembers={communityMembers} />
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Stats section - Vertical blocks with main content */}
        <div className="flex flex-col w-full mt-12 space-y-6">
          {/* Main content block with diamond logo */}
          <motion.div
            className="flex flex-col md:flex-row gap-4 items-start border-b border-white/10 pb-6"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            {/* Suitpax Symbol */}
            <div className="rounded-md border border-white/10 overflow-hidden flex-shrink-0 w-16 h-16 md:w-20 md:h-20 relative">
              <Image src="/logo/suitpax-symbol.webp" alt="Suitpax Symbol" fill className="object-cover" />
            </div>

            {/* Text content */}
            <div className="flex flex-col">
              <h4 className="text-xl md:text-2xl font-medium tracking-tighter text-white mb-2">
                The future of business travel is here
              </h4>
              <p className="text-sm text-white/70 max-w-2xl">
                Our manifesto represents more than just words—it's our commitment to revolutionizing how businesses
                approach travel. With a focus on efficiency, automation, and user experience, we're building a platform
                that will transform the industry.
              </p>
            </div>
          </motion.div>

          {/* Stats items */}
          <div className="space-y-2">
            <motion.div
              className="flex items-center gap-2 border-b border-white/10 px-0 py-2"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-xl font-medium tracking-tighter text-white">20</span>
              <span className="text-[10px] text-white/60">Core principles</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 border-b border-white/10 px-0 py-2"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <span className="text-xl font-medium tracking-tighter text-white">2031</span>
              <span className="text-[10px] text-white/60">Vision year</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 border-b border-white/10 px-0 py-2"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <span className="text-[10px] text-white/60">Community members</span>
              <span className="text-[10px] text-white/40">Not active</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 border-b border-white/10 px-0 py-2"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <span className="text-[10px] text-white/60">Countries represented</span>
              <span className="text-[10px] text-white/40">Not active</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 border-b border-white/10 px-0 py-2"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <span className="text-[10px] text-white/80 font-medium">Launching Q2 2025</span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
