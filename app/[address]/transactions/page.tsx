"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import TradesTable from "@/app/components/TradesTable";
import { fetchAndProcessTradingHistoryData } from "@/src/lib/services/tradingDataProcessor";
import { TradingHistoryData } from "@/src/types/types";
import DashboardLayout from "@/app/components/DashboardLayout";
import { formatAddress } from "@/src/lib/utils/addressUtils";
import { useCopyToClipboard } from "@/src/lib/utils/clipboardUtils";
import { Check, Copy } from "lucide-react";
import { useDateRange } from "@/app/hooks/useDateRange";
import DateRangeModal from "@/app/components/DateRangeModal";

export default function TransactionsPage({
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

  const [tradingHistory, setTradingHistory] = useState<TradingHistoryData[]>(
    []
  );
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

  // Fetch transaction data with proper error handling
  const fetchTransactionData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const historyData = await fetchAndProcessTradingHistoryData(
        params.address,
        startTime, // Use the startTime from useDateRange
        endTime // Use the endTime from useDateRange
      );

      setTradingHistory(historyData.tradingHistory as TradingHistoryData[]);
    } catch (error) {
      setError("Failed to fetch transaction data");
      console.error("Transaction data fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [params.address, startTime, endTime]);

  // Fetch data when component mounts or date range changes
  useEffect(() => {
    fetchTransactionData();
  }, [fetchTransactionData]);

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
      <DashboardLayout
        layoutType="full-width"
        header={
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Trading History</h1>
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

        <div className="space-y-8">
          <TradesTable
            address={params.address}
            itemsPerPage={20}
            trades={tradingHistory}
            isLoading={isLoading}
          />
        </div>
      </DashboardLayout>
    </motion.div>
  );
}
