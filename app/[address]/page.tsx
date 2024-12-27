"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/app/components/DashboardLayout";
import MetricCard from "@/app/components/MetricCard";
import { DateRangePicker } from "@/app/components/dateRangePicker";
import TradingStats from "@/app/components/TradingStats";
import {
  CurrencyDollarIcon,
  ScaleIcon,
  ChartBarIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { formatUSD, formatNumber } from "@/src/lib/utils/formatters";
import { fetchAndProcessPnLData } from "@/src/lib/services/tradingDataProcessor";

// Define our interfaces for better type safety
interface TimeRange {
  start: number | null;
  end: number | null;
}

interface DashboardMetrics {
  netPnL: number;
  tradingVolume: number;
  totalTradingCount: number;
  grossProfit: number;
  totalFees: number;
  winCount: number;
  lossCount: number;
  avgTradeSize: number;
  largestWin: number;
  largestLoss: number;
}

export default function DashboardPage({
  params,
}: {
  params: { address: string };
}) {
  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: null,
    end: null,
  });
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchAndProcessPnLData(
        params.address,
        timeRange.start,
        timeRange.end
      );

      setMetrics({
        netPnL: data.netPnL,
        tradingVolume: data.tradingVolume,
        totalTradingCount: data.totalTradingCount,
        grossProfit: data.grossProfit,
        totalFees: data.totalFees,
        winCount: data.winCount,
        lossCount: data.lossCount,
        avgTradeSize: data.avgTradeSize,
        largestWin: data.largestWin,
        largestLoss: data.largestLoss,
      });
    } catch (error) {
      setError("Failed to fetch dashboard data");
      console.error("Dashboard data fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [params.address, timeRange]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
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

  if (error || !metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-red-500">{error || "No data available"}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 mt-24"
    >
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <span className="text-gray-500">
            {params.address.slice(0, 4)}...{params.address.slice(-4)}
          </span>
        </div>
        <DateRangePicker
          onDateChange={(start, end) => {
            setTimeRange({ start, end });
          }}
        />
      </div>

      {/* Metrics Grid */}
      <DashboardLayout layoutType="metrics">
        <MetricCard
          title="Net Profit"
          value={formatUSD(metrics.netPnL)}
          icon={<CurrencyDollarIcon className="w-5 h-5" />}
          isPositive={metrics.netPnL > 0}
        />
        <MetricCard
          title="Trading Volume"
          value={formatUSD(metrics.tradingVolume)}
          icon={<ChartBarIcon className="w-5 h-5" />}
          subtitle="Open + Close Position Size"
        />
        <MetricCard
          title="Total Trades"
          value={formatNumber(metrics.totalTradingCount)}
          icon={<ScaleIcon className="w-5 h-5" />}
        />
        <MetricCard
          title="Gross Profit"
          value={formatUSD(metrics.grossProfit)}
          icon={<WalletIcon className="w-5 h-5" />}
          isPositive={metrics.grossProfit > 0}
        />
        <MetricCard
          title="Fees Paid"
          value={formatUSD(metrics.totalFees)}
          icon={<CurrencyDollarIcon className="w-5 h-5" />}
          isPositive={false}
        />
        <TradingStats
          winCount={metrics.winCount}
          lossCount={metrics.lossCount}
          avgTradeSize={metrics.avgTradeSize}
          largestWin={metrics.largestWin}
          largestLoss={metrics.largestLoss}
        />
      </DashboardLayout>
    </motion.div>
  );
}
