"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import { useMediaQuery } from "@/hooks/use-media-query"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { FaTwitter, FaLinkedin, FaGithub, FaDiscord } from "react-icons/fa"
import { PiSparkle } from "react-icons/pi"

const navigationItems = [
  { name: "Solutions", href: "/solutions" },
  { name: "Pricing", href: "/pricing" },
  { name: "Manifesto", href: "/manifesto" },
  { name: "Talk to Founders", href: "/contact" },
  { name: "Community", href: "/community" },
]

const socialLinks = [
  { name: "Twitter", href: "https://twitter.com/suitpax", icon: FaTwitter },
  { name: "LinkedIn", href: "https://linkedin.com/company/suitpax", icon: FaLinkedin },
  { name: "GitHub", href: "https://github.com/suitpax", icon: FaGithub },
  { name: "Discord", href: "https://discord.gg/suitpax", icon: FaDiscord },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
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
      {/* Floating Header */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 left-4 right-4 z-50 bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={100} height={24} className="h-6 w-auto" />
              {/* Badge solo en desktop */}
              {!isMobile && (
                <div className="inline-flex items-center rounded-lg bg-gray-200 px-2 py-0.5 text-[9px] font-medium text-gray-700">
                  <PiSparkle className="mr-1 h-2.5 w-2.5" />
                  <em className="font-serif italic">React π6</em>
                </div>
              )}
            </Link>

            {/* Desktop Navigation */}
            {!isMobile && (
              <div className="hidden md:flex items-center space-x-6">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-xs font-medium text-gray-700 hover:text-black transition-colors tracking-tight"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Social Links & Auth */}
            <div className="flex items-center space-x-3">
              {/* Social Links - Desktop Only */}
              {!isMobile && (
                <div className="hidden md:flex items-center space-x-2">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-black transition-colors"
                    >
                      <social.icon className="h-3 w-3" />
                    </Link>
                  ))}
                </div>
              )}

              {/* Auth Buttons */}
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
                <div className="flex items-center space-x-2">
                  {/* Login solo en desktop */}
                  {!isMobile && (
                    <Link
                      href="/auth/login"
                      className="text-xs font-medium text-gray-700 hover:text-black transition-colors tracking-tight"
                    >
                      Log In
                    </Link>
                  )}
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors tracking-tight"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              {isMobile && (
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-1.5 rounded-lg text-gray-700 hover:text-black hover:bg-gray-100 transition-colors"
                >
                  {isOpen ? <XMarkIcon className="h-4 w-4" /> : <Bars3Icon className="h-4 w-4" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Menu */}
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
                </Link>
              ))}

              {/* Social Links - Mobile */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-900 mb-3">Follow us</p>
                <div className="flex items-center space-x-4">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-black transition-colors"
                    >
                      <social.icon className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Solo Sign Up en móvil si no hay usuario */}
              {!loading && !user && (
                <div className="pt-4 border-t border-gray-200">
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

      {/* Mobile backdrop */}
      {isOpen && isMobile && (
        <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
