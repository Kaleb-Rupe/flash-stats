"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import TradingCharts from "@/app/components/TradingCharts/TradingCharts";
import { fetchAndProcessPnLData } from "@/src/lib/services/tradingDataProcessor";
import { ChartDataPoint } from "@/src/types/types";
import DashboardLayout from "@/app/components/DashboardLayout";
import { Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/src/lib/utils/clipboardUtils";
import { formatAddress } from "@/src/lib/utils/addressUtils";
import { useDateRange } from "@/app/hooks/useDateRange";
import DateRangeModal from "@/app/components/DateRangeModal";

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
  // Initialize the date range hook
  const {
    startTime,
    endTime,
    isModalOpen,
    openModal,
    closeModal,
    handleDateChange,
  } = useDateRange();

  const [chartData, setChartData] = useState<ChartPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { formattedAddress } = formatAddress(params.address);
  const { copyToClipboard } = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(params.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fetch and process chart data
  const fetchChartData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await fetchAndProcessPnLData(
        params.address,
        startTime,
        endTime
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
  }, [params.address, startTime, endTime]);

  // Fetch data when component mounts or date range changes
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
            <button
              onClick={openModal}
              className="hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg bg-[#131a2b] transition duration-300"
            >
              Filter by Dates
            </button>
          </div>
        }
      >
        {/* Date Range Modal */}
        <DateRangeModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onDateChange={handleDateChange}
        />

        {/* Trading Charts */}
        <TradingCharts
          pnlData={chartData.chartData}
          volumeData={chartData.volumeData}
          marketDistribution={chartData.marketDistribution}
        />
      </DashboardLayout>
    </motion.div>
  );
}
