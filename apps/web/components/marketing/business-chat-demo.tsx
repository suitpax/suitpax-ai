"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import TravelChatInput from "../ui/travel-chat-input"
import {
  SiRevolut,
  SiExpensify,
  SiWise,
  SiChase,
  SiPaypal,
  SiVisa,
  SiMastercard,
  SiAmericanexpress,
} from "react-icons/si"

// Componente para el segundo ejemplo con el mismo fondo de San Francisco
const ExpenseManagementCard = () => {
  return (
    <div className="relative w-full h-auto min-h-[420px] overflow-hidden rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm">
      {/* Imagen de fondo de San Francisco */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/san-francisco-skyline.jpg"
          alt="San Francisco Skyline"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-black/10"></div>
        <div className="absolute bottom-2 left-2 right-2 text-center">
          <span className="inline-block bg-gray-800/60 backdrop-blur-md text-[8px] text-white px-2 py-0.5 rounded-md font-medium">
            Smart Expense Management
          </span>
        </div>
      </div>

      {/* Contenido superpuesto */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 sm:p-6">
        {/* Título y badge */}
        <div className="w-full text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="inline-flex items-center rounded-xl bg-gray-800/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-medium text-white shadow-sm">
              <Image
                src="/logo/suitpax-cloud-logo.webp"
                alt="Suitpax"
                width={50}
                height={12}
                className="h-3 w-auto mr-1"
              />
              <em className="font-serif italic">Expense Management</em>
            </span>
          </div>
          <h3 className="text-xl font-medium tracking-tighter text-white">Smart Receipts</h3>
          <p className="text-xs text-gray-200 mt-1">Automated expense tracking & reporting</p>
        </div>

        {/* Mini-card con varias frases sobre la tecnología - centrada y más pequeña */}
        <div className="w-full flex justify-center">
          <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-3 border border-gray-400/30 max-w-[240px] w-full mx-auto shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-white">Financial Integrations</span>
            </div>
            <div className="space-y-1 text-[10px] text-gray-300">
              <p>• Automatic receipt scanning and categorization</p>
              <p>• Real-time expense tracking with bank connections</p>
              <p>• Instant reimbursements to your account</p>
            </div>

            {/* Grid de logos de conexiones bancarias - sin fondo */}
            <div className="mt-3 grid grid-cols-4 gap-2">
              <div className="flex items-center justify-center p-1.5">
                <SiRevolut className="text-white h-4 w-4" />
              </div>
              <div className="flex items-center justify-center p-1.5">
                <SiExpensify className="text-white h-4 w-4" />
              </div>
              <div className="flex items-center justify-center p-1.5">
                <SiWise className="text-white h-4 w-4" />
              </div>
              <div className="flex items-center justify-center p-1.5">
                <SiChase className="text-white h-4 w-4" />
              </div>
              <div className="flex items-center justify-center p-1.5">
                <SiPaypal className="text-white h-4 w-4" />
              </div>
              <div className="flex items-center justify-center p-1.5">
                <SiVisa className="text-white h-4 w-4" />
              </div>
              <div className="flex items-center justify-center p-1.5">
                <SiMastercard className="text-white h-4 w-4" />
              </div>
              <div className="flex items-center justify-center p-1.5">
                <SiAmericanexpress className="text-white h-4 w-4" />
              </div>
            </div>

            {/* Texto FOMO en la parte inferior */}
            <div className="mt-2 pt-1 border-t border-gray-500/30">
              <p className="text-[9px] font-medium text-gray-300">
                <span className="text-white">Don't miss out:</span> 87% of travelers save time with our integrations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Nuevo componente para TRM Management
import { SiHubspot, SiGooglecalendar, SiZoom, SiGmail, SiIntercom } from "react-icons/si"
const TRMManagementCard = () => {
  return (
    <div className="relative w-full h-auto min-h-[420px] overflow-hidden rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm">
      {/* Imagen de fondo de San Francisco (cambiada para que sea la misma) */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/san-francisco-skyline.jpg"
          alt="San Francisco Skyline"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-black/10"></div>
        <div className="absolute bottom-2 left-2 right-2 text-center">
          <span className="inline-block bg-gray-800/60 backdrop-blur-md text-[8px] text-white px-2 py-0.5 rounded-md font-medium">
            Client Relationship Suite
          </span>
        </div>
      </div>

      {/* Contenido superpuesto */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 sm:p-6">
        {/* Título y badge */}
        <div className="w-full text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="inline-flex items-center rounded-xl bg-gray-800/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-medium text-white shadow-sm">
              <Image
                src="/logo/suitpax-cloud-logo.webp"
                alt="Suitpax"
                width={50}
                height={12}
                className="h-3 w-auto mr-1"
              />
              <em className="font-serif italic">TRM Management</em>
            </span>
          </div>
          <h3 className="text-xl font-medium tracking-tighter text-white">Client Relationships</h3>
          <p className="text-xs text-gray-200 mt-1">Seamless travel & relationship management</p>
        </div>

        {/* Mini-card con información sobre TRM */}
        <div className="w-full flex justify-center">
          <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-3 border border-gray-400/30 max-w-xs w-full mx-auto shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-white">Calendar & CRM Integrations</span>
            </div>
            <div className="space-y-1 text-[10px] text-gray-300">
              <p>• AI-driven meeting recommendations</p>
              <p>• Smart travel planning with client priorities</p>
              <p>• Automated follow-ups with integrated CRM</p>
            </div>

            {/* Grid de logos de integraciones */}
            <div className="mt-3 grid grid-cols-5 gap-2">
              <div className="flex items-center justify-center p-1.5">
                <SiHubspot className="text-white h-4 w-4" />
              </div>
              <div className="flex items-center justify-center p-1.5">
                <SiGooglecalendar className="text-white h-4 w-4" />
              </div>
              <div className="flex items-center justify-center p-1.5">
                <SiZoom className="text-white h-4 w-4" />
              </div>
              <div className="flex items-center justify-center p-1.5">
                <SiIntercom className="text-white h-4 w-4" />
              </div>
              <div className="flex items-center justify-center p-1.5">
                <SiGmail className="text-white h-4 w-4" />
              </div>
            </div>

            {/* Texto FOMO en la parte inferior */}
            <div className="mt-2 pt-1 border-t border-gray-500/30">
              <p className="text-[9px] font-medium text-gray-300">
                <span className="text-white">Limited access:</span> Only a select few companies have early access
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Nuevo componente para Carbon Footprint
const CarbonFootprintCard = () => {
  return (
    <div className="relative w-full h-auto min-h-[420px] overflow-hidden rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm">
      {/* Imagen de fondo diferente */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/high-speed-train-desert-new.png"
          alt="High Speed Train"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-black/10"></div>
        <div className="absolute bottom-2 left-2 right-2 text-center">
          <span className="inline-block bg-gray-800/60 backdrop-blur-md text-[8px] text-white px-2 py-0.5 rounded-md font-medium">
            Sustainable Travel Solutions
          </span>
        </div>
      </div>

      {/* Contenido superpuesto */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 sm:p-6">
        {/* Título y badge */}
        <div className="w-full text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="inline-flex items-center rounded-xl bg-gray-800/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-medium text-white shadow-sm">
              <Image
                src="/logo/suitpax-cloud-logo.webp"
                alt="Suitpax"
                width={50}
                height={12}
                className="h-3 w-auto mr-1"
              />
              <em className="font-serif italic">Carbon Neutral</em>
            </span>
          </div>
          <h3 className="text-xl font-medium tracking-tighter text-white">AirCarbon O2</h3>
          <p className="text-xs text-gray-200 mt-1">Sustainable travel for conscious businesses</p>
        </div>

        {/* Mini-card con información sobre huella de carbono */}
        <div className="w-full flex justify-center">
          <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-3 border border-gray-400/30 max-w-sm w-full shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-white">Carbon Offset</span>
            </div>
            <div className="space-y-1 text-[10px] text-gray-300">
              <p>• Automatic carbon footprint calculation</p>
              <p>• Sustainable travel options prioritized</p>
              <p>• Investment in verified carbon offset projects</p>
            </div>

            {/* Texto FOMO en la parte inferior */}
            <div className="mt-2 pt-1 border-t border-gray-500/30">
              <p className="text-[9px] font-medium text-gray-300">
                <span className="text-white">Join the movement:</span> 65% of Fortune 500 companies use carbon
                offsetting
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Nuevo componente vertical con la chica de pelo corto - rediseñado
const VerticalAssistantCard = () => {
  return (
    <div className="relative bg-gray-100 p-3 sm:p-5 rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
      {/* Contenido superpuesto */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex flex-col items-center text-center mb-3 sm:mb-4">
          <div className="flex items-center gap-1 mb-2">
            <span className="inline-flex items-center rounded-lg bg-gray-800/60 backdrop-blur-md px-2 py-0.5 text-[8px] font-medium text-white shadow-sm">
              <Image
                src="/logo/suitpax-cloud-logo.webp"
                alt="Suitpax"
                width={40}
                height={10}
                className="h-2.5 w-auto mr-1"
              />
              <em className="font-serif italic">MCP Technology</em>
            </span>
          </div>
          <h3 className="font-medium text-black text-lg mb-1.5 tracking-tighter">AI-Powered Travel Assistant</h3>
          <p className="text-[10px] text-gray-600 max-w-xs">
            Your personal travel companion that anticipates needs before they arise
          </p>
        </div>

        {/* Input con la chica de pelo corto DENTRO del input - más fino como travel chat input */}
        <div className="flex-grow flex flex-col justify-center items-center">
          <div className="relative flex items-center gap-2 p-2 rounded-lg border border-gray-400/30 bg-gray-800/60 backdrop-blur-md shadow-sm w-full max-w-xs hover:bg-gray-700/60 transition-all duration-300 transform hover:scale-[1.02]">
            {/* Agent avatar - chica de pelo corto con video */}
            <div className="relative w-8 sm:w-10 h-8 sm:h-10 overflow-hidden rounded-lg border border-gray-500/50 ml-1 shadow-md">
              <video
                className="w-full h-full object-cover scale-[1.4] object-[center_top]"
                autoPlay
                muted
                loop
                playsInline
              >
                <source
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/372671794094522374%20%281%29-mXhXqJuzE8yRQG72P48PBvFH1FNb7X.mp4"
                  type="video/mp4"
                />
              </video>
            </div>

            {/* Placeholder text */}
            <div className="flex-1 py-1.5 px-2 text-[10px] text-white h-8 flex items-center">
              <span className="inline-block">How can I help with your travel plans?</span>
            </div>

            {/* Send button (visual only) */}
            <div className="text-white mr-1.5 bg-gray-700/70 p-1 rounded-full hover:bg-gray-600/70 cursor-pointer transition-colors">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
        </div>

        {/* Textos movidos debajo del input */}
        <div className="mt-3 sm:mt-4 text-left max-w-xs mx-auto">
          <p className="text-xs font-serif italic text-gray-800 mb-1.5">Travel, like an open world</p>
          <div className="text-[9px] text-gray-600 space-y-0.5">
            <p>I've found some great options for your trip:</p>
            <p>• 3 direct flights under your budget</p>
            <p>• 5 hotels near your conference venue</p>
            <p>• Weather forecast: Sunny, 72°F</p>
            <p>• Would you like to see the details?</p>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 text-center">
          <p className="text-xs text-gray-600 max-w-xs mx-auto"></p>
        </div>
      </div>
    </div>
  )
}

// Componente rediseñado con el video de la agente pelirroja
const SuitpaxAssistantCard = () => {
  return (
    <div className="relative bg-white/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[420px]">
      {/* Fondo abstracto */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/abstract-fluid-waves.jpeg"
          alt="Abstract Fluid Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent"></div>
        <div className="absolute bottom-2 left-2 right-2 text-center">
          <span className="inline-block bg-gray-800/60 backdrop-blur-md text-[8px] text-white px-2 py-0.5 rounded-md font-medium">
            Next-Gen Business Travel
          </span>
        </div>
      </div>

      {/* Contenido superpuesto */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex flex-col items-center text-center mb-4">
          <h3 className="font-medium text-black text-xl mb-2 tracking-tighter">Where travel meets intelligence</h3>
          <p className="text-xs text-gray-600 max-w-xs">
            Seamlessly blending AI with human expertise for the ultimate business travel experience
          </p>
        </div>

        {/* Video de la agente pelirroja dentro de un input */}
        <div className="flex-grow flex flex-col justify-center items-center">
          <div className="relative bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 p-3 w-full max-w-sm shadow-sm">
            <div className="flex items-start gap-3 mb-3">
              <div className="relative w-14 sm:w-16 h-14 sm:h-16 overflow-hidden rounded-lg border border-gray-200 flex-shrink-0 shadow-sm">
                <video className="w-full h-full object-cover scale-110" autoPlay muted loop playsInline>
                  <source
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/372667474502451203%20%28online-video-cutter.com%29%20%281%29-cMldY8CRYlKeR2Ppc8vnuyqiUzfGWe.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-gray-800">Meets our AI Agent</p>
                <div className="text-[11px] text-gray-600 mt-1 space-y-1">
                  <p>I've booked your trip to San Francisco:</p>
                  <p>• Flight: BA287 LHR→SFO, Oct 15</p>
                  <p>• Hotel: Kimpton Sir Francis Drake</p>
                  <p>• Car: Tesla Model 3 from Hertz</p>
                  <p>• Total: $2,450 (15% under budget)</p>
                </div>
              </div>
            </div>

            {/* Texto FOMO en la parte inferior */}
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-[10px] font-medium text-gray-600">
                <span className="text-gray-800">Join the waitlist:</span> 2,500+ business travelers already using our AI
                agents
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <a href="mailto:hello@suitpax.com" className="text-xs font-medium text-gray-700 hover:underline">
            Send feedback
          </a>
        </div>
      </div>
    </div>
  )
}

export default function BusinessChatDemo() {
  const [activeCard, setActiveCard] = useState(0)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)
  const cards = [
    <TravelChatInput key="travel" />,
    <ExpenseManagementCard key="expense" />,
    <TRMManagementCard key="trm" />,
    <CarbonFootprintCard key="carbon" />,
  ]

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-12">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <Image
                src="/logo/suitpax-bl-logo.webp"
                alt="Suitpax"
                width={50}
                height={12}
                className="h-2.5 w-auto mr-1"
              />
              Business
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse mr-1"></span>
              Next-Gen AI
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-3xl font-medium tracking-tighter text-black leading-none mb-4">
            Experience the future of business travel
          </h2>
          <p className="text-sm font-medium text-gray-600 max-w-2xl mb-2">
            Our AI agents understand complex travel needs and deliver tailored solutions in seconds
          </p>
          <p className="text-xs sm:text-sm font-light text-gray-500 max-w-xl mx-auto">
            From booking flights to managing expenses, our platform streamlines your entire business travel experience
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <SuitpaxAssistantCard />
              </motion.div>
            </div>

            <div className="order-1 md:order-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="grid grid-cols-1 gap-6">
                  {/* Mostrar la card activa */}
                  {cards[activeCard]}

                  {/* Dots de navegación */}
                  <div className="flex justify-center items-center mt-2">
                    {cards.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveCard(index)}
                        className={`w-2 h-2 mx-1 rounded-full transition-all ${
                          activeCard === index ? "bg-gray-800" : "bg-gray-300"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                  <VerticalAssistantCard />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
