"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function FoundersOpenLetter() {
  return (
    <div className="relative py-20 md:py-28 lg:py-32 bg-black">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12 relative z-10">
        {/* Header section */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-md bg-white/5 backdrop-blur-sm px-3 py-1 text-[10px] font-medium text-white/80 border border-white/10 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-2 animate-pulse"></span> From my mind to yours
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter leading-none max-w-4xl mx-auto bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent normal-case"
          >
            Why I built Suitpax?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-xs sm:text-sm font-medium text-white/60 max-w-2xl"
          >
            My journey to revolutionize business travel and why I believe it's time for a change
          </motion.p>
        </div>

        {/* Founder section */}
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative w-20 h-20 mr-4 mb-4">
                <Image src="/founders/alberto.webp" alt="Alberto Zurano" fill className="object-cover rounded-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-medium text-white flex items-center justify-center">
                  Alberto Zurano
                  <a
                    href="https://linkedin.com/in/alberto-zurano-burillo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center ml-2 text-white/40 hover:text-white/80 transition-colors duration-200"
                  >
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="inline-block"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </h3>
                <div className="flex justify-center mt-2">
                  <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/5 border border-gray-200/20">
                    <span className="text-[10px] text-white/80 mr-1.5">Founder and CEO</span>
                    <div className="h-3 w-px bg-white/20 mx-1.5"></div>
                    <a
                      href="https://www.aena.es"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center"
                    >
                      <span className="text-[9px] text-white/60 group-hover:text-white/80 transition-colors duration-200">
                        ex-Aena
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-sm text-white/70 italic font-serif text-center">
              <p>
                "After experiencing the frustrations of business travel firsthand, I knew there had to be a better way.
                With Suitpax, we're building the platform I always wished existed."
              </p>
              <p>
                "Our vision goes beyond just another travel platform—we're creating an ecosystem that truly understands
                the unique needs of business travelers and their companies."
              </p>
            </div>
          </motion.div>

          {/* Joint statement */}
          <motion.div
            className="mt-16 pt-8 border-t border-white/10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-white/80 italic font-serif max-w-3xl mx-auto text-sm">
              "I'm committed to building a platform that doesn't just meet the needs of today's business travelers but
              anticipates the challenges of tomorrow. Suitpax is more than a product—it's my vision for the future of
              business travel."
            </p>
            <div className="mt-4 flex justify-center space-x-1 text-xs">
              <span className="text-white font-medium">Alberto Zurano</span>
              <span className="text-white/60">|</span>
              <span className="text-white/60">April 2025</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
