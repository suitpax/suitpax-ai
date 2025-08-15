"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const FadeContainer = ({ children, ...props }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

const FadeSpan = ({ children, ...props }: any) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="text-black"
      {...props}
    >
      {children}
    </motion.span>
  )
}

export { FadeContainer, FadeSpan, useEffect, useState }
