"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { PiEnvelopeBold, PiPhoneBold } from "react-icons/pi"
import type { ContactProps } from "./types"

interface ContactCardProps {
  contact: ContactProps
  delay?: number
  onClick?: () => void
}

export const ContactCard = ({ contact, delay = 0, onClick }: ContactCardProps) => {
  const { name, position, company, companyIcon, email, phone, image, badge, isPlayground } = contact

  if (isPlayground && !onClick) {
    return (
      <motion.div
        className="w-full bg-transparent border border-white/20 rounded-xl p-2 hover:shadow-sm transition-shadow cursor-pointer"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay }}
        whileHover={{ y: -3, scale: 1.01 }}
      >
        <div className="flex items-center justify-center h-[72px]">
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium text-white">Playground+</span>
            <span className="text-[10px] text-white/60 mt-1">Click to view contact</span>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="bg-black/30 border border-white/10 rounded-xl p-4 hover:bg-black/40 transition-colors"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -3, scale: 1.01 }}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 border border-white/20">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-white">{name}</div>
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-md bg-black/70 border border-white/10 flex items-center justify-center p-1">
                {companyIcon}
              </div>
              <span className="text-[9px] text-white/80">{company}</span>
            </div>
          </div>
          <div className="text-[9px] text-white/60">{position}</div>
          <div className="flex items-center mt-1">
            <span className="inline-flex items-center rounded-full bg-white/10 px-1.5 py-0.5 text-[7px] font-medium text-white border border-white/20">
              {badge}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1 gap-1">
            <div className="flex items-center gap-1">
              <PiEnvelopeBold className="h-2 w-2 text-white/50" />
              <span className="text-[7px] text-white/70">{email}</span>
            </div>
            <div className="flex items-center gap-1">
              <PiPhoneBold className="h-2 w-2 text-white/50" />
              <span className="text-[7px] text-white/70">{phone}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
