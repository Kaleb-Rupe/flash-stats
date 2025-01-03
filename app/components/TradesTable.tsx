// import { Card } from "@tremor/react";
// import {
//   formatMarketValue,
//   formatCurrency,
//   formatTimestamp,
// } from "@/src/lib/utils/formatters";
// import { MARKETS } from "@/src/lib/utils/markets";
// import { useState } from "react";
// import { TradesTableProps } from "@/src/types/types";

// export default function TradesTable({
//   itemsPerPage = 10,
//   trades,
// }: TradesTableProps) {
//   const [currentPage, setCurrentPage] = useState(1);
//   const totalPages = Math.ceil(trades.length / itemsPerPage);

//   const sortedTrades = trades.sort(
//     (a, b) => Number(b.timestamp) - Number(a.timestamp)
//   );

//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentTrades = sortedTrades.slice(startIndex, endIndex);

//   return (
//     <Card className="mt-6">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-medium">Trading History</h3>
//         <div className="text-sm text-gray-500">
//           Showing {startIndex + 1}-{Math.min(endIndex, trades.length)} of{" "}
//           {trades.length} trades
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="border-b border-gray-200 dark:border-gray-800">
//               <th className="px-4 py-3 text-left">Time</th>
//               <th className="px-4 py-3 text-left">Type</th>
//               <th className="px-4 py-3 text-left">Market</th>
//               <th className="px-4 py-3 text-left">Collateral</th>
//               <th className="px-4 py-3 text-right">Size</th>
//               <th className="px-4 py-3 text-right">Entry</th>
//               <th className="px-4 py-3 text-right">Exit</th>
//               <th className="px-4 py-3 text-right">PnL</th>
//               <th className="px-4 py-3 text-right">Fee/Fee USD</th>
//               <th className="px-4 py-3 text-right">Trx</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentTrades.map((trade) => {
//               const date = formatTimestamp(trade.timestamp);

