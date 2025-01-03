import React from "react";
import { MemoizedBarChart, MemoizedAreaChart } from "../charts";
import { formatUSD } from "@/src/lib/utils/formatters";
import { ChartDataPoint } from "../types";
import { Card, Title } from "@tremor/react";
import { motion } from "framer-motion";

interface PnLTabProps {
  pnlData: ChartDataPoint[];
  isMobile: boolean;
}

export default function PnLTab({
  pnlData,
  isMobile,
}: PnLTabProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <Title>Daily PnL Distribution</Title>
          <MemoizedAreaChart
          className="transform-gpu"
          data={pnlData}
          index="date"
          categories={["PNL"]}
          colors={["blue"]}
          valueFormatter={formatUSD}
          yAxisWidth={isMobile ? 85 : 105}
          />
        </Card>
      </motion.div>
    </div>
  );
}
