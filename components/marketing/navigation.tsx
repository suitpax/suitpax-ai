"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { PiDotsNineBold, PiDotsSixBold } from "react-icons/pi"
import { SiX, SiGithub, SiLinkedin, SiCrunchbase, SiGmail } from "react-icons/si"
import { FaDiscord } from "react-icons/fa"
import { useMediaQuery } from "@/hooks/use-media-query"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { cn } from "@/lib/utils"

const navigationItems = [
  { name: "Manifesto", href: "/manifesto" },
  { name: "Pricing", href: "/pricing" },
  { name: "Suitpax Code X", href: "/pricing#code", badge: "Mobile Only" },
  { name: "Talk to founder", href: "/contact" },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
                     "fixed top-0 left-0 right-0 z-50 flex justify-center px-3 pt-1.5 pb-1.5",
          "transition-all duration-300"
        )}
      >
        <div
          className={cn(
            "flex w-full max-w-6xl items-center justify-between rounded-xl backdrop-blur-md bg-white/90 border border-black/5 px-3 py-1",
            isScrolled ? "shadow-lg border-black/10" : ""
          )}
        >
          <Link href="/" className="flex items-center">
            <Image
              src="/logo/suitpax-bl-logo.webp"
              alt="Suitpax"
              width={110}
              height={22}
              priority
              className="h-5 w-auto"
            />
          </Link>

          {!isMobile && (
            <div className="hidden md:flex items-center space-x-5">
              {navigationItems
                .filter((i) => i.name !== "Suitpax Code X")
                .map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-3 py-1.5 text-sm hover:bg-black/5 rounded-lg font-medium tracking-tighter transition-colors text-black"
                  >
                    {item.name}
                    {item.badge && (
                      <span className="ml-1 inline-flex items-center rounded-full border border-black px-2 py-0.5 text-[10px] font-medium text-black">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              <Link
                href="https://discord.gg/suitpax"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-0.5 text-xs bg-transparent border border-black rounded-md font-medium tracking-tighter transition-colors flex items-center gap-1 text-black"
              >
                <FaDiscord className="h-4 w-4" />
                Discord (coming soon)
              </Link>
              {loading ? (
                <div className="w-16 h-6 bg-gray-200 animate-pulse rounded-lg"></div>
              ) : user ? (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors tracking-tight"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-xs font-medium text-gray-700 hover:text-black transition-colors tracking-tight"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors tracking-tight"
                >
                  Sign Up
                </Link>
              )}
            </div>
          )}

          {isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-lg text-gray-700 hover:text-black hover:bg-gray-100 transition-colors border border-black/10 bg-gray-100"
            >
              <div className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                {isOpen ? <PiDotsSixBold size={20} /> : <PiDotsNineBold size={20} />}
              </div>
            </button>
          )}
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-20 left-4 right-4 z-40 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-xl md:hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-sm font-medium text-gray-700 hover:text-black transition-colors tracking-tight"
                >
                  {item.name}
                  {item.name === "Suitpax Code X" && (
                    <span className="ml-1 inline-flex items-center rounded-full border border-black px-2 py-0.5 text-[10px] font-medium text-black">Mobile Only</span>
                  )}
                </Link>
              ))}

              <div className="pt-2 border-t border-gray-200/30">
                <Link
                  href="https://discord.gg/suitpax"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center w-full py-1 text-lg font-medium tracking-tighter text-black hover:bg-black/5 rounded-md transition-colors"
                >
                  <FaDiscord className="h-4 w-4 mr-1.5" />
                  Discord (coming soon)
                </Link>
              </div>

              <div className="mt-4 px-0">
                <div className="flex justify-start space-x-4 py-2">
                  <Link href="https://twitter.com/suitpax" className="text-gray-500 hover:text-black">
                    <SiX className="h-4 w-4" />
                    <span className="sr-only">X</span>
                  </Link>
                  <Link href="https://linkedin.com/company/suitpax" className="text-gray-500 hover:text-black">
                    <SiLinkedin className="h-4 w-4" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                  <Link href="https://github.com/suitpax" className="text-gray-500 hover:text-black">
                    <SiGithub className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                  <Link
                    href="https://www.crunchbase.com/organization/suitpax"
                    className="text-gray-500 hover:text-black"
                  >
                    <SiCrunchbase className="h-4 w-4" />
                    <span className="sr-only">Crunchbase</span>
                  </Link>
                  <Link href="mailto:hello@suitpax.com" className="text-gray-500 hover:text-black">
                    <SiGmail className="h-4 w-4" />
                    <span className="sr-only">Email</span>
                  </Link>
                </div>
              </div>

              {!loading && !user && (
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link
                    href="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors tracking-tight"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-xl transition-colors tracking-tight"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && isMobile && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
