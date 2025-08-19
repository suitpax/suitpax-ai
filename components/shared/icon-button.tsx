"use client"

import { Button } from "@/components/ui/button"

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export default function IconButton({ children, className = "", ...props }: IconButtonProps) {
  return (
    <Button variant="secondary" className={`h-9 w-9 p-0 rounded-full border-gray-300 bg-white text-gray-900 hover:bg-gray-100 ${className}`} {...props}>
      {children}
    </Button>
  )
}

