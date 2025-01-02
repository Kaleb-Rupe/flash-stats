import React, { useState } from "react";
import { MemoizedBarChart } from "../charts";
import { formatUSD } from "@/src/lib/utils/formatters";
import { ChartDataPoint } from "../types";
import { Card, Title } from "@tremor/react";
import { motion } from "framer-motion";

export default function NetPnLTab({
  enrichedPnlData,
  isMobile,
}: {
  enrichedPnlData: ChartDataPoint[];
  isMobile: boolean;
}) {
  const [showMovingAverage, setShowMovingAverage] = useState(false);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <div className="flex justify-between">
            <Title>Cumulative P&L with Moving Average</Title>
            <div className="flex items-center">
              <button
                className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-sm"
                onClick={() => setShowMovingAverage(!showMovingAverage)}
                aria-pressed={showMovingAverage}
              >
                {showMovingAverage ? "Hide" : "Show"} Moving Average
              </button>
            </div>
          </div>
          <MemoizedBarChart
            className="transform-gpu"
            data={enrichedPnlData}
            categories={[
              "Net PNL",
              ...(showMovingAverage ? ["Moving Average"] : []),
            ]}
            barCategoryGap={isMobile ? undefined : "3%"}
            index="date"
            colors={["indigo", "emerald"]}
            valueFormatter={formatUSD}
            yAxisWidth={isMobile ? 85 : 95}
          />
          <div className="mt-4 text-sm text-gray-500">
            The blue line shows your cumulative P&L, while the green line
            represents a 7-day moving average to help identify trends.
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
