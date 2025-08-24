import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { z } from "zod"

const PolicyDataSchema = z.object({
  companyName: z.string().optional(),
  employeeCount: z.number().optional(),
  industry: z.string().optional(),
  budget: z.number().optional(),
  travelFrequency: z.enum(["low", "medium", "high"]).optional(),
  regions: z.array(z.string()).optional(),
  policies: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    const { object } = await generateObject({
      model: anthropic("claude-sonnet-4-20250514"),
      schema: PolicyDataSchema,
      prompt: `
        Analyze the following document text and extract structured data about the company's travel policies and requirements:

        Text: ${text}

        Extract:
        - Company name
        - Number of employees (if mentioned)
        - Industry sector
        - Travel budget (if mentioned)
        - Travel frequency (low/medium/high based on context)
        - Regions they operate in
        - Existing policies mentioned

        Return structured data that can be used to recommend appropriate travel policies.
      `,
    })

    return NextResponse.json(object)
  } catch (error) {
    console.error("Policy data extraction error:", error)
    return NextResponse.json({ error: "Failed to extract policy data" }, { status: 500 })
  }
}
