"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type CollapsibleProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export function Collapsible({ open, onOpenChange, children, className, ...rest }: CollapsibleProps) {
  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = isControlled ? Boolean(open) : internalOpen
  const handleOpenChange = (next: boolean) => { if (!isControlled) setInternalOpen(next); onOpenChange?.(next) }
  return (
    <div data-state={isOpen ? "open" : "closed"} className={className} {...rest}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child
        return React.cloneElement(child as any, { __collapsibleOpen: isOpen, __setCollapsibleOpen: handleOpenChange })
      })}
    </div>
  )
}

export function CollapsibleTrigger({ children, asChild = false, __collapsibleOpen, __setCollapsibleOpen, ...rest }: any) {
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<any>
    return React.cloneElement(child, { ...rest, onClick: (e: any) => { child.props.onClick?.(e); __setCollapsibleOpen?.(!__collapsibleOpen) } })
  }
  return (
    <button type="button" onClick={() => __setCollapsibleOpen?.(!__collapsibleOpen)} {...rest}>
      {children}
    </button>
  )
}

export function CollapsibleContent({ children, className, __collapsibleOpen, ...rest }: any) {
  return (
    <div className={cn(className)} hidden={!__collapsibleOpen} {...rest}>
      {children}
    </div>
  )
}

export default Collapsible

