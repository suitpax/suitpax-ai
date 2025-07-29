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
      setIsScrolled(window.scrollY > 20)
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo/suitpax-bl-logo.webp"
              alt="Suitpax"
              width={120}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("solutions")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-black transition-colors">
                <span>Solutions</span>
                <PiCaretDownBold className="w-3 h-3" />
              </button>

              <AnimatePresence>
                {activeDropdown === "solutions" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl border border-gray-200 shadow-lg p-6"
                  >
                    <div className="space-y-4">
                      {solutions.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block p-3 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-medium text-black mb-1">{item.name}</div>
                          <div className="text-xs text-gray-600">{item.description}</div>
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
              <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-black transition-colors">
                <span>Company</span>
                <PiCaretDownBold className="w-3 h-3" />
              </button>

              <AnimatePresence>
                {activeDropdown === "company" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl border border-gray-200 shadow-lg p-6"
                  >
                    <div className="space-y-4">
                      {company.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block p-3 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-medium text-black mb-1">{item.name}</div>
                          <div className="text-xs text-gray-600">{item.description}</div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/pricing" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
              Pricing
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 bg-gray-800 text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-black transition-colors"
          >
            {isMobileMenuOpen ? <PiXBold className="w-5 h-5" /> : <PiListBold className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 bg-white"
            >
              <div className="py-6 space-y-6">
                {/* Mobile Solutions */}
                <div>
                  <div className="font-medium text-black mb-3">Solutions</div>
                  <div className="space-y-3 pl-4">
                    {solutions.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block text-sm text-gray-600 hover:text-black transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mobile Company */}
                <div>
                  <div className="font-medium text-black mb-3">Company</div>
                  <div className="space-y-3 pl-4">
                    {company.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block text-sm text-gray-600 hover:text-black transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  href="/pricing"
                  className="block font-medium text-black"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>

                {/* Mobile CTA */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link
                    href="/auth/login"
                    className="block text-center py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block text-center py-3 bg-gray-800 text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
