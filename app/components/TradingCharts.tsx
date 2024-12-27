import React from "react";
import {
  Card,
  LineChart,
  BarChart,
  DonutChart,
  Title,
  TabGroup,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from "@tremor/react";
import { formatUSD } from "@/src/lib/utils/formatters";

interface TradingChartsProps {
  pnlData: any[];
  volumeData: any[];
  marketDistribution: any[];
}

export default function TradingCharts({
  pnlData,
  volumeData,
  marketDistribution,
}: TradingChartsProps) {
  // Helper function to calculate moving average
  const calculateMovingAverage = (data: any[], period: number = 7) => {
    return data.map((item, index) => {
      if (index < period - 1) return { ...item, "Moving Average": null };

      const sum = data
        .slice(index - period + 1, index + 1)
        .reduce((acc, curr) => acc + curr["Net PNL"], 0);

      return {
        ...item,
        "Moving Average": sum / period,
      };
    });
  };

  // Add moving average to PnL data
  const enrichedPnlData = calculateMovingAverage(pnlData);

  // Format volume data for better visualization
  const formattedVolumeData = volumeData.map((item) => ({
    ...item,
    volume: Number(item.volume),
  }));

  // Calculate cumulative volume
  let cumulativeVolume = 0;
  const volumeWithCumulative = formattedVolumeData.map((item) => ({
    ...item,
    cumulativeVolume: (cumulativeVolume += item.volume),
  }));

  return (
    <div className="space-y-6">
      <TabGroup>
        <TabList className="mt-8">
          <Tab>PnL Analysis</Tab>
          <Tab>Volume Analysis</Tab>
          <Tab>Market Distribution</Tab>
        </TabList>

        <TabPanels>
          {/* PnL Analysis Panel */}
          <TabPanel>
            <div className="space-y-6">
              <Card>
                <Title>Cumulative PnL with Moving Average</Title>
                <LineChart
                  className="h-72 mt-4"
                  data={enrichedPnlData}
                  index="date"
                  categories={["Net PNL", "Moving Average"]}
                  colors={["indigo", "emerald"]}
                  valueFormatter={formatUSD}
                  showLegend
                  showAnimation
                />
                <div className="mt-4 text-sm text-gray-500">
                  The blue line shows your cumulative PnL, while the green line
                  represents a 7-day moving average to help identify trends.
                </div>
              </Card>

              <Card>
                <Title>Daily PnL Distribution</Title>
                <BarChart
                  className="h-72 mt-4"
                  data={pnlData}
                  index="date"
                  categories={["PNL"]}
                  colors={["blue"]}
                  valueFormatter={formatUSD}
                  showAnimation
                />
              </Card>
            </div>
          </TabPanel>

          {/* Volume Analysis Panel */}
          <TabPanel>
            <div className="space-y-6">
              <Card>
                <Title>Trading Volume Over Time</Title>
                <BarChart
                  className="h-72 mt-4"
                  data={volumeWithCumulative}
                  index="date"
                  categories={["volume"]}
                  colors={["violet"]}
                  valueFormatter={formatUSD}
                  showAnimation
                />
              </Card>

              <Card>
                <Title>Cumulative Trading Volume</Title>
                <LineChart
                  className="h-72 mt-4"
                  data={volumeWithCumulative}
                  index="date"
                  categories={["cumulativeVolume"]}
                  colors={["rose"]}
                  valueFormatter={formatUSD}
                  showAnimation
                />
              </Card>
            </div>
          </TabPanel>

          {/* Market Distribution Panel */}
          <TabPanel>
            <Card>
              <Title>Trading Volume by Market</Title>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DonutChart
                  className="h-80 mt-4"
                  data={marketDistribution}
                  category="value"
                  index="name"
                  valueFormatter={formatUSD}
                  colors={[
                    "slate",
                    "violet",
                    "indigo",
                    "rose",
                    "cyan",
                    "amber",
                  ]}
                  showAnimation
                />
                <div className="space-y-4">
                  <Title>Market Breakdown</Title>
                  <div className="space-y-2">
                    {marketDistribution.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm">{item.name}</span>
                        <span className="font-medium">
                          {formatUSD(item.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
