import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  PiArrowRightBold,
  PiChartLineUpBold,
  PiCurrencyDollarBold,
  PiLightningBold,
  PiShieldCheckBold,
  PiClockBold,
  PiTrendUpBold,
  PiCheckCircleBold,
} from "react-icons/pi"

import BankConnection from "@/components/marketing/bank-connection"

export const metadata: Metadata = {
  title: "Travel Expense Management | Suitpax - AI-Powered Business Travel Platform",
  description:
    "Simplify your business travel expense management with Suitpax's AI-powered tools, automated reporting, and seamless bank integrations. Reduce costs by up to 30%.",
  keywords:
    "travel expense management, business travel expenses, automated expense reporting, AI expense tracking, corporate travel costs, expense automation",
  openGraph: {
    title: "Travel Expense Management | Suitpax - AI-Powered Business Travel Platform",
    description:
      "Simplify your business travel expense management with Suitpax's AI-powered tools, automated reporting, and seamless bank integrations. Reduce costs by up to 30%.",
    url: "https://suitpax.com/travel-expense-management",
    siteName: "Suitpax",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Suitpax Travel Expense Management",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Expense Management | Suitpax - AI-Powered Business Travel Platform",
    description:
      "Simplify your business travel expense management with Suitpax's AI-powered tools, automated reporting, and seamless bank integrations. Reduce costs by up to 30%.",
    images: ["/twitter-image.png"],
    creator: "@suitpax",
  },
  alternates: {
    canonical: "https://suitpax.com/travel-expense-management",
  },
}

export default function TravelExpenseManagement() {
  return <></>
}
