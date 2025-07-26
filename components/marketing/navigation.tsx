import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"

export function MarketingNavigation() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-secondary h-10 px-4 py-2 md:hidden">
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Navigate through the marketing site.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Link href="/" className="flex items-center p-3 -m-3 rounded-lg hover:bg-gray-100 transition-colors">
            Home
          </Link>
          <Link href="/pricing" className="flex items-center p-3 -m-3 rounded-lg hover:bg-gray-100 transition-colors">
            Pricing
          </Link>
          <Link href="/features" className="flex items-center p-3 -m-3 rounded-lg hover:bg-gray-100 transition-colors">
            Features
          </Link>
          <Link href="/blog" className="flex items-center p-3 -m-3 rounded-lg hover:bg-gray-100 transition-colors">
            Blog
          </Link>
          <Link href="/about" className="flex items-center p-3 -m-3 rounded-lg hover:bg-gray-100 transition-colors">
            About
          </Link>
          <Link href="/contact" className="flex items-center p-3 -m-3 rounded-lg hover:bg-gray-100 transition-colors">
            Contact
          </Link>
          <Link href="/terms" className="flex items-center p-3 -m-3 rounded-lg hover:bg-gray-100 transition-colors">
            Terms & Conditions
          </Link>
          <Link href="/privacy" className="flex items-center p-3 -m-3 rounded-lg hover:bg-gray-100 transition-colors">
            Privacy Policy
          </Link>
          <a
            href="https://slack.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center p-3 -m-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Join Slack
          </a>
        </div>
      </SheetContent>
    </Sheet>
  )
}
