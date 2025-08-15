export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/lib/supabase/server"
import { AutoApprovalEngine, type TravelRequest } from "@/lib/intelligence/auto-approval"
import { employeeScoringService } from "@/lib/intelligence/employee-scoring"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const ENHANCED_SUITPAX_SYSTEM_PROMPT = `You are Suitpax AI, the world's most advanced business travel and enterprise productivity assistant. You are the central AI brain of Suitpax, a next-generation business travel platform that revolutionizes how companies manage travel, expenses, and productivity.

## Core Identity & Mission
You are a comprehensive multi-capability AI agent with enterprise-grade intelligence. Your mission is to deliver precise, actionable outcomes across all business travel domains: plan and optimize travel, manage expenses, ensure policy compliance, generate documents, and provide strategic intelligence for better business decisions.

## Advanced Capabilities & Tools

### 🛫 Travel Intelligence & Optimization
- **Real-time Flight Search**: Access live pricing, schedules, aircraft data, and ancillary services via Duffel API
- **Smart Booking Orchestration**: Handle one-way, round-trip, multi-city itineraries for individuals and teams
- **Corporate Policy Alignment**: Ensure compliance with budgets, travel classes, advance purchase rules, and change policies
- **Cost Optimization**: Analyze cost/time trade-offs, suggest alternatives (nearby airports, flexible dates, cabin upgrades)
- **Loyalty Program Integration**: Optimize frequent flyer programs, seat preferences, and meal selections
- **Risk Management**: Provide destination intelligence (visa requirements, travel advisories, airport disruptions, strikes)

### 💼 Business Operations & Automation
- **Expense Management**: Automated expense reporting, receipt processing, policy compliance checking
- **Document Generation**: Create professional reports, invoices, itineraries, contracts, and presentations
- **Meeting Coordination**: Schedule international meetings, coordinate time zones, book conference facilities
- **Team Travel Management**: Organize group travel, manage approvals, coordinate logistics
- **VIP Services**: Arrange premium services, airport lounges, ground transportation, concierge services

### 🔧 Technical & Integration Capabilities
- **Full-stack Development**: Generate production-ready code (React/Next.js, TypeScript, APIs, databases)
- **API Integrations**: Connect with travel providers, expense systems, calendar applications
- **Data Analytics**: Process travel data, generate insights, create performance dashboards
- **Workflow Automation**: Build custom business processes, approval workflows, notification systems

### 🌐 Real-time Intelligence
- **Live Data Integration**: Access real-time flight status, weather, exchange rates, travel alerts
- **News & Disruptions**: Monitor travel disruptions, strikes, political events affecting business travel
- **Market Intelligence**: Track pricing trends, seasonal patterns, corporate discount opportunities

## Communication Excellence
- **Language Detection**: Automatically detect user language and respond accordingly (default Spanish if unclear)
- **Professional Tone**: Clear, concise, and pragmatic communication style
- **Structured Outputs**: Use headers, bullets, tables for maximum scannability
- **No Emojis**: Maintain professional business communication standards
- **Executive Summaries**: Provide brief summaries followed by detailed structured information

## Travel Response Protocol (Critical)
When handling travel queries:
1. **Extract Intent**: Identify origin, destination, dates, passengers, cabin preferences, constraints
2. **Validate Parameters**: Request missing information succinctly if needed
3. **Real-time Search**: Use Duffel API for accurate, live market data
4. **Present Results**: Display airline logos, routes, prices, times, stops, and key conditions
5. **Add Value**: Suggest alternatives and optimization tips (nearby airports, flexible dates)
6. **Structured Output**: Always append JSON block for UI rendering:

:::flight_offers_json
{"offers": [{"id":"...","price":"...","airline":"...","airline_iata":"...","logo":"...","depart":"ISO","arrive":"ISO","origin":"IATA","destination":"IATA","stops":0}]}
:::

## Quality Assurance Standards
- **Accuracy First**: No fabrications. Admit uncertainty and provide next steps
- **Security & Privacy**: Handle data responsibly, never expose sensitive information
- **Enterprise Compliance**: Follow corporate travel policies and regulatory requirements
- **Performance Optimization**: Provide fast, efficient responses with minimal latency
- **Continuous Learning**: Adapt to user preferences and company-specific requirements

## Advanced Prompt Capabilities
You have access to specialized prompt libraries for:
- **Business Travel Optimization**: Route planning, cost analysis, policy compliance
- **Expense Management**: Automated categorization, receipt processing, audit trails
- **Productivity Enhancement**: Task automation, meeting coordination, document generation
- **Risk Assessment**: Travel safety, insurance recommendations, contingency planning
- **Executive Support**: VIP services, luxury accommodations, premium experiences

You are the ultimate business travel companion, combining the precision of enterprise software with the intelligence of advanced AI to deliver exceptional travel experiences while optimizing costs and ensuring compliance.`

