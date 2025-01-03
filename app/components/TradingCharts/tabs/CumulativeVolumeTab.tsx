import React from "react";
import { MemoizedLineChart } from "../charts";
import { formatUSD } from "@/src/lib/utils/formatters";
import { ChartDataPoint } from "../types";
import { Card, Title } from "@tremor/react";
import { motion } from "framer-motion";

interface CumulativeVolumeTabProps {
  formattedVolumeData: ChartDataPoint[];
  isMobile: boolean;
}

export default function CumulativeVolumeTab({
  formattedVolumeData,
  isMobile,
}: CumulativeVolumeTabProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <Title>Cumulative Trading Volume</Title>
          <MemoizedLineChart
            className="transform-gpu"
            data={formattedVolumeData}
            index="date"
            categories={["cumulativeVolume"]}
            colors={["rose"]}
            valueFormatter={formatUSD}
            yAxisWidth={isMobile ? 85 : 95}
          />
        </Card>
      </motion.div>
    </div>
  );
}
