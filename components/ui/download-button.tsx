"use client"

import type { ReactNode } from "react"
import { PiDownloadSimpleBold } from "react-icons/pi"

interface DownloadButtonProps {
  filePath: string
  fileName: string
  children: ReactNode
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  className?: string
  icon?: boolean
}

export const DownloadButton = ({
  filePath,
  fileName,
  children,
  variant = "primary",
  size = "md",
  className = "",
  icon = true,
}: DownloadButtonProps) => {
  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = filePath
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const variantClasses = {
    primary: "bg-black text-white hover:bg-black/80",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
    outline: "bg-transparent border border-gray-200 text-black hover:bg-gray-50",
    ghost: "bg-transparent text-black hover:bg-gray-100",
  }

  const sizeClasses = {
    sm: "text-xs px-2 py-1 rounded-md",
    md: "text-sm px-3 py-1.5 rounded-lg",
    lg: "text-base px-4 py-2 rounded-xl",
  }

  return (
    <button
      onClick={handleDownload}
      className={`flex items-center space-x-1.5 font-medium transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {icon && <PiDownloadSimpleBold className={size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-5 h-5"} />}
      <span>{children}</span>
    </button>
  )
}
