import { Card } from "@tremor/react";
import { formatUSD } from "@/src/lib/utils/formatters";
import { TradingStatsProps } from "@/src/types/types";

export default function TradingStats({
  avgTradeSize,
  largestWin,
  largestLoss,
}: TradingStatsProps) {

  return (
    <Card>
      <h3 className="text-md font-medium mb-4">Trading Statistics</h3>
      <div className="grid grid-cols-2">
        <div>
          <p className="text-sm text-gray-500">Avg Trade Size</p>
          <p className="text-sm font-semibold">{formatUSD(avgTradeSize)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">Largest Trade</p>
          <div className="flex flex-row gap-2">
            <p className="text-xs text-center text-gray-500">Win</p>
            <p className="text-xs font-semibold text-green-500">
              {formatUSD(largestWin)}
            </p>
            <p className="text-xs text-center text-gray-500">Loss</p>
            <p className="text-xs font-semibold text-red-500">
              {formatUSD(largestLoss)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
