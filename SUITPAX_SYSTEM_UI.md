## SUITPAX_SYSTEM_UI Chat Components: Implementation Guide and Duplicate Message Solutions

SUITPAX_SYSTEM_UI es una librería especializada de componentes React (basada en shadcn/ui) para aplicaciones de IA con interfaces de chat optimizadas. Esta guía cubre arquitectura de componentes, buenas prácticas y soluciones críticas para prevenir mensajes duplicados en escenarios de streaming.

## Official component structure and patterns

**Core Architecture**: SUITPAX_SYSTEM_UI proporciona cuatro componentes esenciales de chat que trabajan en conjunto. `ChatContainer` actúa como wrapper inteligente con auto-scroll, usando `use-stick-to-bottom` para una experiencia fluida. Los mensajes se renderizan con `Message` (avatares, markdown y acciones). La entrada del usuario se gestiona con `PromptInput` (textarea auto-resizable y botones de acción). Componentes como `ScrollButton` y `ResponseStream` amplían la experiencia para respuestas en streaming.

**Component Integration Pattern**: La estructura recomendada sigue una jerarquía clara: `ChatContainerRoot` envuelve toda la interfaz, `ChatContainerContent` contiene los mensajes con `space-y-4`, y `ChatContainerScrollAnchor` gestiona la posición del scroll. Detalles críticos: usar IDs únicos de mensaje para rendimiento y `markdown={true}` para renderizar contenido enriquecido.

## Root causes of duplicate messages in chat interfaces

**React StrictMode Impact**: En desarrollo, React 18 `StrictMode` invoca doblemente ciertos ciclos (componentes y `useEffect`), duplicando llamadas a APIs, listeners y actualizaciones de estado, lo que deriva en mensajes duplicados. En lugar de deshabilitar `StrictMode`, usa funciones de cleanup y patrones con `useRef` para manejar doble invocación correctamente.

**State Management Issues**: Actualizaciones de estado incorrectas causan duplicados, especialmente con streaming. Patrones comunes: falta de cleanup en `useEffect`, arrays de dependencias incorrectos, mutación de estado en vez de actualizaciones inmutables; múltiples `useEffect` en conflicto; y cierres obsoletos que acumulan contenido duplicado.

**Streaming Response Complications**: En streaming, actualizaciones rápidas pueden usar referencias de estado obsoletas. El patrón `setMessages((prev) => [...prev, newChunk])` parece correcto, pero genera duplicados si cada update referencia un `prev` desfasado respecto al acumulado actual.

## Critical solutions for streaming duplicate prevention

**UseRef Content Tracking Pattern**: La solución más efectiva para streaming usa `useRef` para acumular contenido fuera del estado de React:

```javascript
const assistantContentRef = useRef('')

const handleStreaming = async () => {
  assistantContentRef.current = '' // Reset para nuevo mensaje
  
  for await (const chunk of stream) {
    if (chunk.content) {
      assistantContentRef.current += chunk.content
      
      setMessages(prev => {
        const messages = [...prev]
        const lastIndex = messages.length - 1
        
        if (messages[lastIndex]?.role !== 'assistant') {
          messages.push({
            id: generateId(),
            role: 'assistant', 
            content: assistantContentRef.current
          })
        } else {
          messages[lastIndex].content = assistantContentRef.current
        }
        
        return messages
      })
    }
  }
}
```

**Message Deduplication Strategy**: Implementa detección por ID antes de agregar mensajes al estado (streaming o no):

```javascript
const addMessage = useCallback((newMessage) => {
  setMessages(prev => {
    if (!prev.find(msg => msg.id === newMessage.id)) {
      return [...prev, newMessage]
    }
    return prev
  })
}, [])
```

## Next.js organization and state management patterns

**Recommended Project Structure**: En Next.js, usa arquitectura por funcionalidades. Componentes en `components/chat/` (`ChatContainer.jsx`, `MessageList.jsx`, `MessageInput.jsx`). Hooks personalizados en `hooks/` (`useChat.ts`, `useMessages.ts`). Servicios en `lib/` (`chat-service.ts`) para integrar backend.

**State Management Approaches**: Para apps simples, `useState`/`useReducer` son suficientes. En casos complejos, considera Zustand o `@chatscope/use-chat` (agrupación, typing indicators, borradores persistentes). Context API funciona bien para estado global: conversaciones activas, presencia de usuarios, etc.

**App Router Considerations**: App Router permite server components (carga inicial), streaming para mejor performance y layouts anidados. Usa client components ('use client') para WebSocket y tiempo real, y server components para autenticación y contenido estático.

## Performance optimization and component architecture

**Message Rendering Optimization**: Usa `React.memo` con comparadores personalizados para mensajes. Para listas largas, virtualiza con `react-window`. Proporciona keys e IDs únicos para optimizar la reconciliación de React.

**Auto-scrolling Implementation**: `ChatContainer` implementa auto-scroll con animaciones tipo spring basadas en velocidad. Detecta scroll del usuario y preserva posición al navegar hacia arriba. Nota: `ScrollButton` solo funciona dentro de `ChatContainerRoot` (no con contenedores de scroll custom).

**Connection Management**: Mantén una sola conexión WebSocket por componente con cleanup adecuado:

```javascript
useEffect(() => {
  const socket = io(SERVER_URL)
  
  socket.on('message', handleMessage)
  
  return () => {
    socket.off('message', handleMessage)
    socket.disconnect()
  }
}, [])
```

## Real-world implementation patterns and best practices

**Production Usage**: Implementaciones en producción muestran la viabilidad del enfoque (e.g., WorkspaceChat a gran escala). Buenas prácticas: integración correcta de componentes dentro de frameworks de chat mayores y uso activo de capacidades de streaming.

**Component Installation**: Instala componentes individuales con shadcn CLI: `npx shadcn@latest add "https://prompt-kit.com/c/chat-container.json"`. Asegúrate de configurar shadcn/ui primero; SUITPAX_SYSTEM_UI se apoya en su sistema de diseño y accesibilidad.

**Integration with AI Frameworks**: Funciona con Vercel AI SDK v5 y OpenAI SDK. Los componentes son agnósticos de backend mediante patrones controlados (`value` y `onValueChange`).

## Conclusión

Prevenir duplicados implica comprender `StrictMode`, aplicar cleanup y usar refs para acumulación en streaming. Decisiones clave: IDs únicos por mensaje, deduplicación por ID, una sola conexión por componente y aprovechar optimizaciones integradas de SUITPAX_SYSTEM_UI. Con una organización adecuada en Next.js y un estado bien gestionado, obtendrás chats fiables y performantes en desarrollo y producción.

---

## Problemas críticos detectados en implementaciones actuales

**PROBLEMA CRÍTICO: Estás agregando el mensaje del usuario DESPUÉS de recibir la respuesta**

```typescript
const handleSend = async () => {
  // ...
  const userMessage: Message = {
    id: Date.now().toString(),
    content: input.trim(),
    role: "user",
    timestamp: new Date(),
  };

  // ❌ NO actualizas el estado aquí (correcto, pero...)
  
  const response = await fetch("/api/chat", {
    body: JSON.stringify({
      message: userMessage.content,
      history: messages, // ✅ Envías solo el historial actual
    }),
  });

  // ❌ PROBLEMA: Agregas AMBOS mensajes al mismo tiempo
  setMessages(prev => [
    ...prev,
    userMessage,        // Mensaje del usuario
    {
      id: assistantId,
      content: data.response,  // Respuesta del asistente
      role: "assistant",
      timestamp: new Date(),
      reasoning: data.reasoning,
    },
  ])
}
```

### Solución inmediata

```typescript
const handleSend = async () => {
  if (!input.trim() || loading) return;
  
  setLoading(true);
  
  // 1. Agregar mensaje del usuario INMEDIATAMENTE
  const userMessage: Message = {
    id: Date.now().toString(),
    content: input.trim(),
    role: "user",
    timestamp: new Date(),
  };
  
  setMessages(prev => [...prev, userMessage]);
  setInput(""); // Limpiar input inmediatamente
  
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage.content,
        history: [...messages, userMessage], // Incluir el nuevo mensaje
        includeReasoning: showReasoning,
      }),
    });
    const data = await response.json()
    
    // 2. Agregar SOLO la respuesta del asistente
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: data.response,
      role: "assistant",
      timestamp: new Date(),
      reasoning: data.reasoning,
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    
  } catch (error) {
    // Manejar error
  } finally {
    setLoading(false);
  }
};
```

## Componentes a eliminar/reorganizar

Duplicados y ejemplos de SUITPAX_SYSTEM_UI que debes eliminar para reducir ruido:

