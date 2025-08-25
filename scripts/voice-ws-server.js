// Basic WebSocket server for live voice mode (STT streaming)
// Requires GOOGLE_APPLICATION_CREDENTIALS to be set.

const WebSocket = require('ws')
const speech = require('@google-cloud/speech').v1p1beta1

const PORT = process.env.VOICE_WS_PORT ? parseInt(process.env.VOICE_WS_PORT, 10) : 8081

const server = new WebSocket.Server({ port: PORT })
console.log(`[voice-ws] WebSocket server listening on :${PORT}`)

server.on('connection', (ws) => {
  console.log('[voice-ws] client connected')

  const client = new speech.SpeechClient()
  let languageCode = 'en-US'
  let recognizeStream = null

  function startStream() {
    const request = {
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode,
        enableAutomaticPunctuation: true,
        enableWordTimeOffsets: false,
        model: 'latest_long',
        interimResults: true,
      },
      interimResults: true,
      singleUtterance: false,
    }
    recognizeStream = client
      .streamingRecognize(request)
      .on('error', (err) => {
        console.error('[voice-ws] stt error', err.message)
        safeSend({ type: 'error', error: 'stt_error', message: err.message })
      })
      .on('data', (data) => {
        try {
          const result = data.results?.[0]
          const alt = result?.alternatives?.[0]
          if (!alt) return
          safeSend({ type: 'transcript', text: alt.transcript || '', final: Boolean(result?.isFinal) })
        } catch (e) {}
      })
  }

  function safeSend(obj) { try { ws.send(JSON.stringify(obj)) } catch {} }

  startStream()

  ws.on('message', (msg) => {
    // Control messages are JSON text, audio chunks are binary
    if (typeof msg === 'string') {
      try {
        const payload = JSON.parse(msg)
        if (payload?.type === 'set_language' && typeof payload?.code === 'string') {
          languageCode = payload.code
          if (recognizeStream) try { recognizeStream.end() } catch {}
          startStream()
          safeSend({ type: 'language_set', code: languageCode })
        } else if (payload?.type === 'reset') {
          if (recognizeStream) try { recognizeStream.end() } catch {}
          startStream()
        }
      } catch {
        // ignore
      }
      return
    }
    // Binary audio chunk (PCM16 16kHz)
    if (recognizeStream) {
      try {
        recognizeStream.write({ audio_content: msg })
      } catch (e) {
        console.error('[voice-ws] write error', e?.message)
      }
    }
  })

  ws.on('close', () => {
    try { recognizeStream?.end() } catch {}
    console.log('[voice-ws] client disconnected')
  })
})

process.on('SIGINT', () => { console.log('shutting down'); process.exit(0) })

