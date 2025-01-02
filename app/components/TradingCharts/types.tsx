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

export interface ChartProps {
  data: ChartDataPoint[];
  index: string;
  categories: string[];
  colors: string[];
  valueFormatter: (value: number) => string;
  yAxisWidth: number;
  className?: string;
  showLegend?: boolean;
}
