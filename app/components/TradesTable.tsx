import { Card } from "@tremor/react";
import {
  formatMarketValue,
  formatCurrency,
  formatTimestamp,
} from "../../src/lib/utils/formatters";
import { MARKETS } from "../../src/lib/utils/markets";
import { useState } from "react";
import { TradesTableProps } from "../../src/types/types";

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
    <Card className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Trading History</h3>
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1}-{Math.min(endIndex, trades.length)} of{" "}
          {trades.length} trades
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Market</th>
              <th className="px-4 py-3 text-left">Collateral</th>
              <th className="px-4 py-3 text-right">Size</th>
              <th className="px-4 py-3 text-right">Entry</th>
              <th className="px-4 py-3 text-right">Exit</th>
              <th className="px-4 py-3 text-right">PnL</th>
              <th className="px-4 py-3 text-right">Fee/Fee USD</th>
              <th className="px-4 py-3 text-right">Trx</th>
            </tr>
          </thead>
          <tbody>
            {currentTrades.map((trade) => {
              const date = formatTimestamp(trade.timestamp);

              const feeInUsd =
                trade.side === "long"
                  ? trade.entryPrice || trade.oraclePrice
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
                    : "-"
                  : formatCurrency(
                      formatMarketValue(trade.feeAmount, trade.market)
                    );
              return (
                <tr
                  key={trade.txId}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <td className="px-4 py-3">{date}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full font-medium text-xs
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
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-col">
                      {trade.collateralAmount
                        ? formatMarketValue(
                            Number(trade.collateralAmount),
                            trade.market
                          )
                        : trade.finalCollateralAmount
                        ? formatMarketValue(
                            Number(trade.finalCollateralAmount),
                            trade.market
                          )
                        : "-"}{" "}
                      {MARKETS[trade.market].name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {trade.collateralAmount
                        ? formatCurrency(
                            formatMarketValue(
                              Number(trade.collateralAmount),
                              trade.market
                            ) *
                              Number(trade.entryPrice) *
                              1e-8
                          )
                        : "-"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {trade.sizeUsd
                      ? formatCurrency(Number(trade.sizeUsd) * 1e-6)
                      : trade.finalSizeUsd
                      ? formatCurrency(Number(trade.finalSizeUsd) * 1e-6)
                      : trade.price
                      ? formatCurrency(
                          (Number(trade.price) * 1e-6) /
                            (Number(trade.collateralAmount) /
                              MARKETS[trade.market].denomination)
                        )
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {trade.tradeType === "CLOSE_POSITION" ||
                    trade.tradeType === "REMOVE_COLLATERAL" ||
                    trade.tradeType === "DECREASE_SIZE"
                      ? "-"
                      : trade.entryPrice
                      ? formatCurrency(Number(trade.entryPrice) * 1e-8)
                      : trade.oraclePrice
                      ? formatCurrency(Number(trade.oraclePrice) * 1e-8)
                      : trade.price &&
                        trade.tradeType !== "INCREASE_SIZE" &&
                        trade.tradeType !== "DECREASE_SIZE" &&
                        trade.tradeType !== "LIQUIDATE"
                      ? formatCurrency(Number(trade.price) * 1e-6)
                      : trade.tradeType === "INCREASE_SIZE"
                      ? formatCurrency(
                          Number(trade.sizeUsd * 1e-6) /
                            (Number(trade.sizeAmount) /
                              MARKETS[trade.market].denomination)
                        )
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {trade.tradeType === "CLOSE_POSITION" ||
                    trade.tradeType === "REMOVE_COLLATERAL" ||
                    trade.tradeType === "DECREASE_SIZE" ||
                    trade.tradeType === "LIQUIDATE"
                      ? trade.exitPrice
                        ? formatCurrency(Number(trade.exitPrice) * 1e-8)
                        : trade.oraclePrice
                        ? formatCurrency(Number(trade.oraclePrice) * 1e-8)
                        : trade.tradeType === "DECREASE_SIZE" ||
                          trade.tradeType === "LIQUIDATE"
                        ? formatCurrency(
                            Number(trade.sizeUsd * 1e-6) /
                              (Number(trade.sizeAmount) /
                                MARKETS[trade.market].denomination)
                          )
                        : trade.price
                        ? formatCurrency(Number(trade.price) * 1e-6)
                        : "-"
                      : "-"}
                  </td>
                  <td
                    className={`px-4 py-3 text-right ${
                      Number(trade.pnlUsd) * 1e-6 > 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {trade.pnlUsd
                      ? formatCurrency(Number(trade.pnlUsd) * 1e-6)
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500">
                    <div className="flex flex-col">
                      <div>
                        {trade.feeAmount
                          ? formatMarketValue(trade.feeAmount, trade.market)
                          : "-"}
                      </div>
                      <div>
                        {feeInUsd !== `$${NaN}` && feeInUsd !== "$0.00"
                          ? feeInUsd
                          : "-"}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={`https://explorer.solana.com/tx/${trade.txId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
