import { type NextRequest, NextResponse } from "next/server"
import { listRemoteResources } from "@/lib/mcp/remote"

export async function POST(request: NextRequest) {
  try {
    const { serverUrl, headers } = await request.json()
    if (!serverUrl) return NextResponse.json({ error: "serverUrl required" }, { status: 400 })

    const resources = await listRemoteResources({ url: serverUrl, headers })
    return NextResponse.json({ resources })
  } catch (e) {
    console.error("Remote MCP resources error:", e)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}