- ❌ `components/motion-primitives/*`
- ❌ `components/prompt-kit/examples/*`
- ❌ `components/prompt-kit/containers/*`
- ❌ `components/prompt-kit/blocks/code-block-*.tsx`
- ❌ `components/prompt-kit/suggestion/*`
- ❌ `components/prompt-kit/sources/*`
- ❌ `components/prompt-kit/message/examples.tsx`

Conservar y consolidar:

- ✅ `components/prompt-kit/chat-container.tsx`
- ✅ `components/prompt-kit/prompt-input.tsx`
- ✅ `components/prompt-kit/message.tsx`
- ✅ `components/prompt-kit/markdown.tsx`
- ✅ `components/prompt-kit/reasoning.tsx`
- ✅ `components/prompt-kit/scroll-button.tsx`
- ✅ `components/prompt-kit/voice-button.tsx`
- ✅ `components/prompt-kit/blocks/flight-offers-block.tsx`

## Mejoras necesarias para IA completa

### Hook de Streaming Real (`hooks/useStreamingChat.ts`)

```typescript
import { useRef, useState, useCallback } from 'react'

export function useStreamingChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  
  const sendMessage = useCallback(async (content: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    abortControllerRef.current = new AbortController()
    setIsStreaming(true)
    
    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
        signal: abortControllerRef.current.signal,
      })
      
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''
      
      const assistantId = Date.now().toString()
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }])
      
      while (true) {
        const { done, value } = await reader!.read()
        if (done) break
        
        const chunk = decoder.decode(value)
        assistantContent += chunk
        
        setMessages(prev => prev.map(msg => 
          msg.id === assistantId 
            ? { ...msg, content: assistantContent }
            : msg
        ))
      }
    } finally {
      setIsStreaming(false)
    }
  }, [])
  
  return { messages, sendMessage, isStreaming }
}
```

### Contexto Global de Chat (`contexts/ChatContext.tsx`)

```typescript
import { createContext, useContext, useState } from 'react'

interface ChatContextType {
  sessions: ChatSession[]
  activeSessionId: string | null
  createSession: () => void
  switchSession: (id: string) => void
  deleteSession: (id: string) => void
}

const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  
  const createSession = () => {}
  const switchSession = (_id: string) => {}
  const deleteSession = (_id: string) => {}
  
  return (
    <ChatContext.Provider value={{
      sessions,
      activeSessionId,
      createSession,
      switchSession,
      deleteSession
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider')
  return ctx
}
```

### Persistencia con Supabase (fragmento de `app/api/chat/route.ts`)

```typescript
// Después de generar respuesta
if (userId) {
  await supabase.from("chat_sessions").upsert({
    id: sessionId,
    user_id: userId,
    messages: [...history, userMessage, assistantMessage],
    updated_at: new Date().toISOString(),
  })
  
  await supabase.rpc("update_ai_usage", {
    user_uuid: userId,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
  })
}
```

### Sistema de Tools/Functions (`lib/tools/index.ts`)

```typescript
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
      // Implementar búsqueda
      return params
    }
  },
]
```

### Rate Limiting y Throttling (`lib/rate-limiter.ts`)

```typescript
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  
  canMakeRequest(userId: string, limit: number = 10): boolean {
    const now = Date.now()
    const userRequests = this.requests.get(userId) || []
    const recentRequests = userRequests.filter(t => now - t < 60000)
    
    if (recentRequests.length >= limit) {
      return false
    }
    
    this.requests.set(userId, [...recentRequests, now])
    return true
  }
}
```

## Otros errores encontrados

**Memory Leak en Voice Button**: Verifica que `components/prompt-kit/voice-button.tsx` limpie correctamente recursos (MediaStream, `AudioContext`, listeners, `AbortController`) en `useEffect` cleanup para evitar fugas de memoria durante sesiones prolongadas.

## Error Handling en API Routes

Aplica manejo de errores consistente en todas las rutas:

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }
    // ... lógica
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
```

## TypeScript Types Missing (`types/chat.ts`)

```typescript
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
```

## Componentes adicionales sugeridos

- **TranscriptPanel**: visualización/descarga de transcripciones.
- **TokenIndicator**: contador de tokens y costos.
- **StreamingStatus**: indicador de estado de conexión/streaming.
- **AttachmentPreview**: vista previa de archivos subidos.