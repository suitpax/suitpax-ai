import { type NextRequest, NextResponse } from "next/server"
import { listRemoteTools, callRemoteTool } from "@/lib/mcp/remote"

export async function POST(request: NextRequest) {
  try {
    const { serverUrl, headers, toolName, args } = await request.json()
    if (!serverUrl) return NextResponse.json({ error: "serverUrl required" }, { status: 400 })

    if (toolName) {
      const result = await callRemoteTool({ url: serverUrl, headers }, toolName, args || {})
      return NextResponse.json({ result })
    }

    const tools = await listRemoteTools({ url: serverUrl, headers })
    return NextResponse.json({ tools })
  } catch (e) {
    console.error("Remote MCP tools error:", e)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}