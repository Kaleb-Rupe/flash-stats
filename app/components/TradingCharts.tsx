import React, { useState, useMemo } from "react";
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
import { useMediaQuery } from "react-responsive";

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
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [showMovingAverage, setShowMovingAverage] = useState(false);

  // Initialize selected markets based on marketDistribution
  const initialSelectedMarkets = marketDistribution.reduce((acc, item) => {
    acc[item.name] = true; // Set all markets to true by default
    return acc;
  }, {} as { [key: string]: boolean });

  const [selectedMarkets, setSelectedMarkets] = useState(
    initialSelectedMarkets
  );

  const handleCheckboxChange = (marketName: string) => {
    setSelectedMarkets((prev: { [key: string]: boolean }) => ({
      ...prev,
      [marketName]: !prev[marketName],
    }));
  };

  // Filter market distribution based on selected markets
  const filteredMarketDistribution = useMemo(() => {
    return marketDistribution.filter(
      (item: { name: string }) => selectedMarkets[item.name]
    );
  }, [marketDistribution, selectedMarkets]);

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

  // Use useMemo to recalculate enriched PnL data only when pnlData or showMovingAverage changes
  const enrichedPnlData = useMemo(() => {
    const dataWithMovingAverage = calculateMovingAverage(pnlData);
    return dataWithMovingAverage;
  }, [pnlData, showMovingAverage]);

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
        <TabList
          className={`ml-2 border-none ${
            isMobile ? "flex justify-center" : ""
          }`}
        >
          <Tab className={`${isMobile ? "text-xs" : "text-sm"}`}>
            PnL Analysis
          </Tab>
          <Tab className={`${isMobile ? "text-xs" : "text-sm"}`}>
            Volume Analysis
          </Tab>
          <Tab className={`${isMobile ? "text-xs" : "text-sm"}`}>
            Market Distribution
          </Tab>
        </TabList>

        <TabPanels>
          {/* PnL Analysis Panel */}
          <TabPanel>
            <div className="space-y-6">
              <Card>
                <div className="flex justify-between">
                  <Title>Cumulative PnL with Moving Average</Title>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showMovingAverage}
                      onChange={() => setShowMovingAverage(!showMovingAverage)}
                      className="mr-2"
                    />
                    <label>Show Moving Average</label>
                  </div>
                </div>
                <LineChart
                  className="w-auto h-72 mt-4"
                  data={enrichedPnlData}
                  index="date"
                  categories={[
                    "Net PNL",
                    ...(showMovingAverage ? ["Moving Average"] : []),
                  ]}
                  colors={["indigo", "emerald"]}
                  valueFormatter={formatUSD}
                  yAxisWidth={110}
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
                  className="w-auto h-72 mt-4"
                  data={pnlData}
                  index="date"
                  categories={["PNL"]}
                  colors={["blue"]}
                  valueFormatter={formatUSD}
                  yAxisWidth={110}
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
                  className="w-auto h-72 mt-4"
                  data={volumeWithCumulative}
                  index="date"
                  categories={["volume"]}
                  colors={["violet"]}
                  valueFormatter={formatUSD}
                  yAxisWidth={110}
                  showAnimation
                />
              </Card>

              <Card>
                <Title>Cumulative Trading Volume</Title>
                <LineChart
                  className="w-auto h-72 mt-4"
                  data={volumeWithCumulative}
                  index="date"
                  categories={["cumulativeVolume"]}
                  colors={["rose"]}
                  valueFormatter={formatUSD}
                  yAxisWidth={110}
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
                  className="w-auto h-80 mt-4 lg:mt-12"
                  data={filteredMarketDistribution}
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
                    "emerald",
                    "sky",
                    "blue",
                    "purple",
                    "fuchsia",
                    "pink",
                    "rose",
                  ]}
                  showAnimation
                />
                <div className="space-y-4">
                  <Title>Market Breakdown</Title>
                  <div className="space-y-2">
                    {marketDistribution.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedMarkets[item.name]}
                            onChange={() => handleCheckboxChange(item.name)}
                            className="mr-2"
                          />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="font-medium text-sm">
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
