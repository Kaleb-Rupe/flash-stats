// import { calculatePnLMetrics } from "../utils/pnlAnalytics";
// import { fetchTradingHistory, fetchPnLInfo } from "./tradingApi";
// import { ChartDataPoint } from "../../types/types";

// import { MARKETS } from "../utils/markets";

// export const fetchAndProcessPnLData = async (
//   address: string,
//   start?: number | null,
//   end?: number | null
// ) => {
//   try {
//     const pnlData = await fetchPnLInfo(address);

//     pnlData.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));

//     let runningPnL = 0;
//     let runningNetPnL = 0;
//     let totalVolume = 0;
//     let totalFeesPaid = 0;
//     let tradeCount = 0;
//     const chartDataPoints: ChartDataPoint[] = [];

//     for (let trade of pnlData) {
//       const timestamp = Number(trade.timestamp);
//       if (start && end && (timestamp < start || timestamp > end)) continue;

//       tradeCount += 1;
//       runningPnL += trade.pnlUsd * 1e-6;
//       runningNetPnL += Number(trade.netPnlUsd) * 1e-6;
//       totalVolume += trade.totalVolumeUsd * 1e-6;
//       totalFeesPaid += trade.totalFeesUsd * 1e-6;

//       chartDataPoints.push({
//         date: new Date(timestamp * 1000).toLocaleDateString(),
//         timestamp,
//         PNL: runningPnL,
//         "Net PNL": runningNetPnL,
//       });
//     }

//     let wins = 0;
//     let losses = 0;
//     let totalTradeSize = 0;
//     let tradeCountMax = 0;
//     let maxWin = 0;
//     let maxLoss = 0;

//     for (let trade of pnlData) {
//       const pnl = trade.pnlUsd * 1e-6;
//       const tradeSize = trade.sizeUsd ? Number(trade.sizeUsd) * 1e-6 : 0;

//       if (
//         trade.tradeType === "CLOSE_POSITION" ||
//         trade.tradeType === "STOP_LOSS" ||
//         trade.tradeType === "TAKE_PROFIT" ||
//         trade.tradeType === "LIQUIDATE"
//       ) {
//         if (pnl > 0) {
//           wins++;
//           maxWin = Math.max(maxWin, pnl);
//         } else {
//           losses++;
//           maxLoss = Math.min(maxLoss, pnl);
//         }
//       }

//       if (trade.side === "long" || trade.side === "short") {
//         if (trade.sizeUsd) {
//           totalTradeSize += tradeSize;
//           tradeCountMax++;
//         }
//       }
//     }

//     const volumeDataPoints = pnlData.reduce((acc: any[], trade) => {
//       const date = new Date(
//         Number(trade.timestamp) * 1000
//       ).toLocaleDateString();
//       const volume = trade.totalVolumeUsd * 1e-6;
//       const existingPoint = acc.find((point) => point.date === date);

//       if (existingPoint) {
//         existingPoint.volume += volume;
//       } else {
//         acc.push({ date, volume });
//       }
//       return acc;
//     }, []);

//     const marketData = pnlData.reduce(
//       (acc: { [key: string]: number }, trade) => {
//         const market = MARKETS[trade.market]?.name || trade.market;
//         acc[market] = (acc[market] || 0) + trade.totalVolumeUsd * 1e-6;
//         return acc;
//       },
//       {}
//     );

//     const marketDistributionData = Object.entries(marketData).map(
//       ([name, value]) => ({
//         name,
//         value,
//       })
//     );

//     const metrics = calculatePnLMetrics(pnlData);
//     const averageTradeSize =
//       tradeCountMax > 0 ? totalTradeSize / tradeCountMax : 0;

//     return {
//       pnlMetrics: metrics,
//       netPnL: parseFloat(runningNetPnL.toFixed(2)),
//       tradingVolume: parseFloat(totalVolume.toFixed(2)),
//       totalFees: parseFloat(totalFeesPaid.toFixed(2)),
//       chartData: chartDataPoints,
//       tradingHistory: pnlData,
//       totalTradingCount: tradeCount,
//       winCount: wins,
//       lossCount: losses,
//       avgTradeSize: averageTradeSize,
//       largestWin: maxWin,
//       largestLoss: maxLoss,
//       volumeData: volumeDataPoints,
//       marketDistribution: marketDistributionData,
//       grossProfit: parseFloat((runningNetPnL + totalFeesPaid).toFixed(2)),
//     };
//   } catch (error) {
//     console.error("Failed to fetch and process PnL data:", error);
//     throw error;
//   }
// };

// export const fetchAndProcessTradingHistoryData = async (
//   address: string,
//   start?: number | null,
//   end?: number | null
// ) => {
//   try {
//     const tradingData = await fetchTradingHistory(address);
//     tradingData.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));

//     const formattedTradingHistory = tradingData
//       .map((trade) => {
//         const timestamp = Number(trade.timestamp);
//         if (start && end && (timestamp < start || timestamp > end)) return null;

