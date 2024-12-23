import { TradingData, TradingHistoryData } from "../../types/types";

const BASE_URL = "https://api.prod.flash.trade";

export const fetchTradingHistory = async (
  address: string
): Promise<TradingHistoryData[]> => {
  const response = await fetch(
    `${BASE_URL}/trading-history/find-all-by-user-v2/${address}`
  );
  console.log("Response:", response);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: TradingHistoryData[] = await response.json();
  return data;
};

export const fetchPnLInfo = async (address: string): Promise<TradingData[]> => {
  const response = await fetch(`${BASE_URL}/pnl-info/by-owner/${address}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: TradingData[] = await response.json();
  return data;
};
