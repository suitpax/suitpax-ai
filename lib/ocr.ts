import axios from 'axios'
import { TextractClient, DetectDocumentTextCommand } from '@aws-sdk/client-textract'

export type ParsedExpense = {
  amount?: number
  currency?: string
  expense_date?: string
  vendor?: string
  project_code?: string
  raw_text: string
}

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const pdfjs: any = await import('pdfjs-dist/build/pdf')
  const loadingTask = pdfjs.getDocument({ data: buffer, disableWorker: true })
  const pdf = await loadingTask.promise
  let fullText = ''
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const content = await page.getTextContent()
    const strings: string[] = (content.items || []).map((it: any) => (it as any).str || '')
    fullText += strings.join(' ') + '\n'
  }
  return fullText
}

async function extractTextWithUnpdf(buffer: Buffer): Promise<string | null> {
  const apiKey = process.env.UNPDF_API_KEY
  if (!apiKey) return null
  try {
    const resp = await axios.post('https://api.unpdf.io/v1/extract', buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Authorization': `Bearer ${apiKey}`
      },
      timeout: 30000
    })
    if (resp.data?.text) return String(resp.data.text)
    if (Array.isArray(resp.data?.pages)) {
      return resp.data.pages.map((p: any) => p.text || '').join('\n')
    }
    return null
  } catch {
    return null
  }
}

async function extractTextFromImageWithTextract(buffer: Buffer): Promise<string> {
  const region = process.env.AWS_REGION || 'eu-west-1'
  const client = new TextractClient({ region })
  const cmd = new DetectDocumentTextCommand({ Document: { Bytes: buffer } })
  const res = await client.send(cmd)
  const lines = (res?.Blocks || []).filter(b => b.BlockType === 'LINE').map(b => b.Text || '')
  return lines.join('\n')
}

export async function extractTextAuto(file: { buffer: Buffer, filename?: string, mimetype?: string }): Promise<string> {
  const { buffer, filename = '', mimetype = '' } = file
  const lower = (mimetype || '').toLowerCase()
  const isPDF = lower.includes('pdf') || filename.toLowerCase().endsWith('.pdf')
  if (isPDF) {
    const viaUnpdf = await extractTextWithUnpdf(buffer)
    if (viaUnpdf && viaUnpdf.trim()) return viaUnpdf
    return extractTextFromPDF(buffer)
  }
  // Images -> Textract
  try {
    return await extractTextFromImageWithTextract(buffer)
  } catch {
    return ''
  }
}

export function extractExpenseEntities(text: string): ParsedExpense {
  const result: ParsedExpense = { raw_text: text }

  const currencySymbols: Record<string, string> = { '$': 'USD', '€': 'EUR', '£': 'GBP' }
  const currencyCodes = ['USD','EUR','GBP','MXN','ARS','CLP','COP']

  const amountRegexes = [
    /(?<currency>USD|EUR|GBP|MXN|ARS|CLP|COP)\s*(?<amount>\d{1,3}(?:[\.,]\d{3})*(?:[\.,]\d{2})?)/i,
    /(?<symbol>[$€£])\s*(?<amount>\d{1,3}(?:[\.,]\d{3})*(?:[\.,]\d{2})?)/,
    /Total\s*[:\-]?\s*(?<symbol>[$€£])?\s*(?<amount>\d{1,3}(?:[\.,]\d{3})*(?:[\.,]\d{2})?)/i
  ]

  for (const re of amountRegexes) {
    const m = text.match(re as any)
    if (m) {
      const groups: any = (m as any).groups || {}
      const rawAmount = (groups.amount || (m as any)[2] || '').replace(/[,]/g, '')
      const parsed = parseFloat(rawAmount.replace(/\.(?=\d{3}(\D|$))/g, ''))
      if (!Number.isNaN(parsed)) result.amount = parsed
      const symbol = groups.symbol || ''
      const code = groups.currency || ''
      if (code && currencyCodes.includes(code.toUpperCase())) result.currency = code.toUpperCase()
      if (!result.currency && symbol && currencySymbols[symbol]) result.currency = currencySymbols[symbol]
      break
    }
  }

  const dateRegexes = [
    /(20\d{2})[-\/.](\d{1,2})[-\/.](\d{1,2})/,
    /(\d{1,2})[-\/.](\d{1,2})[-\/.](20\d{2})/
  ]
  for (const re of dateRegexes) {
    const m = text.match(re)
    if (m) {
      let yyyy = '', mm = '', dd = ''
      if (m[1].length === 4) { yyyy = m[1]; mm = m[2]; dd = m[3] }
      else { dd = m[1]; mm = m[2]; yyyy = m[3] }
      const pad = (s: string) => s.padStart(2, '0')
      result.expense_date = `${yyyy}-${pad(mm)}-${pad(dd)}`
      break
    }
  }

  const lines = text.split(/\n|\r/).map(l => l.trim()).filter(Boolean)
  const vendorCandidates = lines.slice(0, 10).concat(lines.filter(l => /merchant|seller|vendor|empresa|comercio|tienda/i.test(l)))
  const clean = (s: string) => s.replace(/invoice|receipt|merchant|seller|vendor|ticket/i, '').trim()
  for (const cand of vendorCandidates) {
    if (cand.length >= 3 && !/total|amount|date|\d{3,}/i.test(cand)) {
      result.vendor = clean(cand)
      break
    }
  }

  const pc = text.match(/Project\s*Code[:\-]?\s*([A-Z0-9\-]{3,})/i)
  if (pc) result.project_code = pc[1]

  return result
}