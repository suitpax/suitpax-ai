import { NextResponse } from "next/server"
import { mcpClient } from "@/lib/mcp/client"

export async function GET() {
  try {
    await mcpClient.connect()
    const resources = await mcpClient.getResources()
    await mcpClient.disconnect()

    return NextResponse.json({ resources })
  } catch (error) {
    console.error("MCP resources error:", error)
    return NextResponse.json({ error: "Failed to fetch MCP resources" }, { status: 500 })
  }
}
