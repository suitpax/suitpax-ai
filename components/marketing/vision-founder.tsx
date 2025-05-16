"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { StarBorder } from "@/components/ui/star-border"

export default function VisionFounder() {
  return (
    <section className="relative overflow-hidden py-16 bg-gray-50">
      <div className="absolute inset-0 z-0 w-full h-full opacity-30">
        <Image
          src="/images/green-gradient-bg.png"
          alt="Green gradient background"
          fill
          className="object-cover object-center w-full h-full"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm"></div>
      </div>

      <StarBorder className="absolute top-0 left-0 w-full h-full" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="outline" className="bg-gray-200/50 backdrop-blur-sm">
              FOUNDER&apos;S VISION
            </Badge>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none">
              Reimagining business travel for the AI era
            </h2>

            <p className="text-base md:text-lg text-gray-700 max-w-xl font-light">
              Our mission is to transform how businesses approach travel by creating an intelligent ecosystem that
              anticipates needs, eliminates friction, and delivers exceptional experiences.
            </p>

            <div className="pt-4">
              <Link
                href="/manifesto"
                className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
              >
                <span className="font-medium">Read our manifesto</span>
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
                  className="lucide lucide-arrow-right"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                  <Image src="/founders/alberto-new.webp" alt="Alberto Zurano" fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Alberto Zurano</h3>
                  <p className="text-sm text-gray-600">Founder & CEO</p>
                </div>
              </div>

              <blockquote className="text-gray-700 font-light italic mb-6">
                "When I was 6 years old, I got lost in an airport. That experience sparked a lifelong passion to make
                travel more seamless and intelligent. With Suitpax, we're building technology that I wish existed back
                then—a platform that understands travelers' needs before they even arise."
              </blockquote>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
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
                      className="lucide lucide-lightbulb"
                    >
                      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                      <path d="M9 18h6" />
                      <path d="M10 22h4" />
                    </svg>
                  </div>
                  <p className="text-sm">Pioneering AI-first travel management since 2023</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
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
                      className="lucide lucide-globe"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      <path d="M2 12h20" />
                    </svg>
                  </div>
                  <p className="text-sm">Building for global enterprises with local expertise</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
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
                      className="lucide lucide-sparkles"
                    >
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                      <path d="M5 3v4" />
                      <path d="M19 17v4" />
                      <path d="M3 5h4" />
                      <path d="M17 19h4" />
                    </svg>
                  </div>
                  <p className="text-sm">Committed to creating magical travel experiences</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-gray-200/50 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium">
              Launching Q2 2025
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
