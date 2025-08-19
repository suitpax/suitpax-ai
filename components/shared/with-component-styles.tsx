"use client"

interface WithComponentStylesProps {
  className?: string
  children: React.ReactNode
}

export default function WithComponentStyles({ className = "", children }: WithComponentStylesProps) {
  return <div className={className}>{children}</div>
}

