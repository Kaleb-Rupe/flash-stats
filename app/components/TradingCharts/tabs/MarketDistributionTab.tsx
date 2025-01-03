import React from "react";
import { MemoizedDonutChart } from "../charts";
import { formatUSD } from "@/src/lib/utils/formatters";
import { Card, Title } from "@tremor/react";
import { motion } from "framer-motion";

export interface MarketDistributionTabProps {
  filteredMarketDistribution: any;
  marketDistribution: any;
  selectedMarkets: any;
  setSelectedMarkets: any;
}

export default function MarketDistributionTab({
  filteredMarketDistribution,
  marketDistribution,
  selectedMarkets,
  setSelectedMarkets,
}: MarketDistributionTabProps) {
  const handleCheckboxChange = (marketName: string) => {
    setSelectedMarkets((prev: any) => ({
      ...prev,
      [marketName]: !prev[marketName],
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <Title>Trading Volume by Market</Title>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        <MemoizedDonutChart
        className="w-auto h-80 mt-4 lg:mt-12 transform-gpu"
        data={filteredMarketDistribution}
        category="value"
        index="name"
        valueFormatter={formatUSD}
        colors={[
          "violet",
          "indigo",
          "rose",
          "cyan",
          "amber",
          "emerald",
          "sky",
          "blue",
          "purple",
          "fuchsia",
          "pink",
          "rose",
        ]}
        showAnimation
      />
      <div className="space-y-4">
        <Title>Market Breakdown</Title>
        <div className="space-y-2">
          {marketDistribution.map((item: any, index: any) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedMarkets[item.name]}
                  onChange={() => handleCheckboxChange(item.name)}
                  className="mr-2"
                />
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="font-medium text-sm">
                {formatUSD(item.value)}
              </span>
            </div>
          ))}
        </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
