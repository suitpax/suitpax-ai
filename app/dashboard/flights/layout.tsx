"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function FlightsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const links = [
    { href: '/dashboard/flights', label: 'Search' },
    { href: '/dashboard/flights/airlines', label: 'Airlines' },
    { href: '/dashboard/flights/airports', label: 'Airports' },
    { href: '/dashboard/flights/ancillaries', label: 'Ancillaries' },
    { href: '/dashboard/flights/loyalty', label: 'Loyalty' },
  ]

  return (
    <div className="flex h-full">
      <aside className="w-56 shrink-0 border-r border-neutral-800 bg-neutral-950 p-4">
        <div className="text-sm text-neutral-400 mb-2">Duffel</div>
        <nav className="space-y-1">
          {links.map(link => {
            const active = pathname === link.href
            return (
              <Link key={link.href} href={link.href} className={`block rounded-lg px-3 py-2 text-sm ${active ? 'bg-neutral-900 text-white' : 'text-neutral-300 hover:bg-neutral-900'}`}>
                {link.label}
              </Link>
            )
          })}
        </nav>
      </aside>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}