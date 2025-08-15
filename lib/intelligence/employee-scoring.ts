import { createClient } from "@/lib/supabase/server"

export interface EmployeeScore {
  id: string
  user_id: string
  organization_id?: string
  compliance_score: number
  trust_level: "new" | "developing" | "trusted" | "expert"
  risk_category: "low" | "medium" | "high"
  total_bookings: number
  approved_bookings: number
  rejected_bookings: number
  policy_violations: number
  average_booking_amount: number
  total_spend: number
  savings_generated: number
  books_in_advance_days: number
  prefers_policy_compliant: boolean
  last_violation_date?: string
  auto_approval_limit: number
  requires_manual_review: boolean
  score_updated_at: string
  created_at: string
  updated_at: string
}

export interface BookingApproval {
  id: string
  user_id: string
  booking_id?: string
  expense_id?: string
  approval_type: "auto" | "manual" | "ai_assisted"
  status: "pending" | "approved" | "rejected" | "escalated"
  decision_reason?: string
  confidence_score?: number
  policy_checks: Record<string, any>
  violated_policies: string[]
  amount: number
  currency: string
  approved_by?: string
  ai_model_used?: string
  processing_time_ms?: number
  created_at: string
  updated_at: string
}

export class EmployeeScoringService {
  private supabase = createClient()

  async getEmployeeScore(userId: string): Promise<EmployeeScore | null> {
    const { data, error } = await this.supabase.from("employee_scores").select("*").eq("user_id", userId).single()

    if (error) {
      console.error("Error fetching employee score:", error)
      return null
    }

    return data
  }

  async calculateAutoApprovalEligibility(
    userId: string,
    bookingAmount: number,
    bookingType: string,
  ): Promise<{
    eligible: boolean
    confidence: number
    reason: string
    maxAmount: number
  }> {
    const score = await this.getEmployeeScore(userId)

    if (!score) {
      // New employee - conservative approval
      return {
        eligible: bookingAmount <= 500,
        confidence: 60,
        reason: "New employee - limited auto-approval",
        maxAmount: 500,
      }
    }

    const { compliance_score, trust_level, auto_approval_limit, requires_manual_review } = score

    // Manual review required
    if (requires_manual_review) {
      return {
        eligible: false,
        confidence: 0,
        reason: "Employee flagged for manual review",
        maxAmount: 0,
      }
    }

    // Amount exceeds personal limit
    if (bookingAmount > auto_approval_limit) {
      return {
        eligible: false,
        confidence: 0,
        reason: `Amount exceeds personal limit of ${auto_approval_limit}`,
        maxAmount: auto_approval_limit,
      }
    }

    // Calculate confidence based on trust level and compliance
    let confidence = compliance_score

    // Trust level multipliers
    const trustMultipliers = {
      expert: 1.1,
      trusted: 1.0,
      developing: 0.9,
      new: 0.8,
    }

    confidence *= trustMultipliers[trust_level]

    // Booking type adjustments
    if (bookingType === "flight" && bookingAmount > 1000) {
      confidence *= 0.9 // Slightly more conservative for expensive flights
    }

    const eligible = confidence >= 80 && bookingAmount <= auto_approval_limit

    return {
      eligible,
      confidence: Math.min(confidence, 100),
      reason: eligible
        ? `Auto-approved based on ${trust_level} trust level and ${compliance_score}% compliance`
        : `Requires manual review - confidence ${confidence.toFixed(1)}% below threshold`,
      maxAmount: auto_approval_limit,
    }
  }

  async recordBookingApproval(
    approval: Omit<BookingApproval, "id" | "created_at" | "updated_at">,
  ): Promise<BookingApproval | null> {
    const { data, error } = await this.supabase.from("booking_approvals").insert(approval).select().single()

    if (error) {
      console.error("Error recording booking approval:", error)
      return null
    }

    return data
  }

  async updateEmployeeScore(userId: string): Promise<void> {
    // This will trigger the database function to recalculate the score
    const { error } = await this.supabase.rpc("calculate_employee_score", {
      p_user_id: userId,
    })

    if (error) {
      console.error("Error updating employee score:", error)
    }
  }

  async getApprovalHistory(userId: string, limit = 50): Promise<BookingApproval[]> {
    const { data, error } = await this.supabase
      .from("booking_approvals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching approval history:", error)
      return []
    }

    return data || []
  }

  async getOrganizationScores(organizationId: string): Promise<EmployeeScore[]> {
    const { data, error } = await this.supabase
      .from("employee_scores")
      .select(`
        *,
        users!inner(full_name, email)
      `)
      .eq("organization_id", organizationId)
      .order("compliance_score", { ascending: false })

    if (error) {
      console.error("Error fetching organization scores:", error)
      return []
    }

    return data || []
  }

  async adjustAutoApprovalLimit(userId: string, newLimit: number, reason: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("employee_scores")
      .update({
        auto_approval_limit: newLimit,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)

    if (error) {
      console.error("Error adjusting auto-approval limit:", error)
      return false
    }

    // Log the change
    await this.recordBookingApproval({
      user_id: userId,
      approval_type: "manual",
      status: "approved",
      decision_reason: `Auto-approval limit adjusted to ${newLimit}: ${reason}`,
      confidence_score: 100,
      policy_checks: { limit_adjustment: true },
      violated_policies: [],
      amount: newLimit,
      currency: "USD",
    })

    return true
  }
}

export const employeeScoringService = new EmployeeScoringService()
