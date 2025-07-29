"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  {
    name: "Product",
    href: "#",
    submenu: [
      { name: "AI Travel Agents", href: "#ai-agents", description: "Intelligent travel assistants" },
      { name: "Business Travel", href: "#business-travel", description: "Corporate travel solutions" },
      { name: "Expense Management", href: "#expenses", description: "Automated expense tracking" },
      { name: "Travel Policies", href: "/solutions/travel-policies", description: "Smart policy management" },
    ],
  },
  {
    name: "Solutions",
    href: "#",
    submenu: [
      { name: "For Enterprises", href: "#enterprise", description: "Large organization solutions" },
      { name: "For SMBs", href: "#smb", description: "Small and medium business tools" },
      { name: "For Travel Managers", href: "#managers", description: "Travel management platform" },
      { name: "For Finance Teams", href: "#finance", description: "Financial control and reporting" },
    ],
  },
  { name: "Pricing", href: "/pricing" },
  { name: "Company", href: "/manifesto" },
]

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSubmenuToggle = (name: string) => {
    setActiveSubmenu(activeSubmenu === name ? null : name)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md border-b border-gray-200" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Suitpax</span>
            <Image
              className="h-8 w-auto"
              src="/logo/suitpax-bl-logo.webp"
              alt="Suitpax"
              width={120}
              height={32}
              priority
            />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <div key={item.name} className="relative group">
              {item.submenu ? (
                <>
                  <button
                    className="flex items-center gap-x-1 text-sm font-medium leading-6 text-gray-900 hover:text-gray-600 transition-colors"
                    onMouseEnter={() => setActiveSubmenu(item.name)}
                  >
                    {item.name}
                    <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                  </button>

                  <AnimatePresence>
                    {activeSubmenu === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform px-2 sm:px-0"
                        onMouseLeave={() => setActiveSubmenu(null)}
                      >
                        <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5">
                          <div className="p-4">
                            {item.submenu.map((subItem) => (
                              <div
                                key={subItem.name}
                                className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                              >
                                <div className="flex-auto">
                                  <Link href={subItem.href} className="block font-medium text-gray-900">
                                    {subItem.name}
                                    <span className="absolute inset-0" />
                                  </Link>
                                  <p className="mt-1 text-gray-600">{subItem.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href={item.href}
                  className="text-sm font-medium leading-6 text-gray-900 hover:text-gray-600 transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <Link
            href="/auth/login"
            className="text-sm font-medium leading-6 text-gray-900 hover:text-gray-600 transition-colors"
          >
            Log in
          </Link>
          <Button asChild size="sm">
            <Link href="/auth/signup">
              Sign up
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden">
            <div className="fixed inset-0 z-10" />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
            >
              <div className="flex items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">Suitpax</span>
                  <Image
                    className="h-8 w-auto"
                    src="/logo/suitpax-bl-logo.webp"
                    alt="Suitpax"
                    width={120}
                    height={32}
                  />
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <div key={item.name}>
                        {item.submenu ? (
                          <>
                            <button
                              className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-medium leading-7 text-gray-900 hover:bg-gray-50"
                              onClick={() => handleSubmenuToggle(item.name)}
                            >
                              {item.name}
                              <ChevronDown
                                className={`h-5 w-5 flex-none transition-transform ${
                                  activeSubmenu === item.name ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            <AnimatePresence>
                              {activeSubmenu === item.name && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="ml-4 space-y-2">
                                    {item.submenu.map((subItem) => (
                                      <Link
                                        key={subItem.name}
                                        href={subItem.href}
                                        className="block rounded-lg py-2 pl-6 pr-3 text-sm font-medium leading-7 text-gray-700 hover:bg-gray-50"
                                        onClick={() => setMobileMenuOpen(false)}
                                      >
                                        {subItem.name}
                                      </Link>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <Link
                            href={item.href}
                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium leading-7 text-gray-900 hover:bg-gray-50"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="py-6 space-y-4">
                    <Link
                      href="/auth/login"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium leading-7 text-white bg-black hover:bg-gray-800 transition-colors text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
