"use client"
import Link from "next/link"
import { motion } from "framer-motion"

interface HackerNewsBadgeProps {
  points?: number
  href?: string
}

export const HackerNewsBadge = ({
  points = 119,
  href = "https://news.ycombinator.com/newest",
}: HackerNewsBadgeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-block"
    >
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[10px] font-medium"
      >
        <span className="flex items-center justify-center bg-[#FF6600] text-white w-5 h-5 rounded-sm text-[10px] font-bold">
          Y
        </span>
        <span className="text-black">Featured on Hacker News</span>
      </Link>
    </motion.div>
  )
}

export default HackerNewsBadge
