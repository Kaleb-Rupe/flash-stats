// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import { motion } from "framer-motion";
// import type { CustomTooltipProps as TremorTooltipProps } from "@tremor/react";
// import DashboardLayout from "@/app/components/DashboardLayout";
// import MetricCard from "@/app/components/MetricCard";
// import {
//   CurrencyDollarIcon,
//   ScaleIcon,
//   ChartBarIcon,
//   WalletIcon,
// } from "@heroicons/react/24/outline";
// import TradesTable from "@/app/components/TradesTable";
// import TradingStats from "@/app/components/TradingStats";
// import TradingCharts from "@/app/components/TradingCharts";
// import PnLBreakdown from "@/app/components/PnLBreakdown";
// import PositionAnalysis from "@/app/components/PositionAnalysis";
// import { formatUSD, formatNumber } from "@/src/lib/utils/formatters";
// import { DateRangePicker } from "@/app/components/dateRangePicker";
// import {
//   ChartDataPoint,
//   TradingData,
//   TradingHistoryProps,
// } from "@/src/types/types";
// import {
//   fetchAndProcessPnLData,
//   fetchAndProcessTradingHistoryData,
// } from "@/src/lib/services/tradingDataProcessor";
// import { calculatePnLMetrics } from "@/src/lib/utils/pnlAnalytics";

// interface DashboardState {
//   startTime: number | null;
//   endTime: number | null;
//   data: any;
//   tradingHistoryData: any;
//   tradingHistory: TradingData[];
//   chartData: ChartDataPoint[];
//   totalFees: number;
//   tradingVolume: number;
//   netPnL: number;
//   grossProfit: number;
//   totalTradingCount: number;
//   winCount: number;
//   lossCount: number;
//   avgTradeSize: number;
//   largestWin: number;
//   largestLoss: number;
//   volumeData: any[];
//   marketDistribution: any[];
//   pnlMetrics: ReturnType<typeof calculatePnLMetrics> | null;
//   loading: boolean;
//   error: string | null;
// }

// export default function Dashboard({ address }: TradingHistoryProps) {
//   // Initialize all state in a single object for better organization
//   const [state, setState] = useState<DashboardState>({
//     startTime: null,
//     endTime: null,
//     data: null,
//     tradingHistoryData: null,
//     tradingHistory: [],
//     chartData: [],
//     totalFees: 0,
//     tradingVolume: 0,
//     netPnL: 0,
//     grossProfit: 0,
//     totalTradingCount: 0,
//     winCount: 0,
//     lossCount: 0,
//     avgTradeSize: 0,
//     largestWin: 0,
//     largestLoss: 0,
//     volumeData: [],
//     marketDistribution: [],
//     pnlMetrics: null,
//     loading: true,
//     error: null,
//   });

//   // Fetch trading data with error handling and loading states
//   const fetchTradingData = useCallback(async () => {
//     setState((prev) => ({ ...prev, loading: true, error: null }));

//     try {
//       const [pnlData, historyData] = await Promise.all([
//         fetchAndProcessPnLData(address, state.startTime, state.endTime),
//         fetchAndProcessTradingHistoryData(
//           address,
//           state.startTime,
//           state.endTime
//         ),
//       ]);

//       // Update all state at once to prevent multiple re-renders
//       setState((prev) => ({
//         ...prev,
//         data: pnlData,
//         pnlMetrics: pnlData.pnlMetrics,
//         netPnL: pnlData.netPnL,
//         tradingVolume: pnlData.tradingVolume,
//         totalFees: pnlData.totalFees,
//         grossProfit: pnlData.grossProfit,
//         tradingHistory: pnlData.tradingHistory,
//         chartData: pnlData.chartData,
//         totalTradingCount: pnlData.totalTradingCount,
//         winCount: pnlData.winCount,
//         lossCount: pnlData.lossCount,
//         avgTradeSize: pnlData.avgTradeSize,
//         largestWin: pnlData.largestWin,
//         largestLoss: pnlData.largestLoss,
//         volumeData: pnlData.volumeData,
//         marketDistribution: pnlData.marketDistribution,
//         tradingHistoryData: historyData,
//         loading: false,
//       }));
//     } catch (error) {
//       setState((prev) => ({
//         ...prev,
//         error: "Failed to fetch trading data.",
//         loading: false,
//       }));
//       console.error("Failed to fetch trading data:", error);
//     }
//   }, [address, state.startTime, state.endTime]);

