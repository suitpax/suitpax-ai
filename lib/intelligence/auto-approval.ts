import { createClient } from "@/lib/supabase/server"

export interface TravelRequest {
  user_id: string
  employee_level: "standard" | "manager" | "executive" | "c_level"
  trip_purpose: "business" | "training" | "conference" | "client_meeting"
  destination: string
  departure_date: string
  return_date?: string
  flight_cost: number
  hotel_cost?: number
  cabin_class: "economy" | "premium_economy" | "business" | "first"
  advance_booking_days: number
  total_cost: number
}

export interface ApprovalResult {
  approved: boolean
  confidence: number
  reasons: string[]
  policy_violations?: string[]
  recommendations?: string[]
  requires_manual_review: boolean
  auto_approval_id?: string
}

export interface CompanyPolicy {
  id: string
  company_id: string
  max_flight_cost_by_level: Record<string, number>
  allowed_cabin_classes_by_level: Record<string, string[]>
  min_advance_booking_days: number
  max_hotel_cost_per_night: number
  restricted_destinations: string[]
  auto_approval_threshold: number
  requires_justification_above: number
}

export class AutoApprovalEngine {
  private supabase = createClient()

  async evaluateTravel(request: TravelRequest): Promise<ApprovalResult> {
    try {
      // Get company policy
      const policy = await this.getCompanyPolicy(request.user_id)
      if (!policy) {
        return this.createManualReviewResult("No company policy found")
      }

      // Run all validation checks
      const checks = await Promise.all([
        this.checkBudgetCompliance(request, policy),
        this.checkCabinClassCompliance(request, policy),
        this.checkAdvanceBookingCompliance(request, policy),
        this.checkDestinationCompliance(request, policy),
        this.checkHotelCostCompliance(request, policy),
        this.checkTripPurposeValidity(request),
        this.checkSeasonalFactors(request),
        this.checkUserHistory(request.user_id),
      ])

      const violations = checks.filter((check) => !check.compliant)
      const confidence = this.calculateConfidence(checks)

      // Auto-approve if all checks pass and confidence is high
      if (violations.length === 0 && confidence >= policy.auto_approval_threshold) {
        const approvalId = await this.logAutoApproval(request, confidence)
        return {
          approved: true,
          confidence,
          reasons: [
            "All policy requirements met",
            `Budget within ${request.employee_level} limits`,
            `${request.advance_booking_days} days advance booking`,
            "Destination approved for business travel",
          ],
          recommendations: this.generateOptimizationTips(request, policy),
          requires_manual_review: false,
          auto_approval_id: approvalId,
        }
      }

      // Require manual review if violations or low confidence
      return {
        approved: false,
        confidence,
        reasons: violations.map((v) => v.reason),
        policy_violations: violations.map((v) => v.violation),
        requires_manual_review: true,
      }
    } catch (error) {
      console.error("Auto-approval evaluation error:", error)
      return this.createManualReviewResult("System error during evaluation")
    }
  }

  private async getCompanyPolicy(userId: string): Promise<CompanyPolicy | null> {
    const { data: user } = await this.supabase.from("users").select("company_id").eq("id", userId).single()

    if (!user?.company_id) return null

    const { data: policy } = await this.supabase
      .from("travel_policies")
      .select("*")
      .eq("company_id", user.company_id)
      .eq("active", true)
      .single()

    return policy
  }

  private async checkBudgetCompliance(request: TravelRequest, policy: CompanyPolicy) {
    const maxAllowed = policy.max_flight_cost_by_level[request.employee_level] || 1000
    const compliant = request.flight_cost <= maxAllowed

    return {
      compliant,
      reason: compliant
        ? `Flight cost $${request.flight_cost} within $${maxAllowed} limit`
        : `Flight cost $${request.flight_cost} exceeds $${maxAllowed} limit`,
      violation: compliant ? null : `Budget exceeded by $${request.flight_cost - maxAllowed}`,
    }
  }

  private async checkCabinClassCompliance(request: TravelRequest, policy: CompanyPolicy) {
    const allowedClasses = policy.allowed_cabin_classes_by_level[request.employee_level] || ["economy"]
    const compliant = allowedClasses.includes(request.cabin_class)

    return {
      compliant,
      reason: compliant
        ? `${request.cabin_class} class approved for ${request.employee_level}`
        : `${request.cabin_class} class not allowed for ${request.employee_level}`,
      violation: compliant ? null : `Cabin class violation: ${request.cabin_class} not in ${allowedClasses.join(", ")}`,
    }
  }

