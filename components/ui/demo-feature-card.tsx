"use client"

import type React from "react"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import { PiArrowRightBold, PiCheckCircleBold, PiSparkle } from "react-icons/pi"

interface DemoFeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  image: string
  features: string[]
  ctaText?: string
  ctaLink?: string
}

const DemoFeatureCard = ({
  title,
  description,
  icon,
  image,
  features,
  ctaText = "Explore Feature",
  ctaLink = "#",
}: DemoFeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 flex flex-col h-full"
      whileHover={{ y: -5, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Image section */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Floating badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-md flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">{icon}</div>
          <span className="text-xs font-medium text-gray-800">{title}</span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-medium text-white">{title}</h3>
        </div>
      </div>

      {/* Content section */}
      <div className="p-4 flex-grow">
        <p className="text-sm text-gray-600 mb-4">{description}</p>

        {/* Features list */}
        <ul className="space-y-2 mb-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <PiCheckCircleBold className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA section */}
      <div className="p-4 pt-0 mt-auto">
        <motion.a
          href={ctaLink}
          className="flex items-center justify-between w-full bg-gray-100 hover:bg-emerald-50 text-gray-800 rounded-lg p-3 transition-colors"
          whileHover={{ scale: 1.03 }}
          animate={isHovered ? { backgroundColor: "#ecfdf5" } : {}}
        >
          <span className="text-sm font-medium">{ctaText}</span>
          <motion.div
            animate={isHovered ? { x: 5 } : { x: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <PiArrowRightBold className="h-4 w-4" />
          </motion.div>
        </motion.a>
      </div>

      {/* Sparkle effect on hover */}
      {isHovered && (
        <motion.div
          className="absolute top-2 right-2 text-amber-400"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <PiSparkle className="h-5 w-5" />
        </motion.div>
      )}
    </motion.div>
  )
}

export default DemoFeatureCard
