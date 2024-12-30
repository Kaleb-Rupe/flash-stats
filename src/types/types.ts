// export interface Position {
//   market: string;
//   side: string;
//   size: string;
//   entryPrice: string;
//   liquidationPrice: string;
//   unrealizedPnl: string;
//   address: string;
// }

// export interface MarketInfo {
//   name: string;
//   denomination: number;
//   isShortMarket?: boolean;
//   baseMarket?: string;
//   exponent: number;
// }

// export interface TradingStatsProps {
//   winCount: number;
//   lossCount: number;
//   avgTradeSize: number;
//   largestWin: number;
//   largestLoss: number;
// }

// export interface TradingData {
//   timestamp: string;
//   pnlUsd: number;
//   netPnlUsd: string;
//   totalVolumeUsd: number;
//   totalFeesUsd: number;
//   txId: string;
//   tradeType: string;
//   feeAmount: number;
//   market: string;
//   side: string;
//   sizeUsd: string;
//   sizeAmount: string;
//   address: string;
//   duration: string;
//   entryPrice: number | null;
//   entryPriceExponent: number | null;
//   exitPrice: number | null;
//   exitPriceExponent: number | null;
//   exitFeeAmount: number | null;
//   collateralAmount: string;
//   collateralPrice?: string;
//   collateralPriceExponent?: number | null;
//   liquidationPrice?: string;
//   oraclePrice?: string;
//   oraclePriceExponent?: number | null;
//   denomination: string;
// }

// export interface ChartDataPoint {
//   date: string;
//   timestamp: number;
//   PNL: number;
//   "Net PNL": number;
// }

// export interface TradingHistoryProps {
//   address: string;
// }

// export interface TradeData {
//   txId: string;
//   tradeType: string;
//   pnlUsd: string;
//   feeAmount: string;
//   market: string;
//   timestamp: string;
//   side: string;
//   sizeUsd: string;
//   entryPrice?: string;
//   exitPrice?: string;
// }

// export interface TradesTableProps {
//   itemsPerPage?: number;
//   address: string;
//   trades: TradingHistoryData[];
// }

// export interface TradingMetricsDisplayProps {
//   trades: TradingHistoryData[];
// }

// export interface TradingHistoryData {
//   txId: number;
//   eventIndex: number;
//   timestamp: number;
//   positionAddress: string;
//   owner: string;
//   market: string;
//   side: string;
//   tradeType: string;
//   price: number | null | string;
//   sizeUsd: number;
//   sizeAmount: number;
//   collateralUsd: number | null;
//   collateralPrice: number;
//   collateralPriceExponent: number;
//   collateralAmount: number;
//   pnlUsd: number;
//   liquidationPrice: number | null;
//   feeAmount: number;
//   oraclePrice: number | null;
//   oraclePriceExponent: number | null;
//   orderPrice: number;
//   orderPriceExponent: number;
//   entryPrice: number;
//   entryPriceExponent: number;
//   feeRebateAmount: number;
//   finalCollateralAmount: number | null;
//   finalCollateralUsd: number | null;
//   finalSizeUsd: number | null;
//   finalSizeAmount: number | null;
//   duration: number;
//   exitPrice: number;
//   exitPriceExponent: number;
//   exitFeeAmount: number;
//   id: number;
//   oracleAccountTimestamp: string;
//   oracleAccountType: string;
//   oracleAccountPrice: number;
//   oracleAccountPriceExponent: number;
// }

import { calculatePnLMetrics } from "@/src/lib/utils/pnlAnalytics";

// Base Types for Market Information
export interface MarketInfo {
  name: string;
  denomination: number;
  isShortMarket?: boolean;
  baseMarket?: string;
  exponent: number;
}

// Types for Position Data
export interface Position {
  market: string;
  side: string;
  size: string;
  entryPrice: string;
  liquidationPrice: string;
  unrealizedPnl: string;
  address: string;
}

// Types for Trading Statistics
export interface TradingStatsProps {
  winCount: number;
  lossCount: number;
  avgTradeSize: number;
  largestWin: number;
  largestLoss: number;
}

// Enhanced Trading Data Interface
export interface TradingData {
  timestamp: string;
  pnlUsd: number;
  netPnlUsd: string;
  totalVolumeUsd: number;
  totalFeesUsd: number;
  txId: string;
  tradeType: TradeType;
  feeAmount: number;
  market: string;
  side: TradeSide;
  sizeUsd: string;
  sizeAmount: string;
  address: string;
  duration: string;
  entryPrice: number | null;
  entryPriceExponent: number | null;
  exitPrice: number | null;
  exitPriceExponent: number | null;
  exitFeeAmount: number | null;
  collateralAmount: string;
  collateralPrice?: string;
  collateralPriceExponent?: number | null;
  liquidationPrice?: string;
  oraclePrice?: string;
  oraclePriceExponent?: number | null;
  denomination: string;
}

