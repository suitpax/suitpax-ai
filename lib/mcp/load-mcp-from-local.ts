import fs from "node:fs"
import path from "node:path"
import { assertServerOnly } from "@/lib/supabase/utils"

export type LocalMcpConfig = {
	entry: string // absolute or relative path to a local MCP server script
	name?: string
}

export type LoadFromLocalResult = {
	entry: string
	exists: boolean
	name?: string
}

export async function loadMcpFromLocal(config: LocalMcpConfig): Promise<LoadFromLocalResult> {
	assertServerOnly()
	const entryPath = path.isAbsolute(config.entry) ? config.entry : path.join(process.cwd(), config.entry)
	const exists = fs.existsSync(entryPath)
	return { entry: entryPath, exists, name: config.name }
}