//         return {
//           txId: trade.txId,
//           timestamp: trade.timestamp,
//           market: trade.market,
//           side: trade.side,
//           tradeType: trade.tradeType,
//           price: trade.price,
//           pnlUsd: trade.pnlUsd,
//           feeAmount: trade.feeAmount,
//           sizeUsd: trade.sizeUsd,
//           entryPrice: trade.entryPrice,
//           exitPrice: trade.exitPrice,
//           duration: trade.duration,
//           exitPriceExponent: trade.exitPriceExponent,
//           entryPriceExponent: trade.entryPriceExponent,
//           oraclePrice: trade.oraclePrice,
//           oraclePriceExponent: trade.oraclePriceExponent,
//           sizeAmount: trade.sizeAmount,
//           finalSizeUsd: trade.finalSizeUsd,
//           collateralAmount: trade.collateralAmount,
//           finalCollateralAmount: trade.finalCollateralAmount,
//           collateralUsd: trade.collateralUsd,
//           finalCollateralUsd: trade.finalCollateralUsd,
//         };
//       })
//       .filter(Boolean); // Remove null values

//     return {
//       tradingHistory: formattedTradingHistory,
//       totalTradingCount: formattedTradingHistory.length,
//     };
//   } catch (error) {
//     console.error("Failed to fetch and process trading history data:", error);
//     throw error;
//   }
// };


import { calculatePnLMetrics } from "../utils/pnlAnalytics";
import { fetchTradingHistory, fetchPnLInfo } from "./tradingApi";
import { ChartDataPoint, TradingData } from "../../types/types";
import { MARKETS } from "../utils/markets";
import { groupBy, sumBy } from "lodash";

/**
 * Processes raw trading data and returns multiple formatted datasets
 * for different visualizations and analysis purposes.
 */
export const fetchAndProcessPnLData = async (
  address: string,
  start?: number | null,
  end?: number | null
) => {
  try {
    // Fetch raw trading data
    const pnlData = await fetchPnLInfo(address);

    // Sort data chronologically for accurate calculations
    pnlData.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));

    // Initialize accumulators for running calculations
    let runningPnL = 0;
    let runningNetPnL = 0;
    let totalVolume = 0;
    let totalFeesPaid = 0;
    const chartDataPoints: ChartDataPoint[] = [];

    // Process each trade and build time series data
    for (const trade of pnlData) {
      const timestamp = Number(trade.timestamp);

      // Apply time range filter if specified
      if (start && end && (timestamp < start || timestamp > end)) {
        continue;
      }

      // Update running totals
      const pnl = trade.pnlUsd * 1e-6;
      const netPnl = Number(trade.netPnlUsd) * 1e-6;
      const volume = trade.totalVolumeUsd * 1e-6;
      const fees = trade.totalFeesUsd * 1e-6;

      runningPnL += pnl;
      runningNetPnL += netPnl;
      totalVolume += volume;
      totalFeesPaid += fees;

      // Create chart data point
      chartDataPoints.push({
        date: new Date(timestamp * 1000).toLocaleDateString(),
        timestamp,
        PNL: runningPnL,
        "Net PNL": runningNetPnL,
      });
    }

    // Process trade outcomes
    const tradeOutcomes = processTradeOutcomes(pnlData);

    // Calculate market distribution
    const marketDistribution = calculateMarketDistribution(pnlData);

    // Process volume data
    const volumeData = processVolumeData(pnlData);

    // Calculate trade timing metrics
    const timingMetrics = calculateTradingTiming(pnlData);

    // Calculate advanced metrics
    const { wins, losses, totalTradeSize, tradeCountMax, maxWin, maxLoss } =
      calculateTradeMetrics(pnlData);

    // Return comprehensive trading analysis
    return {
      pnlMetrics: calculatePnLMetrics(pnlData),
      netPnL: parseFloat(runningNetPnL.toFixed(2)),
      tradingVolume: parseFloat(totalVolume.toFixed(2)),
      totalFees: parseFloat(totalFeesPaid.toFixed(2)),
      chartData: chartDataPoints,
      tradingHistory: pnlData,
      totalTradingCount: tradeCountMax,
      winCount: wins,
      lossCount: losses,
      avgTradeSize: tradeCountMax > 0 ? totalTradeSize / tradeCountMax : 0,
      largestWin: maxWin,
      largestLoss: maxLoss,
      volumeData,
      marketDistribution,
      grossProfit: parseFloat((runningNetPnL + totalFeesPaid).toFixed(2)),
      tradingTiming: timingMetrics,
      tradeOutcomes,
    };
  } catch (error) {
    console.error("Failed to fetch and process PnL data:", error);
    throw error;
  }
};

/**
 * Processes trade outcomes to analyze success rates and patterns
 */
