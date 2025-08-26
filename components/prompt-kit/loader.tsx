"use client"

import { motion } from "framer-motion"

// Style constants
const DOT_SIZE = "size-2"
const DOT_COLOR = "bg-primary/60"
const DOT_SPACING = "gap-1"

// Animation constants
const ANIMATION_DURATION = 0.6
const DELAY_DOT_1 = 0
const DELAY_DOT_2 = 0.1
const DELAY_DOT_3 = 0.2

// Animation settings
const ANIMATION = {
  y: ["0%", "-60%", "0%"],
  opacity: [1, 0.7, 1],
}

const TRANSITION = {
  duration: ANIMATION_DURATION,
  ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
  repeat: Number.POSITIVE_INFINITY,
}

export function Loader() {
  return (
    <div className={`flex items-center justify-center ${DOT_SPACING}`}>
      <Dot delay={DELAY_DOT_1} />
      <Dot delay={DELAY_DOT_2} />
      <Dot delay={DELAY_DOT_3} />
    </div>
  )
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.div
      className={`${DOT_SIZE} ${DOT_COLOR} rounded-full`}
      animate={ANIMATION}
      transition={{
        ...TRANSITION,
        delay,
      }}
    />
  )
}
