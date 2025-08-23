import type { Metadata } from "next"
import PasswordGatePageClient from "./password-client"

export const metadata: Metadata = {
	title: "Private Preview Access",
	description: "Enter your access key to explore Suitpax — AI-powered business travel platform.",
	alternates: { canonical: "https://suitpax.com/password" },
}

export default function PasswordGatePage() {
	return <PasswordGatePageClient />
}