"use client";

// app/[address]/layout.tsx
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import { useMediaQuery } from "react-responsive";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div className="flex">
      {/* Sidebar - Fixed position */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main content wrapper - Fills remaining space */}
        <div
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "ml-[5rem]" : isMobile ? "m-0" : "ml-[17rem]"
        }`}
      >
        {/* Header - Fixed position */}
        
          <Header isCollapsed={isCollapsed} />

          {/* Main content - Scrollable with padding for fixed header */}
          <main className={`${isMobile ? "mb-20" : ""}`}>{children}</main>
        </div>
    </div>
  );
}
