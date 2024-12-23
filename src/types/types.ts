export interface Position {
  market: string;
  side: string;
  size: string;
  entryPrice: string;
  liquidationPrice: string;
  unrealizedPnl: string;
  address: string;
}

export interface MarketInfo {
  name: string;
  denomination: number;
  isShortMarket?: boolean;
  baseMarket?: string;
  exponent: number;
}

export interface TradingStatsProps {
  winCount: number;
  lossCount: number;
  avgTradeSize: number;
  largestWin: number;
  largestLoss: number;
}

export interface TradingData {
  timestamp: string;
  pnlUsd: number;
  netPnlUsd: string;
  totalVolumeUsd: number;
  totalFeesUsd: number;
  txId: string;
  tradeType: string;
  feeAmount: number;
  market: string;
  side: string;
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

export interface ChartDataPoint {
  date: string;
  timestamp: number;
  PNL: number;
  "Net PNL": number;
}

export interface TradingHistoryProps {
  address: string;
}

export interface TradeData {
  txId: string;
  tradeType: string;
  pnlUsd: string;
  feeAmount: string;
  market: string;
  timestamp: string;
  side: string;
  sizeUsd: string;
  entryPrice?: string;
  exitPrice?: string;
}

export interface TradesTableProps {
  itemsPerPage?: number;
  address: string;
  trades: TradingHistoryData[];
}

export interface TradingMetricsDisplayProps {
  trades: TradingHistoryData[];
}

export interface TradingHistoryData {
  txId: number;
  eventIndex: number;
  timestamp: number;
  positionAddress: string;
  owner: string;
  market: string;
  side: string;
  tradeType: string;
  price: number | null | string;
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
  oracleAccountTimestamp: string;
  oracleAccountType: string;
  oracleAccountPrice: number;
  oracleAccountPriceExponent: number;
}
