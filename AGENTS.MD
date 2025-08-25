## Agents Overview

This project includes an agentic AI layer for chat, flights, coding, documents, and expenses. It follows a simple contract: detect the user intent, optionally call a specialized tool endpoint, then respond with an appropriate system prompt per agent.

### What is agents.md?

`agents.md` is a lightweight spec popularized by the agents community to document how agents in a codebase work: their responsibilities, prompts, tools, inputs/outputs, and conventions. This file serves as our canonical reference for Suitpax AI agents.

Reference: `https://agents.md/`

### Agent Routing

- Entry: `lib/chat/router.ts`
  - Detects intent: `flight_search | code_generation | document_processing | expense_analysis | general`.
  - Optionally calls a tool API: `/app/api/chat/tools/*`.
  - Chooses system prompt per agent: core, flights, hotels, or code.
  - Generates a response via `lib/anthropic` using the user plan.

### System Prompts

- Core: `lib/prompts/system.ts` (general travel/coding/business/documents/expenses)
- Flights Expert: `lib/prompts/agents/flights-expert.ts`
- Hotels Expert: `lib/prompts/agents/hotels-expert.ts`
- Code Assistant: `lib/prompts/code/index.ts` exports `SUITPAX_CODE_SYSTEM_PROMPT`

### Tools (MCP and HTTP)

HTTP tool endpoints used by the router:
- `POST /api/chat/tools/flight-search`
  - Input: `{ query: string }`
  - Output: `{ success: boolean, offers?: Array<{ airline:{name,code,logo|null}, price:number, currency:string, route:{origin, destination, departure_time, arrival_time, duration:number, stops:number}, booking_url:string }>, search_params? }`
- `POST /api/chat/tools/code-generator`
  - Input: `{ query: string, language?: string, framework?: string }`
  - Output: `{ success: boolean, code?: string, usage?: any }`
- `POST /api/chat/tools/expense-analyzer`
  - Input: `{ query: string, userId?: string }`
  - Output: `{ success: boolean, analysis?: string, insights?: string[], usage?: any }`

MCP servers and clients exist under `lib/mcp/*` and can be composed into agents where appropriate.

### Agent Runner

- `lib/agents/runner.ts`
  - Provides thin utilities to execute an agent plan and unify results.

### Conventions

- Validation with Zod where needed; stable JSON outputs for tool calls.
- Prompts live under `lib/prompts/*`. Tools under `app/api/chat/tools/*`.
- Keep agent names, prompts, and capabilities explicit and discoverable.

### Extending Agents

1) Create/extend a prompt under `lib/prompts/*`.
2) Add a tool under `app/api/chat/tools/<name>/route.ts` returning `{ success: boolean, ... }`.
3) Update `lib/chat/router.ts` to detect the new intent and call the tool.
4) Add any UI in `app/dashboard/*` or components as needed.

### Environment

- Requires `ANTHROPIC_API_KEY` for AI-backed tools.
- `NEXT_PUBLIC_BASE_URL` used to call internal endpoints from tools.

### Known Gaps (TypeScript)

- Some imports/components referenced in marketing and dashboard sections may be missing or typed loosely. Run `pnpm type-check` to see current issues.
- ElevenLabs and OCR/PDF pipelines use browser/Node types; check Buffer/Blob conversions if you change runtime boundaries.

