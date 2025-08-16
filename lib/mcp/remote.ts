import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { WebSocketClientTransport } from "@modelcontextprotocol/sdk/client/websocket.js"

export type RemoteServerConfig = {
  name?: string
  url: string
  headers?: Record<string, string>
}

export async function withRemoteMCPClient<T>(config: RemoteServerConfig, fn: (client: Client) => Promise<T>): Promise<T> {
  const transport = new WebSocketClientTransport(config.url, {
    headers: config.headers || {},
  } as any)

  const client = new Client(
    { name: "suitpax-code", version: "1.0.0" },
    { capabilities: { resources: {}, tools: {}, prompts: {} } },
  )

  await client.connect(transport)
  try {
    return await fn(client)
  } finally {
    await client.close()
  }
}

export async function listRemoteTools(config: RemoteServerConfig) {
  return await withRemoteMCPClient(config, async (client) => {
    const res = await client.listTools()
    return res.tools
  })
}

export async function listRemoteResources(config: RemoteServerConfig) {
  return await withRemoteMCPClient(config, async (client) => {
    const res = await client.listResources()
    return res.resources
  })
}

export async function callRemoteTool(config: RemoteServerConfig, name: string, args: any) {
  return await withRemoteMCPClient(config, async (client) => {
    return await client.callTool({ name, arguments: args })
  })
}