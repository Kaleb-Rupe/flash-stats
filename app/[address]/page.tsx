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
import { ChartDataPoint, DashboardState } from "@/src/types/types";
import { useMediaQuery } from "react-responsive";
import TradingMetricsDisplay from "../components/TradingMetricsDisplay";
import { DateRangePicker } from "@/app/components/dateRangePicker";
import { Copy } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { Check } from "lucide-react";
import { useCopyToClipboard } from "@/src/lib/utils/clipboardUtils";
import { formatAddress } from "@/src/lib/utils/addressUtils";

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

export default function DashboardPage({
  params,
}: {
  params: { address: string };
}) {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [chartData, setChartData] = useState<ChartPageData | null>(null);
  const { formattedAddress } = formatAddress(params.address);
  const { copyToClipboard } = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(params.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
    pnlData: [],
    loading: true,
    error: null,
  });
  const [selectedTab, setSelectedTab] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem("selectedTab");
      return savedTab ? Number(savedTab) : 0;
    }
    return 0; // Default value if not in the browser
  });

  // Fetch trading data with error handling and loading states
  const fetchTradingData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [pnlData, historyData] = await Promise.all([
        fetchAndProcessPnLData(params.address, timeRange.start, timeRange.end),
        fetchAndProcessTradingHistoryData(
          params.address,
          timeRange.start,
          timeRange.end
        ),
      ]);

      // Update all state at once to prevent multiple re-renders
      setState((prev) => ({
        ...prev,
        data: pnlData,
        pnlMetrics: pnlData.pnlMetrics,
        pnlData: pnlData.chartData,
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

      setChartData({
        chartData: pnlData.chartData,
        volumeData: pnlData.volumeData,
        marketDistribution: pnlData.marketDistribution,
        tradingHistory: pnlData.tradingHistory,
        pnlMetrics: pnlData.pnlMetrics,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Failed to fetch trading data.",
        loading: false,
      }));
      console.error("Failed to fetch trading data:", error);
    }
  }, [params.address, timeRange.start, timeRange.end]);

  useEffect(() => {
    fetchTradingData();
  }, [fetchTradingData]);

  useEffect(() => {
    const savedTab = localStorage.getItem("selectedTab");
    setSelectedTab(savedTab ? Number(savedTab) : 0);
  }, []);

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
      className={`space-y-6 ${isMobile ? "mt-24 mb-[7rem]" : "mt-20"}`}
    >
      <div className="flex justify-end px-4 sm:px-6 lg:px-8">
        <TabNavigation selectedTab={selectedTab} onTabChange={setSelectedTab} />
      </div>

      
      <div className="flex justify-between items-center px-6 sm:px-8 lg:px-10">
        <div>
          <h1 className="text-2xl font-bold">Summary</h1>
          <span
            className="text-white cursor-pointer flex items-center ml-2"
            onClick={handleCopy}
            title="Copy Address"
          >
            {formattedAddress}
            {copied ? (
              <Check size={16} className="text-[#318231] ml-2" />
            ) : (
              <Copy
                size={16}
                className="text-white ml-2 opacity-100 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            )}
          </span>
        </div>
        <DateRangePicker
          onDateChange={(start, end) => {
            setTimeRange({ start, end });
          }}
        />
      </div>
      {selectedTab === 0 && (
        <Dashboard
          address={params.address}
          state={state}
          setState={setState}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
      )}
      {selectedTab === 1 && (
        <TradingMetricsDisplay
          trades={chartData?.tradingHistory || []}
          address={params.address}
        />
      )}
      {selectedTab === 2 && (
        <AnalyticsDashboard tradingData={state.pnlMetrics} />
      )}
    </motion.div>
  );
}
