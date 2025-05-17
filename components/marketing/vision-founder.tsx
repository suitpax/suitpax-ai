"use client"
import Image from "next/image"
import Link from "next/link"
import { PiArrowRightBold } from "react-icons/pi"
import { BsHeartFill } from "react-icons/bs"

export default function VisionFounder() {
  return (
    <section className="py-16 bg-gray-50 text-black relative overflow-hidden">
      {/* Coordenadas decorativas como en el diseño de referencia */}
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
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative">
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
              Founder&apos;s Vision
            </span>
            <span className="inline-flex items-center rounded-xl bg-black/10 px-2.5 py-0.5 text-[9px] font-medium text-black">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse mr-1"></span>
              2025
            </span>
            <span className="inline-flex items-center rounded-xl bg-black/10 px-2.5 py-0.5 text-[9px] font-medium text-black">
              We <BsHeartFill className="inline-block mx-0.5 text-red-500" /> Business Travel
            </span>
          </div>

          {/* Título principal con estilo similar a AI Travel Agents */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-none text-center mb-4">
            Our vision for the future of travel
          </h2>
          <p className="text-lg md:text-xl text-center max-w-2xl mx-auto mb-12 text-black/80">
            Building the next generation of AI-powered travel systems for millions of business travelers
          </p>

          {/* Stats en formato vertical */}
          <div className="flex flex-col items-center mb-12 gap-2 w-full">
            <div className="inline-block border border-black/30 px-4 py-1 mb-4 text-sm text-black/80 rounded-md bg-transparent font-medium">
              2025 VISION
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
              {[
                { label: "AI Agents", value: "100+", description: "Specialized travel experts" },
                { label: "Global Coverage", value: "200+ Cities", description: "Worldwide support" },
                { label: "Response Time", value: "< 1 min", description: "Instant assistance" },
                { label: "User Experience", value: "Seamless", description: "Human-centered design" },
              ].map((stat, i) => (
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
            OUR CORE PRINCIPLES
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {[
              "AI-first approach: We build with and for artificial intelligence",
              "Customer obsession: Every decision starts with the traveler",
              "Radical transparency: Open communication and shared knowledge",
              "Ownership mindset: Everyone acts like a founder",
              "Continuous learning: We embrace growth and experimentation",
              "Global impact: Our mission is to reach millions of business travelers worldwide",
            ].map((value, index) => (
              <div key={index} className="bg-transparent border border-black/20 p-3 rounded-md">
                <p className="text-xs font-medium text-black/80">{value}</p>
              </div>
            ))}
          </div>

          {/* Founder Card */}
          <div className="mb-12">
            <div className="inline-block border border-black/30 px-4 py-1 mb-8 mx-auto text-sm text-black/80 rounded-md bg-transparent font-medium">
              FOUNDER&apos;S PERSPECTIVE
            </div>

            <div className="max-w-2xl mx-auto bg-transparent backdrop-blur-xl p-6 rounded-md border border-black/20 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <Image
                    src="/founders/alberto-new.webp"
                    alt="Alberto Zurano"
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-medium tracking-tighter">Alberto Zurano</h3>
                    <p className="text-sm text-black/70">Founder & CEO</p>
                  </div>
                </div>

                <p className="text-sm text-black/80 mb-6 italic">
                  "When I was 6 years old, I got lost in an airport. That experience sparked a lifelong passion to make
                  travel more seamless and intelligent. With Suitpax, we're building technology that I wish existed back
                  then—a platform that understands travelers' needs before they even arise. By 2025, our vision is to
                  create an ecosystem where AI and humans work together to make business travel not just efficient, but
                  truly enjoyable."
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="bg-black/5 p-3 rounded-md">
                    <p className="text-xs font-medium text-black/80">
                      Seamless integration with enterprise systems for frictionless travel management
                    </p>
                  </div>
                  <div className="bg-black/5 p-3 rounded-md">
                    <p className="text-xs font-medium text-black/80">
                      Personalized AI agents that learn and adapt to each traveler's preferences
                    </p>
                  </div>
                  <div className="bg-black/5 p-3 rounded-md">
                    <p className="text-xs font-medium text-black/80">
                      Real-time assistance and proactive problem-solving for stress-free journeys
                    </p>
                  </div>
                  <div className="bg-black/5 p-3 rounded-md">
                    <p className="text-xs font-medium text-black/80">
                      Sustainable travel options that balance business needs with environmental responsibility
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline 2025 */}
          <div className="mb-12">
            <div className="inline-block border border-black/30 px-4 py-1 mb-8 mx-auto text-sm text-black/80 rounded-md bg-transparent font-medium">
              ROADMAP TO 2025
            </div>

            <div className="relative">
              {/* Línea de tiempo */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-black/20"></div>

              <div className="space-y-12 relative">
                {[
                  {
                    year: "Q2 2025",
                    title: "Global Launch",
                    description: "Official launch of Suitpax platform with full feature set and global coverage",
                  },
                  {
                    year: "Q1 2025",
                    title: "Enterprise Integration",
                    description: "Complete integration with major enterprise systems and travel providers",
                  },
                  {
                    year: "Q4 2024",
                    title: "Beta Program",
                    description: "Expanded beta testing with select enterprise partners",
                  },
                  {
                    year: "Q3 2024",
                    title: "AI Agent Network",
                    description: "Development of specialized AI agents for different travel scenarios",
                  },
                ].map((milestone, index) => (
                  <div key={index} className="flex items-center justify-center">
                    <div
                      className={`w-full max-w-md bg-transparent border border-black/20 p-4 rounded-md relative ${
                        index % 2 === 0 ? "text-left" : "text-right"
                      }`}
                    >
                      <div
                        className={`absolute top-1/2 transform -translate-y-1/2 ${
                          index % 2 === 0 ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"
                        } w-3 h-3 rounded-full bg-black/80 z-10`}
                      ></div>
                      <span className="inline-block bg-black/10 px-2 py-0.5 rounded-md text-[10px] font-medium mb-2">
                        {milestone.year}
                      </span>
                      <h4 className="text-sm font-medium">{milestone.title}</h4>
                      <p className="text-xs text-black/70">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Botón de acción */}
          <div className="flex justify-center">
            <Link
              href="/manifesto"
              className="inline-flex items-center gap-2 bg-transparent border border-black text-black hover:bg-black/10 px-4 py-2 rounded-xl transition-colors"
            >
              <span className="font-medium">Read our full manifesto</span>
              <PiArrowRightBold className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
