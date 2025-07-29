"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { RiMenuLine, RiCloseLine, RiArrowRightLine } from "react-icons/ri"

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center" onClick={closeMenu}>
              <Image
                src="/logo/suitpax-bl-logo.webp"
                alt="Suitpax"
                width={120}
                height={30}
                className="h-7 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/travel-expense-management"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Solutions
              </Link>
              <Link href="/pricing" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              <Link
                href="/manifesto"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Manifesto
              </Link>
              <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Contact
              </Link>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-4 py-2 rounded-xl hover:bg-gray-50"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center bg-black text-white hover:bg-gray-800 px-6 py-2 rounded-xl text-sm font-medium tracking-tighter shadow-lg transition-colors"
              >
                Get Started
                <RiArrowRightLine className="ml-1.5 h-4 w-4" />
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <RiCloseLine className="h-6 w-6 text-gray-700" />
              ) : (
                <RiMenuLine className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={closeMenu} />

            {/* Mobile Menu */}
            <motion.div
              className="absolute top-16 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6 space-y-4">
                {/* Mobile Navigation Links */}
                <div className="space-y-3">
                  <Link
                    href="/travel-expense-management"
                    className="block text-base font-medium text-gray-700 hover:text-gray-900 transition-colors py-2"
                    onClick={closeMenu}
                  >
                    Solutions
                  </Link>
                  <Link
                    href="/pricing"
                    className="block text-base font-medium text-gray-700 hover:text-gray-900 transition-colors py-2"
                    onClick={closeMenu}
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/manifesto"
                    className="block text-base font-medium text-gray-700 hover:text-gray-900 transition-colors py-2"
                    onClick={closeMenu}
                  >
                    Manifesto
                  </Link>
                  <Link
                    href="/contact"
                    className="block text-base font-medium text-gray-700 hover:text-gray-900 transition-colors py-2"
                    onClick={closeMenu}
                  >
                    Contact
                  </Link>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-4" />

                {/* Mobile Auth Buttons */}
                <div className="space-y-3">
                  <Link
                    href="/auth/login"
                    className="block w-full text-center text-base font-medium text-gray-700 hover:text-gray-900 transition-colors py-3 px-4 rounded-xl hover:bg-gray-50"
                    onClick={closeMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block w-full text-center bg-black text-white hover:bg-gray-800 py-3 px-4 rounded-xl text-base font-medium tracking-tighter shadow-lg transition-colors"
                    onClick={closeMenu}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation
