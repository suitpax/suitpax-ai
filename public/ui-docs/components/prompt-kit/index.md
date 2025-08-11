# Prompt Kit (Suitpax)

Prompt Kit es una colección de componentes de UI orientados a experiencias de chat/IA en Suitpax. Proveen estructura, accesibilidad y consistencia visual.

## Componentes principales

- ChatContainerRoot: Contenedor raíz que maneja scroll y contexto del chat.
- ChatContainerContent: Renderiza la lista de mensajes, estado de carga y exportación a PDF.
- ChatContainerScrollAnchor: Anclaje invisible para auto-scroll al final.
- ChatMessage: Mensaje individual con soporte Markdown, copiar y exportar a PDF.
- ReasoningResponse: Panel colapsable para mostrar un resumen de razonamiento de alto nivel.
- PromptInput / PromptInputTextarea / PromptInputActions: Entrada de prompt con acciones.
- ScrollButton: Botón flotante para volver al final del chat.

## Integración rápida

\`\`\`tsx
import {
  ChatContainerRoot,
  ChatContainerContent,
  ChatContainerScrollAnchor,
} from "@/components/prompt-kit/chat-container";

<ChatContainerRoot>
  <ChatContainerContent messages={messages} isLoading={loading} />
  <ChatContainerScrollAnchor />
</ChatContainerRoot>
\`\`\`

Entrada con acciones:

\`\`\`tsx
import { PromptInput, PromptInputTextarea, PromptInputActions } from "@/components/prompt-kit/prompt-input";

<PromptInput value={input} onValueChange={setInput} onSubmit={handleSend}>
  <PromptInputActions>{/* Botones extra */}</PromptInputActions>
  <PromptInputTextarea placeholder="Escribe tu solicitud…" />
  <PromptInputActions>{/* Botón enviar */}</PromptInputActions>
</PromptInput>
\`\`\`

## Razonamiento (resumen)

- Usa ReasoningResponse para mostrar un resumen del razonamiento devuelto por el backend.
- Recomendación: mantenerlo opcional (switch) y presentar un resumen de alto nivel, no cadenas de pensamiento detalladas.

\`\`\`tsx
import { ReasoningResponse } from "@/components/prompt-kit/reasoning";

{message.reasoning && <ReasoningResponse reasoning={message.reasoning} />}
\`\`\`

## Theming y estilo

- Tipografía y colores consistentes con Tailwind.
- Switch activado: negro (data-[state=checked]:bg-black) para una estética más sobria.
- Mensaje del usuario: fondo negro, texto blanco.
- Mensaje del asistente: tarjeta clara con borde sutil.

## Accesibilidad

- ChatContainerRoot gestiona el foco visual y el auto-scroll.
- Buttons y enlaces con áreas de toque adecuadas y estados de foco visibles.
- Markdown renderizado con jerarquía semántica.

## Buenas prácticas

- Mantener prompts y respuestas en Markdown limpio (sin emojis).
- Para reasoning, limitar a 3–5 viñetas o 80–120 palabras.
- Exportaciones a PDF disponibles desde cada mensaje del asistente y del histórico.

## Roadmap sugerido

- Soporte de streaming token a token en ChatMessage.
- Indicadores de herramientas usadas (tool badges) por respuesta.
- Controles de sesión: renombrar, archivar, borrar.
- Telemetría de UX (no PII): tiempos de respuesta, errores, uso de features.
