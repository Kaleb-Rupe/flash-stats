import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  layoutType?: "metrics" | "charts" | "full-width";
}

export default function DashboardLayout({
  children,
  className = "",
  header,
  layoutType = "metrics",
}: DashboardLayoutProps) {

  const layoutStyles = {
    metrics: `
      grid grid-cols-2
      sm:grid-cols-2 
      lg:grid-cols-4 
      gap-4
    `,
    charts: `
      grid grid-cols-1
      lg:grid-rows-1
      gap-4
      lg:gap-4
    `,
    "full-width": "flex flex-col gap-6 pb-6",
  };

  const containerStyles = {
    metrics: "max-w-full",
    charts: "max-w-full",
    "full-width": "max-w-full",
  };

  return (
    <div
      className={`
        w-full px-4 sm:px-6 lg:px-8
        mx-auto ${containerStyles[layoutType]}
        transform-gpu will-change-transform
        transition-all duration-300 ease-in-out
      `}
      style={{
        // Use CSS transform for better performance
        transform: `translateX(0)`,
      }}
    >
      {header && (
        <div className="mb-4 transition-all duration-300 ease-in-out">
          {header}
        </div>
      )}
      <div
        className={`
          ${layoutStyles[layoutType]}
          ${className}
          relative
           duration-300 ease-in-out
        `}
      >
        {children}
      </div>
    </div>
  );
}
