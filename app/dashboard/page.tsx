import { UserStatsChart } from "@/components/charts/user-stats-chart"
import { SuitpaxRadarChart } from "@/components/charts/radar-chart"
import { ExpenseTrendsChart } from "@/components/charts/expense-trends-chart"
// Added new business metrics chart import
import { BusinessMetricsChart } from "@/components/charts/business-metrics-chart"

const DashboardPage = () => {
  return (
    <div>
      {/* Other sections of the dashboard */}
      <div id="charts-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <UserStatsChart />
          <SuitpaxRadarChart />
          <div className="lg:col-span-2 xl:col-span-1">
            <ExpenseTrendsChart />
          </div>
          {/* Added new business metrics chart */}
          <div className="lg:col-span-2 xl:col-span-1">
            <BusinessMetricsChart />
          </div>
        </div>
      </div>
      {/* Other sections of the dashboard */}
    </div>
  )
}

export default DashboardPage