const tools: Anthropic.Tool[] = [
  {
    name: "search_flights",
    description: "Searches for real-time flight offers with advanced filtering and optimization options.",
    input_schema: {
      type: "object",
      properties: {
        origin: { type: "string", description: "Origin airport IATA code (e.g., 'JFK', 'LHR')" },
        destination: { type: "string", description: "Destination airport IATA code" },
        departure_date: { type: "string", description: "Departure date in YYYY-MM-DD format" },
        return_date: { type: "string", description: "Return date in YYYY-MM-DD format (optional for one-way)" },
        passengers: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["adult", "child", "infant"] },
              age: { type: "number", description: "Age for child/infant passengers" },
            },
          },
          description: "Passenger details array",
        },
        cabin_class: {
          type: "string",
          enum: ["economy", "premium_economy", "business", "first"],
          description: "Preferred cabin class",
        },
        max_stops: { type: "number", description: "Maximum number of stops (0 for direct flights)" },
        airlines: { type: "array", items: { type: "string" }, description: "Preferred airline IATA codes" },
        max_price: { type: "number", description: "Maximum price filter" },
      },
      required: ["origin", "destination", "departure_date", "passengers"],
    },
  },
  {
    name: "search_hotels",
    description: "Searches for hotel accommodations with business traveler preferences.",
    input_schema: {
      type: "object",
      properties: {
        location: { type: "string", description: "City or specific location for hotel search" },
        check_in: { type: "string", description: "Check-in date in YYYY-MM-DD format" },
        check_out: { type: "string", description: "Check-out date in YYYY-MM-DD format" },
        guests: { type: "number", description: "Number of guests" },
        rooms: { type: "number", description: "Number of rooms needed" },
        star_rating: { type: "number", description: "Minimum star rating (1-5)" },
        amenities: {
          type: "array",
          items: { type: "string" },
          description: "Required amenities (wifi, gym, business_center, etc.)",
        },
      },
      required: ["location", "check_in", "check_out", "guests"],
    },
  },
  {
    name: "check_travel_policy",
    description: "Validates travel bookings against corporate travel policies.",
    input_schema: {
      type: "object",
      properties: {
        booking_details: { type: "object", description: "Flight or hotel booking details to validate" },
        employee_level: {
          type: "string",
          enum: ["standard", "manager", "executive", "c_level"],
          description: "Employee level for policy rules",
        },
        trip_purpose: {
          type: "string",
          enum: ["business", "training", "conference", "client_meeting"],
          description: "Purpose of travel",
        },
      },
      required: ["booking_details"],
    },
  },
  {
    name: "evaluate_auto_approval",
    description: "Evaluates a travel request for automatic approval based on company policies and AI intelligence.",
    input_schema: {
      type: "object",
      properties: {
        user_id: { type: "string", description: "User ID making the travel request" },
        employee_level: {
          type: "string",
          enum: ["standard", "manager", "executive", "c_level"],
          description: "Employee level for policy rules",
        },
        trip_purpose: {
          type: "string",
          enum: ["business", "training", "conference", "client_meeting"],
          description: "Purpose of travel",
        },
        destination: { type: "string", description: "Travel destination" },
        departure_date: { type: "string", description: "Departure date in YYYY-MM-DD format" },
        return_date: { type: "string", description: "Return date in YYYY-MM-DD format (optional)" },
        flight_cost: { type: "number", description: "Total flight cost" },
        hotel_cost: { type: "number", description: "Hotel cost per night (optional)" },
        cabin_class: {
          type: "string",
          enum: ["economy", "premium_economy", "business", "first"],
          description: "Flight cabin class",
        },
      },
      required: [
        "user_id",
        "employee_level",
        "trip_purpose",
        "destination",
        "departure_date",
        "flight_cost",
        "cabin_class",
      ],
    },
  },
]

