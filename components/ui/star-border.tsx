"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export const StarBorder = React.forwardRef<React.ElementRef<"svg">, React.ComponentPropsWithoutRef<"svg">>(
  ({ className, ...props }, ref) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4", className)}
      ref={ref}
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 13.41 18.18 20.02 12 17.79 5.82 20.02 7 13.41 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
)
StarBorder.displayName = "StarBorder"
