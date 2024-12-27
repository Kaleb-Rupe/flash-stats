import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
  // Allow customization of layout type for different sections
  layoutType?: "metrics" | "charts" | "full-width";
}

export default function DashboardLayout({
  children,
  className = "",
  layoutType = "metrics",
}: DashboardLayoutProps) {
  // We'll create base layout styles that we can extend
  const baseStyles = "w-full px-4 sm:px-6 lg:px-8 mx-auto";

  // Different layout configurations based on content type
  const layoutStyles = {
    metrics: `
      grid grid-cols-1 
      sm:grid-cols-2 
      lg:grid-cols-3 
      gap-4 sm:gap-6 lg:gap-8 
      auto-rows-fr
    `,
    charts: `
      grid grid-cols-1 
      lg:grid-cols-2 
      gap-6 lg:gap-8
      auto-rows-fr
    `,
    "full-width": "flex flex-col gap-6",
  };

  // Container styles for different screen sizes
  const containerStyles = {
    metrics: "max-w-7xl",
    charts: "max-w-full",
    "full-width": "max-w-full",
  };

  return (
    <div
      className={`
      ${baseStyles}
      ${containerStyles[layoutType]}
      transition-all duration-200 ease-in-out
    `}
    >
      <div
        className={`
        ${layoutStyles[layoutType]}
        ${className}
        py-6
        relative
      `}
      >
        {/* Grid overlay for development (hidden in production) */}
        {process.env.NODE_ENV === "development" && (
          <div className="absolute inset-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pointer-events-none opacity-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-blue-500 h-full" />
            ))}
          </div>
        )}

        {/* Main content */}
        {children}
      </div>
    </div>
  );
}
