import { NextRequest, NextResponse } from "next/server"
import { createBrowserbaseSession } from "@/utils/browserbase"

export async function POST(req: NextRequest) {
	try {
		const { projectId } = await req.json().catch(() => ({ projectId: undefined }))
		const session = await createBrowserbaseSession(projectId)
		return NextResponse.json({ id: session.id, connectUrl: (session as any).connectUrl || session.connectUrl })
	} catch (error) {
		console.error("Browserbase route error:", error)
		return NextResponse.json({ error: "Failed to create Browserbase session" }, { status: 500 })
	}
}