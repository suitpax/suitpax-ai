export function getPageTitle(pathname: string): { title: string; description?: string } {
  const routes: Record<string, { title: string; description?: string }> = {
    "/dashboard": { title: "Dashboard", description: "Overview and quick actions" },
    "/dashboard/flights": { title: "Flights", description: "Search and book business flights" },
    "/dashboard/hotels": { title: "Stays", description: "Search and manage hotel stays" },
    "/dashboard/expenses": { title: "Expenses", description: "Track and manage travel expenses" },
    "/dashboard/analytics": { title: "Analytics", description: "Travel insights and reports" },
    "/dashboard/cost-center": { title: "Cost Centers", description: "Budgets and spending by department" },
    "/dashboard/locations": { title: "Locations", description: "Saved places and destinations" },
    "/dashboard/team": { title: "Team", description: "Manage team members" },
    "/dashboard/mail": { title: "Mail", description: "Travel communications" },
    "/dashboard/meetings": { title: "Meetings", description: "Schedule and join meetings" },
    "/dashboard/ai-core": { title: "Suitpax AI", description: "AI-powered travel assistant" },
    "/dashboard/voice-ai": { title: "Voice AI", description: "Voice-powered assistance" },
    "/dashboard/settings": { title: "Settings", description: "Account and preferences" },
    "/dashboard/profile": { title: "Profile", description: "Personal information" },
  }

  return routes[pathname] || { title: "Dashboard", description: "Overview and quick actions" }
}