function buildAirlineLogoUrl(iata?: string | null): string | null {
  if (!iata) return null
  return `https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${iata}.svg`
}

function normalizeFlightOffers(raw: any[]): Array<{
  id: string
  price: string
  airline?: string
  airline_iata?: string
  logo?: string | null
  depart?: string
  arrive?: string
  origin?: string
  destination?: string
  stops?: number
}> {
  try {
    return raw.slice(0, 8).map((o: any) => {
      const firstSlice = o?.slices?.[0]
      const lastSlice = o?.slices?.[o?.slices?.length - 1]
      const firstSeg = firstSlice?.segments?.[0]
      const lastSeg = lastSlice?.segments?.[lastSlice?.segments?.length - 1]

      const carrier = firstSeg?.marketing_carrier || firstSeg?.operating_carrier || {}
      const airlineName = carrier?.name || undefined
      const airlineIata = carrier?.iata_code || carrier?.iata || undefined

      const originIata =
        firstSeg?.origin?.iata_code || firstSlice?.origin?.iata_code || firstSeg?.origin?.iata || undefined
      const destinationIata =
        lastSeg?.destination?.iata_code || lastSlice?.destination?.iata_code || lastSeg?.destination?.iata || undefined

      const segmentsCount = firstSlice?.segments?.length || 1
      const stops = Math.max(0, segmentsCount - 1)

      return {
        id: o?.id,
        price: `${o?.total_amount || o?.total_amount?.toString() || ""} ${o?.total_currency || ""}`.trim(),
        airline: airlineName,
        airline_iata: airlineIata,
        logo: buildAirlineLogoUrl(airlineIata || null),
        depart: firstSeg?.departing_at || firstSlice?.departing_at,
        arrive: lastSeg?.arriving_at || lastSlice?.arriving_at,
        origin: originIata,
        destination: destinationIata,
        stops,
      }
    })
  } catch {
    return []
  }
}

async function flightSearchTool(
  origin: string,
  destination: string,
  departure_date: string,
  return_date?: string,
  passengers?: any[],
  cabin_class = "economy",
  max_stops?: number,
  airlines?: string[],
  max_price?: number,
) {
  try {
    const { Duffel } = await import("@duffel/api")
    const duffel = new Duffel({ token: process.env.DUFFEL_API_KEY! })

    const slices = [{ origin, destination, departure_date }]
    if (return_date) {
      slices.push({ origin: destination, destination: origin, departure_date: return_date })
    }

    const searchParams: any = {
      slices,
      passengers: passengers || [{ type: "adult" }],
      cabin_class,
    }

    // Add advanced filters
    if (max_stops !== undefined) {
      searchParams.max_connections = max_stops
    }

    const offerRequest = await duffel.offerRequests.create(searchParams)
    const offers = await duffel.offers.list({ offer_request_id: offerRequest.id })

    // Apply additional filters
    if (airlines && airlines.length > 0) {
      offers.data = offers.data.filter((offer) =>
        offer.slices.some((slice) =>
          slice.segments.some((segment) => airlines.includes(segment.marketing_carrier.iata_code)),
        ),
      )
    }

    if (max_price) {
      offers.data = offers.data.filter((offer) => Number.parseFloat(offer.total_amount) <= max_price)
    }

    return offers.data.slice(0, 8) // Return more options for business travelers
  } catch (error) {
    console.error("Duffel API Error:", error)
    return { error: "Failed to retrieve flight information. Please check your search parameters and try again." }
  }
}

async function hotelSearchTool(
  location: string,
  check_in: string,
  check_out: string,
  guests = 1,
  rooms = 1,
  star_rating?: number,
  amenities?: string[],
) {
  try {
    // This would integrate with a hotel API like Duffel Stays
    // For now, return a structured response indicating the search parameters
    return {
      location,
      check_in,
      check_out,
      guests,
      rooms,
      star_rating,
      amenities,
      message: "Hotel search functionality will be integrated with Duffel Stays API",
    }
  } catch (error) {
    console.error("Hotel Search Error:", error)
    return { error: "Failed to search for hotels. Please try again." }
  }
}

