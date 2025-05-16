"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PiDotsNineBold, PiDotsSixBold, PiDotsThreeBold, PiArrowRightBold } from "react-icons/pi"
import { BsHeartFill } from "react-icons/bs"
import { keyframes } from "@emotion/react"
import { useState, useEffect } from "react"

// Componente de simulación de chat con efecto de borde animado
const ChatSimulator = () => {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)

  const messages = [
    "Hi there! We're looking for talented engineers to join our mission.",
    "Our goal is to bring our software to millions of business travelers worldwide.",
    "We're revolutionizing how companies manage travel with cutting-edge AI.",
    "Want to help us transform the industry? Join our team!",
  ]

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (isTyping && typedText.length < messages[currentMessage].length) {
      timeout = setTimeout(
        () => {
          setTypedText(messages[currentMessage].substring(0, typedText.length + 1))
        },
        50 + Math.random() * 30,
      )
    } else if (typedText === messages[currentMessage]) {
      timeout = setTimeout(() => {
        setIsTyping(false)
        setTimeout(() => {
          setTypedText("")
          setCurrentMessage((prev) => (prev + 1) % messages.length)
          setIsTyping(true)
        }, 2000)
      }, 1500)
    }

    return () => clearTimeout(timeout)
  }, [typedText, isTyping, currentMessage, messages])

  // Animación del borde tipo circuito
  const borderAnimation = keyframes`
    0% { background-position: 0% 0%; }
    100% { background-position: 200% 0%; }
  `

  return (
    <div className="relative p-0.5 rounded-xl overflow-hidden">
      {/* Borde animado */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(90deg, #065f46, white, black, white)",
          backgroundSize: "200% 100%",
          animation: `${borderAnimation} 3s linear infinite`,
        }}
      />

      {/* Contenido del chat */}
      <div className="bg-white p-3 rounded-xl relative z-10 border border-emerald-950/20">
        <p className="text-xs text-emerald-950">
          {typedText}
          {isTyping && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.7 }}
              className="inline-block w-1.5 h-3 bg-emerald-950/40 ml-1"
            />
          )}
        </p>

        <div className="flex justify-between mt-2">
          <div className="flex gap-1">
            {messages.map((_, idx) => (
              <motion.div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full ${idx === currentMessage ? "bg-black" : "bg-gray-300"}`}
                animate={idx === currentMessage ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              />
            ))}
          </div>
          <a
            href="mailto:hello@suitpax.com"
            className="text-[10px] text-emerald-950 font-medium hover:text-amber-500 transition-colors"
          >
            Apply Now
          </a>
        </div>
      </div>
    </div>
  )
}

const marquee = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`

// Títulos alternativos para el componente
const titleVariations = [
  "We're hiring! Will you join us?",
  "Join our mission to transform business travel",
  "Build the future of travel with us",
  "Be part of the Suitpax revolution",
]

// Posiciones disponibles
const positions = [
  {
    id: 1,
    title: "Co-Founder/CTO",
    description: "Lead our technical vision and build the foundation of our AI-powered travel platform",
    icon: <PiDotsSixBold className="w-6 h-6" />,
    requirements: [
      "10+ years of engineering leadership",
      "Experience scaling startups from 0 to 1",
      "Strong background in AI/ML systems",
      "Passion for revolutionizing business travel",
    ],
  },
  {
    id: 2,
    title: "Founding AI Engineer",
    description: "Design and implement cutting-edge AI systems that power our travel agents",
    icon: <PiDotsNineBold className="w-6 h-6" />,
    requirements: [
      "5+ years experience with LLMs and AI systems",
      "Strong Python and TypeScript skills",
      "Experience with RAG and agent architectures",
      "Passion for human-centered AI design",
    ],
  },
  {
    id: 3,
    title: "CPO",
    description: "Shape our product strategy and deliver exceptional travel experiences",
    icon: <PiDotsThreeBold className="w-6 h-6" />,
    requirements: [
      "8+ years of product leadership",
      "Experience in travel tech or B2B SaaS",
      "Strong user-centered design approach",
      "Ability to translate vision into execution",
    ],
  },
]

// Estadísticas
const stats = [
  {
    label: "Open Positions",
    value: positions.length.toString(),
    description: "Growing with our needs",
  },
  {
    label: "Team Size",
    value: "2 Humans",
    description: "+ super AI Agent team",
  },
  {
    label: "Funding",
    value: "20.000€",
    description: "Founder investment",
  },
  {
    label: "Founded",
    value: "Q2 2025",
    description: "Launch date",
  },
]

// Beneficios actualizados enfocados en crecimiento y tecnología AI
const benefits = [
  "Join a rapidly growing team at the forefront of AI travel technology",
  "Develop cutting-edge AI systems that will transform the business travel industry",
  "Competitive compensation with significant equity in our high-growth startup",
  "Work with world-class talent building the best team in the industry",
  "Shape the future of travel with innovative AI solutions and agentic systems",
  "Flexible work environment that prioritizes impact and innovation",
  "Help bring our software to millions of business travelers and corporate employees worldwide",
]

// Valores de la empresa actualizados
const values = [
  "AI-first approach: We build with and for artificial intelligence",
  "Customer obsession: Every decision starts with the traveler",
  "Radical transparency: Open communication and shared knowledge",
  "Ownership mindset: Everyone acts like a founder",
  "Continuous learning: We embrace growth and experimentation",
  "Global impact: Our mission is to reach millions of business travelers worldwide",
]

// Actualizar los contactos para un único correo de contacto
const contacts = [
  {
    name: "Founders Team",
    role: "Leadership",
    email: "founders@suitpax.com",
    image: "/logo/suitpax-symbol-2.png",
  },
]

export const Hiring = () => {
  // Seleccionar un título aleatorio
  const randomTitle = titleVariations[Math.floor(Math.random() * titleVariations.length)]

  return (
    <section className="py-16 bg-gray-300 text-black relative overflow-hidden">
      {/* Coordenadas decorativas como en el diseño de referencia */}
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="absolute top-0 left-0 right-0 overflow-hidden whitespace-nowrap">
          <div className="animate-marquee inline-block">
            <div className="flex justify-between text-xs border-b border-black/20 pb-2 mb-8 w-[200%]">
              <span>37° 46' 30.0"</span>
              <span>N</span>
              <span>122° 25' 09.0"</span>
              <span>W</span>
              <span>37.7750</span>
              <span>↑</span>
              <span>-122.4194</span>
              <span>→</span>
              <span>San Francisco</span>
              <span>California</span>
              <span>37° 46' 30.0"</span>
              <span>N</span>
              <span>122° 25' 09.0"</span>
              <span>W</span>
              <span>37.7750</span>
              <span>↑</span>
              <span>-122.4194</span>
              <span>→</span>
              <span>San Francisco</span>
              <span>California</span>
              <span>37° 46' 30.0"</span>
              <span>N</span>
              <span>122° 25' 09.0"</span>
              <span>W</span>
              <span>37.7750</span>
              <span>↑</span>
              <span>-122.4194</span>
              <span>→</span>
              <span>San Francisco</span>
              <span>California</span>
              <span>37° 46' 30.0"</span>
              <span>N</span>
              <span>122° 25' 09.0"</span>
              <span>W</span>
              <span>37.7750</span>
              <span>↑</span>
              <span>-122.4194</span>
              <span>→</span>
              <span>San Francisco</span>
              <span>California</span>
            </div>
          </div>
        </div>

        <div className="pt-12">
          {/* Suitpax symbol en el centro */}
          <div className="flex justify-center mb-4">
            <Image
              src="/logo/suitpax-symbol-2.png"
              alt="Suitpax Symbol"
              width={30}
              height={30}
              className="rounded-lg"
            />
          </div>

          {/* Badges similares a AI Travel Agents */}
          <div className="flex items-center gap-2 mb-4 justify-center">
            <span className="inline-flex items-center rounded-xl bg-black/10 px-2.5 py-0.5 text-[10px] font-medium text-black">
              Join our team
            </span>
            <span className="inline-flex items-center rounded-xl bg-black/10 px-2.5 py-0.5 text-[9px] font-medium text-black">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse mr-1"></span>
              Q3 2025
            </span>
            <span className="inline-flex items-center rounded-xl bg-black/10 px-2.5 py-0.5 text-[9px] font-medium text-black">
              We <BsHeartFill className="inline-block mx-0.5 text-red-500" /> Tech enthusiasts
            </span>
          </div>

          {/* Título principal con estilo similar a AI Travel Agents */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-none text-center mb-4">
            {randomTitle}
          </h2>
          <p className="text-lg md:text-xl text-center max-w-2xl mx-auto mb-12 text-black/80">
            Build the next generation of agentic travel systems for millions of business travelers
          </p>

          {/* Stats en formato vertical */}
          <div className="flex flex-col items-center mb-12 gap-2 w-full">
            <div className="inline-block border border-black/30 px-4 py-1 mb-4 text-sm text-black/80 rounded-md bg-transparent font-medium">
              OVERVIEW
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center bg-transparent border border-black/30 rounded-md p-3 text-center w-full h-full"
                >
                  <p className="text-xs font-medium text-black/70">{stat.label}</p>
                  <p className="text-sm font-bold">{stat.value}</p>
                  <p className="text-[10px] text-black/60">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sección de valores */}
          <div className="inline-block border border-black/30 px-4 py-1 mb-8 mx-auto text-sm text-black/80 rounded-md bg-transparent font-medium">
            OUR VALUES
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {values.map((value, index) => (
              <div key={index} className="bg-transparent border border-black/20 p-3 rounded-md">
                <p className="text-xs font-medium text-black/80">{value}</p>
              </div>
            ))}
          </div>

          {/* Posiciones disponibles - Estilo de tarjetas similar a los screenshots */}
          {/* Eliminar esta sección:
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {positions.map((position) => (
              <motion.div
                key={position.id}
                className="bg-transparent backdrop-blur-xl p-6 rounded-md border border-black/20 relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {/* Efecto de fondo }
                <div className="absolute -inset-1 bg-black/5 blur-xl"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-black/10 rounded-md">{position.icon}</div>
                    <h3 className="text-xl font-medium tracking-tighter">{position.title}</h3>
                  </div>

                  <p className="text-sm text-black/70 mb-4">{position.description}</p>

                  <div className="space-y-2">
                    {position.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <p className="text-xs text-black/80">{req}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          */}

          {/* Reemplazar con: */}
          <div className="mb-12">
            <div className="inline-block border border-black/30 px-4 py-1 mb-8 mx-auto text-sm text-black/80 rounded-md bg-transparent font-medium">
              BUILDING OUR TECHNICAL TEAM
            </div>

            <div className="max-w-2xl mx-auto bg-transparent backdrop-blur-xl p-6 rounded-md border border-black/20 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-lg font-medium tracking-tighter mb-4 text-center">
                  We're assembling a world-class engineering team
                </p>

                <p className="text-sm text-black/80 mb-4 text-center">
                  Our mission is to build the most advanced AI-powered travel platform. We're looking for passionate
                  engineers, AI specialists, and product visionaries who want to transform how businesses manage travel.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-black/5 p-3 rounded-md">
                    <p className="text-xs font-medium text-black/80">AI & Machine Learning Engineers</p>
                  </div>
                  <div className="bg-black/5 p-3 rounded-md">
                    <p className="text-xs font-medium text-black/80">Full-Stack Developers</p>
                  </div>
                  <div className="bg-black/5 p-3 rounded-md">
                    <p className="text-xs font-medium text-black/80">Product Designers</p>
                  </div>
                  <div className="bg-black/5 p-3 rounded-md">
                    <p className="text-xs font-medium text-black/80">Technical Leadership</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de contactos */}
          <div className="inline-block border border-black/30 px-4 py-1 mb-4 mx-auto text-sm text-black/80 rounded-md bg-transparent font-medium">
            CONTACT US
          </div>

          <div className="grid grid-cols-1 gap-3 mb-8 w-full max-w-md mx-auto">
            {contacts.map((contact, index) => (
              <div key={index} className="bg-transparent border border-black/20 p-3 rounded-md flex items-start gap-3">
                <Image
                  src={contact.image || "/placeholder.svg"}
                  alt={contact.name}
                  width={40}
                  height={40}
                  className="rounded-md object-cover bg-white"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs">{contact.name}</p>
                  <p className="text-[10px] text-black/70">{contact.role}</p>
                  <p className="text-[10px] text-black/80 truncate font-bold">{contact.email}</p>
                  <div className="flex -space-x-2 mt-1">
                    <Image
                      src="/founders/alberto.webp"
                      alt="Alberto"
                      width={16}
                      height={16}
                      className="rounded-full border border-white"
                    />
                    <Image
                      src="/founders/alexis.webp"
                      alt="Alexis"
                      width={16}
                      height={16}
                      className="rounded-full border border-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sección de beneficios */}
          <div className="inline-block border border-black/30 px-4 py-1 mb-8 mx-auto text-sm text-black/80 rounded-md bg-transparent font-medium">
            WE OFFER
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-black/5 p-3 rounded-md">
                <p className="text-xs font-medium text-black/80">{benefit}</p>
              </div>
            ))}
          </div>

          {/* Añadir la mini Card con UI chat */}
          <div className="mb-12">
            <div className="inline-block border border-black/30 px-4 py-1 mb-8 mx-auto text-sm text-black/80 rounded-md bg-transparent font-medium">
              JOIN OUR CONVERSATIONS
            </div>

            <div className="max-w-md mx-auto bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src="/agents/agent-5.png"
                    alt="Suitpax Agent"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center">
                    <p className="text-xs font-medium">Kira from Suitpax</p>
                    <span className="ml-2 inline-flex items-center rounded-xl bg-black/10 px-2 py-0.5 text-[9px] font-medium text-black">
                      Mission 2031
                    </span>
                  </div>
                  <p className="text-[10px] text-black/60">AI Recruitment Assistant</p>
                </div>
              </div>

              <ChatSimulator />

              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-[10px] text-center text-black/60">
                  Our AI assistants help streamline our hiring process. Join our team and build the next generation of
                  these tools!
                </p>
              </div>
            </div>
          </div>

          {/* Botón de acción */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="bg-transparent border-black text-black hover:bg-black/10 hover:text-black rounded-xl"
              asChild
            >
              <a href="https://wellfound.com/company/suitpax-careers" target="_blank" rel="noopener noreferrer">
                View all open positions
                <PiArrowRightBold className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hiring
