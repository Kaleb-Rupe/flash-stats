import { MarketInfo, TradingData } from "../../types/types";
import { MARKETS } from "./markets";

export interface PositionMetrics {
  entryPrice: number;
  exitPrice: number | null;
  size: number;
  collateral: number;
  leverage: number;
  pnl: number;
  netPnl: number;
  fees: number;
  duration: number;
  isShort: boolean;
  market: MarketInfo;
}

export function calculatePositionMetrics(trade: TradingData): PositionMetrics {
  const market = MARKETS[trade.market];
  const isShort = market.isShortMarket;

  const entryPrice = trade.entryPrice
    ? Number(trade.entryPrice) /
      Math.pow(10, Number(trade.entryPriceExponent || 0))
    : 0;

  const exitPrice = trade.exitPrice
    ? Number(trade.exitPrice) /
      Math.pow(10, Number(trade.exitPriceExponent || 0))
    : null;

  const size = Number(trade.sizeUsd) / 1e6;
  const collateral = Number(trade.collateralAmount || 0) / market.denomination;
  const leverage = size / (collateral || 1);

  const pnl = Number(trade.pnlUsd) / 1e6;
  const fees = Number(trade.totalFeesUsd) / 1e6;

  return {
    entryPrice,
    exitPrice,
    size,
    collateral,
    leverage,
    pnl,
    netPnl: pnl - fees,
    fees,
    duration: Number(trade.duration || 0),
    isShort: market.isShortMarket || false,
    market,
  };
}
