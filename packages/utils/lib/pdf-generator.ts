import puppeteer from "puppeteer"

export async function generatePDF(content: string, reasoning?: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  try {
    const page = await browser.newPage()

    // Clean markdown for PDF
    const cleanContent = content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br>")

    const cleanReasoning = reasoning
      ? reasoning
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>")
          .replace(/`(.*?)`/g, "<code>$1</code>")
          .replace(/\n/g, "<br>")
      : ""

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Suitpax AI Response</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 20px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #064e3b;
              margin-bottom: 10px;
            }
            .content {
              margin-bottom: 30px;
            }
            .reasoning {
              background: #f9fafb;
              border-left: 4px solid #064e3b;
              padding: 20px;
              margin-top: 30px;
            }
            .reasoning h3 {
              margin-top: 0;
              color: #064e3b;
            }
            code {
              background: #f3f4f6;
              padding: 2px 4px;
              border-radius: 3px;
              font-family: 'Monaco', 'Consolas', monospace;
            }
            strong {
              color: #064e3b;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Suitpax AI</div>
            <div>Business Travel Assistant Response</div>
            <div style="font-size: 14px; color: #6b7280; margin-top: 10px;">
              Generated on ${new Date().toLocaleDateString()}
            </div>
          </div>
          
          <div class="content">
            ${cleanContent}
          </div>
          
          ${
            reasoning
              ? `
            <div class="reasoning">
              <h3>AI Reasoning</h3>
              ${cleanReasoning}
            </div>
          `
              : ""
          }
        </body>
      </html>
    `

    await page.setContent(html, { waitUntil: "networkidle0" })

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    })

    return Buffer.from(pdf)
  } finally {
    await browser.close()
  }
}
