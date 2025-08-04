import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer"
import { createElement } from "react"

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 15,
    fontWeight: "normal",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    padding: 15,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  statLabel: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  messagesContainer: {
    flex: 1,
    marginTop: 25,
  },
  messageBlock: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  userMessage: {
    backgroundColor: "#f3f4f6",
    borderColor: "#e5e7eb",
    alignSelf: "flex-end",
    maxWidth: "75%",
  },
  assistantMessage: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    alignSelf: "flex-start",
    maxWidth: "85%",
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  messageRole: {
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  userRole: {
    color: "#3b82f6",
  },
  assistantRole: {
    color: "#059669",
  },
  messageTime: {
    fontSize: 9,
    color: "#9ca3af",
  },
  messageContent: {
    fontSize: 11,
    lineHeight: 1.5,
    color: "#1f2937",
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    alignItems: "center",
  },
  brandText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 5,
    letterSpacing: -0.5,
  },
  footerText: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 3,
  },
})

interface ChatPDFProps {
  messages: Array<{
    id: string
    role: "user" | "assistant"
    content: string
    timestamp?: Date
  }>
  title: string
  stats: {
    totalMessages: number
    userMessages: number
    assistantMessages: number
    exportDate: string
  }
  userEmail: string
}

const ChatPDFDocument = ({ messages, title, stats, userEmail }: ChatPDFProps) =>
  createElement(
    Document,
    {},
    createElement(
      Page,
      { size: "A4", style: styles.page },
      // Header
      createElement(
        View,
        { style: styles.header },
        createElement(Text, { style: styles.title }, title),
        createElement(Text, { style: styles.subtitle }, `Exportado por: ${userEmail}`),
        createElement(Text, { style: styles.subtitle }, stats.exportDate),
        createElement(
          View,
          { style: styles.statsContainer },
          createElement(
            View,
            { style: styles.statItem },
            createElement(Text, { style: styles.statValue }, stats.totalMessages.toString()),
            createElement(Text, { style: styles.statLabel }, "Total Mensajes"),
          ),
          createElement(
            View,
            { style: styles.statItem },
            createElement(Text, { style: styles.statValue }, stats.userMessages.toString()),
            createElement(Text, { style: styles.statLabel }, "Tus Mensajes"),
          ),
          createElement(
            View,
            { style: styles.statItem },
            createElement(Text, { style: styles.statValue }, stats.assistantMessages.toString()),
            createElement(Text, { style: styles.statLabel }, "Respuestas IA"),
          ),
        ),
      ),
      // Messages
      createElement(
        View,
        { style: styles.messagesContainer },
        ...messages.map((message, index) =>
          createElement(
            View,
            {
              key: message.id || index,
              style: [styles.messageBlock, message.role === "user" ? styles.userMessage : styles.assistantMessage],
            },
            createElement(
              View,
              { style: styles.messageHeader },
              createElement(
                Text,
                { style: [styles.messageRole, message.role === "user" ? styles.userRole : styles.assistantRole] },
                message.role === "user" ? "Usuario" : "Suitpax AI",
              ),
              message.timestamp &&
                createElement(
                  Text,
                  { style: styles.messageTime },
                  message.timestamp.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                ),
            ),
            createElement(
              Text,
              { style: styles.messageContent },
              // Limpiar markdown básico para PDF
              message.content
                .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
                .replace(/\*(.*?)\*/g, "$1") // Italic
                .replace(/`(.*?)`/g, "$1") // Code
                .replace(/#{1,6}\s/g, "") // Headers
                .replace(/^\s*[-*+]\s/gm, "• ") // List items
                .replace(/^\s*\d+\.\s/gm, "• ") // Numbered lists
                .replace(/\[([^\]]+)\]$$[^)]+$$/g, "$1"), // Links
            ),
          ),
        ),
      ),
      // Footer
      createElement(
        View,
        { style: styles.footer },
        createElement(Text, { style: styles.brandText }, "SUITPAX AI"),
        createElement(Text, { style: styles.footerText }, "Business Travel & Expense Management Platform"),
        createElement(
          Text,
          { style: styles.footerText },
          "Este documento contiene información confidencial de tu conversación con Suitpax AI",
        ),
        createElement(Text, { style: styles.footerText }, "Para más información visita suitpax.com"),
      ),
    ),
  )

export async function generateChatPDF(props: ChatPDFProps): Promise<Buffer> {
  try {
    const doc = ChatPDFDocument(props)
    const pdfBuffer = await pdf(doc).toBuffer()
    return pdfBuffer
  } catch (error) {
    console.error("Error generando PDF:", error)
    throw new Error("Failed to generate PDF")
  }
}
