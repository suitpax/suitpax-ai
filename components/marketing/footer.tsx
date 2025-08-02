"use client"

import Link from "next/link"
import Image from "next/image"
import { SiX, SiGithub, SiLinkedin, SiCrunchbase, SiGmail, SiDiscord } from "react-icons/si"
import { PiArrowUpRightBold, PiCalendarCheckBold } from "react-icons/pi"
import { useEffect, useState } from "react"

export const Footer = () => {
  const [isMobile, setIsMobile] = useState(false)

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return (
    <footer className="relative bg-black overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-repeat bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/60"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1: Logo e información principal */}
          <div className="flex flex-col items-start">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo/suitpax-cloud-logo.webp"
                alt="Suitpax Logo"
                width={100}
                height={25}
                className="h-6 w-auto"
              />
            </Link>
            <p className="text-gray-400 mb-6 font-medium tracking-tighter text-xs text-left">
              The next-gen of traveltech with superpowers
            </p>

            {/* Status badge en posición destacada */}
            <div className="mb-6">
              <p className="text-xs text-gray-400 mb-2 font-medium">System Status:</p>
              <Link href="https://status.suitpax.com" target="_blank" rel="noopener noreferrer">
                <div className="inline-flex items-center bg-transparent px-3 py-1.5 rounded-lg shadow-sm border border-gray-600/30 group hover:border-gray-500/30 transition-colors duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></div>
                  <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors duration-300">
                    All Systems Operational
                  </span>
                </div>
              </Link>
            </div>

            <p className="text-xs text-gray-500">Av. Fabraquer 21, El Campello-Muchavista, VC, Spain, 03560</p>
          </div>

          {/* Columna 2: Products & Services */}
          <div className="flex flex-col items-start">
            <h3 className="text-white font-medium mb-4 text-sm">Products</h3>
            <div className="flex flex-col space-y-2 mb-6">
              <Link
                href="/auth/sign-up"
                className="text-gray-400 hover:text-gray-200 transition-colors text-sm"
              >
                Business Travel
              </Link>
              <Link href="/pricing" className="text-gray-400 hover:text-gray-200 transition-colors text-sm">
                Pricing
              </Link>
              <Link
                href="https://app.suitpax.com/auth/signup"
                className="text-gray-400 hover:text-gray-200 transition-colors text-sm"
              >
                Pre-register
              </Link>
              <Link
                href="https://pitch-suitpax.vercel.app"
                className="text-gray-400 hover:text-gray-200 transition-colors text-sm flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center">
                  <Image
                    src="/logo/suitpax-cloud-logo.webp"
                    alt="Suitpax"
                    width={60}
                    height={15}
                    className="h-4 w-auto mr-1"
                  />
                  <span className="font-serif italic">Deck</span>
                  <PiArrowUpRightBold className="h-3 w-3 ml-1 text-gray-400" />
                </div>
              </Link>
            </div>
          </div>

          {/* Columna 3: Company */}
          <div className="flex flex-col items-start">
            <h3 className="text-white font-medium mb-4 text-sm">Company</h3>
            <div className="flex flex-col space-y-2 mb-6">
              <Link href="/manifesto" className="text-gray-400 hover:text-gray-200 transition-colors text-sm">
                Manifesto
              </Link>
              <Link
                href="https://cal.com/team/founders/partnership"
                className="text-gray-400 hover:text-gray-200 transition-colors text-sm"
              >
                Talk to founder
              </Link>
              <Link
                href="https://lu.ma/suitpax"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-200 transition-colors text-sm flex items-center gap-1"
              >
                <PiCalendarCheckBold className="h-3.5 w-3.5" />
                Join Suitpax Events
                <PiArrowUpRightBold className="h-3 w-3 text-gray-400" />
              </Link>
              <Link
                href="https://trust.inc/suitpax"
                className="text-gray-400 hover:text-gray-200 transition-colors text-sm flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Trust Center
                <PiArrowUpRightBold className="h-3 w-3 text-gray-400" />
              </Link>
            </div>

            {/* Trust badges */}
            <h3 className="text-white font-medium mb-3 text-sm">Certifications</h3>
            <div className="flex flex-col space-y-2">
              {[
                { label: "SOC 2 Type I", status: "active" },
                { label: "GDPR Ready", status: "ready" },
                { label: "CCPA Compliant", status: "compliant" },
                { label: "DPA Suitpax AI", action: "download" },
                { label: "AI Act", link: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai" },
              ].map((cert, index) => (
                <div
                  key={index}
                  className={`flex items-center bg-transparent px-3 py-1.5 rounded-lg shadow-sm border border-gray-600/30 group hover:border-gray-500/30 transition-colors duration-300 ${
                    cert.action === "download" ? "cursor-pointer" : ""
                  }`}
                  onClick={
                    cert.action === "download"
                      ? () => {
                          const link = document.createElement("a")
                          link.href = "/legal/suitpax-ai-dpa.pdf"
                          link.download = "Suitpax-AI-DPA.pdf"
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                        }
                      : undefined
                  }
                >
                  {cert.status && (
                    <div
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        cert.status === "active" ? "bg-emerald-300 animate-pulse" : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                  <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors duration-300">
                    {cert.link ? (
                      <Link href={cert.link} target="_blank" rel="noopener noreferrer">
                        {cert.label}
                      </Link>
                    ) : (
                      cert.label
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Columna 4: Connect with us */}
          <div className="flex flex-col items-start">
            <h3 className="text-white font-medium mb-4 text-sm">Connect with us</h3>
            <div className="flex flex-wrap gap-3 mb-6">
              <Link href="https://twitter.com/suitpax" className="text-gray-400 hover:text-gray-200 transition-colors">
                <SiX className="h-5 w-5" />
                <span className="sr-only">X</span>
              </Link>
              <Link
                href="https://linkedin.com/company/suitpax"
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <SiLinkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="https://github.com/suitpax" className="text-gray-400 hover:text-gray-200 transition-colors">
                <SiGithub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://discord.gg/aPG7Sqst"
                className="text-gray-400 hover:text-gray-200 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiDiscord className="h-5 w-5" />
                <span className="sr-only">Discord</span>
              </Link>
              <Link
                href="https://instagram.com/suitpax"
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://www.crunchbase.com/organization/suitpax"
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <SiCrunchbase className="h-5 w-5" />
                <span className="sr-only">Crunchbase</span>
              </Link>
              <Link href="mailto:hello@suitpax.com" className="text-gray-400 hover:text-gray-200 transition-colors">
                <SiGmail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>

            <div className="mt-auto">
              <p className="font-medium tracking-tighter text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Suitpax. All rights reserved.
              </p>
              <p className="mt-2 text-xs font-medium tracking-tighter text-gray-500">
                "Suitpax" and logo are registered trademarks of the company.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full border-t border-gray-800 mt-8 pt-4 flex justify-center">
          <div className="flex items-center justify-center">
            <span className="text-[9px] text-gray-500 flex items-center">Technology by</span>
            <Image
              src="/logo/suitpax-cloud-logo.webp"
              alt="Suitpax Technology"
              width={50}
              height={12}
              className="h-3 w-auto opacity-50 ml-1.5"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
