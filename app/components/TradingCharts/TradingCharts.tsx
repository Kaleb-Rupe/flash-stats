import React, { useState, useMemo } from "react";
import { TabGroup, Tab, TabList, TabPanels, TabPanel } from "@tremor/react";
import { useMediaQuery } from "react-responsive";
import { calculateMovingAverage, formatVolumeData } from "./utils";

// Lazy load the tabs
const PnLTab = React.lazy(() => import("./tabs/PnLTab"));
const NetPnLTab = React.lazy(() => import("./tabs/NetPnLTab"));
const VolumeTab = React.lazy(() => import("./tabs/VolumeTab"));
const CumulativeVolumeTab = React.lazy(() => import("./tabs/CumulativeVolumeTab"));
const MarketDistributionTab = React.lazy(
  () => import("./tabs/MarketDistributionTab")
);

export interface ChartDataPoint {
  date: string;
  "Net PNL"?: number;
  PNL?: number;
  volume?: number;
  cumulativeVolume?: number;
}

export interface MarketDistributionPoint {
  name: string;
  value: number;
}

export interface TradingChartsProps {
  pnlData: ChartDataPoint[];
  volumeData: ChartDataPoint[];
  marketDistribution: MarketDistributionPoint[];
}

export default function TradingCharts({
  pnlData,
  volumeData,
  marketDistribution,
}: TradingChartsProps) {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const initialSelectedMarkets = useMemo(
    () =>
      marketDistribution.reduce<Record<string, boolean>>((acc, item) => {
        acc[item.name] = true;
        return acc;
      }, {}),
    [marketDistribution]
  );

  const [selectedMarkets, setSelectedMarkets] = useState(
    initialSelectedMarkets
  );

  const enrichedPnlData = useMemo(
    () => calculateMovingAverage(pnlData),
    [pnlData]
  );
  const formattedVolumeData = useMemo(
    () => formatVolumeData(volumeData),
    [volumeData]
  );
  const filteredMarketDistribution = useMemo(
    () => marketDistribution.filter((item) => selectedMarkets[item.name]),
    [marketDistribution, selectedMarkets]
  );

  return (
    <div className="space-y-6 no-select">
      <TabGroup className="w-full">
        <TabList className={`ml-2 ${isMobile ? "flex justify-center" : ""}`}>
          <Tab className={isMobile ? "text-xs" : "text-sm"}>PnL Analysis</Tab>
          <Tab className={isMobile ? "text-xs" : "text-sm"}>
            Volume Analysis
          </Tab>
          <Tab className={isMobile ? "text-xs" : "text-sm"}>
            Market Distribution
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel className="space-y-6">
            <NetPnLTab enrichedPnlData={enrichedPnlData} isMobile={isMobile} />
            <PnLTab pnlData={pnlData} isMobile={isMobile} />
          </TabPanel>
          <TabPanel className="space-y-6">
            <VolumeTab
              formattedVolumeData={formattedVolumeData}
              isMobile={isMobile}
            />
            <CumulativeVolumeTab
              formattedVolumeData={formattedVolumeData}
              isMobile={isMobile}
            />
          </TabPanel>
          <TabPanel className="space-y-6">
            <MarketDistributionTab
              filteredMarketDistribution={filteredMarketDistribution}
              marketDistribution={marketDistribution}
              selectedMarkets={selectedMarkets}
              setSelectedMarkets={setSelectedMarkets}
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
