import { Card, BarChart } from "@tremor/react";
import { formatUSD } from "@/src/lib/utils/formatters";
import { calculatePnLMetrics } from "@/src/lib/utils/pnlAnalytics";

interface PnLBreakdownProps {
  metrics: ReturnType<typeof calculatePnLMetrics>;
}

export default function PnLBreakdown({ metrics }: PnLBreakdownProps) {
  // Transform data for charts
  const marketData = Object.entries(metrics.byMarket).map(([name, value]) => ({
    name,
    PnL: value,
  }));

  const timeData = Object.entries(metrics.byTimeOfDay).map(([hour, value]) => ({
    hour: `${hour}:00`,
    PnL: value,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">PnL Breakdown</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-lg font-medium mb-4">PnL by Market</h3>
          <BarChart
            className="h-72"
            data={marketData}
            index="name"
            categories={["PnL"]}
            colors={["indigo"]}
            valueFormatter={formatUSD}
            yAxisWidth={100}
          />
        </Card>

        <Card>
          <h3 className="text-lg font-medium mb-4">PnL by Time of Day</h3>
          <BarChart
            className="h-72"
            data={timeData}
            index="hour"
            categories={["PnL"]}
            colors={["violet"]}
            valueFormatter={formatUSD}
            yAxisWidth={100}
          />
        </Card>
      </div>
    </div>
  );
}
