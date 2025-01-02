import {
  formatMarketValue,
  formatCurrency,
  formatTimestampMonthDay,
  formatTimestampHourMinute,
} from "@/src/lib/utils/formatters";
import { MARKETS } from "@/src/lib/utils/markets";
import { useState } from "react";
import { TradesTableProps } from "@/src/types/types";
import TradeDropdown from "@/app/components/TradeDropdown";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export default function TradesTable({
  itemsPerPage = 10,
  trades,
  isLoading,
}: TradesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(trades.length / itemsPerPage);
  const [activeTradeId, setActiveTradeId] = useState<number | string | null>(
    null
  );

  const sortedTrades = trades.sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp)
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTrades = sortedTrades.slice(startIndex, endIndex);

  return (
    <motion.div initial="hidden" animate="visible" variants={tableVariants}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium" aria-label="Trading History" aria-hidden="true">
        </h3>
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1}-{Math.min(endIndex, trades.length)} of{" "}
          {trades.length} trades
        </div>
      </div>

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center py-10"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="overflow-x-auto"
          >
            {currentTrades.map((trade) => {
              const dateMonthDay = formatTimestampMonthDay(trade.timestamp);
              const dateHourMinute = formatTimestampHourMinute(trade.timestamp);
              const feeInUsd = calculateFeeInUsd(trade);

              return (
                <TradeDropdown
                  key={trade.txId}
                  trade={trade}
                  dateMonthDay={dateMonthDay}
                  dateHourMinute={dateHourMinute}
                  feeInUsd={calculateFeeInUsd(trade)}
                  isOpen={activeTradeId === trade.txId}
                  onToggle={() =>
                    setActiveTradeId(
                      activeTradeId === trade.txId ? null : trade.txId
                    )
                  }
                  activeTradeId={activeTradeId}
                  setActiveTradeId={setActiveTradeId}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 disabled:opacity-50 
            transition-colors duration-200"
        >
          Previous
        </motion.button>

        <span className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </span>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 disabled:opacity-50 
            transition-colors duration-200"
        >
          Next
        </motion.button>
      </div>
    </motion.div>
  );
}

export const calculateFeeInUsd = (trade: any) => {
  if (trade.side === "long") {
    return trade.entryPrice || trade.oraclePrice
      ? formatCurrency(
          (trade.entryPrice
            ? Number(trade.entryPrice)
            : Number(trade.oraclePrice)) *
            (trade.entryPriceExponent
              ? Number(`1e${trade.entryPriceExponent}`)
              : Number(`1e${trade.oraclePriceExponent}`)) *
            formatMarketValue(trade.feeAmount, trade.market)
        )
      : trade.price !== "0"
      ? formatCurrency(
          Number(trade.price) *
            Number(`1e${MARKETS[trade.market].exponent}`) *
            formatMarketValue(trade.feeAmount, trade.market)
        )
      : trade.tradeType === "INCREASE_SIZE" ||
        trade.tradeType === "DECREASE_SIZE"
      ? formatCurrency(
          (Number(trade.sizeUsd) / Number(trade.sizeAmount)) *
            1e3 *
            formatMarketValue(trade.feeAmount, trade.market)
        )
      : "-";
  } else {
    return formatCurrency(formatMarketValue(trade.feeAmount, trade.market));
  }
};

//**
// const calculateFeeInUsd = (trade: any) => {
//   const getEntryPrice = () => {
//     if (trade.entryPrice) {
//       return Number(trade.entryPrice);
//     }
//     if (trade.oraclePrice) {
//       return Number(trade.oraclePrice);
//     }
//     return null;
//   };

//   const entryPrice = getEntryPrice();
//   const exponent = trade.entryPriceExponent || trade.oraclePriceExponent;

//   if (trade.side === "long") {
//     if (entryPrice) {
//       return formatCurrency(
//         entryPrice *
//           (exponent ? Number(`1e${exponent}`) : 1) *
//           formatMarketValue(trade.feeAmount, trade.market)
//       );
//     }

//     if (trade.price !== "0") {
//       return formatCurrency(
//         Number(trade.price) *
//           Number(`1e${MARKETS[trade.market].exponent}`) *
//           formatMarketValue(trade.feeAmount, trade.market)
//       );
//     }

//     if (
//       trade.tradeType === "INCREASE_SIZE" ||
//       trade.tradeType === "DECREASE_SIZE"
//     ) {
//       return formatCurrency(
//         (Number(trade.sizeUsd) / Number(trade.sizeAmount)) *
//           1e3 *
//           formatMarketValue(trade.feeAmount, trade.market)
//       );
//     }
//   } else {
//     return formatCurrency(formatMarketValue(trade.feeAmount, trade.market));
//   }

//   return "-";
// };
// */
