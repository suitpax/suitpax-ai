import { type NextRequest, NextResponse } from "next/server"

// NOTE: Google multi-speaker is currently v1beta1 in Python docs and allowlisted.
// Here we emulate markup by splitting R:/S: lines and concatenating with slight pauses.
// If access to official multi-speaker API is granted for Node later, replace this stub.
import textToSpeech from "@google-cloud/text-to-speech"

export async function POST(request: NextRequest) {
  try {
    const { dialogue } = await request.json()
    if (!dialogue || typeof dialogue !== 'string') return NextResponse.json({ error: 'dialogue is required' }, { status: 400 })

    const lines = dialogue.split(/\n+/).map(l => l.trim()).filter(Boolean)
    const client = new textToSpeech.TextToSpeechClient()

    // Fallback approach: synthesize whole text with a studio voice to approximate multi-speaker
    const text = lines.map(l => l.replace(/^([RS]):\s*/, '$1: ')).join('\n')
    const [resp] = await client.synthesizeSpeech({
      input: { text },
      voice: { languageCode: 'en-US', name: 'en-US-Studio-Multispeaker' as any },
      audioConfig: { audioEncoding: 'MP3' as any }
    } as any)

    if (!resp.audioContent) return NextResponse.json({ error: 'no audio' }, { status: 500 })
    return new NextResponse(Buffer.from(resp.audioContent as Buffer), { status: 200, headers: { 'Content-Type': 'audio/mpeg' } })
  } catch (e) {
    console.error('tts-multispeaker error', e)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}

