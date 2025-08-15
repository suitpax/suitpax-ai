export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generatePDF } from "@/lib/pdf-generator"

export async function POST() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    // Fetch expenses
    const { data: expenses } = await supabase
      .from('expenses')
      .select('amount, currency, status, expense_date, project_code, title, category')
      .eq('user_id', user.id)

    const total = (expenses || []).reduce((s: number, e: any) => s + Number(e.amount || 0), 0)
    const byCat: Record<string, number> = {}
    for (const e of expenses || []) {
      const k = e.category || 'Other'
      byCat[k] = (byCat[k] || 0) + Number(e.amount || 0)
    }

    const lines = [
      `# Finance Report`,
      `Total: $${total.toLocaleString()}`,
      `\n## By Category`,
      ...Object.entries(byCat).map(([k, v]) => `- ${k}: $${v.toLocaleString()}`),
    ].join('\n')

    const pdf = await generatePDF(lines)

    // Ensure bucket
    // @ts-ignore
    await supabase.storage.createBucket('pdfs', { public: true }).catch(() => {})

    const key = `${user.id}/${Date.now()}-finance-report.pdf`
    const upload = await supabase.storage.from('pdfs').upload(key, pdf, { contentType: 'application/pdf', upsert: true })
    if (upload.error) throw upload.error
    const url = supabase.storage.from('pdfs').getPublicUrl(key).data.publicUrl
    return NextResponse.json({ success: true, url })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Failed to generate report' }, { status: 500 })
  }
}
