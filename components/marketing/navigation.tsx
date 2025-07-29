"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { PiCaretDownBold, PiListBold, PiXBold } from "react-icons/pi"

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const solutions = [
    {
      name: "Business Travel",
      href: "/solutions/business-travel",
      description: "Complete travel management platform",
    },
    {
      name: "Expense Management",
      href: "/travel-expense-management",
      description: "Automated expense tracking and reporting",
    },
    {
      name: "Travel Policies",
      href: "/solutions/travel-policies",
      description: "Smart policy compliance and automation",
    },
    {
      name: "AI Agents",
      href: "/solutions/ai-agents",
      description: "24/7 intelligent travel assistance",
    },
  ]

  const company = [
    {
      name: "About",
      href: "/about",
      description: "Our mission and team",
    },
    {
      name: "Manifesto",
      href: "/manifesto",
      description: "Our vision for the future",
    },
    {
      name: "Careers",
      href: "/careers",
      description: "Join our team",
    },
    {
      name: "Contact",
      href: "/contact",
      description: "Get in touch",
    },
  ]

  return (
    <>
      {/* Floating Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-black/95 backdrop-blur-xl shadow-2xl border border-gray-800/60 scale-95"
            : "bg-black/90 backdrop-blur-lg border border-gray-800/40 shadow-xl"
        } rounded-xl px-6 py-3 max-w-4xl w-[calc(100%-2rem)]`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <Image
              src="/logo/suitpax-cloud-logo.webp"
              alt="Suitpax"
              width={100}
              height={25}
              className="h-6 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 mx-6">
            {/* Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("solutions")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-white transition-colors py-2">
                <span>Solutions</span>
                <PiCaretDownBold className="w-3 h-3" />
              </button>

              <AnimatePresence>
                {activeDropdown === "solutions" && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-3 w-80 bg-black/98 backdrop-blur-xl rounded-xl border border-gray-800/60 shadow-2xl p-4 z-50"
                  >
                    <div className="space-y-1">
                      {solutions.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block p-3 rounded-xl hover:bg-gray-800/50 transition-all duration-200 group"
                        >
                          <div className="font-medium text-white mb-1 group-hover:text-gray-100">{item.name}</div>
                          <div className="text-xs text-gray-400 group-hover:text-gray-300">{item.description}</div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Company Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("company")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-white transition-colors py-2">
                <span>Company</span>
                <PiCaretDownBold className="w-3 h-3" />
              </button>

              <AnimatePresence>
                {activeDropdown === "company" && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-3 w-72 bg-black/98 backdrop-blur-xl rounded-xl border border-gray-800/60 shadow-2xl p-4 z-50"
                  >
                    <div className="space-y-1">
                      {company.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block p-3 rounded-xl hover:bg-gray-800/50 transition-all duration-200 group"
                        >
                          <div className="font-medium text-white mb-1 group-hover:text-gray-100">{item.name}</div>
                          <div className="text-xs text-gray-400 group-hover:text-gray-300">{item.description}</div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-2">
              Pricing
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-gray-800/50"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 bg-white text-black rounded-xl text-sm font-medium hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-gray-800/50"
          >
            {isMobileMenuOpen ? <PiXBold className="w-5 h-5" /> : <PiListBold className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-20 left-4 right-4 z-50 bg-black/98 backdrop-blur-xl rounded-2xl border border-gray-800/60 shadow-2xl p-6 lg:hidden max-h-[calc(100vh-6rem)] overflow-y-auto"
            >
              <div className="space-y-6">
                {/* Mobile Solutions */}
                <div>
                  <div className="font-medium text-white mb-3 text-base">Solutions</div>
                  <div className="space-y-2 pl-3">
                    {solutions.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block text-gray-300 hover:text-white transition-colors py-2 text-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mobile Company */}
                <div>
                  <div className="font-medium text-white mb-3 text-base">Company</div>
                  <div className="space-y-2 pl-3">
                    {company.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block text-gray-300 hover:text-white transition-colors py-2 text-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  href="/pricing"
                  className="block font-medium text-white text-base"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>

                {/* Mobile CTA */}
                <div className="pt-4 border-t border-gray-800/60 space-y-3">
                  <Link
                    href="/auth/login"
                    className="block text-center py-3 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-gray-800/50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block text-center py-3 bg-white text-black rounded-xl text-sm font-medium hover:bg-gray-100 transition-all duration-200 shadow-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
