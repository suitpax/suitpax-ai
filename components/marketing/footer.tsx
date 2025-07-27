import Link from "next/link"
import Image from "next/image"
import { PiGithubLogo, PiTwitterLogo, PiLinkedinLogo, PiYoutubeLogo, PiArrowRight } from "react-icons/pi"
import { HackerNewsBadge } from "@/components/ui/hacker-news-badge"
import { Button } from "@/components/ui/button"

const footerSections = [
  {
    title: "Product",
    links: [
      { name: "Business Travel", href: "#" },
      { name: "Expense Management", href: "/travel-expense-management" },
      { name: "AI Agents", href: "#" },
      { name: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "#" },
      { name: "Manifesto", href: "/manifesto" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Blog", href: "#" },
      { name: "Help Center", href: "#" },
      { name: "API Documentation", href: "#" },
      { name: "Security", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Terms of Service", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Cookie Policy", href: "#" },
    ],
  },
]

const socialLinks = [
  { name: "GitHub", icon: PiGithubLogo, href: "#" },
  { name: "Twitter", icon: PiTwitterLogo, href: "#" },
  { name: "LinkedIn", icon: PiLinkedinLogo, href: "#" },
  { name: "YouTube", icon: PiYoutubeLogo, href: "#" },
]

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 border-t border-gray-800">
      {/* Top Section with CTA and Badges */}
      <div className="bg-gray-900/50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 lg:py-20 text-center">
          <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Ready to Revolutionize Your Business Travel?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            Join thousands of innovative companies and take control of your travel expenses with the power of AI.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 transition-colors shadow-lg">
                Get Started Free
                <PiArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex justify-center gap-4 flex-wrap items-center">
            <HackerNewsBadge />
            <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-300">
              <span className="relative flex h-2 w-2 mr-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Vercel AI Hackathon Winner</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section with Links */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Image src="/logo/suitpax-cloud-logo.webp" alt="Suitpax Logo" width={120} height={32} />
            <p className="text-sm text-gray-400">
              The AI-powered platform for seamless business travel and expense management.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((item) => (
                <a key={item.name} href={item.href} className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">{footerSections[0].title}</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {footerSections[0].links.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-base text-gray-400 hover:text-white transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">{footerSections[1].title}</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {footerSections[1].links.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-base text-gray-400 hover:text-white transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">{footerSections[2].title}</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {footerSections[2].links.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-base text-gray-400 hover:text-white transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">{footerSections[3].title}</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {footerSections[3].links.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-base text-gray-400 hover:text-white transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Suitpax, Inc. All rights reserved.</p>
          <div className="flex items-center mt-4 sm:mt-0">
            <span className="text-sm text-gray-500 mr-2">Technology by</span>
            <Image src="/logo/suitpax-symbol.webp" alt="Suitpax Symbol" width={20} height={20} />
            <span className="ml-1 font-semibold text-gray-400">Suitpax</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
