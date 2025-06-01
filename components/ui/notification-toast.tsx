"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"

interface NotificationToastProps {
  type: "success" | "error" | "warning" | "info"
  title: string
  message?: string
  duration?: number
  onClose?: () => void
  className?: string
}

export default function NotificationToast({
  type,
  title,
  message,
  duration = 5000,
  onClose,
  className,
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose?.(), 300)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const typeConfig = {
    success: {
      icon: CheckCircle,
      colors: "bg-emerald-50 border-emerald-200 text-emerald-800",
      iconColor: "text-emerald-600",
    },
    error: {
      icon: AlertCircle,
      colors: "bg-red-50 border-red-200 text-red-800",
      iconColor: "text-red-600",
    },
    warning: {
      icon: AlertTriangle,
      colors: "bg-yellow-50 border-yellow-200 text-yellow-800",
      iconColor: "text-yellow-600",
    },
    info: {
      icon: Info,
      colors: "bg-blue-50 border-blue-200 text-blue-800",
      iconColor: "text-blue-600",
    },
  }

  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-xl border shadow-lg",
            config.colors,
            className,
          )}
        >
          <div className="flex items-start gap-3">
            <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", config.iconColor)} />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium">{title}</h4>
              {message && <p className="text-xs mt-1 opacity-90">{message}</p>}
            </div>
            <button
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => onClose?.(), 300)
              }}
              className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
