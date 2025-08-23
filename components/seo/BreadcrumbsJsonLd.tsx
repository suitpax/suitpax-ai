"use client"

import { usePathname } from "next/navigation"
import Script from "next/script"

const labelMap: Record<string, string> = {
	"": "Home",
	"business-travel": "Business Travel",
	"ai-agents": "AI Agents",
	"pricing": "Pricing",
	"password": "Access",
}

export default function BreadcrumbsJsonLd() {
	const pathname = usePathname() || "/"
	const segments = pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean)
	const items = [
		{
			"@type": "ListItem",
			position: 1,
			name: labelMap[""] || "Home",
			item: "https://suitpax.com/",
		},
		...segments.map((seg, idx) => ({
			"@type": "ListItem",
			position: idx + 2,
			name: labelMap[seg] || seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
			item: `https://suitpax.com/${segments.slice(0, idx + 1).join("/")}`,
		})),
	]
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items,
	}
	return <Script id="breadcrumbs-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}