function processTradeOutcomes(trades: TradingData[]) {
  const closedTrades = trades.filter(
    (trade) => trade.tradeType === "CLOSE_POSITION"
  );

  // Group trades by market
  const marketGroups = groupBy(
    closedTrades,
    (trade) => MARKETS[trade.market]?.name
  );

  return Object.entries(marketGroups).map(([market, trades]) => {
    const wins = trades.filter((t) => Number(t.pnlUsd) > 0).length;
    const total = trades.length;
    return {
      market,
      winRate: (wins / total) * 100,
      totalTrades: total,
      averagePnL: sumBy(trades, (t) => Number(t.pnlUsd) * 1e-6) / total,
    };
  });
}

/**
 * Calculates volume distribution across different markets
 */
function calculateMarketDistribution(trades: TradingData[]) {
  const marketVolumes = trades.reduce((acc, trade) => {
    const market = MARKETS[trade.market]?.name || trade.market;
    const volume = Number(trade.totalVolumeUsd) * 1e-6;
    acc[market] = (acc[market] || 0) + volume;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(marketVolumes).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }));
}

/**
 * Processes volume data for time-based analysis
 */
function processVolumeData(trades: TradingData[]) {
  return trades.reduce((acc: any[], trade) => {
    const date = new Date(Number(trade.timestamp) * 1000).toLocaleDateString();
    const volume = trade.totalVolumeUsd * 1e-6;
    const existingPoint = acc.find((point) => point.date === date);

    if (existingPoint) {
      existingPoint.volume += volume;
    } else {
      acc.push({ date, volume });
    }
    return acc;
  }, []);
}

/**
 * Analyzes trading patterns based on timing
 */
function calculateTradingTiming(trades: TradingData[]) {
  const hourlyPerformance = new Array(24).fill(0);
  const dayOfWeekPerformance = new Array(7).fill(0);

  trades.forEach((trade) => {
    if (trade.tradeType === "CLOSE_POSITION") {
      const date = new Date(Number(trade.timestamp) * 1000);
      const pnl = Number(trade.pnlUsd) * 1e-6;

      hourlyPerformance[date.getHours()] += pnl;
      dayOfWeekPerformance[date.getDay()] += pnl;
    }
  });

  return {
    hourlyPerformance,
    dayOfWeekPerformance,
  };
}

/**
 * Calculates core trading metrics
 */
function calculateTradeMetrics(trades: TradingData[]) {
  let wins = 0;
  let losses = 0;
  let totalTradeSize = 0;
  let tradeCountMax = 0;
  let maxWin = 0;
  let maxLoss = 0;

  trades.forEach((trade) => {
    const pnl = Number(trade.pnlUsd) * 1e-6;
    const tradeSize = Number(trade.sizeUsd) * 1e-6;

    if (trade.tradeType === "CLOSE_POSITION") {
      if (pnl > 0) {
        wins++;
        maxWin = Math.max(maxWin, pnl);
      } else {
        losses++;
        maxLoss = Math.min(maxLoss, pnl);
      }
    }

    if (trade.side === "long" || trade.side === "short") {
      if (trade.sizeUsd) {
        totalTradeSize += tradeSize;
        tradeCountMax++;
      }
    }
  });

  return {
    wins,
    losses,
    totalTradeSize,
    tradeCountMax,
    maxWin,
    maxLoss,
  };
}

/**
 * Processes trading history data with time range filtering
 */
export const fetchAndProcessTradingHistoryData = async (
  address: string,
  start?: number | null,
  end?: number | null
) => {
  try {
    const tradingData = await fetchTradingHistory(address);

    // Sort chronologically
    tradingData.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));

    // Apply time range filter and format data
    const formattedTradingHistory = tradingData
      .map((trade) => {
        const timestamp = Number(trade.timestamp);
        if (start && end && (timestamp < start || timestamp > end)) {
          return null;
        }

        return {
          txId: trade.txId,
          timestamp: trade.timestamp,
          market: trade.market,
          side: trade.side,
          tradeType: trade.tradeType,
          price: trade.price,
          pnlUsd: trade.pnlUsd,
          feeAmount: trade.feeAmount,
          sizeUsd: trade.sizeUsd,
          entryPrice: trade.entryPrice,
          exitPrice: trade.exitPrice,
          duration: trade.duration,
          exitPriceExponent: trade.exitPriceExponent,
          entryPriceExponent: trade.entryPriceExponent,
          oraclePrice: trade.oraclePrice,
          oraclePriceExponent: trade.oraclePriceExponent,
          sizeAmount: trade.sizeAmount,
          finalSizeUsd: trade.finalSizeUsd,
          collateralAmount: trade.collateralAmount,
          finalCollateralAmount: trade.finalCollateralAmount,
          collateralUsd: trade.collateralUsd,
          finalCollateralUsd: trade.finalCollateralUsd,
        };
      })
      .filter(Boolean); // Remove null entries

    return {
      tradingHistory: formattedTradingHistory,
      totalTradingCount: formattedTradingHistory.length,
    };
  } catch (error) {
    console.error("Failed to fetch and process trading history data:", error);
    throw error;
  }
};