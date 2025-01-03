import React, { Suspense } from "react";
import { lazy } from "react";
import ChartLoader from "./ChartLoader";
import { AreaChartProps, BarChartProps, DonutChartProps, LineChartProps } from "@tremor/react";

const LineChart = lazy(() =>
  import("@tremor/react").then((mod) => ({ default: mod.LineChart }))
);
const BarChart = lazy(() =>
  import("@tremor/react").then((mod) => ({ default: mod.BarChart }))
);
const DonutChart = lazy(() =>
  import("@tremor/react").then((mod) => ({ default: mod.DonutChart }))
);
const AreaChart = lazy(() =>
  import("@tremor/react").then((mod) => ({ default: mod.AreaChart }))
);

export const MemoizedBarChart = React.memo(function MemoizedBarChart(
  props: BarChartProps
) {
  return (
    <Suspense fallback={<ChartLoader />}>
      <BarChart {...props} />
    </Suspense>
  );
});

export const MemoizedLineChart = React.memo(function MemoizedLineChart(
  props: LineChartProps
) {
  return (
    <Suspense fallback={<ChartLoader />}>
      <LineChart {...props} />
    </Suspense>
  );
});

export const MemoizedDonutChart = React.memo(function MemoizedDonutChart(
  props: DonutChartProps
) {
  return (
    <Suspense fallback={<ChartLoader />}>
      <DonutChart {...props} />
    </Suspense>
  );
});

export const MemoizedAreaChart = React.memo(function MemoizedAreaChart(
  props: AreaChartProps
) {
  return (
    <Suspense fallback={<ChartLoader />}>
      <AreaChart {...props} />
    </Suspense>
  );
});
