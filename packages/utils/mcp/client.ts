import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"

export interface MCPResource {
  uri: string
  name: string
  description?: string
  mimeType?: string
}

export interface MCPTool {
  name: string
  description: string
  inputSchema: any
}

export class SuitpaxMCPClient {
  private client: Client
  private transport: StdioClientTransport

  constructor() {
    this.transport = new StdioClientTransport({
      command: "node",
      args: ["./lib/mcp/server.js"],
    })
    this.client = new Client(
      {
        name: "suitpax-ai",
        version: "1.0.0",
      },
      {
        capabilities: {
          resources: {},
          tools: {},
          prompts: {},
        },
      },
    )
  }

  async connect() {
    await this.client.connect(this.transport)
  }

  async disconnect() {
    await this.client.close()
  }

  async getResources(): Promise<MCPResource[]> {
    const response = await this.client.listResources()
    return response.resources
  }

  async getTools(): Promise<MCPTool[]> {
    const response = await this.client.listTools()
    return response.tools
  }

  async callTool(name: string, arguments_: any) {
    return await this.client.callTool({ name, arguments: arguments_ })
  }

  async readResource(uri: string) {
    return await this.client.readResource({ uri })
  }
}

export const mcpClient = new SuitpaxMCPClient()
