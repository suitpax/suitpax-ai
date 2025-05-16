"use client"
import { motion } from "framer-motion"

interface ShiningTextProps {
  text: string
  className?: string
}

export function ShiningText({ text, className = "" }: ShiningTextProps) {
  return (
    <motion.h1
      className={`bg-[linear-gradient(110deg,#404040,35%,#fff,50%,#404040,75%,#404040)] bg-[length:200%_100%] bg-clip-text text-base font-regular text-transparent ${className}`}
      initial={{ backgroundPosition: "200% 0" }}
      animate={{ backgroundPosition: "-200% 0" }}
      transition={{
        repeat: Number.POSITIVE_INFINITY,
        duration: 2,
        ease: "linear",
      }}
    >
      {text}
    </motion.h1>
  )
}
