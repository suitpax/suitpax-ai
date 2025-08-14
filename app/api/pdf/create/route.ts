export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { generatePDF } from "@/lib/pdf-generator"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { content, reasoning, filename } = await req.json()
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ success: false, error: 'content string required' }, { status: 400 })
    }

    const pdf = await generatePDF(content, reasoning)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || 'anonymous'

    // Ensure bucket exists
    // @ts-ignore
    await supabase.storage.createBucket('pdfs', { public: true }).catch(() => {})

    const key = `${userId}/${Date.now()}-${(filename || 'suitpax').replace(/[^a-z0-9-_]/gi, '_')}.pdf`
    const upload = await supabase.storage.from('pdfs').upload(key, pdf, {
      contentType: 'application/pdf',
      upsert: true,
    })

    if (upload.error) {
      return NextResponse.json({ success: false, error: upload.error.message }, { status: 500 })
    }

    const url = supabase.storage.from('pdfs').getPublicUrl(key).data.publicUrl

    return NextResponse.json({ success: true, url, key })
  } catch (e: any) {
    console.error('pdf create error', e)
    return NextResponse.json({ success: false, error: 'Failed to create PDF' }, { status: 500 })
  }
}
