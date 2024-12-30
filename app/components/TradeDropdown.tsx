import React from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { formatCurrency, formatMarketValue } from "@/src/lib/utils/formatters";
import { MARKETS } from "@/src/lib/utils/markets";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
const TradeDropdown = ({
  trade,
  dateMonthDay,
  dateHourMinute,
  feeInUsd,
  isOpen,
  onToggle,
  activeTradeId,
  setActiveTradeId,
}: {
  trade: any;
  dateMonthDay: any;
  dateHourMinute: any;
  feeInUsd: any;
  isOpen: boolean;
  onToggle: () => void;
  activeTradeId: number | string | null;
  setActiveTradeId: (id: number | string | null) => void;
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 920px)" });

  const handleToggle = () => {
    if (activeTradeId === trade.txId) {
      setActiveTradeId(null); // Close if already open
    } else {
      setActiveTradeId(trade.txId); // Open this trade and close others
    }
    onToggle();
  };

  return (
    <div className="mb-2 border border-gray-200 dark:border-gray-800 rounded-lg shadow-strong border-t ring-1 bg-tremor-background ring-tremor-ring dark:bg-dark-tremor-background dark:ring-dark-tremor-ring">
      <div
        className="flex justify-between items-center p-2 cursor-pointer relative"
        onClick={handleToggle}
      >
        <table className="min-w-full">
          <thead>
            <tr className="border-b text-xs border-gray-200 dark:border-gray-800">
              <th className="px-4 py-2 text-left">
                {isMobile ? "Market" : "Market/Date"}
              </th>
              <th className="px-4 py-2 text-left">
                {isMobile ? "Trade" : "Trade Type"}
              </th>
              <th className="px-4 py-2 text-left">Entry/Exit</th>
              <th className="px-4 py-2 text-left">P&L</th>
              <th className="px-4 py-2 text-left"></th>
            </tr>
          </thead>
          <tbody className="items-center text-sm">
            <tr className="border-gray-200 dark:border-gray-800">
              <td className="px-4 py-3 text-left w-1/4">
                {MARKETS[trade.market]?.name.replace("-SHORT", "") ||
                  trade.market.replace("-SHORT", "")}
                <br />
                <div
                  className={`text-[${isMobile ? "8px" : "12px"}] ${
                    isMobile ? "" : "text-gray-500"
                  }`}
                >
                  {isMobile ? (
                    <>
                      {dateMonthDay}
                      <br />
                      {dateHourMinute}
                    </>
                  ) : (
                    dateMonthDay + ", " + dateHourMinute
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-left w-1/4">
                <div
                  className={`inline-flex items-center px-2 py-[1px] rounded-full text-[10px] font-bold ${
                    trade.side === "long"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {isMobile
                    ? trade.tradeType
                        .replace(/_/g, " ")
                        .replace("POSITION", "")
                        .replace("COLLATERAL", "")
                        .replace("DECREASE", "DEC/SZ")
                        .replace("INCREASE", "INC/SZ")
                        .replace("LIQUIDATE", "LIQ")
                        .replace("SIZE", "")
                        .replace("STOP LOSS", "S/L")
                        .replace("TAKE PROFIT", "T/P")
                    : trade.tradeType.replace(/_/g, " ")}
                </div>
              </td>
              <td
                className={`px-4 py-3 text-left w-1/4 ${
                  trade.exitPrice ? "text-red-500" : "text-green-500"
                }`}
              >
                {trade.exitPrice ? (
                  <>{formatCurrency(Number(trade.exitPrice) * 1e-8)}</>
                ) : trade.entryPrice ? (
                  <>{formatCurrency(Number(trade.entryPrice) * 1e-8)}</>
                ) : null}
              </td>
              <td
                className={`px-4 py-3 text-left w-1/4 ${
                  Number(trade.pnlUsd) * 1e-6 > 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {trade.pnlUsd ? (
                  <>{formatCurrency(Number(trade.pnlUsd) * 1e-6)}</>
                ) : null}
              </td>
              <td
                className={`flex items-center justify-center ${
                  isMobile ? "px-2 mt-5" : "px-4 mt-5"
                }`}
              >
                {isOpen ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {isOpen && (
        <div className="p-4 border-t ring-1 bg-tremor-background ring-tremor-ring dark:bg-dark-tremor-background dark:ring-dark-tremor-ring shadow-strong">
          {isMobile ? (
            <div className="flex text-xs flex-col space-y-4">
              <div className="flex justify-between">
                <span className="font-bold">Size:</span>
                <span>
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
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Fee/FeeUSD:</span>
                <span className="text-gray-500 text-right">
                  {trade.feeAmount
                    ? formatMarketValue(trade.feeAmount, trade.market)
                    : "-"}
                  <br />
                  {feeInUsd !== `$${NaN}` && feeInUsd !== "$0.00"
                    ? feeInUsd
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Collateral:</span>
                <span>
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
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Entry:</span>
                <span>
                  {trade.entryPrice
                    ? formatCurrency(Number(trade.entryPrice) * 1e-8)
                    : trade.oraclePrice
                    ? formatCurrency(Number(trade.oraclePrice) * 1e-8)
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Exit:</span>
                <span>
                  {trade.exitPrice
                    ? formatCurrency(Number(trade.exitPrice) * 1e-8)
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Transaction:</span>
                <Link
                  href={`https://explorer.solana.com/tx/${trade.txId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  View
                </Link>
              </div>
            </div>
          ) : (
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
                  </td>
                  <td className="px-4 py-2 text-left">
                    {trade.entryPrice
                      ? formatCurrency(Number(trade.entryPrice) * 1e-8)
                      : trade.oraclePrice
                      ? formatCurrency(Number(trade.oraclePrice) * 1e-8)
                      : "-"}
                  </td>
                  <td className="px-4 py-2 text-left">
                    {trade.exitPrice
                      ? formatCurrency(Number(trade.exitPrice) * 1e-8)
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
          )}
        </div>
      )}
    </div>
  );
};

export default TradeDropdown;
