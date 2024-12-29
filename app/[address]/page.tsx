"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import AnalyticsDashboard from "@/app/components/AnalyticsDashboard";
import TabNavigation from "@/app/components/TabNavigation";
import {
  fetchAndProcessPnLData,
  fetchAndProcessTradingHistoryData,
} from "@/src/lib/services/tradingDataProcessor";
import Dashboard from "@/app/components/History";
import { DashboardState } from "@/src/types/types";

interface TimeRange {
  start: number | null;
  end: number | null;
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
  const [state, setState] = useState<DashboardState>({
    startTime: null,
    endTime: null,
    data: null,
    tradingHistoryData: null,
    tradingHistory: [],
    chartData: [],
    totalFees: 0,
    tradingVolume: 0,
    netPnL: 0,
    grossProfit: 0,
    totalTradingCount: 0,
    winCount: 0,
    lossCount: 0,
    avgTradeSize: 0,
    largestWin: 0,
    largestLoss: 0,
    volumeData: [],
    marketDistribution: [],
    pnlMetrics: null,
    loading: true,
    error: null,
  });
  const [selectedTab, setSelectedTab] = useState(0);

  // Fetch trading data with error handling and loading states
  const fetchTradingData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [pnlData, historyData] = await Promise.all([
        fetchAndProcessPnLData(params.address, state.startTime, state.endTime),
        fetchAndProcessTradingHistoryData(
          params.address,
          state.startTime,
          state.endTime
        ),
      ]);

      // Update all state at once to prevent multiple re-renders
      setState((prev) => ({
        ...prev,
        data: pnlData,
        pnlMetrics: pnlData.pnlMetrics,
        netPnL: pnlData.netPnL,
        tradingVolume: pnlData.tradingVolume,
        totalFees: pnlData.totalFees,
        grossProfit: pnlData.grossProfit,
        tradingHistory: pnlData.tradingHistory,
        chartData: pnlData.chartData,
        totalTradingCount: pnlData.totalTradingCount,
        winCount: pnlData.winCount,
        lossCount: pnlData.lossCount,
        avgTradeSize: pnlData.avgTradeSize,
        largestWin: pnlData.largestWin,
        largestLoss: pnlData.largestLoss,
        volumeData: pnlData.volumeData,
        marketDistribution: pnlData.marketDistribution,
        tradingHistoryData: historyData,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Failed to fetch trading data.",
        loading: false,
      }));
      console.error("Failed to fetch trading data:", error);
    }
  }, [params.address, state.startTime, state.endTime]);

  useEffect(() => {
    fetchTradingData();
  }, [fetchTradingData]);

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

  if (state.error || !state.pnlMetrics) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-red-500">
          {state.error || "No data available"}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 mt-24"
    >
      <TabNavigation onTabChange={setSelectedTab} />

      {selectedTab === 0 && (
        <Dashboard
          address={params.address}
          state={state}
          setState={setState}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
      )}
      {selectedTab === 1 && <div>Performance content goes here</div>}
      {selectedTab === 2 && (
        <AnalyticsDashboard tradingData={state.pnlMetrics} />
      )}
    </motion.div>
  );
}
