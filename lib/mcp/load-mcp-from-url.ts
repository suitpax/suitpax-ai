import { listRemoteResources, listRemoteTools, RemoteServerConfig } from "@/lib/mcp/remote"
import { assertServerOnly } from "@/lib/supabase/utils"

export type LoadFromUrlResult = {
	tools: Array<{ name: string; description?: string }>
	resources: Array<{ uri: string; name?: string; description?: string }>
}

export async function loadMcpFromUrl(config: RemoteServerConfig): Promise<LoadFromUrlResult> {
	assertServerOnly()
	const [tools, resources] = await Promise.all([
		listRemoteTools(config).catch(() => [] as any[]),
		listRemoteResources(config).catch(() => [] as any[]),
	])
	return {
		tools: tools.map((t: any) => ({ name: t.name, description: t.description })),
		resources: resources.map((r: any) => ({ uri: r.uri, name: r.name, description: r.description })),
	}
}