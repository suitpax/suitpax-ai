import { type NextRequest, NextResponse } from "next/server"

// Returns a ready-made multi-speaker dialogue about Suitpax features (R=Guide, S=User)
export async function GET() {
  const dialogue = [
    { speaker: 'R', text: 'Welcome to Suitpax. I can search flights, manage policies, and analyze expenses.' },
    { speaker: 'S', text: 'Can you show me a quick flight search from MAD to LHR?' },
    { speaker: 'R', text: 'Of course. I will also summarize options and post details in chat.' },
    { speaker: 'S', text: 'And can you read my travel policy to check compliance?' },
    { speaker: 'R', text: 'Yes. I will review policy rules, highlight violations, and suggest compliant alternatives.' },
  ]
  return NextResponse.json({ dialogue })
}

export async function POST(request: NextRequest) {
  const { topic } = await request.json().catch(() => ({}))
  const base = topic || 'Suitpax features overview'
  const dialogue = [
    { speaker: 'R', text: `Let me explain: ${base}.` },
    { speaker: 'S', text: 'Sounds good. How does it work with real-time voice?' },
    { speaker: 'R', text: 'We transcribe your speech, reason with context, then synthesize a natural reply.' },
  ]
  return NextResponse.json({ dialogue })
}

