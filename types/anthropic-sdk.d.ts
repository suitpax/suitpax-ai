declare module "@anthropic-ai/sdk" {
  export interface AnthropicMessageInput {
    model: string
    max_tokens?: number
    temperature?: number
    system?: string
    messages: Array<{ role: "user" | "assistant"; content: string }>
  }

  export type AnthropicMessageResponse = {
    content: Array<{ type: "text"; text: string }>
    usage?: { input_tokens?: number; output_tokens?: number }
  }

  class Anthropic {
    constructor(options: { apiKey: string })
    messages: {
      create: (input: AnthropicMessageInput) => Promise<AnthropicMessageResponse>
    }
  }

  export default Anthropic
}
