## AI Studio

AI Studio groups advanced creation tools:
- Notebook: mixed markdown + AI cells backed by `/api/notebook/run` using `lib/chat/router`
- Podcast: script-to-audio via Google Cloud TTS
- Docs: upload document and generate a text + voice summary

Entries:
- Page: `/dashboard/ai-studio`
- Components: `components/ai-studio/*`
- API: `app/api/notebook/run`

Extensibility roadmap:
- Persist notebooks to Supabase (cells, outputs, versions)
- Add voice cloning options and multi-voice mixing
- Integrate OCR/PDF extraction to summarize real documents
- Export to RSS/Podcast feed

Security & privacy:
- Avoid storing raw audio by default; store metadata and regenerate on demand
- Enforce role-based access for shared notebooks/podcasts

