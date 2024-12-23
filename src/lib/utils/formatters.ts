import { TradingHistoryData } from "../../types/types";
import { MARKETS } from "./markets";

export const formatMarketValue = (value: string | number, market: string) => {
  const marketInfo = MARKETS[market];
  if (!marketInfo) {
    console.error(`Unknown market: ${market}`);
    return 0;
  }
  return Number(value) / marketInfo.denomination;
};

export const formatFees = (value: string | number) => {
  return formatCurrency(Number(value) * 1e-6);
};

const hasConsecutiveTwoZeros = (value: number): boolean => {
  return value.toString().includes("." + "00") && value <= 1;
};

const hasConsecutiveThreeZeros = (value: number): boolean => {
  return value.toString().includes("." + "000") && value <= 1;
};

export const formatCurrency = (value: number) => {
  if (hasConsecutiveTwoZeros(value)) {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
      roundingMode: "expand",
    });
  } else if (hasConsecutiveThreeZeros(value)) {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 5,
      maximumFractionDigits: 5,
      roundingMode: "trunc",
    });
  } else {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      roundingMode: "trunc",
    });
  }
};

export const formatPercentage = (value: number) => {
  return value.toFixed(2);
};

export const formatUSD = (value: number) => {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    roundingMode: "trunc",
  });
};

export const formatNumber = (value: number) => {
  return Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
};

export const formatTimestamp = (timestamp: number) => {
  return (
    new Date(Number(timestamp) * 1000).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }) || "Invalid Date"
  );
};

export const calculateNetProfit = (trades: TradingHistoryData[]) => {
  let totalNetProfit = 0;
  let openPositions: { [key: string]: TradingHistoryData } = {};

  trades.forEach((trade) => {
    if (trade.tradeType === "OPEN_POSITION") {
      openPositions[trade.market] = trade; // Track open positions by market
    } else if (trade.tradeType === "CLOSE_POSITION") {
      const openTrade = openPositions[trade.market]; // Match with open position by market
      if (openTrade) {
        const pnl = trade.pnlUsd * 1e-6 || 0; // Calculate PnL in USD
        const fees = trade.feeAmount * 1e-6 || 0; // Calculate fees in USD
        totalNetProfit += pnl - fees; // Update total net profit
        delete openPositions[trade.market]; // Remove from open positions
      }
    }
  });

  return totalNetProfit;
};

export const calculateTradingVolume = (trades: TradingHistoryData[]) => {
  return trades.reduce((total, trade) => {
    return (
      total +
      (trade.tradeType === "OPEN_POSITION" ? trade.sizeUsd * 1e-6 || 0 : 0)
    );
  }, 0);
};

export const calculateTotalTrades = (trades: TradingHistoryData[]) => {
  return trades.filter((trade) => trade.tradeType === "OPEN_POSITION").length; // Count only open trades
};

export const calculateGrossProfit = (trades: TradingHistoryData[]) => {
  return trades.reduce((total, trade) => {
    return (
      total + (trade.tradeType === "CLOSE_POSITION" ? trade.pnlUsd || 0 : 0)
    );
  }, 0);
};

export const calculateFeesPaid = (trades: TradingHistoryData[]) => {
  return trades.reduce((total, trade) => {
    return (
      total + (trade.tradeType === "CLOSE_POSITION" ? trade.feeAmount || 0 : 0)
    );
  }, 0);
};

export const calculateWinRate = (trades: TradingHistoryData[]) => {
  const closedTrades = trades.filter(
    (trade) => trade.tradeType === "CLOSE_POSITION"
  );
  const wins = closedTrades.filter(
    (trade) => trade.pnlUsd > 0 && trade.pnlUsd !== null
  ).length;
  return closedTrades.length > 0 ? (wins / closedTrades.length) * 100 : 0;
};

export const calculateAvgTradeSize = (trades: TradingHistoryData[]) => {
  const totalVolume = calculateTradingVolume(trades);
  const totalTrades = calculateTotalTrades(trades);
  return totalTrades > 0 ? totalVolume / totalTrades : 0;
};

