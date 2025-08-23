import type React from "react"
import { Inter } from "next/font/google"
import ClientLayout from "./ClientLayout"
import { Suspense } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ToastProvider from "@/components/ui/toast-provider"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const orgJsonLd = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Suitpax",
		url: "https://suitpax.com",
		logo: "https://suitpax.com/logo/suitpax-cloud-logo.webp",
		sameAs: [
			"https://twitter.com/suitpax",
			"https://www.linkedin.com/company/suitpax",
			"https://github.com/suitpax",
		],
		description:
			"Suitpax is the next-gen AI traveltech platform for modern companies — conversational booking, real-time policy compliance, expenses, and analytics in one flow.",
	}
	const websiteJsonLd = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Suitpax",
		url: "https://suitpax.com",
		potentialAction: {
			"@type": "SearchAction",
			target: "https://suitpax.com/search?q={search_term_string}",
			"query-input": "required name=search_term_string",
		},
	}
	return (
		<html lang="en" className="scroll-smooth" suppressHydrationWarning>
			<head>
				<meta name="application-name" content="Suitpax" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content="Suitpax | The next-gen AI traveltech" />
				<meta name="format-detection" content="telephone=no" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="theme-color" content="#000000" />
				<meta name="description" content="Suitpax — AI-powered business travel that simplifies booking, expenses and policies with MCP agents and live analytics." />
				<link rel="canonical" href="https://suitpax.com" />
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
			</head>
			<body className={inter.className}>
				<ThemeProvider attribute="class" forcedTheme="light">
					<Suspense
						fallback={
							<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
								<div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
							</div>
						}
					>
						<ClientLayout>{children}</ClientLayout>
						<ToastProvider />
					</Suspense>
				</ThemeProvider>
			</body>
		</html>
	)
}

export const metadata = {
	generator: "suitpax",
	metadataBase: new URL("https://suitpax.com"),
	title: {
		default: "Suitpax — AI-Powered Business Travel Platform",
		template: "%s | Suitpax",
	},
	description:
		"The next-gen of AI traveltech. An AI-powered business travel platform that simplifies booking, expense management, and travel policies for modern companies.",
	openGraph: {
		title: "Suitpax — AI-Powered Business Travel Platform",
		description:
			"Run business travel with MCP AI agents, smart policies, and real-time analytics.",
		url: "https://suitpax.com",
		siteName: "Suitpax",
		images: [
			{ url: "/og-image.png", width: 1200, height: 630, alt: "Suitpax" },
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Suitpax — AI-Powered Business Travel Platform",
		description: "AI traveltech for teams: conversational booking, expenses and policies.",
		images: ["/twitter-image.png"],
		creator: "@suitpax",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	alternates: {
		canonical: "https://suitpax.com",
	},
}
