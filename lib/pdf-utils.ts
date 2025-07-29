"use client"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export async function generateChatPDF(messages: ChatMessage[], title = "Chat Conversation"): Promise<void> {
  try {
    // Create a simple HTML structure for the PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #eee;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .message {
              margin-bottom: 20px;
              padding: 15px;
              border-radius: 8px;
              border-left: 4px solid #ddd;
            }
            .message.user {
              background-color: #f8f9fa;
              border-left-color: #007bff;
            }
            .message.assistant {
              background-color: #fff;
              border-left-color: #28a745;
              border: 1px solid #eee;
            }
            .message-role {
              font-weight: bold;
              margin-bottom: 8px;
              text-transform: uppercase;
              font-size: 12px;
              letter-spacing: 1px;
            }
            .message.user .message-role {
              color: #007bff;
            }
            .message.assistant .message-role {
              color: #28a745;
            }
            .message-content {
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .timestamp {
              font-size: 11px;
              color: #666;
              margin-top: 8px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <p>Generado el ${new Date().toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}</p>
          </div>
          
          ${messages
            .map(
              (message) => `
            <div class="message ${message.role}">
              <div class="message-role">${message.role === "user" ? "Usuario" : "Asistente"}</div>
              <div class="message-content">${message.content}</div>
              <div class="timestamp">${message.timestamp.toLocaleString("es-ES")}</div>
            </div>
          `,
            )
            .join("")}
          
          <div class="footer">
            <p>Conversación exportada desde Suitpax AI Chat</p>
          </div>
        </body>
      </html>
    `

    // Create a blob with the HTML content
    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)

    // Create a temporary link and trigger download
    const link = document.createElement("a")
    link.href = url
    link.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_${Date.now()}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up
    URL.revokeObjectURL(url)

    // Note: For actual PDF generation, you would need a library like jsPDF or html2pdf
    // This creates an HTML file that can be printed to PDF by the browser
    console.log("Chat exported as HTML file (can be printed to PDF)")
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw new Error("Error al generar el PDF")
  }
}

export async function readTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === "string") {
        resolve(result)
      } else {
        reject(new Error("Could not read file as text"))
      }
    }

    reader.onerror = () => reject(new Error("Error reading file"))

    if (file.type === "application/pdf") {
      // For PDF files, we'll just return a placeholder
      // In a real implementation, you'd use a PDF parsing library
      resolve(`[PDF File: ${file.name}] - Content extraction would require a PDF parsing library`)
    } else if (file.type.startsWith("text/")) {
      reader.readAsText(file)
    } else {
      reject(new Error("Unsupported file type for text extraction"))
    }
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function getFileIcon(fileType: string): string {
  if (fileType.startsWith("image/")) return "🖼️"
  if (fileType === "application/pdf") return "📄"
  if (fileType.includes("word")) return "📝"
  if (fileType.includes("excel") || fileType.includes("spreadsheet")) return "📊"
  if (fileType.includes("powerpoint") || fileType.includes("presentation")) return "📊"
  if (fileType.startsWith("text/")) return "📄"
  return "📎"
}
