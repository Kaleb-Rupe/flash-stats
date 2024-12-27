import React from "react";
import { Card } from "@tremor/react";
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
  calculateAvgTradeDuration,
  calculateTradeResultByTime,
} from "@/src/lib/utils/formatters";
import { TradingMetricsDisplayProps } from "@/src/types/types";

export default function TradingMetricsDisplay({
  trades,
}: TradingMetricsDisplayProps) {
  // Calculate advanced metrics
  const { longRatio, shortRatio } = calculateLongShortRatios(trades);
  const avgDuration = calculateAvgTradeDuration(trades);
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
    value: number;
    tooltip: string;
    trend?: number;
    isPercentage?: boolean;
    isCurrency?: boolean;
  }) => (
    <div className="p-4 bg-white dark:bg-zinc-900 rounded-lg">
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
          ? formatUSD(value)
          : isPercentage
          ? `${formatPercentage(value)}%`
          : formatNumber(value)}
      </p>
    </div>
  );

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Time-based Metrics */}
        <MetricSection
          title="Average Trade Duration"
          value={parseFloat(avgDuration)}
          tooltip="Average time positions are held"
          isPercentage={false}
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
                  pnl >= 0 ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <div className="text-xs text-center text-zinc-500 dark:text-slate-500">
                  {hour}:00
                </div>
                <div className="text-sm font-medium text-center text-zinc-500 dark:text-slate-500">
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
              .sort(([, a], [, b]) => Math.abs(Number(b)) - Math.abs(Number(a)))
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
  );
}