export const calculateLargestTrades = (trades: TradingHistoryData[]) => {
  const winningTrades = trades.filter(
    (trade) =>
      trade.tradeType === "CLOSE_POSITION" &&
      trade.pnlUsd > 0 &&
      trade.pnlUsd !== null
  );
  const losingTrades = trades.filter(
    (trade) =>
      trade.tradeType === "CLOSE_POSITION" &&
      trade.pnlUsd < 0 &&
      trade.pnlUsd !== null
  );

  const largestWin =
    winningTrades.length > 0
      ? Math.max(...winningTrades.map((trade) => trade.pnlUsd))
      : 0;

  const largestLoss =
    losingTrades.length > 0
      ? Math.min(...losingTrades.map((trade) => trade.pnlUsd))
      : 0;

  return { largestWin, largestLoss };
};

export const calculateAvgTradeDuration = (trades: TradingHistoryData[]) => {
  const totalDuration = trades.reduce((total, trade) => {
    return (
      total + (trade.tradeType === "CLOSE_POSITION" ? trade.duration || 0 : 0)
    );
  }, 0);

  const closedTrades = trades.filter(
    (trade) => trade.tradeType === "CLOSE_POSITION"
  );
  const avgDuration =
    closedTrades.length > 0 ? totalDuration / closedTrades.length : 0;

  // Determine the appropriate unit
  if (avgDuration < 60) {
    return `${avgDuration.toFixed(2)} Seconds`;
  } else if (avgDuration < 3600) {
    return `${(avgDuration / 60).toFixed(2)} Minutes`;
  } else {
    return `${(avgDuration / 3600).toFixed(2)} Hours`;
  }
};

export const calculateLongShortRatios = (trades: TradingHistoryData[]) => {
  let longCount = 0;
  let shortCount = 0;

  trades.forEach((trade) => {
    if (trade.tradeType === "CLOSE_POSITION") {
      if (trade.side === "long") {
        longCount++;
      } else if (trade.side === "short") {
        shortCount++;
      }
    }
  });

  const totalTrades = longCount + shortCount;
  return {
    longRatio: totalTrades > 0 ? (longCount / totalTrades) * 100 : 0,
    shortRatio: totalTrades > 0 ? (shortCount / totalTrades) * 100 : 0,
  };
};

export const calculateTradeDurationBreakdown = (
  trades: TradingHistoryData[]
) => {
  const durationBreakdown = {
    shortTerm: 0,
    mediumTerm: 0,
    longTerm: 0,
  };

  trades.forEach((trade) => {
    if (trade.tradeType === "CLOSE_POSITION") {
      const duration = trade.duration || 0;
      if (duration < 3600) {
        durationBreakdown.shortTerm++;
      } else if (duration < 86400) {
        durationBreakdown.mediumTerm++;
      } else {
        durationBreakdown.longTerm++;
      }
    }
  });

  return durationBreakdown;
};

export const calculateTradeSizeBreakdown = (trades: TradingHistoryData[]) => {
  const sizeBreakdown = {
    small: 0,
    medium: 0,
    large: 0,
  };

  const allSizes = trades
    .filter((trade) => trade.tradeType === "CLOSE_POSITION")
    .map((trade) => trade.sizeUsd * 1e-6);

  const sizeSortedArray = [...allSizes].sort((a, b) => a - b);
  const smallThreshold =
    sizeSortedArray[Math.floor(sizeSortedArray.length * 0.33)];
  const largeThreshold =
    sizeSortedArray[Math.floor(sizeSortedArray.length * 0.66)];

  trades.forEach((trade) => {
    if (trade.tradeType === "CLOSE_POSITION") {
      const size = trade.sizeUsd * 1e-6;
      if (size <= smallThreshold) {
        sizeBreakdown.small++;
      } else if (size > largeThreshold) {
        sizeBreakdown.large++;
      } else {
        sizeBreakdown.medium++;
      }
    }
  });

  return sizeBreakdown;
};

export const calculateTradeResultByTime = (trades: TradingHistoryData[]) => {
  const resultByTime: { [key: string]: number } = {};

  trades.forEach((trade) => {
    if (trade.tradeType === "CLOSE_POSITION") {
      const timestamp = trade.timestamp;
      const hour = new Date(timestamp * 1000).getHours();
      const pnl = trade.pnlUsd * 1e-6 || 0;

      if (!resultByTime[hour]) {
        resultByTime[hour] = 0;
      }
      resultByTime[hour] += pnl;
    }
  });

  return resultByTime;
};

