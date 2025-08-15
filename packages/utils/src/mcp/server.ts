import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"

class SuitpaxMCPServer {
  private server: Server

  constructor() {
    this.server = new Server(
      {
        name: "suitpax-mcp-server",
        version: "2.0.0",
      },
      {
        capabilities: {
          resources: { subscribe: true, listChanged: true },
          tools: { listChanged: true },
          prompts: {},
        },
      },
    )

    this.setupHandlers()
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: "suitpax://user/profile",
            name: "User Profile",
            description: "User preferences, travel history, and business context",
            mimeType: "application/json",
            annotations: { audience: ["assistant"], priority: 0.9 },
          },
          {
            uri: "suitpax://company/policies",
            name: "Company Travel Policies",
            description: "Travel policies, approval workflows, and spending limits",
            mimeType: "application/json",
            annotations: { audience: ["assistant"], priority: 1.0 },
          },
          {
            uri: "suitpax://flights/history",
            name: "Flight Booking History",
            description: "Past flight bookings, preferences, and patterns",
            mimeType: "application/json",
            annotations: { audience: ["assistant"], priority: 0.8 },
          },
          {
            uri: "suitpax://expenses/analytics",
            name: "Expense Analytics",
            description: "Spending patterns, budget utilization, and cost optimization insights",
            mimeType: "application/json",
            annotations: { audience: ["assistant"], priority: 0.7 },
          },
          {
            uri: "suitpax://calendar/integration",
            name: "Calendar Context",
            description: "Meeting schedules, travel conflicts, and availability",
            mimeType: "application/json",
            annotations: { audience: ["assistant"], priority: 0.8 },
          },
        ],
      }
    })

    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "search_flights_intelligent",
            description:
              "Search flights with AI-powered recommendations based on user context, company policies, and travel patterns",
            inputSchema: {
              type: "object",
              properties: {
                origin: { type: "string", description: "Origin airport code or city name" },
                destination: { type: "string", description: "Destination airport code or city name" },
                departureDate: { type: "string", description: "Departure date (YYYY-MM-DD)" },
                returnDate: { type: "string", description: "Return date (YYYY-MM-DD), optional for one-way" },
                passengers: { type: "number", description: "Number of passengers", default: 1 },
                class: {
                  type: "string",
                  enum: ["economy", "premium", "business", "first"],
                  description: "Preferred class",
                },
                flexible: { type: "boolean", description: "Allow flexible dates for better prices", default: false },
              },
              required: ["origin", "destination", "departureDate"],
            },
          },
          {
            name: "analyze_travel_expenses",
            description: "Comprehensive expense analysis with cost optimization recommendations",
            inputSchema: {
              type: "object",
              properties: {
                timeframe: {
                  type: "string",
                  enum: ["week", "month", "quarter", "year"],
                  description: "Analysis period",
                },
                category: {
                  type: "string",
                  enum: ["flights", "hotels", "meals", "transport", "all"],
                  description: "Expense category",
                },
                comparison: { type: "boolean", description: "Compare with previous period", default: true },
                optimization: { type: "boolean", description: "Include cost optimization suggestions", default: true },
              },
              required: ["timeframe"],
            },
          },
          {
            name: "schedule_business_meeting",
            description: "Schedule meetings with travel context awareness and conflict detection",
            inputSchema: {
              type: "object",
              properties: {
                title: { type: "string", description: "Meeting title" },
                attendees: { type: "array", items: { type: "string" }, description: "Attendee email addresses" },
                duration: { type: "number", description: "Duration in minutes", default: 60 },
                preferredTime: { type: "string", description: "Preferred time (ISO 8601)" },
                location: { type: "string", description: "Meeting location or 'virtual'" },
                travelContext: { type: "boolean", description: "Consider travel schedules", default: true },
              },
              required: ["title", "attendees"],
            },
          },
          {
            name: "generate_travel_report",
            description: "Generate comprehensive travel reports with insights and recommendations",
            inputSchema: {
              type: "object",
              properties: {
                reportType: {
                  type: "string",
                  enum: ["expense", "itinerary", "compliance", "analytics"],
                  description: "Type of report",
                },
                period: { type: "string", description: "Reporting period (e.g., '2024-01' or 'Q1-2024')" },
                includeCharts: { type: "boolean", description: "Include visual charts", default: true },
                format: {
                  type: "string",
                  enum: ["pdf", "excel", "json"],
                  description: "Output format",
                  default: "pdf",
                },
              },
              required: ["reportType", "period"],
            },
          },
          {
            name: "check_policy_compliance",
            description: "Verify travel bookings against company policies and approval requirements",
            inputSchema: {
              type: "object",
              properties: {
                bookingType: {
                  type: "string",
                  enum: ["flight", "hotel", "car", "meal"],
                  description: "Type of booking",
                },
                amount: { type: "number", description: "Booking amount in USD" },
                destination: { type: "string", description: "Travel destination" },
                duration: { type: "number", description: "Trip duration in days" },
                businessJustification: { type: "string", description: "Business reason for travel" },
              },
              required: ["bookingType", "amount"],
            },
          },
        ],
      }
    })

    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: [
          {
            name: "travel_optimization",
            description: "Optimize travel plans for cost and efficiency",
            arguments: [
              { name: "destination", description: "Travel destination", required: true },
              { name: "budget", description: "Travel budget", required: false },
              { name: "duration", description: "Trip duration", required: false },
            ],
          },
          {
            name: "expense_analysis",
            description: "Analyze and categorize travel expenses",
            arguments: [
              { name: "period", description: "Analysis period", required: true },
              { name: "category", description: "Expense category", required: false },
            ],
          },
          {
            name: "policy_guidance",
            description: "Provide guidance on company travel policies",
            arguments: [{ name: "scenario", description: "Travel scenario", required: true }],
          },
        ],
      }
    })

    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params

      switch (name) {
        case "travel_optimization":
          return {
            description: "Optimize travel plans for cost and efficiency",
            messages: [
              {
                role: "system",
                content: {
                  type: "text",
                  text: `You are a travel optimization expert. Help optimize travel to ${args?.destination || "[destination]"} with budget ${args?.budget || "[flexible]"} for ${args?.duration || "[duration]"} days. Consider cost, time efficiency, and business requirements.`,
                },
              },
            ],
          }

        case "expense_analysis":
          return {
            description: "Analyze and categorize travel expenses",
            messages: [
              {
                role: "system",
                content: {
                  type: "text",
                  text: `Analyze travel expenses for ${args?.period || "[period]"} focusing on ${args?.category || "all categories"}. Provide insights on spending patterns, policy compliance, and cost optimization opportunities.`,
                },
              },
            ],
          }

        case "policy_guidance":
          return {
            description: "Provide guidance on company travel policies",
            messages: [
              {
                role: "system",
                content: {
                  type: "text",
                  text: `Provide clear guidance on company travel policies for this scenario: ${args?.scenario || "[scenario]"}. Include approval requirements, spending limits, and compliance considerations.`,
                },
              },
            ],
          }

        default:
          throw new Error(`Prompt not found: ${name}`)
      }
    })

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params

      switch (uri) {
        case "suitpax://user/profile":
          return {
            contents: [
              {
                uri,
                mimeType: "application/json",
                text: JSON.stringify({
                  userId: "user_123",
                  name: "Alex Johnson",
                  role: "Senior Business Development Manager",
                  department: "Sales",
                  preferences: {
                    airlines: ["United Airlines", "American Airlines", "Delta"],
                    seatPreference: "aisle",
                    mealPreference: "vegetarian",
                    hotelChain: "Marriott",
                    carRental: "Enterprise",
                  },
                  travelPatterns: {
                    frequentDestinations: ["NYC", "LAX", "LHR", "NRT"],
                    averageTripsPerMonth: 3,
                    preferredBookingWindow: 14,
                    typicalTripDuration: 3,
                  },
                  businessContext: {
                    clientRegions: ["North America", "Europe", "Asia-Pacific"],
                    meetingTypes: ["client presentations", "conferences", "team meetings"],
                    travelBudgetTier: "senior",
                  },
                }),
                annotations: { audience: ["assistant"], priority: 0.9 },
              },
            ],
          }

        case "suitpax://company/policies":
          return {
            contents: [
              {
                uri,
                mimeType: "application/json",
                text: JSON.stringify({
                  flightPolicy: {
                    domesticMaxCost: 800,
                    internationalMaxCost: 2500,
                    classRestrictions: {
                      junior: "economy",
                      senior: "premium_economy",
                      executive: "business",
                    },
                    advanceBookingRequired: 7,
                    approvalRequired: {
                      domestic: 1000,
                      international: 2000,
                    },
                  },
                  hotelPolicy: {
                    maxNightlyRate: {
                      tier1_cities: 300,
                      tier2_cities: 200,
                      other: 150,
                    },
                    preferredChains: ["Marriott", "Hilton", "Hyatt"],
                    bookingPlatform: "corporate_portal",
                  },
                  expensePolicy: {
                    mealAllowances: {
                      domestic: { breakfast: 25, lunch: 35, dinner: 65 },
                      international: { breakfast: 35, lunch: 50, dinner: 85 },
                    },
                    receiptRequired: 25,
                    approvalWorkflow: {
                      under_500: "manager",
                      "500_to_2000": "director",
                      over_2000: "vp_approval",
                    },
                  },
                }),
                annotations: { audience: ["assistant"], priority: 1.0 },
              },
            ],
          }

        case "suitpax://flights/history":
          return {
            contents: [
              {
                uri,
                mimeType: "application/json",
                text: JSON.stringify({
                  recentBookings: [
                    {
                      id: "booking_001",
                      route: "SFO-JFK",
                      date: "2024-12-15",
                      airline: "United Airlines",
                      class: "Premium Economy",
                      cost: 650,
                      purpose: "Client Meeting",
                    },
                    {
                      id: "booking_002",
                      route: "LAX-LHR",
                      date: "2024-11-28",
                      airline: "American Airlines",
                      class: "Business",
                      cost: 2200,
                      purpose: "Conference",
                    },
                  ],
                  preferences: {
                    preferredDepartureTime: "morning",
                    seatPreference: "aisle",
                    frequentFlyerPrograms: ["United MileagePlus", "AA AAdvantage"],
                    averageAdvanceBooking: 12,
                  },
                  analytics: {
                    totalFlights2024: 28,
                    totalSpent2024: 18500,
                    averageCostPerTrip: 660,
                    mostFrequentRoute: "SFO-LAX",
                  },
                }),
                annotations: { audience: ["assistant"], priority: 0.8 },
              },
            ],
          }

        default:
          throw new Error(`Resource not found: ${uri}`)
      }
    })

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params

      switch (name) {
        case "search_flights_intelligent":
          return {
            content: [
              {
                type: "text",
                text: `🔍 **Intelligent Flight Search Results**\n\n**Route:** ${args.origin} → ${args.destination}\n**Date:** ${args.departureDate}${args.returnDate ? ` (Return: ${args.returnDate})` : ""}\n**Passengers:** ${args.passengers || 1}\n\n**Recommended Options:**\n\n✈️ **Option 1: United Airlines** - $${Math.floor(Math.random() * 500 + 400)}\n- Departure: 8:30 AM\n- Duration: 5h 45m\n- Class: ${args.class || "Economy"}\n- ✅ Matches your airline preference\n- ✅ Within company policy\n\n✈️ **Option 2: American Airlines** - $${Math.floor(Math.random() * 500 + 450)}\n- Departure: 2:15 PM\n- Duration: 5h 30m\n- Class: ${args.class || "Economy"}\n- ✅ Better timing for meetings\n- ⚠️ Slightly above average cost\n\n**💡 AI Insights:**\n- Based on your travel history, morning flights work best for your schedule\n- Consider booking within 7 days for company policy compliance\n- Your frequent flyer status can upgrade Option 1 to Premium Economy`,
              },
            ],
          }

        case "analyze_travel_expenses":
          return {
            content: [
              {
                type: "text",
                text: `📊 **Travel Expense Analysis - ${args.timeframe?.toUpperCase()}**\n\n**Summary:**\n- Total Spent: $${Math.floor(Math.random() * 5000 + 2000)}\n- Trips: ${Math.floor(Math.random() * 8 + 3)}\n- Average per Trip: $${Math.floor(Math.random() * 800 + 400)}\n\n**Breakdown by Category:**\n🛫 Flights: 65% ($${Math.floor(Math.random() * 2000 + 1000)})\n🏨 Hotels: 25% ($${Math.floor(Math.random() * 800 + 400)})\n🍽️ Meals: 7% ($${Math.floor(Math.random() * 200 + 100)})\n🚗 Transport: 3% ($${Math.floor(Math.random() * 100 + 50)})\n\n**💡 Optimization Opportunities:**\n- Book flights 14+ days in advance to save ~15%\n- Use preferred hotel chains for better rates\n- Consider combining trips to reduce overall costs\n- Current spending is within policy limits ✅`,
              },
            ],
          }

        case "check_policy_compliance":
          const isCompliant = args.amount < 1000 || args.bookingType === "meal"
          return {
            content: [
              {
                type: "text",
                text: `🔍 **Policy Compliance Check**\n\n**Booking Details:**\n- Type: ${args.bookingType}\n- Amount: $${args.amount}\n- Destination: ${args.destination || "N/A"}\n\n**Compliance Status:** ${isCompliant ? "✅ COMPLIANT" : "⚠️ REQUIRES APPROVAL"}\n\n**Policy Guidelines:**\n${
                  isCompliant
                    ? "- Amount is within automatic approval limits\n- No additional approvals required\n- Proceed with booking"
                    : "- Amount exceeds automatic approval threshold\n- Manager approval required\n- Submit business justification\n- Expected approval time: 1-2 business days"
                }\n\n**Next Steps:**\n${
                  isCompliant
                    ? "✅ You can proceed with this booking immediately"
                    : "📋 Submit approval request with business justification"
                }`,
              },
            ],
          }

        default:
          throw new Error(`Tool not found: ${name}`)
      }
    })
  }

  async start() {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
  }
}

// Start the server
const server = new SuitpaxMCPServer()
server.start().catch(console.error)
