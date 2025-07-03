"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PiDotsNineBold, PiDotsSixBold, PiArrowUpRightBold } from "react-icons/pi"
import { SiX, SiGithub, SiProducthunt, SiLinkedin, SiCrunchbase, SiGmail, } from "react-icons/si"
import { cn } from "@/lib/utils"

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileMenuOpen])

  // Helper function to check if a link is active
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  return (
    <div className="w-full flex justify-center pt-2 py-2 px-4 z-50 fixed top-0 left-0">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:rounded-md"
      >
        Skip to main content
      </a>

      <header
        className={`flex flex-col w-full max-w-6xl rounded-xl backdrop-blur-md bg-white/85 border border-black/5 transition-all duration-300 mb-6 ${
          isScrolled ? "shadow-lg border-black/10" : ""
        } ${isMobileMenuOpen ? "!bg-white/85 !rounded-xl !border-black/10" : ""}`}
      >
        <div className="w-full px-4 py-1">
          <div className="relative flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="sr-only">Suitpax</span>
              <Image
                src="/logo/suitpax-bl-logo.webp"
                alt="Suitpax"
                width={120}
                height={25}
                priority
                className="h-6 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:justify-center lg:space-x-6 absolute left-1/2 -translate-x-1/2">
              <Link
                href="/manifesto"
                className={cn(
                  "px-2.5 py-1.5 text-sm hover:bg-black/5 rounded-lg font-medium tracking-tighter transition-colors",
                  isActive("/manifesto") ? "text-black bg-black/5 font-semibold" : "text-black",
                )}
              >
                Manifesto
              </Link>
              <Link
                href="/pricing"
                className={cn(
                  "px-2.5 py-1.5 text-sm hover:bg-black/5 rounded-lg font-medium tracking-tighter transition-colors",
                  isActive("/pricing") ? "text-black bg-black/5 font-semibold" : "text-black",
                )}
              >
                Pricing
              </Link>
              <Link
                href="https://cal.com/team/founders/partnership"
                className="px-2.5 py-1.5 text-sm text-black hover:bg-black/5 rounded-lg font-medium tracking-tighter transition-colors"
              >
                Talk to founders
              </Link>
             
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Private Beta Button */}
              <Button
                asChild
                className="h-7 text-xs font-medium tracking-tighter rounded-full bg-black text-white hover:bg-black/80 px-3 py-1 shadow-sm min-w-[90px] flex items-center gap-1"
              >
                <Link href="mailto:suitpax.com">
                  Private Beta
                  <PiArrowUpRightBold className="h-2.5 w-2.5 text-white/80" />
                </Link>
              </Button>

              {/* Mobile Menu Button */}
              <button
                type="button"
                ref={buttonRef}
                className="lg:hidden inline-flex items-center justify-center rounded-md p-1.5 text-black bg-gray-100 border border-black/10 backdrop-blur-md"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">{isMobileMenuOpen ? "Close menu" : "Open menu"}</span>
                <div className={`transition-transform duration-200 ${isMobileMenuOpen ? "rotate-180" : ""}`}>
                  {isMobileMenuOpen ? <PiDotsSixBold size={18} /> : <PiDotsNineBold size={18} />}
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu - Simplified */}
          {isMobileMenuOpen && (
            <div ref={menuRef} className="lg:hidden overflow-hidden transition-all duration-300 ease-in-out">
              <nav className="mt-6 border-t border-gray-200/30 pt-4">
                <div className="px-0">
                  <div className="py-2 border-b border-gray-200/30">
                    <Link
                      href="/manifesto"
                      className={cn(
                        "flex items-center w-full py-1 text-lg font-medium tracking-tighter hover:bg-black/5 rounded-md transition-colors",
                        isActive("/manifesto") ? "text-black bg-black/5 font-semibold" : "text-black",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Manifesto
                    </Link>
                  </div>
                  <div className="py-2 border-b border-gray-200/30">
                    <Link
                      href="/pricing"
                      className={cn(
                        "flex items-center w-full py-1 text-lg font-medium tracking-tighter hover:bg-black/5 rounded-md transition-colors",
                        isActive("/pricing") ? "text-black bg-black/5 font-semibold" : "text-black",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Pricing
                    </Link>
                  </div>
                </div>

                <div className="px-0 mt-2">
                  <div className="py-2 border-b border-gray-200/30">
                    <Link
                      href="https://cal.com/team/founders/partnership"
                      className="flex items-center w-full py-1 text-lg font-medium tracking-tighter text-black hover:bg-black/5 rounded-md transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Talk to founders
                    </Link>
                  </div>

                  {/* Suitpax Deck Link */}
                  <div className="py-2 border-b border-gray-200/30">
                    <Link
                      href="https://pitch-suitpax.vercel.app"
                      className="flex items-center w-full py-1 text-lg font-medium tracking-tighter text-black hover:bg-black/5 rounded-md transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="flex items-center">
                        <Image
                          src="/logo/suitpax-bl-logo.webp"
                          alt="Suitpax"
                          width={70}
                          height={18}
                          className="h-4 w-auto mr-1"
                        />
                        <span className="font-serif italic text-sm">Deck</span>
                        <PiArrowUpRightBold className="h-3 w-3 ml-1 text-gray-500" />
                      </div>
                    </Link>
                  </div>

                  <div className="py-2 border-b border-gray-200/30">
                   
                  </div>
               

                {/* Social Icons - Mobile Only */}
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
                    <Link href="https://producthunt.com/products/suitpax-2" className="text-gray-500 hover:text-black">
                      <SiProducthunt className="h-4 w-4" />
                      <span className="sr-only">Product Hunt</span>
                    </Link>
                    <Link href="https://instagram.com/suitpax" className="text-gray-500 hover:text-black">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                      </svg>
                      <span className="sr-only">Instagram</span>
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

                {/* Contact Badge - Mobile Only */}
                <div className="mt-6 px-0 pb-4">
                  <div className="flex flex-col items-start space-y-2">
                    <a
                      href="mailto:hello@suitpax.com"
                      className="inline-flex items-center px-3 py-1.5 bg-transparent border border-black rounded-md text-xs font-medium text-black hover:bg-black/5 transition-colors"
                    >
                      Send feedback
                    </a>
                    <p className="text-[10px] text-gray-500">
                      Feel free to contact us directly with your ideas and feedback. We'd love to hear from you!
                    </p>
                  </div>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </div>
  )
}

export default Navigation
