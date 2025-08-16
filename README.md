# Suitpax AI & Suitpax Code X

## Setup rápido

1) Variables de entorno requeridas

- NEXT_PUBLIC_BASE_URL
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- ANTHROPIC_API_KEY
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET (para Drive/Gmail)
- DUFFEL_API_KEY (opcional)

2) Migraciones Supabase (orden)

Ejecuta en la consola SQL de Supabase los siguientes scripts (directorio `scripts/`):

- `create-suitpax-plans.sql`
- `create-rpc-usage.sql`
- `create-code-snippets-table.sql`
- `create-user-integrations-table.sql`
- (Opcional) `create-ai-usage-table.sql` si no existe ya

3) OAuth Google (Drive/Gmail)

- Crea credenciales OAuth 2.0 en Google Cloud Console
- Autorizado: `${NEXT_PUBLIC_BASE_URL}/api/integrations/google/callback`
- Scopes usados: Drive readonly, Gmail readonly, userinfo
- Conecta desde `Dashboard → Integrations`

4) Modelo y límites

- Modelo unificado: `claude-3-7-sonnet-20250219`
- Planes base (`suitpax_plans`): free/basic/pro/enterprise
- Add-on Suitpax Code (`suitpax_code_addons`): starter/pro/enterprise
- Suscripciones por usuario en `user_subscriptions`
- RPCs: `can_use_ai_tokens_v2`, `can_use_code_tokens`, `get_user_subscription_limits`

## Suitpax Code X

- Página: `Dashboard → Suitpax Code X`
- Servidor MCP: config en el panel superior (persistido en localStorage)
- Slash-commands: `/mcp <tool> {json}`
- Tool Runner: formularios dinámicos por `inputSchema`
- Preview: extrae el último bloque ```html/tsx``` y lo renderiza en iframe
- Guardado de snippets: botón Save → `code_snippets`

## Endpoints clave

- Chat AI: `POST /api/ai-chat` (token gating y logging)
- Streaming: `POST /api/ai-chat/stream`
- Code generation: `POST /api/prompts/code-generation`
- MCP remoto: `POST /api/mcp/remote/tools`, `POST /api/mcp/remote/resources`
- OCR server-only: `POST /api/ocr/process`
- Snippets: `POST /api/snippets/save`
- Integrations: `GET /api/integrations/google/drive/auth`, `GET /api/integrations/google/gmail/auth`, `GET /api/integrations/google/callback`

## Precios (propuesta)

- Suitpax Code Starter: €29/mes (10k code tokens, 50 builds)
- Suitpax Code Pro: €59/mes (30k code tokens, 200 builds)
- Suitpax Code Enterprise: Custom

## MCP servidores recomendados

- GitHub, Vercel/Netlify, Supabase, Stripe, Notion/Linear/Jira, Slack, Google Drive/Docs

## Notas de build

- Mover OCR/PDF a `api/ocr/process` (Node runtime). Iconos corregidos.
- Requiere variables de Supabase para build completo.
