import React, { memo } from "react";
import { Card } from "@tremor/react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  trend?: number | string;
  isPositive?: boolean;
  className?: string;
}

// Memoize the trend indicator component
const TrendIndicator = memo(({ trend }: { trend: number }) => (
  <div
    className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
      trend >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }`}
  >
    {trend >= 0 ? (
      <ArrowUpIcon className="w-4 h-4" />
    ) : (
      <ArrowDownIcon className="w-4 h-4" />
    )}
  </div>
));

TrendIndicator.displayName = "TrendIndicator";

// Memoize the icon wrapper component
const IconWrapper = memo(({ icon }: { icon: React.ReactNode }) => (
  <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-800">{icon}</div>
));

IconWrapper.displayName = "IconWrapper";

function MetricCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  isPositive,
  className = "",
}: MetricCardProps) {
  // Memoize the value class name
  const valueClassName = React.useMemo(
    () =>
      `text-lg lg:text-xl font-semibold ${
        isPositive !== undefined
          ? isPositive
            ? "text-green-500"
            : "text-red-500"
          : "text-tremor-content-strong dark:text-dark-tremor-content-strong"
      }`,
    [isPositive]
  );

  return (
    <Card
      className={`transition-all duration-200 shadow-strong transform-gpu will-change-transform ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 w-full">
          <div className="flex items-center gap-2">
            {icon && <IconWrapper icon={icon} />}
            <div className="flex justify-between w-full">
              <p className="text-tremor-default text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis text-nowrap">
                {title}
              </p>
              {trend !== undefined && <TrendIndicator trend={Number(trend)} />}
            </div>
          </div>
          <p className={valueClassName}>{value}</p>
          {subtitle && (
            <p className="text-xs text-tremor-content dark:text-dark-tremor-content text-nowrap">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

// Memoize the entire component
export default memo(MetricCard);
