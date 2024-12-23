import { Card } from "@tremor/react";
import { formatUSD, formatPercentage } from "../../src/lib/utils/formatters";
import { TradingStatsProps } from "../../src/types/types";

export default function TradingStats({
  winCount,
  lossCount,
  avgTradeSize,
  largestWin,
  largestLoss,
}: TradingStatsProps) {
  const winRate = (winCount / (winCount + lossCount)) * 100 || 0;

  return (
    <Card>
      <h3 className="text-lg font-medium mb-4">Trading Statistics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Win Rate</p>
          <p className="text-xl font-semibold">{formatPercentage(winRate)}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Avg Trade Size</p>
          <p className="text-xl font-semibold">{formatUSD(avgTradeSize)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">Largest Trade</p>
          <div className="flex flex-row gap-2">
            <p className="text-sm text-center w-1/2 text-gray-500">Win</p>
            <p className="text-xl font-semibold text-green-500">
              {formatUSD(largestWin)}
            </p>
            <p className="text-sm text-center w-1/2 text-gray-500">Loss</p>
            <p className="text-xl font-semibold text-red-500">
              {formatUSD(largestLoss)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
