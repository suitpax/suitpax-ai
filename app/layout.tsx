import type React from "react"
import { Inter } from "next/font/google"
import ClientLayout from "./ClientLayout"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="application-name" content="Suitpax" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Suitpax | The next-gen AI traveltech" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={inter.className}>
        <Suspense
          fallback={
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-200 flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            </div>
          }
        >
          <ClientLayout>{children}</ClientLayout>
        </Suspense>
      </body>
    </html>
  )
}

export const metadata = {
  generator: "v0.dev",
}
