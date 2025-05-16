import { WaitlistConfirmation } from "@/components/marketing/waitlist-confirmation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Join the Waitlist | Suitpax",
  description:
    "Join the Suitpax waitlist for early access to our revolutionary business travel platform powered by AI.",
  openGraph: {
    title: "Join the Waitlist | Suitpax",
    description:
      "Join the Suitpax waitlist for early access to our revolutionary business travel platform powered by AI.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Suitpax - Business Travel Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Join the Waitlist | Suitpax",
    description:
      "Join the Suitpax waitlist for early access to our revolutionary business travel platform powered by AI.",
    images: ["/twitter-image.png"],
  },
}

export default function WaitlistPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <WaitlistConfirmation />
    </main>
  )
}
