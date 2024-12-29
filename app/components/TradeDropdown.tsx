import React, { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { formatCurrency, formatMarketValue } from "@/src/lib/utils/formatters";
import { MARKETS } from "@/src/lib/utils/markets";
import Link from "next/link";

const TradeDropdown = ({
  trade,
  date,
  feeInUsd,
}: {
  trade: any;
  date: any;
  feeInUsd: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="mb-2 border border-gray-200 dark:border-gray-800 rounded-lg shadow-strong">
      <div
        className="flex justify-between items-center p-2 cursor-pointer relative"
        onClick={toggleDropdown}
      >
        <div className="flex-grow flex items-center justify-between">
          <span className="px-4 py-3">
            {MARKETS[trade.market]?.name || trade.market}
          </span>
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
          <div
            className={`px-4 py-3 text-left ${
              Number(trade.pnlUsd) * 1e-6 > 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            P&L:{" "}
            {trade.pnlUsd ? formatCurrency(Number(trade.pnlUsd) * 1e-6) : "-"}
          </div>
          <div className="text-sm text-gray-500">Time: {date}</div>
        </div>
        <div className="flex items-center justify-center px-4 ml-8">
          {isOpen ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="p-4 bg-gray-50 dark:bg-gray-900">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-4 py-2 text-left">Size</th>
                <th className="px-4 py-2 text-left">Fee/FeeUSD</th>
                <th className="px-4 py-2 text-left">Collateral</th>
                <th className="px-4 py-2 text-left">Entry</th>
                <th className="px-4 py-2 text-left">Exit</th>
                <th className="px-4 py-2 text-left">Transaction</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 text-left">
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
                <td className="px-4 py-2 text-left text-gray-500">
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
                <td className="px-4 py-2 text-left">
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
                <td className="px-4 py-2 text-left">
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
                      // && trade.tradeType !== "DECREASE_SIZE"
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
                <td className="px-4 py-2 text-left">
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
                <td className="px-4 py-2 text-left">
                  <Link
                    href={`https://explorer.solana.com/tx/${trade.txId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TradeDropdown;
