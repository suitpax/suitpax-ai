"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CityWithImage {
  name: string
  imageUrl: string
}

interface Props {
  cities?: CityWithImage[]
}

const defaultCities: CityWithImage[] = [
  { name: "New York", imageUrl: "/api/images/city?city=New%20York&w=240&h=160" },
  { name: "London", imageUrl: "/api/images/city?city=London&w=240&h=160" },
  { name: "Tokyo", imageUrl: "/api/images/city?city=Tokyo&w=240&h=160" },
  { name: "San Francisco", imageUrl: "/api/images/city?city=San%20Francisco&w=240&h=160" },
  { name: "Berlin", imageUrl: "/api/images/city?city=Berlin&w=240&h=160" },
  { name: "Singapore", imageUrl: "/api/images/city?city=Singapore&w=240&h=160" },
  { name: "Dubai", imageUrl: "/api/images/city?city=Dubai&w=240&h=160" },
  { name: "Hong Kong", imageUrl: "/api/images/city?city=Hong%20Kong&w=240&h=160" },
  { name: "Shanghai", imageUrl: "/api/images/city?city=Shanghai&w=240&h=160" },
  { name: "Sydney", imageUrl: "/api/images/city?city=Sydney&w=240&h=160" },
  { name: "Toronto", imageUrl: "/api/images/city?city=Toronto&w=240&h=160" },
  { name: "Madrid", imageUrl: "/api/images/city?city=Madrid&w=240&h=160" },
  { name: "Paris", imageUrl: "/api/images/city?city=Paris&w=240&h=160" },
  { name: "Lisbon", imageUrl: "/api/images/city?city=Lisbon&w=240&h=160" },
  { name: "Barcelona", imageUrl: "/api/images/city?city=Barcelona&w=240&h=160" },
  { name: "Copenhagen", imageUrl: "/api/images/city?city=Copenhagen&w=240&h=160" },
  { name: "Stockholm", imageUrl: "/api/images/city?city=Stockholm&w=240&h=160" },
  { name: "Seoul", imageUrl: "/api/images/city?city=Seoul&w=240&h=160" },
  { name: "Doha", imageUrl: "/api/images/city?city=Doha&w=240&h=160" },
]

const prefersReducedMotion =
  typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false

export default function CityAnimateWithImages({ cities = defaultCities }: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % cities.length), 3000)
    return () => clearInterval(id)
  }, [cities.length])

  const current = cities[index]

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-10 w-16 rounded-xl overflow-hidden border border-gray-200 bg-white/80 supports-[backdrop-filter]:backdrop-blur">
        <img src={current.imageUrl} alt={current.name} className="h-full w-full object-cover" />
      </div>
      <div className="h-7 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={prefersReducedMotion ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={prefersReducedMotion ? { y: 0, opacity: 0 } : { y: -24, opacity: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { y: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }
            }
            className="text-sm font-medium text-gray-900"
          >
            {current.name}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}

