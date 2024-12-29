import { Card } from "@tremor/react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  subtitle?: string;
  trend?: number;
  isPositive?: boolean;
  className?: string;
}

export default function MetricCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  isPositive,
  className = "",
}: MetricCardProps) {
  return (
    <Card
      className={`transition-all duration-200 shadow-strong ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                {icon}
              </div>
            )}
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              {title}
            </p>
          </div>
          <p
            className={`text-2xl font-semibold ${
              isPositive !== undefined
                ? isPositive
                  ? "text-green-500"
                  : "text-red-500"
                : "text-tremor-content-strong dark:text-dark-tremor-content-strong"
            }`}
          >
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-tremor-content dark:text-dark-tremor-content">
              {subtitle}
            </p>
          )}
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
              trend >= 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {trend >= 0 ? (
              <ArrowUpIcon className="w-4 h-4" />
            ) : (
              <ArrowDownIcon className="w-4 h-4" />
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </Card>
  );
}
