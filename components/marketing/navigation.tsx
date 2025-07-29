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
            ? "bg-white/95 backdrop-blur-xl shadow-2xl border border-gray-200/60 scale-95"
            : "bg-white/90 backdrop-blur-lg border border-gray-200/40 shadow-xl"
        } rounded-full px-8 py-4 max-w-4xl w-[calc(100%-2rem)]`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <Image
              src="/logo/suitpax-cloud-logo.webp"
              alt="Suitpax"
              width={110}
              height={28}
              className="h-7 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 mx-8">
            {/* Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("solutions")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-black transition-colors py-2">
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
                    className="absolute top-full left-0 mt-4 w-80 bg-white/98 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-2xl p-6 z-50"
                  >
                    <div className="space-y-1">
                      {solutions.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block p-4 rounded-xl hover:bg-gray-50/80 transition-all duration-200 group"
                        >
                          <div className="font-medium text-black mb-1 group-hover:text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-600 group-hover:text-gray-700">{item.description}</div>
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
              <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-black transition-colors py-2">
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
                    className="absolute top-full left-0 mt-4 w-72 bg-white/98 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-2xl p-6 z-50"
                  >
                    <div className="space-y-1">
                      {company.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block p-4 rounded-xl hover:bg-gray-50/80 transition-all duration-200 group"
                        >
                          <div className="font-medium text-black mb-1 group-hover:text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-600 group-hover:text-gray-700">{item.description}</div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/pricing" className="text-sm font-medium text-gray-700 hover:text-black transition-colors py-2">
              Pricing
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-gray-700 hover:text-black transition-colors px-4 py-2 rounded-full hover:bg-gray-50/60"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-black transition-colors rounded-full hover:bg-gray-50/60"
          >
            {isMobileMenuOpen ? <PiXBold className="w-6 h-6" /> : <PiListBold className="w-6 h-6" />}
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
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-24 left-4 right-4 z-50 bg-white/98 backdrop-blur-xl rounded-3xl border border-gray-200/60 shadow-2xl p-8 lg:hidden max-h-[calc(100vh-8rem)] overflow-y-auto"
            >
              <div className="space-y-8">
                {/* Mobile Solutions */}
                <div>
                  <div className="font-medium text-black mb-4 text-lg">Solutions</div>
                  <div className="space-y-2 pl-4">
                    {solutions.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block text-gray-600 hover:text-black transition-colors py-2 text-base"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mobile Company */}
                <div>
                  <div className="font-medium text-black mb-4 text-lg">Company</div>
                  <div className="space-y-2 pl-4">
                    {company.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block text-gray-600 hover:text-black transition-colors py-2 text-base"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  href="/pricing"
                  className="block font-medium text-black text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>

                {/* Mobile CTA */}
                <div className="pt-6 border-t border-gray-200/60 space-y-4">
                  <Link
                    href="/auth/login"
                    className="block text-center py-4 text-base font-medium text-gray-700 hover:text-black transition-colors rounded-2xl hover:bg-gray-50/60"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block text-center py-4 bg-black text-white rounded-2xl text-base font-medium hover:bg-gray-900 transition-all duration-200 shadow-lg"
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
