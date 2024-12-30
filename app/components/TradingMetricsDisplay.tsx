import React from "react";
import { Card } from "@tremor/react";
import { motion } from "framer-motion";
import {
  formatUSD,
  formatNumber,
  formatPercentage,
} from "@/src/lib/utils/formatters";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  calculateLongShortRatios,
  // calculateAvgTradeDuration,
  calculateTradeResultByTime,
} from "@/src/lib/utils/formatters";
import { TradingMetricsDisplayProps } from "@/src/types/types";
import DashboardLayout from "@/app/components/DashboardLayout";
export default function TradingMetricsDisplay({
  trades,
  address,
}: TradingMetricsDisplayProps) {
  // Calculate advanced metrics
  const { longRatio, shortRatio } = calculateLongShortRatios(trades);
  // const avgDuration = calculateAvgTradeDuration(trades);
  const timeResults = calculateTradeResultByTime(trades);

  // Helper function for tooltips
  const Tooltip = ({ content }: { content: string }) => (
    <div className="group relative flex items-center">
      <InformationCircleIcon className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
        {content}
      </div>
    </div>
  );

  // Helper for metric cards
  const MetricSection = ({
    title,
    value,
    tooltip,
    trend,
    isPercentage = false,
    isCurrency = false,
  }: {
    title: string;
    value: string | number;
    tooltip: string;
    trend?: number;
    isPercentage?: boolean;
    isCurrency?: boolean;
  }) => (
    <div className="p-4 ring-1 rounded-tremor-default bg-tremor-background ring-tremor-ring dark:bg-dark-tremor-background dark:ring-dark-tremor-ring border-tremor-brand dark:border-dark-tremor-brand shadow-strong">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </h3>
          <Tooltip content={tooltip} />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center ${
              trend >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend >= 0 ? (
              <ArrowTrendingUpIcon className="h-4 w-4" />
            ) : (
              <ArrowTrendingDownIcon className="h-4 w-4" />
            )}
            <span className="ml-1 text-sm">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold">
        {isCurrency
          ? formatUSD(Number(value))
          : isPercentage
          ? `${formatPercentage(Number(value))}%`
          : formatNumber(Number(value))}
      </p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 mt-24"
    >
      <DashboardLayout
        layoutType="full-width"
        header={
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Summary</h1>
              <span className="text-gray-500">
                {address.slice(0, 4)}...{address.slice(-4)}
              </span>
            </div>
          </div>
        }
      >
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {/* Trading Style Distribution */}
            <MetricSection
              title="Long/Short Ratio"
              value={longRatio}
              tooltip="Distribution between long and short positions"
              isPercentage
            />
            <MetricSection
              title="Short Position Ratio"
              value={shortRatio}
              tooltip="Percentage of trades that are short positions"
              isPercentage
            />

            {/* Performance by Time */}
            <div className="col-span-full">
              <h3 className="text-lg font-medium mb-4">
                Performance by Time of Day
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {Object.entries(timeResults).map(([hour, pnl]) => (
                  <div
                    key={hour}
                    className={`p-2 rounded ${
                      pnl >= 0 ? "bg-green-300" : "bg-red-300"
                    }`}
                  >
                    <div className="text-xs text-center text-black dark:text-black">
                      {hour}:00
                    </div>
                    <div className="text-sm font-medium text-center text-black dark:text-black">
                      {formatUSD(pnl)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Stats Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-500">
                Most Active Hours
              </h4>
              <p className="mt-1 text-lg font-semibold">
                {Object.entries(timeResults)
                  .sort(
                    ([, a], [, b]) => Math.abs(Number(b)) - Math.abs(Number(a))
                  )
                  .slice(0, 3)
                  .map(([hour]) => `${hour}:00`)
                  .join(", ")}
              </p>
            </div>
            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-500">
                Best Trading Hours
              </h4>
              <p className="mt-1 text-lg font-semibold">
                {Object.entries(timeResults)
                  .sort(([, a], [, b]) => Number(b) - Number(a))
                  .slice(0, 3)
                  .map(([hour]) => `${hour}:00`)
                  .join(", ")}
              </p>
            </div>
            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-500">
                Trading Consistency
              </h4>
              <p className="mt-1 text-lg font-semibold">
                {(
                  (Object.values(timeResults).filter((pnl) => pnl > 0).length /
                    Object.values(timeResults).length) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </Card>
      </DashboardLayout>
    </motion.div>
  );
}
