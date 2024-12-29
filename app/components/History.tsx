"use client";

import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/app/components/DashboardLayout";
import MetricCard from "@/app/components/MetricCard";
import {
  CurrencyDollarIcon,
  ScaleIcon,
  ChartBarIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import TradingStats from "@/app/components/TradingStats";
import { formatUSD, formatNumber } from "@/src/lib/utils/formatters";
import { DateRangePicker } from "@/app/components/dateRangePicker";
import { TradingHistoryProps } from "@/src/types/types";

export default function Dashboard({
  address,
  state,
  setState,
  timeRange,
  setTimeRange,
}: TradingHistoryProps) {
  if (state.loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-[calc(100vh-8rem)]"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </motion.div>
    );
  }

  if (state.error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-500 text-center py-8"
      >
        <div className="text-center py-12">
          <p className="text-xl text-red-500">
            {state.error || "No data available"}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 mt-24"
    >
      <DashboardLayout
        layoutType="metrics"
        header={
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Summary</h1>
              <span className="text-gray-500">
                {address.slice(0, 4)}...{address.slice(-4)}
              </span>
            </div>
            <DateRangePicker
              onDateChange={(start, end) => {
                setTimeRange({
                  start: start,
                  end: end,
                });
              }}
            />
          </div>
        }
      >
        {/* Metrics Grid */}
        <MetricCard
          title="Net Profit"
          value={formatUSD(state.netPnL)}
          icon={<CurrencyDollarIcon className="w-5 h-5" />}
          isPositive={state.netPnL > 0}
        />
        <MetricCard
          title="Trading Volume"
          value={formatUSD(state.tradingVolume)}
          icon={<ChartBarIcon className="w-5 h-5" />}
          subtitle="Open + Close Position Size"
        />
        <MetricCard
          title="Total Trades"
          value={formatNumber(state.totalTradingCount)}
          icon={<ScaleIcon className="w-5 h-5" />}
        />
        <MetricCard
          title="Gross Profit"
          value={formatUSD(state.grossProfit)}
          icon={<WalletIcon className="w-5 h-5" />}
          isPositive={state.grossProfit > 0}
        />
        <MetricCard
          title="Fees Paid"
          value={formatUSD(state.totalFees)}
          icon={<CurrencyDollarIcon className="w-5 h-5" />}
          isPositive={false}
        />
        <TradingStats
          winCount={state.winCount}
          lossCount={state.lossCount}
          avgTradeSize={state.avgTradeSize}
          largestWin={state.largestWin}
          largestLoss={state.largestLoss}
        />
      </DashboardLayout>
    </motion.div>
  );
}
