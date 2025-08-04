import type React from "react"
import jsPDF from "jspdf"
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"

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
  reasoning?: string
}

interface PDFDocumentProps {
  messages: Message[]
  title: string
  userInfo?: {
    email?: string
    name?: string
  }
}

interface PDFOptions {
  messages: Message[]
  title?: string
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
            {message.reasoning && (
              <View style={styles.messageContainer}>
                <Text style={styles.messageRole}>AI Reasoning:</Text>
                <Text style={styles.messageContent}>{cleanMarkdown(message.reasoning)}</Text>
              </View>
            )}
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

export function generateChatPDF({ messages, title = "Suitpax AI Chat", userInfo }: PDFOptions): jsPDF {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const maxWidth = pageWidth - margin * 2
  let yPosition = margin

  // Helper function to add new page if needed
  const checkPageBreak = (neededHeight: number) => {
    if (yPosition + neededHeight > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
    }
  }

  // Helper function to wrap text
  const wrapText = (text: string, maxWidth: number, fontSize: number) => {
    doc.setFontSize(fontSize)
    return doc.splitTextToSize(text, maxWidth)
  }

  // Header
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text(title, margin, yPosition)
  yPosition += 15

  // User info if provided
  if (userInfo?.name || userInfo?.email) {
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(100, 100, 100)
    if (userInfo.name) {
      doc.text(`User: ${userInfo.name}`, margin, yPosition)
      yPosition += 8
    }
    if (userInfo.email) {
      doc.text(`Email: ${userInfo.email}`, margin, yPosition)
      yPosition += 8
    }
    yPosition += 5
  }

  // Date
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPosition)
  yPosition += 20

  // Messages
  messages.forEach((message, index) => {
    // Check if we need a new page
    checkPageBreak(30)

    // Message header
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 0, 0)

    const roleText = message.role === "user" ? "You" : "Suitpax AI"
    const timestamp = message.timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })

    doc.text(`${roleText} - ${timestamp}`, margin, yPosition)
    yPosition += 10

    // Message content
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(40, 40, 40)

    // Clean markdown from content for PDF
    const cleanContent = message.content
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold markdown
      .replace(/\*(.*?)\*/g, "$1") // Remove italic markdown
      .replace(/`(.*?)`/g, "$1") // Remove code markdown
      .replace(/#{1,6}\s/g, "") // Remove headers
      .replace(/^\s*[-*+]\s/gm, "• ") // Convert lists to bullets
      .replace(/^\s*\d+\.\s/gm, "• ") // Convert numbered lists to bullets

    const wrappedContent = wrapText(cleanContent, maxWidth, 10)

    wrappedContent.forEach((line: string) => {
      checkPageBreak(8)
      doc.text(line, margin, yPosition)
      yPosition += 6
    })

    // Add reasoning if present
    if (message.reasoning) {
      yPosition += 5
      checkPageBreak(20)

      doc.setFontSize(9)
      doc.setFont("helvetica", "italic")
      doc.setTextColor(100, 100, 100)
      doc.text("AI Reasoning:", margin, yPosition)
      yPosition += 8

      const cleanReasoning = message.reasoning
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/`(.*?)`/g, "$1")

      const wrappedReasoning = wrapText(cleanReasoning, maxWidth - 10, 9)

      wrappedReasoning.forEach((line: string) => {
        checkPageBreak(6)
        doc.text(line, margin + 10, yPosition)
        yPosition += 5
      })
    }

    yPosition += 15 // Space between messages
  })

  // Footer
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(`Page ${i} of ${totalPages} - Generated by Suitpax AI`, pageWidth / 2, pageHeight - 10, {
      align: "center",
    })
  }

  return doc
}
