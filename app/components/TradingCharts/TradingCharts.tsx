import React, { useState, useMemo, Suspense } from "react";
import { TabGroup, Tab, TabList, TabPanels, TabPanel } from "@tremor/react";
import { useMediaQuery } from "react-responsive";
import { calculateMovingAverage, formatVolumeData } from "./utils";

// Lazy load the tabs
const PnLTab = React.lazy(() => import("./tabs/PnLTab"));
const NetPnLTab = React.lazy(() => import("./tabs/NetPnLTab"));
const VolumeTab = React.lazy(() => import("./tabs/VolumeTab"));
const CumulativeVolumeTab = React.lazy(
  () => import("./tabs/CumulativeVolumeTab")
);
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

const TRADING_CHARTS_TAB_KEY = "tradingChartsTabIndex";

export default function TradingCharts({
  pnlData,
  volumeData,
  marketDistribution,
}: TradingChartsProps) {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  // Initialize tab state from localStorage or default to 0
  const [selectedTab, setSelectedTab] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem(TRADING_CHARTS_TAB_KEY);
      return savedTab ? parseInt(savedTab, 10) : 0;
    }
    return 0;
  });

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

  // Handle tab change and persist to localStorage
  const handleTabChange = (index: number) => {
    setSelectedTab(index);
    if (typeof window !== "undefined") {
      localStorage.setItem(TRADING_CHARTS_TAB_KEY, index.toString());
    }
  };

  return (
    <div className="space-y-6 no-select">
      <TabGroup index={selectedTab} onIndexChange={handleTabChange}>
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
            <Suspense fallback={<div>Loading...</div>}>
              <NetPnLTab
                enrichedPnlData={enrichedPnlData}
                isMobile={isMobile}
              />
              <PnLTab pnlData={pnlData} isMobile={isMobile} />
            </Suspense>
          </TabPanel>
          <TabPanel className="space-y-6">
            <Suspense fallback={<div>Loading...</div>}>
              <VolumeTab
                formattedVolumeData={formattedVolumeData}
                isMobile={isMobile}
              />
              <CumulativeVolumeTab
                formattedVolumeData={formattedVolumeData}
                isMobile={isMobile}
              />
            </Suspense>
          </TabPanel>
          <TabPanel className="space-y-6">
            <Suspense fallback={<div>Loading...</div>}>
              <MarketDistributionTab
                filteredMarketDistribution={filteredMarketDistribution}
                marketDistribution={marketDistribution}
                selectedMarkets={selectedMarkets}
                setSelectedMarkets={setSelectedMarkets}
              />
            </Suspense>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
