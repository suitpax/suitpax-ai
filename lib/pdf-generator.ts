import type React from "react"
import { Document, Page, Text, View, StyleSheet, Font, pdf } from "@react-pdf/renderer"

// Register fonts for better typography
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2" },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2",
      fontWeight: 500,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2",
      fontWeight: 600,
    },
  ],
})

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    fontFamily: "Inter",
  },
  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    color: "#111827",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: 300,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 600,
    color: "#111827",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: "#6b7280",
    fontWeight: 500,
  },
  messageContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  userMessage: {
    backgroundColor: "#111827",
    borderColor: "#374151",
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  messageRole: {
    fontSize: 10,
    fontWeight: 500,
    color: "#6b7280",
    marginRight: 8,
  },
  messageTime: {
    fontSize: 9,
    color: "#9ca3af",
    fontWeight: 400,
  },
  messageContent: {
    fontSize: 11,
    lineHeight: 1.5,
    color: "#374151",
    fontWeight: 300,
  },
  userMessageContent: {
    color: "#ffffff",
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    alignItems: "center",
  },
  footerText: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
    fontWeight: 400,
  },
  footerBrand: {
    fontSize: 12,
    color: "#111827",
    fontWeight: 600,
    marginBottom: 4,
  },
})

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface PDFDocumentProps {
  messages: Message[]
  title: string
  userInfo?: {
    email?: string
    name?: string
  }
}

// Clean markdown from message content for PDF
function cleanMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s/g, "") // Remove headers
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.*?)\*/g, "$1") // Remove italic
    .replace(/`(.*?)`/g, "$1") // Remove inline code
    .replace(/```[\s\S]*?```/g, "[Code block]") // Replace code blocks
    .replace(/\[([^\]]+)\]$$[^)]+$$/g, "$1") // Remove links, keep text
    .replace(/^\s*[-*+]\s/gm, "• ") // Convert list items to bullets
    .replace(/^\s*\d+\.\s/gm, "• ") // Convert numbered lists to bullets
    .trim()
}

const PDFDocument: React.FC<PDFDocumentProps> = ({ messages, title, userInfo }) => {
  const totalMessages = messages.length
  const userMessages = messages.filter((m) => m.role === "user").length
  const aiMessages = messages.filter((m) => m.role === "assistant").length

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            Generated on{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
            {userInfo?.email && ` • ${userInfo.email}`}
          </Text>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalMessages}</Text>
            <Text style={styles.statLabel}>Total Messages</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userMessages}</Text>
            <Text style={styles.statLabel}>Your Messages</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{aiMessages}</Text>
            <Text style={styles.statLabel}>AI Responses</Text>
          </View>
        </View>

        {/* Messages */}
        {messages.map((message, index) => (
          <View key={message.id} style={[styles.messageContainer, message.role === "user" && styles.userMessage]}>
            <View style={styles.messageHeader}>
              <Text style={styles.messageRole}>{message.role === "user" ? "You" : "Suitpax AI"}</Text>
              <Text style={styles.messageTime}>
                {message.timestamp.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
            <Text style={[styles.messageContent, message.role === "user" && styles.userMessageContent]}>
              {cleanMarkdown(message.content)}
            </Text>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>Suitpax</Text>
          <Text style={styles.footerText}>Your AI-powered business travel assistant</Text>
          <Text style={styles.footerText}>This conversation was exported from Suitpax AI Chat</Text>
        </View>
      </Page>
    </Document>
  )
}

export async function generateChatPDF(
  messages: Message[],
  title: string,
  userInfo?: { email?: string; name?: string },
): Promise<Buffer> {
  const doc = <PDFDocument messages={messages} title={title} userInfo={userInfo} />
  const pdfBuffer = await pdf(doc).toBuffer()
  return pdfBuffer
}