// Trading History Types
export interface TradingHistoryProps {
  address: string;
  state: DashboardState;
  setState: (state: DashboardState) => void;
  timeRange: TimeRange;
  setTimeRange: (timeRange: TimeRange) => void;
}

// Chart Data Types
export interface ChartDataPoint {
  date: string;
  timestamp: number;
  PNL: number;
  "Net PNL": number;
}

// Volume Data Point Interface
export interface VolumeDataPoint {
  date: string;
  volume: number;
  cumulativeVolume?: number;
}

// Market Distribution Data Point
export interface MarketDistributionPoint {
  name: string;
  value: number;
  percentage?: number;
}

// Trading Timing Analysis
export interface TradingTiming {
  hourlyPerformance: number[];
  dayOfWeekPerformance: number[];
}

// Trade Outcome Analysis
export interface TradeOutcome {
  market: string;
  winRate: number;
  totalTrades: number;
  averagePnL: number;
}

// Trading History Data Interface
export interface TradingHistoryData {
  txId: number;
  eventIndex: number;
  timestamp: number;
  positionAddress: string;
  owner: string;
  market: string;
  side: TradeSide;
  tradeType: TradeType;
  price: number | string | null;
  sizeUsd: number;
  sizeAmount: number;
  collateralUsd: number | null;
  collateralPrice: number;
  collateralPriceExponent: number;
  collateralAmount: number;
  pnlUsd: number;
  liquidationPrice: number | null;
  feeAmount: number;
  oraclePrice: number | null;
  oraclePriceExponent: number | null;
  orderPrice: number;
  orderPriceExponent: number;
  entryPrice: number;
  entryPriceExponent: number;
  feeRebateAmount: number;
  finalCollateralAmount: number | null;
  finalCollateralUsd: number | null;
  finalSizeUsd: number | null;
  finalSizeAmount: number | null;
  duration: number;
  exitPrice: number;
  exitPriceExponent: number;
  exitFeeAmount: number;
  id: number;
}

// Component Props Types
export interface TradesTableProps {
  itemsPerPage?: number;
  address: string;
  trades: TradingHistoryData[];
}

export interface TradingMetricsDisplayProps {
  trades: TradingHistoryData[];
  address: string;
}

// Enums for Trade Properties
export enum TradeType {
  OPEN_POSITION = "OPEN_POSITION",
  CLOSE_POSITION = "CLOSE_POSITION",
  LIQUIDATE = "LIQUIDATE",
  ADD_COLLATERAL = "ADD_COLLATERAL",
  REMOVE_COLLATERAL = "REMOVE_COLLATERAL",
  TAKE_PROFIT = "TAKE_PROFIT",
  STOP_LOSS = "STOP_LOSS",
  INCREASE_SIZE = "INCREASE_SIZE",
  DECREASE_SIZE = "DECREASE_SIZE",
}

export enum TradeSide {
  LONG = "long",
  SHORT = "short",
}

// Types for Advanced Metrics
export interface AdvancedMetrics {
  byMarket: { [key: string]: number };
  bySize: {
    small: number;
    medium: number;
    large: number;
  };
  byDuration: {
    shortTerm: number;
    mediumTerm: number;
    longTerm: number;
  };
  byTimeOfDay: {
    [key: string]: number;
  };
  winCount: number;
  lossCount: number;
  largestWin: number;
  largestLoss: number;
}

// Types for Chart Components
export interface ChartProps {
  pnlData: ChartDataPoint[];
  volumeData: VolumeDataPoint[];
  marketDistribution: MarketDistributionPoint[];
}

// Filter Configuration Types
export interface TimeRange {
  start: number | null;
  end: number | null;
}

export interface FilterConfig {
  market: string;
  type: string;
  side: string;
  minAmount: string;
  maxAmount: string;
}

export interface DashboardState {
  startTime: number | null;
  endTime: number | null;
  data: any;
  tradingHistoryData: any;
  tradingHistory: TradingData[];
  chartData: ChartDataPoint[];
  totalFees: number;
  pnlData: ChartDataPoint[];
  tradingVolume: number;
  netPnL: number;
  grossProfit: number;
  totalTradingCount: number;
  winCount: number;
  lossCount: number;
  avgTradeSize: number;
  largestWin: number;
  largestLoss: number;
  volumeData: any[];
  marketDistribution: any[];
  pnlMetrics: ReturnType<typeof calculatePnLMetrics> | null;
  loading: boolean;
  error: string | null;
}
