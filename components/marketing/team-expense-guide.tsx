"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function TeamExpenseGuide() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#0a1a12] via-[#0d1f1a] to-[#0a1a25] py-20">
      {/* Gradient orbs */}
      <div className="absolute left-1/4 top-1/4 h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/3 h-[250px] w-[250px] rounded-full bg-emerald-500/10 blur-[100px]" />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="z-10">
            <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
              <div className="mr-2 h-6 w-6 overflow-hidden rounded-full">
                <Image
                  src="/logo/suitpax-symbol.webp"
                  alt="Suitpax"
                  width={24}
                  height={24}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-white">STRATEGY GUIDE</span>
            </div>

            <h2 className="mb-3 text-xl font-medium tracking-tight text-white/80"><em className="font-serif italic">THE DEFINITIVE GUIDE TO</em></h2>

            <h1 className="mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-white leading-none max-w-4xl">
              <em className="font-serif italic">Transform your team's expense management</em>
            </h1>

            <p className="mt-4 text-xs sm:text-sm font-medium text-white/70 max-w-2xl mb-8">
              Learn how leading companies use AI to simplify expense management, improve team collaboration, and boost productivity.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              <Link
                href="/resources/team-expense-guide.pdf"
                className="group flex items-center rounded-full bg-white px-6 py-3 text-base font-medium text-[#0a1a12] transition-all hover:shadow-lg hover:shadow-blue-500/20"
              >
                <Download className="mr-2 h-5 w-5 text-blue-600" />
                <span>DOWNLOAD GUIDE</span>
              </Link>
            </motion.div>
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative mx-auto max-w-sm"
            >
              <div className="absolute -bottom-10 -left-10 h-[250px] w-[250px] rounded-full bg-emerald-500/10 blur-[80px]" />
              <div className="absolute -right-5 -top-5 h-[150px] w-[150px] rounded-full bg-blue-500/10 blur-[60px]" />

              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-1 backdrop-blur-sm">
                <div className="rounded-lg bg-[#0a1a15]/80 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center">
                    <Image
                      src="/logo/suitpax-symbol.webp"
                      alt="Suitpax"
                      width={20}
                      height={20}
                      className="mr-2 h-5 w-5 object-cover"
                    />
                    <span className="text-sm font-medium text-white/80">Suitpax</span>
                  </div>

                  <h3 className="mb-4 text-xl font-medium text-emerald-400">
                    Manual estratégico de gestión de gastos: convierte a tu equipo en líder de eficiencia
                  </h3>

                  <p className="mb-6 text-sm text-white/70">
                    Estrategias y herramientas tecnológicas para optimizar la gestión de gastos y mejorar la
                    colaboración en equipos distribuidos
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="overflow-hidden rounded-lg bg-white/5 p-2">
                      <div className="h-12 rounded bg-blue-500/20 p-2">
                        <div className="h-full w-2/3 rounded bg-blue-500/40"></div>
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white/5 p-2">
                      <div className="flex h-12 items-center justify-center rounded bg-emerald-500/20">
                        <div className="h-6 w-6 rounded-full bg-emerald-500/40"></div>
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white/5 p-2">
                      <div className="flex h-12 items-center justify-center rounded bg-blue-500/20">
                        <div className="h-4 w-8 rounded bg-blue-500/40"></div>
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white/5 p-2">
                      <div className="h-12 rounded bg-emerald-500/20 p-2">
                        <div className="h-full w-1/2 rounded bg-emerald-500/40"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                animate={{
                  y: isHovered ? [0, -5, 0] : 0,
                  boxShadow: isHovered
                    ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    : "none",
                }}
                transition={{
                  y: { repeat: isHovered ? Number.POSITIVE_INFINITY : 0, duration: 1.5 },
                  boxShadow: { duration: 0.2 },
                }}
                className="absolute -bottom-6 left-1/2 z-10 -translate-x-1/2 transform"
              >
                <Link
                  href="/resources/team-expense-guide.pdf"
                  className="flex items-center rounded-full bg-white px-6 py-3 text-base font-medium text-blue-600 shadow-lg transition-all hover:shadow-xl"
                >
                  <Download className="mr-2 h-5 w-5" />
                  <span>DOWNLOAD</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
