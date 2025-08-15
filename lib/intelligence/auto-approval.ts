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
      // Get company policy and employee scoring
      const [policy, employeeScore, contextualData] = await Promise.all([
        this.getCompanyPolicy(request.user_id),
        this.getEmployeeScore(request.user_id),
        this.getContextualData(request.user_id, request.departure_date),
      ])

      if (!policy) {
        return this.createManualReviewResult("No company policy found")
      }

      const checks = await Promise.all([
        this.checkBudgetCompliance(request, policy),
        this.checkCabinClassCompliance(request, policy),
        this.checkAdvanceBookingCompliance(request, policy),
        this.checkDestinationCompliance(request, policy),
        this.checkHotelCostCompliance(request, policy),
        this.checkTripPurposeValidity(request),
        this.checkSeasonalFactors(request),
        this.checkUserHistory(request.user_id),
        this.checkContextualApproval(request, contextualData),
        this.checkEmployeeScoring(request, employeeScore),
        this.checkEvolvingPolicies(request, policy),
      ])

      const violations = checks.filter((check) => !check.compliant)
      let confidence = this.calculateConfidence(checks)

      if (employeeScore.trust_level === "high") {
        confidence = Math.min(100, confidence + 15)
      } else if (employeeScore.trust_level === "low") {
        confidence = Math.max(0, confidence - 20)
      }

      if (contextualData.isVIPClient && request.trip_purpose === "client_meeting") {
        confidence = Math.min(100, confidence + 25)
      }

      // Auto-approve if all checks pass and confidence is high
      if (violations.length === 0 && confidence >= policy.auto_approval_threshold) {
        const approvalId = await this.logAutoApproval(request, confidence, employeeScore)

        await this.updateEvolvingPolicies(request, policy, true)

        return {
          approved: true,
          confidence,
          reasons: [
            "All policy requirements met",
            `Budget within ${request.employee_level} limits`,
            `${request.advance_booking_days} days advance booking`,
            "Destination approved for business travel",
            `Employee trust level: ${employeeScore.trust_level}`,
            contextualData.isVIPClient ? "VIP client meeting detected" : "",
          ].filter(Boolean),
          recommendations: this.generateOptimizationTips(request, policy),
          requires_manual_review: false,
          auto_approval_id: approvalId,
        }
      }

      await this.updateEvolvingPolicies(request, policy, false)

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

  private async getContextualData(userId: string, departureDate: string) {
    const { data: user } = await this.supabase.from("users").select("email, full_name").eq("id", userId).single()

    // Simulate calendar/email analysis (would integrate with real APIs)
    const isVIPClient = Math.random() > 0.7 // Placeholder for real VIP detection
    const hasUrgentMeeting = new Date(departureDate).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000

    return {
      isVIPClient,
      hasUrgentMeeting,
      userEmail: user?.email || "",
      userName: user?.full_name || "",
    }
  }

  private async checkContextualApproval(request: TravelRequest, contextualData: any) {
    let contextualBoost = 0
    const reasons = []

    if (contextualData.isVIPClient && request.trip_purpose === "client_meeting") {
      contextualBoost += 25
      reasons.push("VIP client meeting detected - elevated approval priority")
    }

    if (contextualData.hasUrgentMeeting && request.advance_booking_days < 7) {
      contextualBoost += 15
      reasons.push("Urgent business meeting - short notice justified")
    }

    return {
      compliant: true,
      reason: reasons.join(", ") || "Standard contextual analysis",
      violation: null,
      contextualBoost,
    }
  }

  private async getEmployeeScore(userId: string) {
    const { data: score } = await this.supabase.from("employee_scores").select("*").eq("user_id", userId).single()

    return (
      score || {
        user_id: userId,
        compliance_rate: 85,
        trust_level: "medium",
        violation_count: 0,
        total_bookings: 0,
        average_advance_booking: 14,
        spending_pattern_score: 75,
      }
    )
  }

  private async checkEmployeeScoring(request: TravelRequest, employeeScore: any) {
    const trustLevels = {
      high: { threshold: 90, boost: 20 },
      medium: { threshold: 70, boost: 0 },
      low: { threshold: 50, boost: -15 },
    }

    const level = trustLevels[employeeScore.trust_level] || trustLevels.medium
    const compliant = employeeScore.compliance_rate >= level.threshold

    return {
      compliant,
      reason: `Employee trust level: ${employeeScore.trust_level} (${employeeScore.compliance_rate}% compliance)`,
      violation: compliant ? null : `Low employee trust score: ${employeeScore.compliance_rate}%`,
      scoringBoost: level.boost,
    }
  }

  private async checkEvolvingPolicies(request: TravelRequest, policy: CompanyPolicy) {
    // Check if this type of request has been frequently approved manually
    const { data: recentApprovals } = await this.supabase
      .from("booking_approvals")
      .select("*")
      .eq("company_id", policy.company_id)
      .eq("destination", request.destination)
      .eq("cabin_class", request.cabin_class)
      .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    const approvalRate = recentApprovals?.length
      ? recentApprovals.filter((a) => a.status === "approved").length / recentApprovals.length
      : 0

    const shouldEvolve = approvalRate > 0.8 && recentApprovals.length >= 5

    return {
      compliant: true,
      reason: shouldEvolve
        ? `Policy evolution detected: ${Math.round(approvalRate * 100)}% approval rate for similar requests`
        : "Standard policy application",
      violation: null,
      shouldEvolve,
      approvalRate,
    }
  }

  private async updateEvolvingPolicies(request: TravelRequest, policy: CompanyPolicy, approved: boolean) {
    // Log the decision for policy evolution analysis
    await this.supabase.from("booking_approvals").insert({
      company_id: policy.company_id,
      user_id: request.user_id,
      destination: request.destination,
      cabin_class: request.cabin_class,
      flight_cost: request.flight_cost,
      status: approved ? "approved" : "rejected",
      approval_method: "auto",
      created_at: new Date().toISOString(),
    })

    // Check if policy should evolve based on recent patterns
    const { data: recentDecisions } = await this.supabase
      .from("booking_approvals")
      .select("*")
      .eq("company_id", policy.company_id)
      .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    if (recentDecisions && recentDecisions.length >= 20) {
      const approvalRate = recentDecisions.filter((d) => d.status === "approved").length / recentDecisions.length

      if (approvalRate > 0.9) {
        // Policy could be more lenient
        await this.suggestPolicyEvolution(policy.company_id, "more_lenient", approvalRate)
      } else if (approvalRate < 0.6) {
        // Policy could be more strict
        await this.suggestPolicyEvolution(policy.company_id, "more_strict", approvalRate)
      }
    }
  }

  private async suggestPolicyEvolution(companyId: string, direction: string, approvalRate: number) {
    await this.supabase.from("policy_evolution_suggestions").insert({
      company_id: companyId,
      suggestion_type: direction,
      current_approval_rate: approvalRate,
      suggested_at: new Date().toISOString(),
      status: "pending",
    })
  }

  private async logAutoApproval(request: TravelRequest, confidence: number, employeeScore?: any): Promise<string> {
    const { data } = await this.supabase
      .from("auto_approvals")
      .insert({
        user_id: request.user_id,
        trip_details: request,
        confidence_score: confidence,
        employee_trust_level: employeeScore?.trust_level || "unknown",
        approved_at: new Date().toISOString(),
        approval_reason: "Automatic approval with enhanced AI strategies",
      })
      .select("id")
      .single()

    if (employeeScore) {
      await this.updateEmployeeScore(request.user_id, true)
    }

    return data?.id || "unknown"
  }

  private async updateEmployeeScore(userId: string, wasCompliant: boolean) {
    const { data: currentScore } = await this.supabase
      .from("employee_scores")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (currentScore) {
      const newComplianceRate = wasCompliant
        ? Math.min(100, currentScore.compliance_rate + 1)
        : Math.max(0, currentScore.compliance_rate - 5)

      const newTrustLevel = newComplianceRate >= 90 ? "high" : newComplianceRate >= 70 ? "medium" : "low"

      await this.supabase
        .from("employee_scores")
        .update({
          compliance_rate: newComplianceRate,
          trust_level: newTrustLevel,
          total_bookings: currentScore.total_bookings + 1,
          last_updated: new Date().toISOString(),
        })
        .eq("user_id", userId)
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

  private async logAutoApproval(request: TravelRequest, confidence: number, employeeScore?: any): Promise<string> {
    const { data } = await this.supabase
      .from("auto_approvals")
      .insert({
        user_id: request.user_id,
        trip_details: request,
        confidence_score: confidence,
        employee_trust_level: employeeScore?.trust_level || "unknown",
        approved_at: new Date().toISOString(),
        approval_reason: "Automatic approval with enhanced AI strategies",
      })
      .select("id")
      .single()

    if (employeeScore) {
      await this.updateEmployeeScore(request.user_id, true)
    }

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
