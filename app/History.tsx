"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { CustomTooltipProps as TremorTooltipProps } from "@tremor/react";
import DashboardLayout from "./components/DashboardLayout";
import MetricCard from "./components/MetricCard";
import {
  CurrencyDollarIcon,
  ScaleIcon,
  ChartBarIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import TradesTable from "./components/TradesTable";
import TradingStats from "./components/TradingStats";
import TradingCharts from "./components/TradingCharts";
import PnLBreakdown from "./components/PnLBreakdown";
import PositionAnalysis from "./components/PositionAnalysis";
import TradingMetricsDisplay from "./components/TradingMetricsDisplay";
import { formatUSD, formatNumber } from "../src/lib/utils/formatters";
import { DateRangePicker } from "./components/dateRangePicker";
import {
  ChartDataPoint,
  TradingData,
  TradingHistoryProps,
} from "../src/types/types";
import {
  fetchAndProcessPnLData,
  fetchAndProcessTradingHistoryData,
} from "../src/lib/services/tradingDataProcessor";
import { calculatePnLMetrics } from "../src/lib/utils/pnlAnalytics";

// Main Trading History Component
export default function TradingHistory({ address }: TradingHistoryProps) {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [data, setData] = useState<any>(null);
  const [tradingHistoryData, setTradingHistoryData] = useState<any>(null);
  const [tradingHistory, setTradingHistory] = useState<TradingData[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [totalFees, setTotalFees] = useState(0);
  const [tradingVolume, setTradingVolume] = useState(0);
  const [netPnL, setNetPnL] = useState(0);
  const [grossProfit, setGrossProfit] = useState(0);
  const [totalTradingCount, setTotalTradingCount] = useState(0);
  const [winCount, setWinCount] = useState(0);
  const [lossCount, setLossCount] = useState(0);
  const [avgTradeSize, setAvgTradeSize] = useState(0);
  const [largestWin, setLargestWin] = useState(0);
  const [largestLoss, setLargestLoss] = useState(0);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [marketDistribution, setMarketDistribution] = useState<any[]>([]);
  const [pnlMetrics, setPnlMetrics] = useState<ReturnType<
    typeof calculatePnLMetrics
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTradingData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pnlData = await fetchAndProcessPnLData(address, startTime, endTime);
      setData(pnlData);
      setPnlMetrics(pnlData.pnlMetrics);
      setNetPnL(pnlData.netPnL);
      setTradingVolume(pnlData.tradingVolume);
      setTotalFees(pnlData.totalFees);
      setGrossProfit(pnlData.grossProfit);
      setTradingHistory(pnlData.tradingHistory);
      setChartData(pnlData.chartData);
      setTotalTradingCount(pnlData.totalTradingCount);
      setWinCount(pnlData.winCount);
      setLossCount(pnlData.lossCount);
      setAvgTradeSize(pnlData.avgTradeSize);
      setLargestWin(pnlData.largestWin);
      setLargestLoss(pnlData.largestLoss);
      setVolumeData(pnlData.volumeData);
      setMarketDistribution(pnlData.marketDistribution);
      const historyData = await fetchAndProcessTradingHistoryData(
        address,
        startTime,
        endTime
      );
      setTradingHistoryData(historyData);
    } catch (error) {
      setError("Failed to fetch trading data.");
      console.error("Failed to fetch trading data:", error);
    } finally {
      setLoading(false);
    }
  }, [address, startTime, endTime]);

  useEffect(() => {
    fetchTradingData();
  }, [fetchTradingData]);

  const customTooltip = ({ active, payload }: TremorTooltipProps) => {
    if (!active || !payload || !payload.length) return null;

    const date = payload[0]?.payload?.date;
    return (
      <div className="w-56 rounded-tremor-default border border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown">
        {payload.map((entry, index) => (
          <div key={index} className="flex flex-1 space-x-2.5">
            <div className="flex w-1 flex-col bg-indigo-500 rounded" />
            <div className="space-y-1">
              <p className="text-tremor-content">{String(entry.dataKey)}</p>
              <p className="font-medium text-tremor-content-emphasis">
                {Number(entry.value).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
              <p className="text-xs text-tremor-content opacity-75">{date}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6 mt-24">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Trading History</h1>
          <span className="text-gray-500">
            {address.slice(0, 4)}...{address.slice(-4)}
          </span>
        </div>
        <DateRangePicker
          onDateChange={(start, end) => {
            setStartTime(start);
            setEndTime(end);
            console.log(`start time: ${start}, end time: ${end}`);
          }}
        />
      </div>

      <DashboardLayout>
        <MetricCard
          title="Net Profit"
          value={formatUSD(netPnL)}
          icon={<CurrencyDollarIcon className="w-5 h-5" />}
          isPositive={netPnL > 0}
        />
        <MetricCard
          title="Trading Volume"
          value={formatUSD(tradingVolume)}
          icon={<ChartBarIcon className="w-5 h-5" />}
          subtitle="Open + Close Position Size"
        />
        <MetricCard
          title="Total Trades"
          value={formatNumber(totalTradingCount)}
          icon={<ScaleIcon className="w-5 h-5" />}
        />
        <MetricCard
          title="Gross Profit"
          value={formatUSD(grossProfit)}
          icon={<WalletIcon className="w-5 h-5" />}
          isPositive={grossProfit > 0}
        />
        <MetricCard
          title="Fees Paid"
          value={formatUSD(totalFees)}
          icon={<CurrencyDollarIcon className="w-5 h-5" />}
          isPositive={false}
        />
        <TradingStats
          winCount={winCount}
          lossCount={lossCount}
          avgTradeSize={avgTradeSize}
          largestWin={largestWin}
          largestLoss={largestLoss}
        />
      </DashboardLayout>

      <TradingCharts
        pnlData={chartData}
        volumeData={volumeData}
        marketDistribution={marketDistribution}
      />
      <div className="space-y-6">
        <TradesTable
          address={address}
          itemsPerPage={10}
          trades={tradingHistoryData.tradingHistory}
        />
        {pnlMetrics && <PnLBreakdown metrics={pnlMetrics} />}
        <PositionAnalysis trades={tradingHistory} />
      </div>

      <TradingMetricsDisplay trades={tradingHistoryData.tradingHistory} />
    </div>
  );
}
