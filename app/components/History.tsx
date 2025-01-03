import React, { memo, Suspense, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/app/components/DashboardLayout";
import MetricCard from "@/app/components/MetricCard";
import {
  CurrencyDollarIcon,
  ScaleIcon,
  ChartBarIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import TradingStats from "@/app/components/TradingStats";
import { formatUSD, formatNumber, formatPercentage } from "@/src/lib/utils/formatters";
import { ChartDataPoint, TradingHistoryProps } from "@/src/types/types";
import NetPnLTab from "./TradingCharts/tabs/NetPnLTab";
import { calculateMovingAverage } from "./TradingCharts/utils";
import { useMediaQuery } from "react-responsive";

// Framer Motion variants for smoother animations
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0 },
  },
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

const MemoizedMetricCard = memo(MetricCard);

export default function Dashboard({
  state,
  pnlData,
}: TradingHistoryProps & { pnlData: ChartDataPoint[] }) {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  if (state.loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex justify-center items-center h-[calc(100vh-8rem)]"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </motion.div>
    );
  }

  if (state.error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-red-500 text-center py-8"
      >
        <p className="text-xl">{state.error || "No data available"}</p>
      </motion.div>
    );
  }

  const enrichedPnlData = useMemo(
    () => calculateMovingAverage(pnlData),
    [pnlData]
  );

  const winRate = (state.winCount / (state.winCount + state.lossCount)) * 100 || 0;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-4 mt-24 transform-gpu"
      >
        <DashboardLayout layoutType="metrics">
          <motion.div variants={cardVariants}>
            <MemoizedMetricCard
              title="Net Profit"
              value={formatUSD(state.netPnL)}
              trend={state.netPnL}
              isPositive={state.netPnL > 0}
            />
          </motion.div>
          <motion.div variants={cardVariants}>
            <MemoizedMetricCard
              title="Total Trades"
              value={formatNumber(state.totalTradingCount)}
              icon={<ScaleIcon className="w-4 h-4" />}
              className="flex justify-center items-center h-full text-center"
            />
          </motion.div>
          <motion.div variants={cardVariants}>
            <MemoizedMetricCard
              title="Gross Profit"
              value={formatUSD(state.grossProfit)}
              trend={state.grossProfit}
              isPositive={state.grossProfit > 0}
            />
          </motion.div>
          <motion.div variants={cardVariants}>
            <MemoizedMetricCard
              title="Fees Paid"
              value={formatUSD(state.totalFees)}
              icon={<CurrencyDollarIcon className="w-4 h-4" />}
              isPositive={false}
              className="flex justify-center items-center h-full text-center"
            />
          </motion.div>
          <motion.div variants={cardVariants}>
            <MemoizedMetricCard
              title="Win Rate"
              value={formatPercentage(winRate)}
              subtitle={`Wins: ${state.winCount} / Losses: ${state.lossCount}`}
              trend={winRate}
              isPositive={winRate > 50}
              className="h-full"
            />
          </motion.div>
          <motion.div variants={cardVariants}>
            <MemoizedMetricCard
              title="Trading Volume"
              value={formatUSD(state.tradingVolume)}
              icon={<ChartBarIcon className="w-4 h-4" />}
              subtitle="Open + Close Position Size"
              className="flex justify-center items-center h-full text-center"
            />
          </motion.div>
          <motion.div variants={cardVariants} className="col-span-2">
            <TradingStats
              winCount={state.winCount}
              lossCount={state.lossCount}
              avgTradeSize={state.avgTradeSize}
              largestWin={state.largestWin}
              largestLoss={state.largestLoss}
            />
          </motion.div>
        </DashboardLayout>

        <DashboardLayout layoutType="full-width">
          <Suspense fallback={<div>Loading...</div>}>
            <NetPnLTab enrichedPnlData={enrichedPnlData} isMobile={isMobile} />
          </Suspense>
        </DashboardLayout>
      </motion.div>
    </AnimatePresence>
  );
}