//   useEffect(() => {
//     fetchTradingData();
//   }, [fetchTradingData]);

//   // Custom tooltip component for charts
//   const CustomTooltip = ({ active, payload }: TremorTooltipProps) => {
//     if (!active || !payload || !payload.length) return null;

//     const date = payload[0]?.payload?.date;
//     return (
//       <div className="w-56 rounded-tremor-default border border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown">
//         {payload.map((entry, index) => (
//           <div key={index} className="flex flex-1 space-x-2.5">
//             <div className="flex w-1 flex-col bg-indigo-500 rounded" />
//             <div className="space-y-1">
//               <p className="text-tremor-content">{String(entry.dataKey)}</p>
//               <p className="font-medium text-tremor-content-emphasis">
//                 {Number(entry.value).toLocaleString("en-US", {
//                   style: "currency",
//                   currency: "USD",
//                 })}
//               </p>
//               <p className="text-xs text-tremor-content opacity-75">{date}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   if (state.loading) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="flex justify-center items-center h-[calc(100vh-8rem)]"
//       >
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
//       </motion.div>
//     );
//   }

//   if (state.error) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="text-red-500 text-center py-8"
//       >
//         {state.error}
//       </motion.div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="space-y-6 mt-24"
//     >
//       {/* Header Section */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold">Trading History</h1>
//           <span className="text-gray-500">
//             {address.slice(0, 4)}...{address.slice(-4)}
//           </span>
//         </div>
//         <DateRangePicker
//           onDateChange={(start, end) => {
//             setState((prev) => ({
//               ...prev,
//               startTime: start,
//               endTime: end,
//             }));
//           }}
//         />
//       </div>

//       {/* Metrics Grid */}
//       <DashboardLayout>
//         <MetricCard
//           title="Net Profit"
//           value={formatUSD(state.netPnL)}
//           icon={<CurrencyDollarIcon className="w-5 h-5" />}
//           isPositive={state.netPnL > 0}
//         />
//         <MetricCard
//           title="Trading Volume"
//           value={formatUSD(state.tradingVolume)}
//           icon={<ChartBarIcon className="w-5 h-5" />}
//           subtitle="Open + Close Position Size"
//         />
//         <MetricCard
//           title="Total Trades"
//           value={formatNumber(state.totalTradingCount)}
//           icon={<ScaleIcon className="w-5 h-5" />}
//         />
//         <MetricCard
//           title="Gross Profit"
//           value={formatUSD(state.grossProfit)}
//           icon={<WalletIcon className="w-5 h-5" />}
//           isPositive={state.grossProfit > 0}
//         />
//         <MetricCard
//           title="Fees Paid"
//           value={formatUSD(state.totalFees)}
//           icon={<CurrencyDollarIcon className="w-5 h-5" />}
//           isPositive={false}
//         />
//         <TradingStats
//           winCount={state.winCount}
//           lossCount={state.lossCount}
//           avgTradeSize={state.avgTradeSize}
//           largestWin={state.largestWin}
//           largestLoss={state.largestLoss}
//         />
//       </DashboardLayout>

//       {/* Charts Section */}
//       <TradingCharts
//         pnlData={state.chartData}
//         volumeData={state.volumeData}
//         marketDistribution={state.marketDistribution}
//         tooltip={CustomTooltip}
//       />

//       {/* Detailed Analysis Section */}
//       <div className="space-y-6">
//         <TradesTable
//           address={address}
//           itemsPerPage={10}
//           trades={state.tradingHistoryData?.tradingHistory || []}
//         />
//         {state.pnlMetrics && <PnLBreakdown metrics={state.pnlMetrics} />}
//         <PositionAnalysis trades={state.tradingHistory} />
//       </div>
//     </motion.div>
//   );
// }
