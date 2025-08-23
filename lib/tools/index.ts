export interface Tool {
  name: string
  description: string
  parameters: Record<string, any>
  execute: (params: any) => Promise<any>
}

export const tools: Tool[] = [
  {
    name: 'search_flights',
    description: 'Search for flights',
    parameters: {},
    execute: async (params) => {
      // TODO: Implement real search
      return { ok: true, params }
    }
  },
]