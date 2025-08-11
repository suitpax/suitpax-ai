import { NextRequest } from "next/server"
import puppeteer from "puppeteer"
import { marked } from "marked"
import sanitizeHtml from "sanitize-html"

export async function POST(req: NextRequest) {
  try {
    const { html, markdown, filename = "suitpax.pdf", format = "A4" } = await req.json()

    let contentHtml = html as string | undefined
    if (!contentHtml && markdown) {
      const raw = await marked.parse(markdown)
      contentHtml = `<!DOCTYPE html><html><head><meta charset='utf-8'/><title>Document</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, Helvetica, Arial, sans-serif; color: #111827; }
          h1,h2,h3,h4 { color: #111827; }
          .container { max-width: 800px; margin: 32px auto; padding: 0 24px; }
        </style>
      </head><body><div class="container">${raw}</div></body></html>`
    }

    if (!contentHtml) {
      return new Response(JSON.stringify({ error: "Provide 'html' or 'markdown'" }), { status: 400 })
    }

    const safeHtml = sanitizeHtml(contentHtml, {
      allowedTags: false, // allow default safe list
      allowedAttributes: false,
    })

    // Launch headless Chromium (works in serverless and docker with bundled chromium)
    const browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--font-render-hinting=medium",
      ],
      headless: true,
    })

    const page = await browser.newPage()
    await page.setContent(safeHtml, { waitUntil: "networkidle0" })
    const pdfBuffer = await page.pdf({ format: format as any, printBackground: true, margin: { top: "20mm", bottom: "20mm" } })
    await browser.close()

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${filename}`,
      },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Failed to generate PDF" }), { status: 500 })
  }
}