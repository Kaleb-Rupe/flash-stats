import { Card, BarChart, LineChart, DonutChart } from "@tremor/react";
import { formatUSD } from "../../src/lib/utils/formatters";
import Tabs from "./Tabs";

interface ChartProps {
  pnlData: any[];
  volumeData: any[];
  marketDistribution: any[];
}

export default function TradingCharts({
  pnlData,
  volumeData,
  marketDistribution,
}: ChartProps) {
  const tabs = [
    {
      label: "PnL Chart",
      content: (
        <Card className="w-full">
          <h3 className="text-lg font-medium mb-4">Cumulative PnL</h3>
          <LineChart
            className="h-72 w-full"
            data={pnlData}
            index="date"
            categories={["Net PNL"]}
            colors={["indigo"]}
            valueFormatter={formatUSD}
            showAnimation={true}
          />
        </Card>
      ),
    },
    {
      label: "Volume Chart",
      content: (
        <Card className="w-full">
          <h3 className="text-lg font-medium mb-4">Trading Volume</h3>
          <BarChart
            className="h-72 w-full"
            data={volumeData}
            index="date"
            categories={["volume"]}
            colors={["blue"]}
            valueFormatter={formatUSD}
          />
        </Card>
      ),
    },
    {
      label: "Market Distribution",
      content: (
        <Card className="w-full">
          <h3 className="text-lg font-medium mb-4">Market Distribution</h3>
          <DonutChart
            className="h-72 w-full"
            data={marketDistribution}
            category="value"
            index="name"
            valueFormatter={formatUSD}
            colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
          />
        </Card>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} />
    </div>
  );
}
