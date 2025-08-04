import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateChatPDF } from "@/lib/pdf-generator"

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Obtener datos del request
    const body = await request.json()
    const { messages, title = "Chat con Suitpax AI" } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No hay mensajes para exportar" }, { status: 400 })
    }

    // Preparar estadísticas
    const userMessages = messages.filter((m: any) => m.role === "user").length
    const assistantMessages = messages.filter((m: any) => m.role === "assistant").length
    const exportDate = new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    const stats = {
      totalMessages: messages.length,
      userMessages,
      assistantMessages,
      exportDate,
    }

    // Generar PDF
    const pdfBuffer = await generateChatPDF({
      messages: messages.map((msg: any) => ({
        ...msg,
        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
      })),
      title,
      stats,
      userEmail: user.email || "Usuario",
    })

    // Log de la exportación (opcional)
    console.log(`PDF generado para usuario ${user.email}: ${messages.length} mensajes`)

    // Retornar PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="suitpax-chat-${Date.now()}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("Error generando PDF:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
