import { type NextRequest, NextResponse } from "next/server"
import { mcpClient } from "@/lib/mcp/client"

export async function GET() {
  try {
    await mcpClient.connect()
    const tools = await mcpClient.getTools()
    await mcpClient.disconnect()

    return NextResponse.json({ tools })
  } catch (error) {
    console.error("MCP tools error:", error)
    return NextResponse.json({ error: "Failed to fetch MCP tools" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { toolName, arguments: args } = await request.json()

    await mcpClient.connect()
    const result = await mcpClient.callTool(toolName, args)
    await mcpClient.disconnect()

    return NextResponse.json({ result })
  } catch (error) {
    console.error("MCP tool call error:", error)
    return NextResponse.json({ error: "Failed to call MCP tool" }, { status: 500 })
  }
}
