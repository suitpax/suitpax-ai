import type React from "react"
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer"

// Registrar fuentes personalizadas si es necesario
// Font.register({
//   family: 'Inter',
//   src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
// })

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    borderBottomStyle: "solid",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "normal",
  },
  messageContainer: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderStyle: "solid",
  },
  userMessage: {
    backgroundColor: "#111827",
    color: "#ffffff",
  },
  assistantMessage: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  messageRole: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  userRole: {
    color: "#ffffff",
  },
  assistantRole: {
    color: "#374151",
  },
  timestamp: {
    fontSize: 9,
    color: "#9ca3af",
  },
  messageContent: {
    fontSize: 11,
    lineHeight: 1.5,
    color: "#374151",
  },
  userContent: {
    color: "#ffffff",
  },
  reasoning: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#10b981",
    borderLeftStyle: "solid",
  },
  reasoningTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#065f46",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  reasoningContent: {
    fontSize: 9,
    color: "#374151",
    lineHeight: 1.4,
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    borderTopStyle: "solid",
    textAlign: "center",
  },
  footerText: {
    fontSize: 9,
    color: "#9ca3af",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  statLabel: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 2,
  },
})

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  reasoning?: string
}

interface PDFData {
  messages: Message[]
  title?: string
  userInfo?: {
    name?: string
    email?: string
  }
}

const PDFDocument: React.FC<{ data: PDFData }> = ({ data }) => {
  const { messages, title = "Suitpax AI Chat Export", userInfo } = data

  const userMessages = messages.filter((m) => m.role === "user").length
  const assistantMessages = messages.filter((m) => m.role === "assistant").length
  const totalMessages = messages.length

  const exportDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            Exportado el {exportDate}
            {userInfo?.email && ` • ${userInfo.email}`}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalMessages}</Text>
            <Text style={styles.statLabel}>Total Mensajes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userMessages}</Text>
            <Text style={styles.statLabel}>Preguntas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{assistantMessages}</Text>
            <Text style={styles.statLabel}>Respuestas IA</Text>
          </View>
        </View>

        {/* Messages */}
        {messages.map((message, index) => (
          <View
            key={message.id}
            style={[styles.messageContainer, message.role === "user" ? styles.userMessage : styles.assistantMessage]}
          >
            <View style={styles.messageHeader}>
              <Text style={[styles.messageRole, message.role === "user" ? styles.userRole : styles.assistantRole]}>
                {message.role === "user" ? "Usuario" : "Suitpax AI"}
              </Text>
              <Text style={styles.timestamp}>
                {message.timestamp.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>

            <Text style={[styles.messageContent, message.role === "user" ? styles.userContent : {}]}>
              {message.content}
            </Text>

            {/* AI Reasoning */}
            {message.reasoning && (
              <View style={styles.reasoning}>
                <Text style={styles.reasoningTitle}>Razonamiento IA</Text>
                <Text style={styles.reasoningContent}>{message.reasoning}</Text>
              </View>
            )}
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Generado por Suitpax AI • Business Travel Platform</Text>
          <Text style={styles.footerText}>
            Este documento contiene información confidencial de tu conversación con nuestro asistente de IA
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export const generatePDF = async (data: PDFData): Promise<Buffer> => {
  try {
    const doc = <PDFDocument data={data} />
    const asPdf = pdf(doc)
    const buffer = await asPdf.toBuffer()
    return buffer
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw new Error("Failed to generate PDF")
  }
}
