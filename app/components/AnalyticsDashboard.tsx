import React, { useState } from "react";
import {
  ArrowTrendingUpIcon,
  ClockIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { Card } from "@tremor/react";
import { BarChart } from "@tremor/react";
import { formatPercentage } from "@/src/lib/utils/formatters";
import { MARKETS } from "@/src/lib/utils/markets";
import { motion } from "framer-motion";
import DashboardLayout from "./DashboardLayout";

// Tab options for time filtering
const timeFilterOptions = [
  { label: "1 Hour", value: "1h" },
  { label: "12 Hours", value: "12h" },
  { label: "24 Hours", value: "24h" },
  { label: "Week", value: "1w" },
  { label: "Month", value: "1m" },
  { label: "All Trades", value: "all" },
];

const AnalyticsDashboard = ({ tradingData }: { tradingData: any }) => {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("all");
  const [selectedSymbol, setSelectedSymbol] = useState("all");

  // Extract all symbols from MARKETS
  const symbols = [
    "All Symbols",
    ...new Set(Object.values(MARKETS).map((market) => market.name)),
  ];

  // Mock data for the time-based trading results
  const timeBasedResults = [
    { time: "12-6am", value: 400 },
    { time: "6-12pm", value: 600 },
    { time: "12-6pm", value: 300 },
    { time: "6-12am", value: -200 },
  ];

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
            <h1 className="text-xl font-bold">Analytics</h1>
            <div className="flex space-x-4">
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="rounded-lg bg-gray-900 border-gray-700 text-sm"
              >
                {symbols.map((symbol) => (
                  <option key={symbol} value={symbol.toLowerCase()}>
                    {symbol}
                  </option>
                ))}
              </select>
              <select
                value={selectedTimeFilter}
                onChange={(e) => setSelectedTimeFilter(e.target.value)}
                className="rounded-lg bg-gray-900 border-gray-700 text-sm"
              >
                {timeFilterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        }
      >

          {/* Metrics Row */}
          <div className="grid grid-cols-4 gap-4">
            {/* Total Trades */}
            <Card className="p-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ChartBarIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Trades</p>
                  <p className="text-xl font-bold">
                    {tradingData?.totalTrades || 0}
                  </p>
                </div>
              </div>
            </Card>

            {/* Win Rate */}
            <Card className="p-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Win Rate</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xl font-bold">
                      {formatPercentage(tradingData?.winRate || 0)}%
                    </p>
                    <span className="text-sm text-gray-500">
                      {tradingData?.wins || 0}W/{tradingData?.losses || 0}L
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Avg Trade Duration */}
            <Card className="p-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ClockIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg Trade Duration</p>
                  <p className="text-xl font-bold">
                    {tradingData?.avgDuration || "0h 0m 0s"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Long/Short Ratio */}
            <Card className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Long Ratio</span>
                  <span className="text-sm">Short Ratio</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-green-500">
                    {formatPercentage(tradingData?.longRatio || 0)}%
                  </span>
                  <span className="text-lg font-bold text-red-500">
                    {formatPercentage(tradingData?.shortRatio || 0)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-red-500"
                    style={{ width: `${tradingData?.longRatio || 0}%` }}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-4 gap-4">
            {/* Trading Results by Time */}
            <div className="col-span-2">
              <Card>
                <h3 className="text-lg font-medium mb-4">
                  Trading Results by Time
                </h3>
                <BarChart
                  className="h-48"
                  data={timeBasedResults}
                  index="time"
                  categories={["value"]}
                  colors={["blue"]}
                  showLegend={false}
                />
              </Card>
            </div>

            {/* Win Ratios */}
            <Card>
              <h3 className="text-lg font-medium mb-2">Long Trade Win Ratio</h3>
              <div className="flex justify-center items-center h-32">
                <div className="relative">
                  <svg className="w-24 h-24">
                    <circle
                      className="text-gray-200"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="44"
                      cx="48"
                      cy="48"
                    />
                    <circle
                      className="text-green-500"
                      strokeWidth="8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="44"
                      cx="48"
                      cy="48"
                      strokeDasharray={`${
                        (2 * Math.PI * 44 * (tradingData?.longWinRate || 0)) /
                        100
                      } ${2 * Math.PI * 44}`}
                      transform="rotate(-90 48 48)"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                    {formatPercentage(tradingData?.longWinRate || 0)}%
                  </span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-medium mb-2">
                Short Trade Win Ratio
              </h3>
              <div className="flex justify-center items-center h-32">
                <div className="relative">
                  <svg className="w-24 h-24">
                    <circle
                      className="text-gray-200"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="44"
                      cx="48"
                      cy="48"
                    />
                    <circle
                      className="text-red-500"
                      strokeWidth="8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="44"
                      cx="48"
                      cy="48"
                      strokeDasharray={`${
                        (2 * Math.PI * 44 * (tradingData?.shortWinRate || 0)) /
                        100
                      } ${2 * Math.PI * 44}`}
                      transform="rotate(-90 48 48)"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                    {formatPercentage(tradingData?.shortWinRate || 0)}%
                  </span>
                </div>
              </div>
            </Card>
          </div>
      </DashboardLayout>
    </motion.div>
  );
};

export default AnalyticsDashboard;