//               const feeInUsd =
//                 trade.side === "long"
//                   ? trade.entryPrice || trade.oraclePrice
//                     ? formatCurrency(
//                         (trade.entryPrice
//                           ? Number(trade.entryPrice)
//                           : Number(trade.oraclePrice)) *
//                           (trade.entryPriceExponent
//                             ? Number(`1e${trade.entryPriceExponent}`)
//                             : Number(`1e${trade.oraclePriceExponent}`)) *
//                           formatMarketValue(trade.feeAmount, trade.market)
//                       )
//                     : trade.price !== "0"
//                     ? formatCurrency(
//                         Number(trade.price) *
//                           Number(`1e${MARKETS[trade.market].exponent}`) *
//                           formatMarketValue(trade.feeAmount, trade.market)
//                       )
//                     : trade.tradeType === "INCREASE_SIZE" ||
//                       trade.tradeType === "DECREASE_SIZE"
//                     ? formatCurrency(
//                         (Number(trade.sizeUsd) / Number(trade.sizeAmount)) *
//                           1e3 *
//                           formatMarketValue(trade.feeAmount, trade.market)
//                       )
//                     : "-"
//                   : formatCurrency(
//                       formatMarketValue(trade.feeAmount, trade.market)
//                     );
//               return (
//                 <tr
//                   key={trade.txId}
//                   className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
//                 >
//                   <td className="px-4 py-3">{date}</td>
//                   <td className="px-4 py-3">
//                     <span
//                       className={`inline-flex items-center px-2 py-1 rounded-full font-medium text-xs
//                       ${
//                         trade.side === "long"
//                           ? "bg-green-100 text-green-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {trade.tradeType.replace(/_/g, " ")}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">
//                     {MARKETS[trade.market]?.name || trade.market}
//                   </td>
//                   <td className="px-4 py-3 text-right">
//                     <div className="flex flex-col">
//                       {trade.collateralAmount
//                         ? formatMarketValue(
//                             Number(trade.collateralAmount),
//                             trade.market
//                           )
//                         : trade.finalCollateralAmount
//                         ? formatMarketValue(
//                             Number(trade.finalCollateralAmount),
//                             trade.market
//                           )
//                         : "-"}{" "}
//                       {MARKETS[trade.market].name}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {trade.collateralAmount
//                         ? formatCurrency(
//                             formatMarketValue(
//                               Number(trade.collateralAmount),
//                               trade.market
//                             ) *
//                               Number(trade.entryPrice) *
//                               1e-8
//                           )
//                         : "-"}
//                     </div>
//                   </td>
//                   <td className="px-4 py-3 text-right">
//                     {trade.sizeUsd
//                       ? formatCurrency(Number(trade.sizeUsd) * 1e-6)
//                       : trade.finalSizeUsd
//                       ? formatCurrency(Number(trade.finalSizeUsd) * 1e-6)
//                       : trade.price
//                       ? formatCurrency(
//                           (Number(trade.price) * 1e-6) /
//                             (Number(trade.collateralAmount) /
//                               MARKETS[trade.market].denomination)
//                         )
//                       : "-"}
//                   </td>
//                   <td className="px-4 py-3 text-right">
//                     {trade.tradeType === "CLOSE_POSITION" ||
//                     trade.tradeType === "REMOVE_COLLATERAL" ||
//                     trade.tradeType === "DECREASE_SIZE"
//                       ? "-"
//                       : trade.entryPrice
//                       ? formatCurrency(Number(trade.entryPrice) * 1e-8)
//                       : trade.oraclePrice
//                       ? formatCurrency(Number(trade.oraclePrice) * 1e-8)
//                       : trade.price &&
//                         trade.tradeType !== "INCREASE_SIZE" &&
//                         trade.tradeType !== "DECREASE_SIZE" &&
//                         trade.tradeType !== "LIQUIDATE"
//                       ? formatCurrency(Number(trade.price) * 1e-6)
//                       : trade.tradeType === "INCREASE_SIZE"
//                       ? formatCurrency(
//                           Number(trade.sizeUsd * 1e-6) /
//                             (Number(trade.sizeAmount) /
//                               MARKETS[trade.market].denomination)
//                         )
//                       : "-"}
//                   </td>
//                   <td className="px-4 py-3 text-right">
//                     {trade.tradeType === "CLOSE_POSITION" ||
//                     trade.tradeType === "REMOVE_COLLATERAL" ||
//                     trade.tradeType === "DECREASE_SIZE" ||
//                     trade.tradeType === "LIQUIDATE"
//                       ? trade.exitPrice
//                         ? formatCurrency(Number(trade.exitPrice) * 1e-8)
//                         : trade.oraclePrice
//                         ? formatCurrency(Number(trade.oraclePrice) * 1e-8)
//                         : trade.tradeType === "DECREASE_SIZE" ||
//                           trade.tradeType === "LIQUIDATE"
//                         ? formatCurrency(
//                             Number(trade.sizeUsd * 1e-6) /
//                               (Number(trade.sizeAmount) /
//                                 MARKETS[trade.market].denomination)
//                           )
//                         : trade.price
//                         ? formatCurrency(Number(trade.price) * 1e-6)
//                         : "-"
//                       : "-"}
//                   </td>
//                   <td
//                     className={`px-4 py-3 text-right ${
//                       Number(trade.pnlUsd) * 1e-6 > 0
//                         ? "text-green-500"
//                         : "text-red-500"
//                     }`}
//                   >
//                     {trade.pnlUsd
//                       ? formatCurrency(Number(trade.pnlUsd) * 1e-6)
//                       : "-"}
//                   </td>
//                   <td className="px-4 py-3 text-right text-gray-500">
//                     <div className="flex flex-col">
//                       <div>
//                         {trade.feeAmount
//                           ? formatMarketValue(trade.feeAmount, trade.market)
//                           : "-"}
//                       </div>
//                       <div>
//                         {feeInUsd !== `$${NaN}` && feeInUsd !== "$0.00"
//                           ? feeInUsd
//                           : "-"}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 py-3 text-right">
//                     <a
//                       href={`https://explorer.solana.com/tx/${trade.txId}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       View
//                     </a>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//           disabled={currentPage === 1}
//           className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span className="text-sm text-gray-500">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//           disabled={currentPage === totalPages}
//           className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </Card>
//   );
// }


import React, { useState, useMemo } from "react";
import { Card } from "@tremor/react";
import {
  formatMarketValue,
  formatCurrency,
  formatTimestamp,
} from "@/src/lib/utils/formatters";
import { MARKETS } from "@/src/lib/utils/markets";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { TradesTableProps } from "@/src/types/types";

// Type for sort configuration
type SortConfig = {
  key: string;
  direction: "asc" | "desc";
};

// Type for filter configuration
type FilterConfig = {
  market: string;
  type: string;
  side: string;
  minAmount: string;
  maxAmount: string;
};

