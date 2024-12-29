import { Card } from "@tremor/react";
import {
  formatMarketValue,
  formatCurrency,
  formatTimestamp,
} from "@/src/lib/utils/formatters";
import { MARKETS } from "@/src/lib/utils/markets";
import { useState } from "react";
import { TradesTableProps } from "@/src/types/types";
import TradeDropdown from "@/app/components/TradeDropdown";

export default function TradesTable({
  itemsPerPage = 10,
  trades,
}: TradesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(trades.length / itemsPerPage);

  const sortedTrades = trades.sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp)
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTrades = sortedTrades.slice(startIndex, endIndex);

  return (
    <Card className="mt-6 shadow-strong">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Trading History</h3>
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1}-{Math.min(endIndex, trades.length)} of{" "}
          {trades.length} trades
        </div>
      </div>

      <div className="overflow-x-auto">
        {currentTrades.map((trade) => {
          const date = formatTimestamp(trade.timestamp);
          const feeInUsd = calculateFeeInUsd(trade);

          return (
            <TradeDropdown
              key={trade.txId}
              trade={trade}
              date={date}
              feeInUsd={feeInUsd}
            />
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </Card>
  );
}

const calculateFeeInUsd = (trade: any) => {
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
