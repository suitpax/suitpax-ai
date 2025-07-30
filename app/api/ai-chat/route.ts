import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
})

// Language detection function
function detectLanguage(text: string): "es" | "en" {
  const spanishWords = [
    "hola",
    "gracias",
    "por favor",
    "ayuda",
    "necesito",
    "quiero",
    "viaje",
    "vuelo",
    "hotel",
    "reserva",
    "precio",
    "costo",
    "empresa",
    "negocio",
    "trabajo",
    "oficina",
    "reunión",
    "conferencia",
    "cliente",
    "proyecto",
  ]
  const englishWords = [
    "hello",
    "thanks",
    "please",
    "help",
    "need",
    "want",
    "travel",
    "flight",
    "hotel",
    "booking",
    "price",
    "cost",
    "company",
    "business",
    "work",
    "office",
    "meeting",
    "conference",
    "client",
    "project",
  ]

  const lowerText = text.toLowerCase()

  let spanishScore = 0
  let englishScore = 0

  spanishWords.forEach((word) => {
    if (lowerText.includes(word)) spanishScore++
  })

  englishWords.forEach((word) => {
    if (lowerText.includes(word)) englishScore++
  })

  // If no clear language detected, default to English
  return spanishScore > englishScore ? "es" : "en"
}

// System prompts for different languages
const systemPrompts = {
  en: `You are Zia, Suitpax's AI travel assistant specializing in business travel. You are knowledgeable, professional, and helpful.

Key information about Suitpax:
- AI-powered business travel platform
- Helps companies save up to 30% on travel costs
- Offers intelligent flight booking, hotel reservations, and expense management
- Provides 24/7 support and real-time travel updates
- Integrates with existing business systems
- SOC 2 certified and GDPR compliant
- Supports 190+ countries and 100+ currencies

Your personality:
- Professional yet friendly
- Knowledgeable about business travel
- Solution-oriented
- Concise but thorough
- Always helpful and positive

Guidelines:
- Focus on business travel solutions
- Provide practical, actionable advice
- Mention Suitpax features when relevant
- Ask clarifying questions when needed
- Keep responses conversational and engaging
- If asked about pricing, suggest contacting the sales team for custom quotes

Always respond in English and maintain a professional business tone.`,

  es: `Eres Zia, el asistente de viajes con IA de Suitpax, especializado en viajes de negocios. Eres conocedor, profesional y servicial.

Información clave sobre Suitpax:
- Plataforma de viajes de negocios impulsada por IA
- Ayuda a las empresas a ahorrar hasta un 30% en costos de viaje
- Ofrece reservas inteligentes de vuelos, hoteles y gestión de gastos
- Proporciona soporte 24/7 y actualizaciones de viaje en tiempo real
- Se integra con sistemas empresariales existentes
- Certificado SOC 2 y cumple con GDPR
- Soporta más de 190 países y más de 100 monedas

Tu personalidad:
- Profesional pero amigable
- Conocedor de viajes de negocios
- Orientado a soluciones
- Conciso pero completo
- Siempre útil y positivo

Pautas:
- Enfócate en soluciones de viajes de negocios
- Proporciona consejos prácticos y accionables
- Menciona las características de Suitpax cuando sea relevante
- Haz preguntas aclaratorias cuando sea necesario
- Mantén las respuestas conversacionales y atractivas
- Si preguntan sobre precios, sugiere contactar al equipo de ventas para cotizaciones personalizadas

Siempre responde en español y mantén un tono profesional de negocios.`,
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required and must be a string" }, { status: 400 })
    }

    // Detect language
    const language = detectLanguage(message)
    const systemPrompt = systemPrompts[language]

    // Prepare conversation for Anthropic
    const messages = [
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user",
        content: message,
      },
    ]

    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages,
    })

    const aiResponse = response.content[0].type === "text" ? response.content[0].text : ""

    return NextResponse.json({
      response: aiResponse,
      language: language,
      conversationId: Date.now().toString(),
    })
  } catch (error) {
    console.error("AI Chat error:", error)

    return NextResponse.json(
      {
        error: "Sorry, I encountered an error. Please try again or contact our support team.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