export default function TradesTable({
  itemsPerPage = 10,
  trades,
}: TradesTableProps) {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "timestamp",
    direction: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterConfig>({
    market: "",
    type: "",
    side: "",
    minAmount: "",
    maxAmount: "",
  });

  // Get unique values for filter dropdowns
  const filterOptions = useMemo(
    () => ({
      markets: [
        ...new Set(
          trades.map((trade) => MARKETS[trade.market]?.name || trade.market)
        ),
      ],
      types: [...new Set(trades.map((trade) => trade.tradeType))],
      sides: [...new Set(trades.map((trade) => trade.side))],
    }),
    [trades]
  );

  // Apply filters to trades
  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      const matchesMarket =
        !filters.market ||
        (MARKETS[trade.market]?.name || trade.market) === filters.market;
      const matchesType = !filters.type || trade.tradeType === filters.type;
      const matchesSide = !filters.side || trade.side === filters.side;
      const amount = Number(trade.sizeUsd) * 1e-6;
      const matchesAmount =
        (!filters.minAmount || amount >= Number(filters.minAmount)) &&
        (!filters.maxAmount || amount <= Number(filters.maxAmount));

      return matchesMarket && matchesType && matchesSide && matchesAmount;
    });
  }, [trades, filters]);

  // Sort filtered trades
  const sortedTrades = useMemo(() => {
    return [...filteredTrades].sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.key) {
        case "timestamp":
          comparison = Number(a.timestamp) - Number(b.timestamp);
          break;
        case "size":
          comparison = Number(a.sizeUsd) * 1e-6 - Number(b.sizeUsd) * 1e-6;
          break;
        case "pnl":
          comparison = Number(a.pnlUsd) * 1e-6 - Number(b.pnlUsd) * 1e-6;
          break;
        // Add more sort cases as needed
      }
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredTrades, sortConfig]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedTrades.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleTrades = sortedTrades.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle sort click
  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Render sort indicator
  const SortIndicator = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUpIcon className="w-4 h-4" />
    ) : (
      <ChevronDownIcon className="w-4 h-4" />
    );
  };

  return (
    <Card className="mt-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium">Trading History</h3>
          <p className="text-sm text-gray-500">
            Showing {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, sortedTrades.length)} of{" "}
            {sortedTrades.length} trades
          </p>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <FunnelIcon className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Market Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Market</label>
              <select
                value={filters.market}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, market: e.target.value }))
                }
                className="w-full rounded-lg border-gray-300 dark:border-gray-600"
              >
                <option value="">All Markets</option>
                {filterOptions.markets.map((market) => (
                  <option key={market} value={market}>
                    {market}
                  </option>
                ))}
              </select>
            </div>

            {/* Trade Type Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Trade Type
              </label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, type: e.target.value }))
                }
                className="w-full rounded-lg border-gray-300 dark:border-gray-600"
              >
                <option value="">All Types</option>
                {filterOptions.types.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Side Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Side</label>
              <select
                value={filters.side}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, side: e.target.value }))
                }
                className="w-full rounded-lg border-gray-300 dark:border-gray-600"
              >
                <option value="">All Sides</option>
                {filterOptions.sides.map((side) => (
                  <option key={side} value={side}>
                    {side}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount Range Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Min Amount
              </label>
              <input
                type="number"
                value={filters.minAmount}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, minAmount: e.target.value }))
                }
                className="w-full rounded-lg border-gray-300 dark:border-gray-600"
                placeholder="Min USD"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Max Amount
              </label>
              <input
                type="number"
                value={filters.maxAmount}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, maxAmount: e.target.value }))
                }
                className="w-full rounded-lg border-gray-300 dark:border-gray-600"
                placeholder="Max USD"
              />
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSort("timestamp")}
              >
                <div className="flex items-center gap-1">
                  Time
                  <SortIndicator columnKey="timestamp" />
                </div>
              </th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Market</th>
              <th className="px-4 py-3 text-left">Side</th>
              <th
                className="px-4 py-3 text-right cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSort("size")}
              >
                <div className="flex items-center justify-end gap-1">
                  Size
                  <SortIndicator columnKey="size" />
                </div>
              </th>
              <th className="px-4 py-3 text-right">Entry</th>
              <th className="px-4 py-3 text-right">Exit</th>
              <th
                className="px-4 py-3 text-right cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSort("pnl")}
              >
                <div className="flex items-center justify-end gap-1">
                  PnL
                  <SortIndicator columnKey="pnl" />
                </div>
              </th>
              <th className="px-4 py-3 text-right">Fees</th>
              <th className="px-4 py-3 text-right">Transaction</th>
            </tr>
          </thead>
          <tbody>
            {visibleTrades.map((trade) => (
              <tr
                key={trade.txId}
                className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="px-4 py-3">
                  {formatTimestamp(trade.timestamp)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                    ${
                      trade.side === "long"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {trade.tradeType.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {MARKETS[trade.market]?.name || trade.market}
                </td>
                <td className="px-4 py-3">{trade.side}</td>
                <td className="px-4 py-3 text-right">
                  {formatCurrency(Number(trade.sizeUsd) * 1e-6)}
                </td>
                <td className="px-4 py-3 text-right">
                  {trade.entryPrice
                    ? formatCurrency(Number(trade.entryPrice) * 1e-8)
                    : "-"}
                </td>
                <td className="px-4 py-3 text-right">
                  {trade.exitPrice
                    ? formatCurrency(Number(trade.exitPrice) * 1e-8)
                    : "-"}
                </td>
                <td
                  className={`px-4 py-3 text-right ${
                    Number(trade.pnlUsd) * 1e-6 > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formatCurrency(Number(trade.pnlUsd) * 1e-6)}
                </td>
                <td className="px-4 py-3 text-right text-gray-500">
                  {formatMarketValue(trade.feeAmount, trade.market)}
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={`https://explorer.solana.com/tx/${trade.txId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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