async function checkTravelPolicyTool(booking_details: any, employee_level = "standard", trip_purpose = "business") {
  try {
    // This would integrate with corporate travel policy systems
    const policy_rules = {
      standard: { max_flight_cost: 1500, cabin_class: "economy", advance_booking_days: 7 },
      manager: { max_flight_cost: 2500, cabin_class: "premium_economy", advance_booking_days: 3 },
      executive: { max_flight_cost: 5000, cabin_class: "business", advance_booking_days: 1 },
      c_level: { max_flight_cost: 10000, cabin_class: "first", advance_booking_days: 0 },
    }

    const rules = policy_rules[employee_level as keyof typeof policy_rules] || policy_rules.standard

    return {
      compliant: true,
      rules_applied: rules,
      employee_level,
      trip_purpose,
      recommendations: [
        "Booking complies with corporate travel policy",
        "Consider booking in advance for better rates",
        "Ensure all receipts are submitted within 30 days",
      ],
    }
  } catch (error) {
    console.error("Policy Check Error:", error)
    return { error: "Failed to validate travel policy compliance." }
  }
}

async function evaluateAutoApprovalTool(input: any) {
  try {
    const autoApproval = new AutoApprovalEngine()

    const departureDate = new Date(input.departure_date)
    const today = new Date()
    const advanceBookingDays = Math.ceil((departureDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    // Get employee scoring data
    const employeeScore = await employeeScoringService.getEmployeeScore(input.user_id)
    const approvalEligibility = await employeeScoringService.calculateAutoApprovalEligibility(
      input.user_id,
      input.flight_cost,
      "flight",
    )

    const travelRequest: TravelRequest = {
      user_id: input.user_id,
      employee_level: input.employee_level,
      trip_purpose: input.trip_purpose,
      destination: input.destination,
      departure_date: input.departure_date,
      return_date: input.return_date,
      flight_cost: input.flight_cost,
      hotel_cost: input.hotel_cost,
      cabin_class: input.cabin_class,
      advance_booking_days: advanceBookingDays,
      total_cost: input.flight_cost + (input.hotel_cost || 0),
    }

    const result = await autoApproval.evaluateTravel(travelRequest)

    // Enhanced result with employee scoring
    const enhancedResult = {
      ...result,
      employee_scoring: {
        trust_level: employeeScore?.trust_level || "new",
        compliance_score: employeeScore?.compliance_score || 85,
        auto_approval_eligible: approvalEligibility.eligible,
        confidence: approvalEligibility.confidence,
        max_auto_amount: approvalEligibility.maxAmount,
        scoring_reason: approvalEligibility.reason,
      },
    }

    // Record the approval decision
    await employeeScoringService.recordBookingApproval({
      user_id: input.user_id,
      approval_type: result.auto_approved ? "auto" : "manual",
      status: result.auto_approved ? "approved" : "pending",
      decision_reason: result.reason,
      confidence_score: result.confidence_score,
      policy_checks: result.policy_compliance || {},
      violated_policies: result.violations || [],
      amount: input.flight_cost,
      currency: "USD",
      ai_model_used: "claude-3-5-sonnet-20241022",
    })

    return enhancedResult
  } catch (error) {
    console.error("Auto-approval evaluation error:", error)
    return { error: "Failed to evaluate travel request for auto-approval" }
  }
}

export async function POST(request: NextRequest) {
  const { message, history = [], includeReasoning = false, userId } = await request.json()

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 })
  }

  const conversationHistory = history.map((msg: any) => ({
    role: msg.role,
    content: msg.content,
  }))

  let userContext = ""
  if (userId) {
    try {
      const supabase = createClient()
      const { data: profile } = await supabase
        .from("profiles")
        .select("company, job_title, travel_preferences")
        .eq("id", userId)
        .single()

      if (profile) {
        userContext = `\nUser Context: ${profile.company ? `Company: ${profile.company}. ` : ""}${profile.job_title ? `Role: ${profile.job_title}. ` : ""}${profile.travel_preferences ? `Preferences: ${profile.travel_preferences}` : ""}`
      }
    } catch (error) {
      console.log("Could not fetch user context:", error)
    }
  }

  const systemPrompt = `${ENHANCED_SUITPAX_SYSTEM_PROMPT}${userContext}

## Formatting & Travel Output Rules
- Detect the user's language and respond accordingly (default to Spanish if unclear).
- Use clean Markdown formatting. No emojis.
- When providing flight results, present a brief summary followed by structured data.
- ALWAYS append flight offers using this exact format for UI rendering:

:::flight_offers_json
{"offers": [{"id":"...","price":"...","airline":"...","airline_iata":"...","logo":"...","depart":"ISO","arrive":"ISO","origin":"IATA","destination":"IATA","stops":0}]}
:::

- Include up to 8 best options with accurate real-time data.
- Provide actionable recommendations and alternatives.`

  try {
    const initialResponse = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022", // Updated to latest model
      max_tokens: 4096,
      system: systemPrompt,
      messages: [...conversationHistory, { role: "user", content: message }],
      tools: tools,
      tool_choice: { type: "auto" },
    })

    const stopReason = (initialResponse as any).stop_reason
    const toolUseContent = (initialResponse as any).content.find((c: any) => c.type === "tool_use")

    let reasoningText: string | undefined

    if (stopReason === "tool_use" && toolUseContent) {
      const { name, input } = toolUseContent
      let toolResult: any

      switch (name) {
        case "search_flights":
          const {
            origin,
            destination,
            departure_date,
            return_date,
            passengers,
            cabin_class,
            max_stops,
            airlines,
            max_price,
          } = input as any
          toolResult = await flightSearchTool(
            origin,
            destination,
            departure_date,
            return_date,
            passengers,
            cabin_class,
            max_stops,
            airlines,
            max_price,
          )
          break
        case "search_hotels":
          const { location, check_in, check_out, guests, rooms, star_rating, amenities } = input as any
          toolResult = await hotelSearchTool(location, check_in, check_out, guests, rooms, star_rating, amenities)
          break
        case "check_travel_policy":
          const { booking_details, employee_level, trip_purpose } = input as any
          toolResult = await checkTravelPolicyTool(booking_details, employee_level, trip_purpose)
          break
        case "evaluate_auto_approval":
          toolResult = await evaluateAutoApprovalTool(input)
          break
        default:
          toolResult = { error: "Unknown tool requested" }
      }

      const finalResponse = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          ...conversationHistory,
          { role: "user", content: message },
          {
            role: "assistant",
            content: [
              { type: "tool_use", id: toolUseContent.id, name: toolUseContent.name, input: toolUseContent.input },
            ],
          },
          {
            role: "user",
            content: [{ type: "tool_result", tool_use_id: toolUseContent.id, content: JSON.stringify(toolResult) }],
          },
        ],
      })

      const text = (finalResponse as any).content?.find((c: any) => c.type === "text")?.text || ""

      if (name === "search_flights" && Array.isArray(toolResult)) {
        const normalized = normalizeFlightOffers(toolResult)
        const offersBlock = `:::flight_offers_json\n${JSON.stringify({ offers: normalized }, null, 2)}\n:::`

        if (includeReasoning) {
          try {
            const r = await anthropic.messages.create({
              model: "claude-3-haiku-20240307",
              max_tokens: 512,
              system:
                "You are Suitpax AI. Provide a brief high-level rationale (3–5 bullets) in Spanish for business travel optimization.",
              messages: [{ role: "user", content: `Explica el razonamiento para esta búsqueda de vuelos: ${message}` }],
            })
            reasoningText = (r as any).content?.find((c: any) => c.type === "text")?.text || undefined
          } catch {}
        }

        return NextResponse.json({ response: `${text}\n\n${offersBlock}`, reasoning: reasoningText })
      }

      return NextResponse.json({ response: text, reasoning: reasoningText })
    }

    const textResponse =
      (initialResponse as any).content?.find((c: any) => c.type === "text")?.text ||
      "I'm sorry, I couldn't process that request. Please try rephrasing your question."

    if (includeReasoning) {
      try {
        const r = await anthropic.messages.create({
          model: "claude-3-haiku-20240307",
          max_tokens: 512,
          system:
            "You are Suitpax AI. Provide a brief high-level rationale (3–5 bullets) in Spanish for business travel assistance.",
          messages: [{ role: "user", content: `Explica el razonamiento para responder: ${message}` }],
        })
        reasoningText = (r as any).content?.find((c: any) => c.type === "text")?.text || undefined
      } catch {}
    }

    return NextResponse.json({ response: textResponse, reasoning: reasoningText })
  } catch (error) {
    console.error("AI Chat API Error:", error)
    return NextResponse.json(
      {
        error: "I'm experiencing technical difficulties. Please try again in a moment.",
      },
      { status: 500 },
    )
  }
}
