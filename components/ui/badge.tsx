"use client"

import { motion } from "framer-motion"
import { RiArrowRightUpLine } from "react-icons/ri"
import Link from "next/link"

interface BadgeProps {
  text: string
  href?: string
  label?: string
  isNew?: boolean
}

export const Badge = ({ text, href = "#", label = "Update", isNew = true }: BadgeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mx-auto"
    >
      <Link
        aria-label={`View ${text}`}
        href={text === "Join our waitlist in the meantime." ? "https://accounts.suitpax.com/waitlist" : href}
        className="mx-auto inline-block"
      >
        <div className="inline-flex max-w-full items-center gap-2 rounded-xl bg-white/5 px-2 py-0.5 pr-2.5 pl-0.5 text-xs font-medium text-white ring-1 shadow-md shadow-emerald-400/10 ring-white/10 filter backdrop-blur-[1px] transition-colors hover:bg-emerald-500/[2.5%] focus:outline-hidden sm:text-xs">
          {isNew && (
            <span className="shrink-0 truncate rounded-xl border bg-white/20 px-1.5 py-0.5 text-xs font-medium text-gray-700">
              {label}
            </span>
          )}
          <span className="flex items-center gap-1 truncate">
            <span className="w-full truncate text-gray-800">{text}</span>
            <RiArrowRightUpLine className="size-3 shrink-0 text-gray-700" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

export default Badge
