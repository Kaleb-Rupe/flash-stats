"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { DateRangePicker } from "@/app/components/dateRangePicker";
import TradingCharts from "@/app/components/TradingCharts/TradingCharts";
import PnLBreakdown from "@/app/components/PnLBreakdown";
import PositionAnalysis from "@/app/components/PositionAnalysis";
import { fetchAndProcessPnLData } from "@/src/lib/services/tradingDataProcessor";
import { ChartDataPoint } from "@/src/types/types";
import DashboardLayout from "@/app/components/DashboardLayout";

interface TimeRange {
  start: number | null;
  end: number | null;
}

interface ChartPageData {
  chartData: ChartDataPoint[];
  volumeData: any[];
  marketDistribution: any[];
  tradingHistory: any[];
  pnlMetrics: any;
}

export default function ChartsPage({
  params,
}: {
  params: { address: string };
}) {
  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: null,
    end: null,
  });
  const [chartData, setChartData] = useState<ChartPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchAndProcessPnLData(
        params.address,
        timeRange.start,
        timeRange.end
      );

      setChartData({
        chartData: data.chartData,
        volumeData: data.volumeData,
        marketDistribution: data.marketDistribution,
        tradingHistory: data.tradingHistory,
        pnlMetrics: data.pnlMetrics,
      });
    } catch (error) {
      setError("Failed to fetch chart data");
      console.error("Chart data fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [params.address, timeRange]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

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

  if (error || !chartData) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-red-500">
          {error || "No chart data available"}
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
      <DashboardLayout
        layoutType="full-width"
        header={
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Trading Analytics</h1>
              <span className="text-gray-500">
                {params.address.slice(0, 4)}...{params.address.slice(-4)}
              </span>
            </div>
            <DateRangePicker
              onDateChange={(start, end) => setTimeRange({ start, end })}
            />
          </div>
        }
      >
        {/* PnL Chart */}
        <TradingCharts
          pnlData={chartData.chartData}
          volumeData={chartData.volumeData}
          marketDistribution={chartData.marketDistribution}
        />
        {/* PnL Breakdown */}
        {/* {chartData.pnlMetrics && (
          <PnLBreakdown metrics={chartData.pnlMetrics} />
        )} */}

        {/* Position Analysis */}
        {/* <PositionAnalysis trades={chartData.tradingHistory} /> */}
      </DashboardLayout>
    </motion.div>
  );
}
