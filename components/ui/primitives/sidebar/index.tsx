"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export const SIDEBAR_TRANSITION_CLASSNAMES = "duration-300 ease-out"

type SidebarContextType = {
  open: boolean
  setOpen: (v: boolean) => void
  openMobile: boolean
  setOpenMobile: (v: boolean) => void
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextType | null>(null)

export function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider")
  return ctx
}

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsible?: "icon" | "offcanvas" | "none"
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true)
  const [openMobile, setOpenMobile] = React.useState(false)
  const toggleSidebar = () => setOpen((v) => !v)
  return (
    <SidebarContext.Provider value={{ open, setOpen, openMobile, setOpenMobile, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({ className, children }: SidebarProps) {
  const { open } = useSidebar()
  return (
    <div className={cn("flex h-full w-64 flex-col bg-white/80 backdrop-blur border-r border-gray-200", !open && "w-16", className)}>
      {children}
    </div>
  )
}

export function SidebarRail(props: React.HTMLAttributes<HTMLButtonElement>) {
  const { toggleSidebar } = useSidebar()
  return (
    <button aria-label="Toggle Sidebar" onClick={toggleSidebar} className={cn("mt-auto h-8 w-full text-gray-500 hover:text-gray-800", props.className)} />
  )
}

export function SidebarHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-3 border-b border-gray-200", props.className)} {...props} />
}

export function SidebarFooter(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-3 border-t border-gray-200", props.className)} {...props} />
}

export function SidebarMenu(props: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("flex-1 p-2 space-y-1", props.className)} {...props} />
}

export function SidebarMenuItem(props: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li className={cn("list-none", props.className)} {...props} />
}

export function SidebarMenuButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("w-full text-left px-3 py-2 rounded-2xl hover:bg-gray-100", className)} {...props} />
}