export const calculateAvgLongShortTrades = (trades: TradingHistoryData[]) => {
  let longPnL = 0;
  let shortPnL = 0;
  let longCount = 0;
  let shortCount = 0;

  trades.forEach((trade) => {
    if (trade.tradeType === "CLOSE_POSITION") {
      const pnl = trade.pnlUsd * 1e-6 || 0;
      if (trade.side === "long") {
        longPnL += pnl;
        longCount++;
      } else if (trade.side === "short") {
        shortPnL += pnl;
        shortCount++;
      }
    }
  });

  return {
    avgLongPnL: longCount > 0 ? longPnL / longCount : 0,
    avgShortPnL: shortCount > 0 ? shortPnL / shortCount : 0,
  };
};

export const calculateLongShortWinRatios = (trades: TradingHistoryData[]) => {
  let longWins = 0;
  let longCount = 0;
  let shortWins = 0;
  let shortCount = 0;

  trades.forEach((trade) => {
    if (trade.tradeType === "CLOSE_POSITION") {
      const pnl = trade.pnlUsd * 1e-6 || 0;
      if (trade.side === "long") {
        longCount++;
        if (pnl > 0) longWins++;
      } else if (trade.side === "short") {
        shortCount++;
        if (pnl > 0) shortWins++;
      }
    }
  });

  return {
    longWinRatio: longCount > 0 ? (longWins / longCount) * 100 : 0,
    shortWinRatio: shortCount > 0 ? (shortWins / shortCount) * 100 : 0,
  };
};

// export const calculateFees = (trades: TradingHistoryData[]): number => {
//   let totalFees = 0;

//   trades.forEach((trade) => {
//     const marketInfo = MARKETS[trade.market];
//     if (!marketInfo) {
//       console.warn(`Unknown market: ${trade.market}`);
//       return;
//     }

//     let feeInUSD = 0;
//     const feeInUsd =
//       trade.side === "long"
//         ? formatCurrency(
//             Number(trade.entryPrice) *
//               Number(`1e${trade.entryPriceExponent}`) *
//               formatMarketValue(trade.feeAmount, trade.market)
//           )
//         : formatCurrency(formatMarketValue(trade.feeAmount, trade.market));
//     switch (trade.tradeType) {
//       case "OPEN_POSITION":
//         const openFeeAmount = Number(trade.feeAmount) / marketInfo.denomination;
//         feeInUSD = openFeeAmount * (Number(trade.entryPrice) * Number(`1e${trade.entryPriceExponent}`));
//         break;

//       case "CLOSE_POSITION":
//         // For Close Position, use the feeAmount directly
//         const closeFeeAmount = Number(trade.feeAmount) / marketInfo.denomination;
//         feeInUSD = closeFeeAmount * (Number(trade.exitPrice) * Number(`1e${trade.exitPriceExponent}`));
//         break;

//       case "TAKE_PROFIT":
//         // For Take Profit, use the feeAmount and entryPrice
//         const takeProfitFeeAmount = Number(trade.feeAmount) / marketInfo.denomination;
//         feeInUSD = takeProfitFeeAmount * (Number(trade.exitPrice) * Number(`1e${trade.exitPriceExponent}`));
//         break;

//       case "STOP_LOSS":
//         // For Stop Loss, similar to Take Profit
//         const stopLossFeeAmount = Number(trade.feeAmount) / marketInfo.denomination;
//         feeInUSD =
//           stopLossFeeAmount *
//           (Number(trade.exitPrice) * Number(`1e${trade.exitPriceExponent}`));
//         break;

//       case "ADD_COLLATERAL":
//         break;

//       case "REMOVE_COLLATERAL":
//         break;

//       case "LIQUIDATE":
//         break;

//       case "INCREASE_SIZE":
//         // For Increase Size, use the feeAmount and entryPrice
//         const increaseSizeFeeAmount = trade.feeAmount
//           ? Number(trade.feeAmount) /
//             Math.pow(10, Math.abs(trade.feeAmountExponent || 0))
//           : 0;
//         feeInUSD = (increaseSizeFeeAmount * entryPrice) / marketInfo.denomination;
//         break;

//       case "DECREASE_SIZE":
//         // For Decrease Size, similar to Increase Size
//         const decreaseSizeFeeAmount = trade.feeAmount
//           ? Number(trade.feeAmount) /
//             Math.pow(10, Math.abs(trade.feeAmountExponent || 0))
//           : 0;
//         feeInUSD = (decreaseSizeFeeAmount * entryPrice) / marketInfo.denomination;
//         break;

//       default:
//         console.warn(`Unhandled trade type: ${trade.tradeType}`);
//         break;
//     }

//     totalFees += feeInUSD;
//   });

//   return totalFees;
// };