  private async checkAdvanceBookingCompliance(request: TravelRequest, policy: CompanyPolicy) {
    const compliant = request.advance_booking_days >= policy.min_advance_booking_days

    return {
      compliant,
      reason: compliant
        ? `${request.advance_booking_days} days advance booking meets ${policy.min_advance_booking_days} day requirement`
        : `${request.advance_booking_days} days advance booking below ${policy.min_advance_booking_days} day requirement`,
      violation: compliant
        ? null
        : `Insufficient advance booking: ${request.advance_booking_days} < ${policy.min_advance_booking_days} days`,
    }
  }

  private async checkDestinationCompliance(request: TravelRequest, policy: CompanyPolicy) {
    const restricted = policy.restricted_destinations.includes(request.destination)
    const compliant = !restricted

    return {
      compliant,
      reason: compliant
        ? `${request.destination} is approved for business travel`
        : `${request.destination} is restricted for business travel`,
      violation: compliant ? null : `Restricted destination: ${request.destination}`,
    }
  }

  private async checkHotelCostCompliance(request: TravelRequest, policy: CompanyPolicy) {
    if (!request.hotel_cost) return { compliant: true, reason: "No hotel booking" }

    const compliant = request.hotel_cost <= policy.max_hotel_cost_per_night

    return {
      compliant,
      reason: compliant
        ? `Hotel cost $${request.hotel_cost}/night within $${policy.max_hotel_cost_per_night} limit`
        : `Hotel cost $${request.hotel_cost}/night exceeds $${policy.max_hotel_cost_per_night} limit`,
      violation: compliant
        ? null
        : `Hotel cost exceeded by $${request.hotel_cost - policy.max_hotel_cost_per_night}/night`,
    }
  }

  private async checkTripPurposeValidity(request: TravelRequest) {
    const validPurposes = ["business", "training", "conference", "client_meeting"]
    const compliant = validPurposes.includes(request.trip_purpose)

    return {
      compliant,
      reason: compliant
        ? `Trip purpose '${request.trip_purpose}' is valid`
        : `Trip purpose '${request.trip_purpose}' requires justification`,
      violation: compliant ? null : `Invalid trip purpose: ${request.trip_purpose}`,
    }
  }

  private async checkSeasonalFactors(request: TravelRequest) {
    // Check for peak travel seasons, holidays, major events
    const departureDate = new Date(request.departure_date)
    const month = departureDate.getMonth()

    // Simple seasonal check (can be enhanced with external APIs)
    const peakSeasons = [11, 0, 6, 7] // Dec, Jan, July, Aug
    const isPeakSeason = peakSeasons.includes(month)

    return {
      compliant: true, // Always compliant, just informational
      reason: isPeakSeason ? "Peak travel season - consider booking early" : "Standard travel season",
      violation: null,
    }
  }

  private async checkUserHistory(userId: string) {
    const { data: recentBookings } = await this.supabase
      .from("flight_bookings")
      .select("total_amount, created_at")
      .eq("user_id", userId)
      .gte("created_at", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false })

    const totalSpent = recentBookings?.reduce((sum, booking) => sum + Number(booking.total_amount), 0) || 0
    const bookingCount = recentBookings?.length || 0

    return {
      compliant: true, // Always compliant, just informational
      reason: `${bookingCount} bookings in last 90 days, $${totalSpent} total spent`,
      violation: null,
    }
  }

  private calculateConfidence(checks: any[]): number {
    const compliantChecks = checks.filter((check) => check.compliant).length
    const totalChecks = checks.length
    return Math.round((compliantChecks / totalChecks) * 100)
  }

  private generateOptimizationTips(request: TravelRequest, policy: CompanyPolicy): string[] {
    const tips = []

    if (request.advance_booking_days < 14) {
      tips.push("Consider booking 14+ days in advance for better rates")
    }

    if (request.cabin_class === "business" && request.employee_level === "standard") {
      tips.push("Economy class could save significant costs for this trip")
    }

    if (request.hotel_cost && request.hotel_cost > policy.max_hotel_cost_per_night * 0.8) {
      tips.push("Consider alternative accommodations to optimize costs")
    }

    return tips
  }

  private async logAutoApproval(request: TravelRequest, confidence: number): Promise<string> {
    const { data } = await this.supabase
      .from("auto_approvals")
      .insert({
        user_id: request.user_id,
        trip_details: request,
        confidence_score: confidence,
        approved_at: new Date().toISOString(),
        approval_reason: "Automatic approval based on policy compliance",
      })
      .select("id")
      .single()

    return data?.id || "unknown"
  }

  private createManualReviewResult(reason: string): ApprovalResult {
    return {
      approved: false,
      confidence: 0,
      reasons: [reason],
      requires_manual_review: true,
    }
  }
}
