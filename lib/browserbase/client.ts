import Browserbase from "@browserbasehq/sdk"
import { assertServerOnly } from "@/lib/supabase/utils"

let browserbaseClient: Browserbase | null = null

export function getBrowserbaseClient(): Browserbase {
	assertServerOnly()
	if (browserbaseClient) return browserbaseClient
	const apiKey = process.env.BROWSER_BASE_API || process.env.BROWSERBASE_API_KEY
	if (!apiKey) throw new Error("Missing BROWSER_BASE_API (or BROWSERBASE_API_KEY)")
	browserbaseClient = new Browserbase({ apiKey })
	return browserbaseClient
}

export async function createBrowserbaseSession(projectId?: string) {
	const bb = getBrowserbaseClient()
	const pid = projectId || process.env.BROWSER_BASE_PROJECT_ID
	const session = await bb.sessions.create(pid ? { projectId: pid } : undefined as any)
	return session
}