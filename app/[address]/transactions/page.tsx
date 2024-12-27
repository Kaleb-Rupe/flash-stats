"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { DateRangePicker } from "@/app/components/dateRangePicker";
import TradesTable from "@/app/components/TradesTable";
import { fetchAndProcessTradingHistoryData } from "@/src/lib/services/tradingDataProcessor";
import { TradingHistoryData } from "@/src/types/types";
import DashboardLayout from "@/app/components/DashboardLayout";

// Define our time range interface for better type safety
interface TimeRange {
  start: number | null;
  end: number | null;
}

export default function TransactionsPage({
  params,
}: {
  params: { address: string };
}) {
  // Use our TimeRange interface for the state
  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: null,
    end: null,
  });
  const [tradingHistory, setTradingHistory] = useState<TradingHistoryData[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch transaction data with proper error handling
  const fetchTransactionData = useCallback(async () => {
    try {
      setIsLoading(true);

      // We now know this returns TradingHistoryData[]
      const historyData = await fetchAndProcessTradingHistoryData(
        params.address,
        timeRange.start,
        timeRange.end
      );

      // TypeScript now knows this is TradingHistoryData[]
      setTradingHistory(historyData.tradingHistory as TradingHistoryData[]);
    } catch (error) {
      setError("Failed to fetch transaction data");
      console.error("Transaction data fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [params.address, timeRange]);

  useEffect(() => {
    fetchTransactionData();
  }, [fetchTransactionData]);

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

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 mt-24"
    >
      {/* Header with date range picker */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Transaction History</h1>
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

      {/* Transaction table */}
      <DashboardLayout layoutType="full-width">
        <div className="space-y-8">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm">
            <TradesTable
              address={params.address}
              itemsPerPage={20}
              trades={tradingHistory}
            />
          </div>
        </div>
      </DashboardLayout>
    </motion.div>
  );
}
