import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import "./globals.css"
import Footer from "@/components/marketing/footer"

export const metadata: Metadata = {
  title: "Suitpax | The Future of Business Travel",
  description: "The all-in-one platform to manage your business travel, expenses, and policies with the power of AI.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
