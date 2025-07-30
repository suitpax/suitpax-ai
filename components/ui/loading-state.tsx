"use client"

import { Loader2, Plane, Hotel, CreditCard, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface LoadingStateProps {
  message?: string
  size?: "sm" | "md" | "lg"
  className?: string
  type?: "default" | "travel" | "dashboard" | "minimal"
}

export function LoadingState({ message = "Cargando...", size = "md", className, type = "default" }: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  if (type === "travel") {
    return (
      <div className={cn("flex flex-col items-center justify-center min-h-[400px] p-8", className)}>
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-16 h-16 border-2 border-gray-200 border-t-black rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Plane className="h-6 w-6 text-black" />
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-sm font-medium text-gray-700 text-center max-w-xs"
        >
          {message}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
        </motion.div>
      </div>
    )
  }

  if (type === "dashboard") {
    return (
      <div className={cn("flex flex-col items-center justify-center min-h-[300px] p-8", className)}>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[Plane, Hotel, CreditCard, BarChart3].map((Icon, index) => (
            <motion.div
              key={index}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.2,
              }}
              className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center"
            >
              <Icon className="h-6 w-6 text-gray-600" />
            </motion.div>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-medium text-gray-700 text-center"
        >
          {message}
        </motion.p>
      </div>
    )
  }

  if (type === "minimal") {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <Loader2 className={cn("animate-spin text-gray-600", sizeClasses[size])} />
        {message && <span className="ml-2 text-sm text-gray-600 font-medium">{message}</span>}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        <Loader2 className={cn("text-gray-600", sizeClasses[size])} />
      </motion.div>
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-sm text-gray-600 font-medium text-center"
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    >
      <Loader2 className={cn("text-gray-600", sizeClasses[size], className)} />
    </motion.div>
  )
}

export function LoadingOverlay({ message = "Cargando..." }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl border border-gray-200"
      >
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-gray-700 font-medium">{message}</p>
      </motion.div>
    </motion.div>
  )
}

export function LoadingCard({ title, description }: { title?: string; description?: string }) {
  return (
    <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        {description && <div className="h-3 bg-gray-100 rounded w-3/4"></div>}
      </div>
    </div>
  )
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="p-4 rounded-xl border border-gray-200">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-100 rounded w-full mb-1"></div>
                      <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
