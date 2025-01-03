import React from "react";
import { MemoizedBarChart } from "../charts";
import { formatUSD } from "@/src/lib/utils/formatters";
import { Card, Title } from "@tremor/react";
import { motion } from "framer-motion";

interface VolumeTabProps {
  formattedVolumeData: any;
  isMobile: boolean;
}

export default function VolumeTab({
  formattedVolumeData,
  isMobile,
}: VolumeTabProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <Title>Trading Volume Over Time</Title>
          <MemoizedBarChart
          className="transform-gpu"
          data={formattedVolumeData}
          index="date"
          categories={["volume"]}
          colors={["violet"]}
          valueFormatter={formatUSD}
          yAxisWidth={isMobile ? 85 : 95}
          />
        </Card>
      </motion.div>
    </div>
  );
}
