import { Card, BarChart } from "@tremor/react";
import { TradingData } from "../../src/types/types";
import { MARKETS } from "../../src/lib/utils/markets";
import { formatUSD } from "../../src/lib/utils/formatters";

interface PositionAnalysisProps {
  trades: TradingData[];
}

interface MarketMetrics {
  totalPnL: number;
  totalVolume: number;
  winCount: number;
  lossCount: number;
  avgLeverage: number;
  avgDuration: number;
  longPnL: number;
  shortPnL: number;
}

function calculateMarketMetrics(trades: TradingData[]): {
  [key: string]: MarketMetrics;
} {
  const metrics: { [key: string]: MarketMetrics } = {};

  trades.forEach((trade) => {
    if (trade.tradeType !== "CLOSE_POSITION") return;

    const market = MARKETS[trade.market];
    if (!market) {
      console.warn(`Unknown market: ${trade.market}`);
      return;
    }

    const marketKey = market.isShortMarket
      ? `${market.name}-SHORT`
      : market.name;

    if (!metrics[marketKey]) {
      metrics[marketKey] = {
        totalPnL: 0,
        totalVolume: 0,
        winCount: 0,
        lossCount: 0,
        avgLeverage: 0,
        avgDuration: 0,
        longPnL: 0,
        shortPnL: 0,
      };
    }

    const pnl = parseFloat(trade.netPnlUsd) * 1e-6;
    const volume = parseFloat(trade.sizeUsd) * 1e-6;
    const duration = parseInt(trade.duration || "0");
    const isShort = market.isShortMarket;

    metrics[marketKey].totalPnL += pnl;
    metrics[marketKey].totalVolume += volume;
    metrics[marketKey].avgDuration =
      (metrics[marketKey].avgDuration + duration) / 2;

    if (pnl > 0) metrics[marketKey].winCount++;
    else metrics[marketKey].lossCount++;

    if (isShort) metrics[marketKey].shortPnL += pnl;
    else metrics[marketKey].longPnL += pnl;
  });

  return metrics;
}

export default function PositionAnalysis({ trades }: PositionAnalysisProps) {
  const marketMetrics = calculateMarketMetrics(trades);

  const marketPerformance = Object.entries(marketMetrics).map(
    ([market, metrics]) => ({
      market,
      "Win Rate":
        (metrics.winCount / (metrics.winCount + metrics.lossCount)) * 100,
      "Long PnL": metrics.longPnL,
      "Short PnL": metrics.shortPnL,
      "Avg Duration (hours)": metrics.avgDuration / 3600,
    })
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Position Analysis</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-lg font-medium mb-4">Market Performance</h3>
          <BarChart
            className="h-72"
            data={marketPerformance}
            index="market"
            categories={["Long PnL", "Short PnL"]}
            colors={["emerald", "blue"]}
            valueFormatter={formatUSD}
            stack
          />
        </Card>

        <Card>
          <h3 className="text-lg font-medium mb-4">Win Rate by Market</h3>
          <BarChart
            className="h-72"
            data={marketPerformance}
            index="market"
            categories={["Win Rate"]}
            colors={["violet"]}
            valueFormatter={(value) => `${value.toFixed(1)}%`}
          />
        </Card>
      </div>
    </div>
  );
}
