export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  reasoning?: string
  toolCalls?: ToolCall[]
  attachments?: Attachment[]
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface ToolCall {
  id: string
  name: string
  parameters: Record<string, any>
  result?: any
}

export interface Attachment {
  id: string
  name: string
  type: string
  url?: string
}