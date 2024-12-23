import React from "react";
import { formatUSD, formatNumber } from "../../src/lib/utils/formatters";
import {
  calculateNetProfit,
  calculateTradingVolume,
  calculateTotalTrades,
  calculateGrossProfit,
  calculateFeesPaid,
  calculateWinRate,
  calculateAvgTradeSize,
  calculateLargestTrades,
  calculateAvgTradeDuration,
  calculateLongShortRatios,
  calculateAvgLongShortTrades,
} from "../../src/lib/utils/formatters";
import { TradingMetricsDisplayProps } from "../../src/types/types";

const TradingMetricsDisplay: React.FC<TradingMetricsDisplayProps> = ({
  trades,
}) => {
  const netProfit = calculateNetProfit(trades);
  const tradingVolume = calculateTradingVolume(trades);
  const totalTrades = calculateTotalTrades(trades);
  const grossProfit = calculateGrossProfit(trades);
  const feesPaid = calculateFeesPaid(trades);
  const winRate = calculateWinRate(trades);
  const avgTradeSize = calculateAvgTradeSize(trades);
  const { largestWin, largestLoss } = calculateLargestTrades(trades);
  const avgTradeDuration = calculateAvgTradeDuration(trades);
  const { longRatio, shortRatio } = calculateLongShortRatios(trades);
  const { avgLongPnL, avgShortPnL } = calculateAvgLongShortTrades(trades);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Net Profit</h3>
        <p className="text-xl">{formatUSD(netProfit)}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Trading Volume</h3>
        <p className="text-xl">{formatUSD(tradingVolume)}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Total Trades</h3>
        <p className="text-xl">{formatNumber(totalTrades)}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Gross Profit</h3>
        <p className="text-xl">{formatUSD(grossProfit)}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Fees Paid</h3>
        <p className="text-xl">{feesPaid}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Win Rate</h3>
        <p className="text-xl">{winRate.toFixed(2)}%</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Avg Trade Size</h3>
        <p className="text-xl">{formatUSD(avgTradeSize)}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Largest Win</h3>
        <p className="text-xl">{formatUSD(largestWin)}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Largest Loss</h3>
        <p className="text-xl">{formatUSD(largestLoss * 1e-6)}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Avg Trade Duration</h3>
        <p className="text-xl">{avgTradeDuration}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Long Win Ratio</h3>
        <p className="text-xl">{longRatio.toFixed(2)}%</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Short Win Ratio</h3>
        <p className="text-xl">{shortRatio.toFixed(2)}%</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Avg Long PnL</h3>
        <p className="text-xl">{formatUSD(avgLongPnL)}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Avg Short PnL</h3>
        <p className="text-xl">{formatUSD(avgShortPnL)}</p>
      </div>
    </div>
  );
};

export default TradingMetricsDisplay;
