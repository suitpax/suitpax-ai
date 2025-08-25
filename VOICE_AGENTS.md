## Voice Agents with Google Cloud Text-to-Speech

This repository enables giving our AI agents a real voice via Google Cloud Text-to-Speech (TTS) and capturing speech via Speech-to-Text (STT).

Overview:
- Endpoints:
  - POST `/api/voice-ai/google/tts` → synthesize given text to MP3 using Google TTS
  - POST `/api/voice-ai/google/stt` → transcribe base64 audio with Google STT
- Voice prompts: `lib/prompts/voice/index.ts` defines speaking style and constraints
- Conversation: `app/api/voice-ai/conversation` generates agent responses from transcripts

Setup:
1) Google Cloud project with TTS and STT enabled
2) Credentials available to Next.js server (Application Default Credentials or service account JSON via env var `GOOGLE_APPLICATION_CREDENTIALS`)
3) Test with curl:
```
curl -X POST /api/voice-ai/google/tts -H 'Content-Type: application/json' -d '{"text":"Hello from Suitpax AI"}' --output voice.mp3
```

Design notes:
- TTS response is binary MP3; client uses `<audio>` to play
- STT request expects `{ audioContent: base64, languageCode? }`
- For multilingual voice, pass a specific `voice` object (see Google TTS docs)

Use cases (what problem are we solving?):
- Give agents a clear, natural voice for hands-free interactions
- Produce audio summaries of itineraries, policies, and documents
- Enable podcast-like briefings for executives or teams

Docs:
- Basics: https://cloud.google.com/text-to-speech/docs/basics
- Product: https://cloud.google.com/text-to-speech#what-problem-are-you-trying-to-solve

Multi‑speaker (experimental):
- Google exposes multi‑speaker dialogue (allowlist, en‑US Studio voice, speakers R/S/T/U)
- Our endpoint `/api/voice-ai/google/tts-multispeaker` currently approximates this by using the Studio Multispeaker voice with labeled lines. When official Node support is available, replace with v1beta1 API and structured turns.
- Ideas:
  - Agentic demos: product walkthroughs with Q/A (R=Guide, S=User)
  - Interactive onboarding scripts per role
  - E‑learning dialogues and scenario practice

