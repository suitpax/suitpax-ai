import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(cookies())
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, navigationOrder, reason } = await request.json()

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
    }

    switch (action) {
      case "reorder_navigation":
        if (!navigationOrder || !Array.isArray(navigationOrder)) {
          return NextResponse.json({ error: "Navigation order array is required" }, { status: 400 })
        }

        // Store the new navigation order in user preferences
        const { error: updateError } = await supabase.from("user_preferences").upsert({
          user_id: user.id,
          preference_key: "sidebar_navigation_order",
          preference_value: navigationOrder,
          updated_at: new Date().toISOString(),
        })

        if (updateError) {
          console.error("Error updating navigation order:", updateError)
          return NextResponse.json({ error: "Failed to update navigation order" }, { status: 500 })
        }

        // Log the AI action for analytics
        await supabase.from("ai_actions").insert({
          user_id: user.id,
          action_type: "sidebar_reorder",
          action_data: {
            new_order: navigationOrder,
            reason: reason || "AI-optimized navigation based on usage patterns",
          },
          created_at: new Date().toISOString(),
        })

        return NextResponse.json({
          success: true,
          message: "Navigation order updated successfully",
          navigationOrder,
        })

      case "get_navigation_order":
        const { data: preferences } = await supabase
          .from("user_preferences")
          .select("preference_value")
          .eq("user_id", user.id)
          .eq("preference_key", "sidebar_navigation_order")
          .single()

        return NextResponse.json({
          success: true,
          navigationOrder: preferences?.preference_value || null,
        })

      case "reset_navigation":
        const { error: deleteError } = await supabase
          .from("user_preferences")
          .delete()
          .eq("user_id", user.id)
          .eq("preference_key", "sidebar_navigation_order")

        if (deleteError) {
          console.error("Error resetting navigation order:", deleteError)
          return NextResponse.json({ error: "Failed to reset navigation order" }, { status: 500 })
        }

        return NextResponse.json({
          success: true,
          message: "Navigation order reset to default",
        })

      case "analyze_usage":
        // Get user's navigation usage patterns
        const { data: usageData } = await supabase
          .from("user_activity")
          .select("page_visited, visit_count, last_visited")
          .eq("user_id", user.id)
          .order("visit_count", { ascending: false })

        const recommendations = generateNavigationRecommendations(usageData || [])

        return NextResponse.json({
          success: true,
          usageData,
          recommendations,
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("AI Sidebar Management API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateNavigationRecommendations(usageData: any[]) {
  const recommendations = []

  if (usageData.length === 0) {
    return [
      {
        type: "default",
        message: "Keep the default navigation order until we gather more usage data",
        confidence: 0.5,
      },
    ]
  }

  // Sort by usage frequency
  const sortedByUsage = usageData.sort((a, b) => b.visit_count - a.visit_count)
  const topPages = sortedByUsage.slice(0, 5)

  // Generate recommendations based on usage patterns
  if (topPages.some((page) => page.page_visited.includes("flights"))) {
    recommendations.push({
      type: "move_up",
      item: "flights",
      message: "Move Flights to the top - it's your most used feature",
      confidence: 0.9,
    })
  }

  if (topPages.some((page) => page.page_visited.includes("expenses"))) {
    recommendations.push({
      type: "move_up",
      item: "expenses",
      message: "Move Expenses higher - you access it frequently",
      confidence: 0.8,
    })
  }

  // Check for unused features
  const unusedFeatures = ["policies", "team", "locations"].filter(
    (feature) => !usageData.some((page) => page.page_visited.includes(feature)),
  )

  if (unusedFeatures.length > 0) {
    recommendations.push({
      type: "move_down",
      items: unusedFeatures,
      message: `Move ${unusedFeatures.join(", ")} lower - they haven't been used recently`,
      confidence: 0.7,
    })
  }

  return recommendations
}
