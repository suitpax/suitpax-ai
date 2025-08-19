# Suitpax AI — Build. Travel. Code.

Suitpax AI is a Next.js 15 application that fuses AI chat/agents, predictive flight search (Duffel), and modern enterprise UX. It includes a dark voice dashboard, an Apple‑style Suitpax AI dashboard, a marketing site with interactive demos, and a predictive prompt system that maps natural language (any language) to travel intents.

## Key Features

- AI Chat and Tools
  - Intent router (`lib/chat/router.ts`) dispatches to specialized tools
  - Flight Search tool (`/api/ai-chat/tools/flight-search`) integrates predictive resolver and Duffel
  - Streaming and structured responses supported

- Predictive Flight Search (Duffel)
  - API: `POST /api/flights/duffel/search` (SDK‑based, enriched with airline/aircraft data)
  - UI: `app/dashboard/flights` with sorting controls and demo routes
  - Predictive mapping: `data/predictive-intents.ts`, `lib/predictive-resolver.ts`
  - Multi‑language detection and translation fallback

- Prompt Kit
  - `components/prompt-kit/prompt-input.tsx` exports `PromptInput`
  - Rich input with attachments, voice, and dark/light variants

- Voice AI and Marketing Demos
  - `app/dashboard/voice-ai` dark dashboard (spectacular, iPhone‑like vibe)
  - Public AI Voice mockup (`components/marketing/ai-voice-assistant.tsx`)

- Apple‑style Suitpax AI Dashboard
  - `app/dashboard/suitpax-ai` redesigned with modern gradients, shining text, and `PromptInput`

- Password Gate Page (Hero‑like)
  - Vanta Halo gray/white background, serif headline: “The Suitpax AI: Build. Travel. Code.”
  - Taller chat‑style input with AI agent video avatar; footer “Technology by Suitpax” with logo

## Tech Stack

- Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion
- Duffel API (real flight offers), Anthropic (AI), Supabase (auth/profile)
- Vanta.js (Halo), Web Speech APIs/ElevenLabs (voice)

## Getting Started

1) Install

```bash
pnpm install
pnpm dev
```

2) Required Environment Variables

- NEXT_PUBLIC_BASE_URL
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- ANTHROPIC_API_KEY
- DUFFEL_API_KEY
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET (Drive/Gmail integrations)

3) Supabase (optional but recommended)

- Apply SQL migrations in `scripts/` as needed for plans, usage, integrations, and snippets.

## Important Endpoints

- AI Chat: `POST /api/ai-chat`, `POST /api/ai-chat/stream`
- AI Tool (Flight Search): `POST /api/ai-chat/tools/flight-search`
- Duffel Search: `POST /api/flights/duffel/search`
- OCR: `POST /api/ocr/process`
- Snippets: `POST /api/snippets/save`
- Integrations (Google): `/api/integrations/google/*`

## Notable UI Routes

- `/dashboard/flights` — Flight search with predictive prompt and sorting
- `/dashboard/voice-ai` — Voice AI dashboard (dark, iPhone‑style)
- `/dashboard/suitpax-ai` — Apple‑style Suitpax AI page
- `/` — Marketing site with AI flight/voice demos
- `/password` — Password gate (hero‑style)

## Conventions

- `PromptInput` is the canonical export for the rich prompt field
- All Duffel flight searching goes through `/api/flights/duffel/search`

## Roadmap and Improvements

- Predictive Enhancements
  - Infer origin from geolocation/user profile
  - Natural date parsing: “this weekend”, “next Friday 6pm”
  - Extract preferences: cabin, stops, airlines, budget, currency
  - Offer re‑ranking and “Recommended/Best Price/Fastest” labels

- Voice & Marketing
  - Finalize `voice-ai` visual overhaul and navigation
  - iPhone‑style AI Voice mockup with realistic prompts, agent named “Nova”

- DX/Quality
  - Resolve pre‑existing TypeScript mismatches (TipTap versions, missing UI exports)
  - Stronger error surfaces for Duffel errors and empty results
  - E2E tests for predictive resolver and sorting

## License

Proprietary — Suitpax. All rights reserved.
