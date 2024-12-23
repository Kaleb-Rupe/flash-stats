import { TradingData } from "../../types/types";
import { MARKETS } from "./markets";

interface PnLMetrics {
  byMarket: { [key: string]: number };
  bySize: {
    small: number;
    medium: number;
    large: number;
  };
  byDuration: {
    shortTerm: number; // < 1 hour
    mediumTerm: number; // 1-24 hours
    longTerm: number; // > 24 hours
  };
  byTimeOfDay: {
    [key: string]: number; // 0-23 hours
  };
  winCount: number;
  lossCount: number;
  largestWin: number;
  largestLoss: number;
}

export function calculatePnLMetrics(trades: TradingData[]): PnLMetrics {
  const metrics: PnLMetrics = {
    byMarket: {},
    bySize: { small: 0, medium: 0, large: 0 },
    byDuration: { shortTerm: 0, mediumTerm: 0, longTerm: 0 },
    byTimeOfDay: {},
    winCount: 0,
    lossCount: 0,
    largestWin: 0,
    largestLoss: 0,
  };

  // Initialize time of day buckets
  for (let i = 0; i < 24; i++) {
    metrics.byTimeOfDay[i] = 0;
  }

  // Calculate size thresholds based on all trades
  const allSizes = trades
    .filter((t) => t.tradeType === "CLOSE_POSITION")
    .map((t) => parseFloat(t.sizeUsd) * 1e-6);
  const sizeSortedArray = [...allSizes].sort((a, b) => a - b);
  const smallThreshold =
    sizeSortedArray[Math.floor(sizeSortedArray.length * 0.33)];
  const largeThreshold =
    sizeSortedArray[Math.floor(sizeSortedArray.length * 0.66)];

  trades.forEach((trade) => {
    if (
      trade.tradeType === "CLOSE_POSITION" ||
      trade.tradeType === "LIQUIDATE"
    ) {
      const pnl = parseFloat(trade.netPnlUsd) * 1e-6;
      const size = parseFloat(trade.sizeUsd) * 1e-6;
      const duration = parseInt(trade.duration || "0");
      const timestamp = parseInt(trade.timestamp) * 1000;
      const hour = new Date(timestamp).getHours();

      // By market
      const marketName = MARKETS[trade.market]?.name || trade.market;
      metrics.byMarket[marketName] = (metrics.byMarket[marketName] || 0) + pnl;

      // By size
      if (size <= smallThreshold) {
        metrics.bySize.small += pnl;
      } else if (size > largeThreshold) {
        metrics.bySize.large += pnl;
      } else {
        metrics.bySize.medium += pnl;
      }

      // By duration
      if (duration < 3600) {
        metrics.byDuration.shortTerm += pnl;
      } else if (duration < 86400) {
        metrics.byDuration.mediumTerm += pnl;
      } else {
        metrics.byDuration.longTerm += pnl;
      }

      // By time of day
      metrics.byTimeOfDay[hour] = (metrics.byTimeOfDay[hour] || 0) + pnl;
    }
  });

  return metrics;
}
