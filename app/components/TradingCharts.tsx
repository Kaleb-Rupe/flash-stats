import React, { useState, useMemo, lazy, Suspense } from "react";
import {
  Card,
  Title,
  TabGroup,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from "@tremor/react";
import { formatUSD } from "@/src/lib/utils/formatters";
import { useMediaQuery } from "react-responsive";

// Define proper types for the data
interface ChartDataPoint {
  date: string;
  "Net PNL"?: number;
  PNL?: number;
  volume?: number;
  cumulativeVolume?: number;
}

interface MarketDistributionPoint {
  name: string;
  value: number;
}

interface TradingChartsProps {
  pnlData: ChartDataPoint[];
  volumeData: ChartDataPoint[];
  marketDistribution: MarketDistributionPoint[];
}

interface ChartProps {
  data: ChartDataPoint[];
  index: string;
  categories: string[];
  colors: string[];
  valueFormatter: (value: number) => string;
  yAxisWidth: number;
  className?: string;
  showLegend?: boolean;
}

// Lazy load chart components with proper types
const LineChart = lazy(() =>
  import("@tremor/react").then((mod) => ({ default: mod.LineChart }))
);
const BarChart = lazy(() =>
  import("@tremor/react").then((mod) => ({ default: mod.BarChart }))
);
const DonutChart = lazy(() =>
  import("@tremor/react").then((mod) => ({ default: mod.DonutChart }))
);

const ChartLoader = () => (
  <div className="w-full h-72 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
  </div>
);

// Memoized chart components with proper types
const MemoizedBarChart = React.memo(function MemoizedBarChart({
  data,
  categories,
  index,
  colors,
  valueFormatter,
  yAxisWidth,
  className,
  showLegend = true,
}: ChartProps) {
  return (
    <Suspense fallback={<ChartLoader />}>
      <BarChart
        data={data}
        index={index}
        categories={categories}
        colors={colors}
        valueFormatter={valueFormatter}
        yAxisWidth={yAxisWidth}
        className={className}
        showLegend={showLegend}
      />
    </Suspense>
  );
});

const MemoizedLineChart = React.memo(function MemoizedLineChart({
  data,
  categories,
  index,
  colors,
  valueFormatter,
  yAxisWidth,
  className,
  showLegend = true,
}: ChartProps) {
  return (
    <Suspense fallback={<ChartLoader />}>
      <LineChart
        data={data}
        index={index}
        categories={categories}
        colors={colors}
        valueFormatter={valueFormatter}
        yAxisWidth={yAxisWidth}
        className={className}
        showLegend={showLegend}
      />
    </Suspense>
  );
});

export default function TradingCharts({
  pnlData,
  volumeData,
  marketDistribution,
}: TradingChartsProps) {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [showMovingAverage, setShowMovingAverage] = useState(false);

  // Initialize selected markets with proper typing
  const initialSelectedMarkets = useMemo(
    () =>
      marketDistribution.reduce<Record<string, boolean>>((acc, item) => {
        acc[item.name] = true;
        return acc;
      }, {}),
    [marketDistribution]
  );

  const [selectedMarkets, setSelectedMarkets] = useState(
    initialSelectedMarkets
  );

  const handleCheckboxChange = (marketName: string) => {
    setSelectedMarkets((prev) => ({
      ...prev,
      [marketName]: !prev[marketName],
    }));
  };

  // Memoized calculations
  const enrichedPnlData = useMemo(
    () => calculateMovingAverage(pnlData),
    [pnlData]
  );

  const formattedVolumeData = useMemo(
    () => formatVolumeData(volumeData),
    [volumeData]
  );

  const filteredMarketDistribution = useMemo(
    () => marketDistribution.filter((item) => selectedMarkets[item.name]),
    [marketDistribution, selectedMarkets]
  );

  return (
    <div className="space-y-6">
      <TabGroup>
        <TabList className={`ml-2 ${isMobile ? "flex justify-center" : ""}`}>
          <Tab
            className={`focus:outline-none dark:focus:outline-none no-ring dark:no-ring ${
              isMobile ? "text-xs" : "text-sm"
            }`}
          >
            PnL Analysis
          </Tab>
          <Tab
            className={`focus:outline-none dark:focus:outline-none no-ring dark:no-ring ${
              isMobile ? "text-xs" : "text-sm"
            }`}
          >
            Volume Analysis
          </Tab>
          <Tab
            className={`focus:outline-none dark:focus:outline-none no-ring dark:no-ring ${
              isMobile ? "text-xs" : "text-sm"
            }`}
          >
            Market Distribution
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <div className="space-y-6">
              <Card>
                <div className="flex justify-between">
                  <Title>Cumulative P&L with Moving Average</Title>
                  <div className="flex items-center">
                    <button
                      className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-sm"
                      onClick={() => setShowMovingAverage(!showMovingAverage)}
                      aria-pressed={showMovingAverage}
                    >
                      {showMovingAverage ? "Hide" : "Show"} Moving Average
                    </button>
                  </div>
                </div>
                <MemoizedBarChart
                  className="w-auto h-72 mt-4"
                  data={enrichedPnlData}
                  categories={[
                    "Net PNL",
                    ...(showMovingAverage ? ["Moving Average"] : []),
                  ]}
                  index="date"
                  colors={["indigo", "emerald"]}
                  valueFormatter={formatUSD}
                  yAxisWidth={isMobile ? 85 : 105}
                />
                <div className="mt-4 text-sm text-gray-500">
                  The blue line shows your cumulative P&L, while the green line
                  represents a 7-day moving average to help identify trends.
                </div>
              </Card>
              <Card>
                <Title>Daily PnL Distribution</Title>
                <MemoizedBarChart
                  className="w-auto h-72 mt-4"
                  data={pnlData}
                  index="date"
                  categories={["PNL"]}
                  colors={["blue"]}
                  valueFormatter={formatUSD}
                  yAxisWidth={isMobile ? 85 : 105}
                />
              </Card>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="space-y-6">
              <Card>
                <Title>Trading Volume Over Time</Title>
                <MemoizedBarChart
                  className="w-auto h-72 mt-4"
                  data={formattedVolumeData}
                  index="date"
                  categories={["volume"]}
                  colors={["violet"]}
                  valueFormatter={formatUSD}
                  yAxisWidth={isMobile ? 85 : 105}
                />
              </Card>
              <Card>
                <Title>Cumulative Trading Volume</Title>
                <MemoizedLineChart
                  className="w-auto h-72 mt-4"
                  data={formattedVolumeData}
                  index="date"
                  categories={["cumulativeVolume"]}
                  colors={["rose"]}
                  valueFormatter={formatUSD}
                  yAxisWidth={isMobile ? 85 : 105}
                />
              </Card>
            </div>
          </TabPanel>

          <TabPanel>
            <Card>
              <Title>Trading Volume by Market</Title>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Suspense fallback={<ChartLoader />}>
                  <DonutChart
                    className="w-auto h-80 mt-4 lg:mt-12"
                    data={filteredMarketDistribution}
                    category="value"
                    index="name"
                    valueFormatter={formatUSD}
                    colors={[
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
                </Suspense>
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

// Utility functions with proper typing
function calculateMovingAverage(
  data: ChartDataPoint[],
  period = 7
): ChartDataPoint[] {
  return data.map((item, index) => {
    if (index < period - 1) return { ...item, "Moving Average": null };

    const sum = data
      .slice(index - period + 1, index + 1)
      .reduce((acc, curr) => acc + (curr["Net PNL"] || 0), 0);

    return {
      ...item,
      "Moving Average": sum / period,
    };
  });
}

function formatVolumeData(data: ChartDataPoint[]): ChartDataPoint[] {
  let cumulativeVolume = 0;
  return data.map((item) => ({
    ...item,
    volume: Number(item.volume || 0),
    cumulativeVolume: (cumulativeVolume += Number(item.volume || 0)),
  }));
}
