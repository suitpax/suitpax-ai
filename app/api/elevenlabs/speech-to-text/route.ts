import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // For demo purposes, return a simulated transcript
    // In production, you would use a real speech-to-text service
    const simulatedTranscripts = [
      "I need to book a flight to New York for next week",
      "Can you help me find a hotel in London?",
      "What are the travel policies for my company?",
      "I need to change my flight booking",
      "Can you recommend restaurants near my hotel?",
      "What's the weather like in Tokyo this week?",
      "I need to book a car rental for my business trip",
      "Can you help me with expense reporting?",
    ]

    const randomTranscript = simulatedTranscripts[Math.floor(Math.random() * simulatedTranscripts.length)]

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      transcript: randomTranscript,
      confidence: 0.95,
    })
  } catch (error) {
    console.error("Speech-to-text error:", error)
    return NextResponse.json({ error: "Failed to process audio" }, { status: 500 })
  }
}
