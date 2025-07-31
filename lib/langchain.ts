import { ChatAnthropic } from "@langchain/anthropic"
import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence } from "@langchain/core/runnables"

// Initialize AI models
export const anthropicModel = new ChatAnthropic({
  model: "claude-3-5-sonnet-20241022",
  temperature: 0.7,
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const openaiModel = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY,
})

// Travel Assistant Prompt Templates
export const travelAssistantPrompt = PromptTemplate.fromTemplate(`
You are Suitpax AI, an expert business travel assistant. You help users with:
- Flight bookings and recommendations
- Hotel reservations
- Expense management
- Travel policy compliance
- Itinerary planning
- Travel insights and analytics

Context from previous conversations: {memory}
Current user query: {query}
User profile: {userProfile}

Provide helpful, accurate, and actionable travel advice. Be concise but comprehensive.
If you need more information, ask specific questions.

Response:
`)

export const expenseAnalysisPrompt = PromptTemplate.fromTemplate(`
You are analyzing business travel expenses. Here's the expense data:
{expenseData}

User's travel policy: {travelPolicy}
Previous expense patterns: {memory}

Provide insights on:
1. Policy compliance
2. Cost optimization opportunities
3. Spending patterns
4. Recommendations for future travel

Analysis:
`)

export const flightRecommendationPrompt = PromptTemplate.fromTemplate(`
You are helping find the best flight options. Here are the search criteria:
- From: {origin}
- To: {destination}
- Departure: {departureDate}
- Return: {returnDate}
- Passengers: {passengers}
- Class: {travelClass}
- Budget: {budget}

User preferences from memory: {memory}
Company travel policy: {travelPolicy}

Provide flight recommendations considering:
1. Cost efficiency
2. Travel time
3. Policy compliance
4. User preferences
5. Airline reliability

Recommendations:
`)

// Create chains
export const travelAssistantChain = RunnableSequence.from([
  travelAssistantPrompt,
  anthropicModel,
  new StringOutputParser(),
])

export const expenseAnalysisChain = RunnableSequence.from([
  expenseAnalysisPrompt,
  anthropicModel,
  new StringOutputParser(),
])

export const flightRecommendationChain = RunnableSequence.from([
  flightRecommendationPrompt,
  anthropicModel,
  new StringOutputParser(),
])

// Helper functions
export async function generateTravelResponse({
  query,
  memory = "",
  userProfile = {},
}: {
  query: string
  memory?: string
  userProfile?: any
}) {
  try {
    const response = await travelAssistantChain.invoke({
      query,
      memory,
      userProfile: JSON.stringify(userProfile),
    })
    return response
  } catch (error) {
    console.error("Error generating travel response:", error)
    throw new Error("Failed to generate travel response")
  }
}

export async function analyzeExpenses({
  expenseData,
  travelPolicy = "",
  memory = "",
}: {
  expenseData: any[]
  travelPolicy?: string
  memory?: string
}) {
  try {
    const response = await expenseAnalysisChain.invoke({
      expenseData: JSON.stringify(expenseData),
      travelPolicy,
      memory,
    })
    return response
  } catch (error) {
    console.error("Error analyzing expenses:", error)
    throw new Error("Failed to analyze expenses")
  }
}

export async function recommendFlights({
  origin,
  destination,
  departureDate,
  returnDate,
  passengers = 1,
  travelClass = "economy",
  budget,
  memory = "",
  travelPolicy = "",
}: {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers?: number
  travelClass?: string
  budget?: number
  memory?: string
  travelPolicy?: string
}) {
  try {
    const response = await flightRecommendationChain.invoke({
      origin,
      destination,
      departureDate,
      returnDate: returnDate || "One way",
      passengers,
      travelClass,
      budget: budget ? `$${budget}` : "No specific budget",
      memory,
      travelPolicy,
    })
    return response
  } catch (error) {
    console.error("Error recommending flights:", error)
    throw new Error("Failed to recommend flights")
  }
}
